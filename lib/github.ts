import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const DIR = "articles";

export interface ArticleRef {
  slug: string;
  sha: string;
}

export interface ArticleContent extends ArticleRef {
  raw: string;
}

/**
 * Returns slug + sha for every .md file in the articles/ directory.
 * sha is required by upsertArticle when overwriting an existing file.
 */
export async function listArticles(): Promise<ArticleRef[]> {
  const { data } = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: DIR,
  });

  if (!Array.isArray(data)) return [];

  return data
    .filter((f) => f.type === "file" && f.name.endsWith(".md"))
    .map((f) => ({ slug: f.name.replace(/\.md$/, ""), sha: f.sha }));
}

/**
 * Fetches the raw Markdown source for a single article.
 * Throws if the path resolves to a directory or doesn't exist.
 */
export async function getArticle(slug: string): Promise<ArticleContent> {
  const { data } = await octokit.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: `${DIR}/${slug}.md`,
  });

  if (Array.isArray(data) || data.type !== "file") {
    throw new Error(`Not a file: ${slug}`);
  }

  // GitHub base64-encodes file content with newlines every 60 chars.
  // Buffer.from handles the embedded newlines automatically.
  const raw = Buffer.from(data.content, "base64").toString("utf-8");

  return { slug, sha: data.sha, raw };
}

/**
 * Creates or updates an article.
 * Pass sha when updating an existing file — GitHub rejects blind overwrites
 * without the current sha to prevent conflicting writes.
 * Returns the new sha so the caller can use it in subsequent updates.
 */
export async function upsertArticle(
  slug: string,
  content: string,
  sha?: string,
): Promise<{ sha: string }> {
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner: OWNER,
    repo: REPO,
    path: `${DIR}/${slug}.md`,
    message: sha ? `docs: update ${slug}` : `docs: add ${slug}`,
    content: Buffer.from(content).toString("base64"),
    ...(sha && { sha }),
  });

  const newSha = data.content?.sha;
  if (!newSha) throw new Error(`No sha returned after upserting ${slug}`);

  return { sha: newSha };
}
