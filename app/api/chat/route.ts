import Anthropic from "@anthropic-ai/sdk";
import { listArticles, getArticle, upsertArticle } from "@/lib/github";
import { serializeArticle } from "@/lib/markdown";

const client = new Anthropic();

// The system prompt stays constant across all requests. Keeping it here (rather
// than per-request) means it can be prompt-cached once the volume justifies it.
const SYSTEM = `You are an IT knowledge base assistant. You help a team manage a \
collection of Markdown articles stored in a GitHub repository.

You have three tools:

- list_articles   — see every article slug and sha in the knowledge base
- get_article     — read the current Markdown content and sha of one article
- save_article    — create a new article or update an existing one

IMPORTANT: GitHub requires the current file sha when overwriting a file. \
If you want to update an existing article you MUST call get_article first to \
retrieve its sha, then pass that sha to save_article. Never call save_article \
with a sha you made up.

Write articles in clean Markdown. Use headings, fenced code blocks, and bullet \
lists. Keep content accurate, concise, and useful to IT staff.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "list_articles",
    description:
      "List every article in the knowledge base. Returns an array of " +
      "{ slug, sha } objects. Call this to discover what articles exist " +
      "before reading or updating one.",
    input_schema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_article",
    description:
      "Fetch the raw Markdown content and current sha for one article. " +
      "You must call this before updating an article so you have its sha.",
    input_schema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Article slug, e.g. 'setting-up-ssh-keys'",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "save_article",
    description:
      "Create a new article or update an existing one. " +
      "Omit sha when creating. Include sha (from get_article) when updating.",
    input_schema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "URL-safe identifier, e.g. 'setting-up-ssh-keys'",
        },
        title: {
          type: "string",
          description: "Article title, written into the front matter",
        },
        description: {
          type: "string",
          description: "One-sentence description for the front matter",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Optional tags written into the front matter",
        },
        body: {
          type: "string",
          description: "Markdown body — everything that goes after the front matter",
        },
        sha: {
          type: "string",
          description: "Current file sha from get_article — required when updating",
        },
      },
      required: ["slug", "title", "body"],
    },
  },
];

// Executes a single tool call and returns a JSON-serialisable result.
// Errors are thrown so the caller can return them as is_error tool results.
async function runTool(
  name: string,
  input: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "list_articles": {
      return await listArticles();
    }

    case "get_article": {
      const { slug } = input as { slug: string };
      return await getArticle(slug);
    }

    case "save_article": {
      const { slug, title, description, tags, body, sha } = input as {
        slug: string;
        title: string;
        description?: string;
        tags?: string[];
        body: string;
        sha?: string;
      };
      const raw = serializeArticle({ title, description, tags }, body);
      return await upsertArticle(slug, raw, sha);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: Anthropic.MessageParam[];
  };

  // msgs is the full conversation Claude sees on every API call.
  // It grows with each loop iteration as we append assistant turns
  // and tool results.
  const msgs: Anthropic.MessageParam[] = [...messages];

  // ─── The agentic while loop ────────────────────────────────────────────────
  //
  // Claude is not a one-shot model when tools are involved. The loop works like
  // this:
  //
  //  1. Call the API with the current message history and tools.
  //  2. Check stop_reason:
  //       "end_turn"  → Claude is done. Return the final text to the client.
  //       "tool_use"  → Claude wants to call one or more tools. Execute them,
  //                     append the results, and loop again.
  //
  // Each iteration can produce multiple tool_use blocks in a single response
  // (Claude decides how many). We execute all of them before looping.
  //
  // The loop naturally terminates because Claude eventually stops calling tools
  // once it has the information it needs. A hard cap guards against edge cases.
  //
  const MAX_ITERATIONS = 10;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM,
      tools: TOOLS,
      messages: msgs,
    });

    // ── end_turn: Claude is finished ────────────────────────────────────────
    // Extract all text blocks and return them. Any thinking blocks in
    // response.content are automatically skipped by the type filter.
    if (response.stop_reason === "end_turn") {
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");

      return Response.json({ message: text });
    }

    // ── tool_use: Claude wants to call tools ─────────────────────────────────
    if (response.stop_reason === "tool_use") {
      // Step 1 — Append Claude's full response as an assistant turn.
      //
      // This MUST be the full content array, not just the text. The API
      // requires the tool_use blocks to be present in the conversation so it
      // can match them up with the tool_result blocks we are about to send.
      // Dropping them causes a 400.
      msgs.push({ role: "assistant", content: response.content });

      // Step 2 — Execute every tool Claude asked for and collect results.
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        try {
          const output = await runTool(
            block.name,
            block.input as Record<string, unknown>,
          );
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(output, null, 2),
          });
        } catch (err) {
          // Returning an error result (rather than throwing) lets Claude see
          // what went wrong and decide how to recover — e.g. retry with a
          // different slug, or explain the problem to the user.
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            is_error: true,
            content: err instanceof Error ? err.message : String(err),
          });
        }
      }

      // Step 3 — Send the results back as a user turn.
      //
      // The conversation now looks like:
      //   … → user msg → assistant (tool_use) → user (tool_result) → [loop]
      //
      // On the next iteration Claude receives the results and either calls
      // more tools or writes its final answer.
      msgs.push({ role: "user", content: toolResults });

      continue;
    }

    // Any other stop reason (e.g. max_tokens) — stop the loop.
    break;
  }

  return Response.json({ message: "No response generated." }, { status: 500 });
}
