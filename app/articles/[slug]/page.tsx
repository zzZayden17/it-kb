import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle } from '@/lib/github'
import { parseArticle } from '@/lib/markdown'

// generateMetadata runs before the page renders and populates <title> and
// <meta name="description"> in the <head>. It receives the same params as the
// page so it can fetch the article's front matter without duplicating logic.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  try {
    const { raw } = await getArticle(slug)
    const { frontmatter } = await parseArticle(raw)
    return {
      title: frontmatter.title,
      description: frontmatter.description,
    }
  } catch {
    return {}
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // params is a Promise in Next.js 16 App Router — must be awaited before use.
  const { slug } = await params

  let raw: string
  try {
    ;({ raw } = await getArticle(slug))
  } catch {
    // getArticle throws when Octokit returns a 404 (file not in the repo).
    // notFound() renders the built-in Next.js 404 page.
    notFound()
  }

  const { frontmatter, html } = await parseArticle(raw)

  return (
    // Page container — centred column with comfortable reading width.
    <div className="mx-auto max-w-2xl px-4 py-10">

      {/* ── Back link ────────────────────────────────────────────────────────
          Always points to /articles, not router.back(), so the destination is
          predictable regardless of how the user arrived at this page.
          inline-flex + items-center aligns the chevron icon with the text.
      */}
      <Link
        href="/articles"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        All articles
      </Link>

      {/* ── Article header ───────────────────────────────────────────────── */}
      <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {frontmatter.title}
        </h1>

        {/* Description — rendered if present in front matter */}
        {frontmatter.description && (
          <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
            {frontmatter.description}
          </p>
        )}

        {/* Meta row — date and tags side by side */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {frontmatter.date && (
            <time
              dateTime={frontmatter.date}
              className="text-sm text-zinc-400 dark:text-zinc-500"
            >
              {new Date(frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}

          {/* Tag pills — only rendered if the front matter includes tags */}
          {frontmatter.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* ── Article body ─────────────────────────────────────────────────────
          parseArticle() converts the Markdown body to an HTML string.
          dangerouslySetInnerHTML injects it directly — safe here because the
          content is admin-authored (you wrote it to GitHub yourself).
          The article-body class in globals.css re-applies typographic defaults
          that Tailwind's reset removed (heading sizes, list bullets, etc.).
      */}
      <div
        className="article-body text-zinc-800 dark:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />

    </div>
  )
}
