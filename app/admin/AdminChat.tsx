'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function AdminChat() {
  // ── State ─────────────────────────────────────────────────────────────────
  //
  // messages: the full conversation history. We send the entire array to
  //   /api/chat on every turn so Claude maintains context across multiple
  //   exchanges. The first message is always from the user — the API requires
  //   it, so we never hardcode an initial assistant message here.
  //
  // input: the controlled textarea value.
  //
  // loading: true while the agent loop is running. Disables the input,
  //   renders the thinking bubble, and prevents double-submits.
  //
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // bottomRef is attached to an invisible div at the end of the message list.
  // Whenever messages or loading changes we scroll it into view, keeping the
  // latest content always visible.
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── send ──────────────────────────────────────────────────────────────────
  //
  // Called on form submit and on Enter keydown. The full message array (after
  // appending the new user message) is sent to the route handler so Claude
  // sees the complete conversation on each turn.
  //
  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    // Build the new history before setting state so we can use it in the
    // fetch body without chasing the async state update.
    const next = [...messages, userMsg]

    setMessages(next)
    setInput('')      // clear immediately — feels instant
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const { message } = (await res.json()) as { message: string }
      setMessages([...next, { role: 'assistant', content: message }])
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: '⚠ Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Enter submits; Shift+Enter inserts a newline (standard chat convention).
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    // h-screen gives us a reliable full-viewport height. The three children
    // are: a fixed header, a scrolling message area, and a fixed footer.
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-zinc-900">

      {/* ── Header ─────────────────────────────────────────────────────────
          shrink-0 prevents this row from compressing when the message list
          is tall. It always stays at its natural height.
      */}
      <header className="shrink-0 border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          IT Knowledge Base — Admin
        </h1>
        <p className="text-sm text-zinc-500">
          Ask me to list, read, create, or update articles.
        </p>
      </header>

      {/* ── Messages ───────────────────────────────────────────────────────
          flex-1 means this row expands to fill all vertical space not taken
          by the header and footer. overflow-y-auto lets it scroll internally
          rather than growing the page and pushing the footer off screen.

          The inner div centres the content and constrains its width, but the
          full-width background colour still fills the parent correctly.
      */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">

          {/* Empty state — shown before the first message is sent */}
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center gap-2 py-24 text-center text-zinc-400">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">
                Try: &ldquo;List all articles&rdquo; or &ldquo;Write an article
                about resetting a Windows password&rdquo;
              </p>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              // User bubble — right-aligned, dark background.
              // justify-end pushes the bubble to the right; the bubble itself
              // is capped at 80% width so long messages don't span the full
              // column.
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-zinc-900 px-4 py-3 text-sm text-white dark:bg-zinc-700">
                  {msg.content}
                </div>
              </div>
            ) : (
              // Assistant bubble — left-aligned, white card.
              // The "Assistant" label is a small text node above the card,
              // not inside it, to keep the card padding consistent.
              //
              // <pre> preserves the newlines and indentation Claude uses in
              // structured output (e.g. lists, code snippets). font-sans
              // overrides the browser's default monospace for pre elements.
              // whitespace-pre-wrap wraps long lines rather than overflowing.
              <div key={i} className="flex flex-col gap-1">
                <span className="pl-1 text-xs font-medium text-zinc-400">
                  Assistant
                </span>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-800 dark:text-zinc-100">
                    {msg.content}
                  </pre>
                </div>
              </div>
            )
          )}

          {/* Loading bubble — same shape as an assistant message.
              animate-pulse gives a slow fade in/out so the user knows
              the agent loop is running (it typically takes 5–15 s).
          */}
          {loading && (
            <div className="flex flex-col gap-1">
              <span className="pl-1 text-xs font-medium text-zinc-400">
                Assistant
              </span>
              <div className="inline-flex max-w-[80%] items-center rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
                <span className="animate-pulse text-sm text-zinc-400">
                  Thinking…
                </span>
              </div>
            </div>
          )}

          {/* Invisible scroll anchor — useEffect scrolls this into view
              whenever messages or loading changes. */}
          <div ref={bottomRef} />

        </div>
      </main>

      {/* ── Footer / Input ─────────────────────────────────────────────────
          shrink-0 keeps this row at its natural height even when the message
          area is full. The form is centred to match the message column.
      */}
      <footer className="shrink-0 border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <form
          className="mx-auto flex max-w-2xl items-end gap-3"
          onSubmit={(e) => { e.preventDefault(); send() }}
        >
          {/* Textarea — rows={3} gives a comfortable 3-line default height.
              resize-none prevents the user from dragging it taller and
              breaking the layout. Shift+Enter for newlines; plain Enter
              submits (handled in onKeyDown).
          */}
          <textarea
            className="flex-1 resize-none rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            rows={3}
            placeholder="Message the assistant… (Enter to send, Shift+Enter for newline)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
          />

          {/* Submit button — disabled when loading or input is blank.
              disabled:opacity-40 gives visible feedback for both states.
              The mb-0.5 nudges it up slightly to align its baseline with
              the bottom of the textarea rather than its very edge.
          */}
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="mb-0.5 shrink-0 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Send
          </button>
        </form>
      </footer>

    </div>
  )
}
