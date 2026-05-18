import Link from 'next/link'
import { listArticles, getArticle } from '@/lib/github'
import { parseFrontmatter } from '@/lib/markdown'

export default async function ArticlesIndexPage() {
  // ── Fetch article list ──────────────────────────────────────────────────────
  //
  // listArticles() throws if the articles/ directory doesn't exist yet.
  // We treat that the same as "zero articles" — the empty state handles it.
  let slugs: string[] = []
  try {
    const refs = await listArticles()
    slugs = refs.map((r) => r.slug)
  } catch {
    // directory missing or API error — fall through to empty state
  }

  // ── Fetch frontmatter for every article in parallel ─────────────────────────
  //
  // Promise.allSettled lets the page render even if individual fetches fail.
  // Rejected entries (e.g. a file deleted between the list call and now)
  // are filtered out rather than crashing the whole page.
  const settled = await Promise.allSettled(
    slugs.map(async (slug) => {
      const { raw } = await getArticle(slug)
      return { slug, frontmatter: parseFrontmatter(raw) }
    }),
  )

  const articles = settled
    .filter(
      (r): r is PromiseFulfilledResult<{ slug: string; frontmatter: ReturnType<typeof parseFrontmatter> }> =>
        r.status === 'fulfilled',
    )
    .map((r) => r.value)

  // Sort newest-first. Articles without a date go to the end.
  articles.sort((a, b) => {
    const da = a.frontmatter.date
    const db = b.frontmatter.date
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return new Date(db).getTime() - new Date(da).getTime()
  })

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Knowledge Base
        </h1>
        {articles.length > 0 && (
          <p className="mt-1 text-sm text-zinc-500">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        )}
      </header>

      {articles.length === 0 ? (
        // ── Empty state ──────────────────────────────────────────────────────
        // Shown when the articles/ directory is missing OR contains no .md files.
        <div className="flex flex-col items-center gap-2 py-24 text-center text-zinc-400">
          <p className="text-lg font-medium">No articles yet</p>
          <p className="text-sm">
            Use the{' '}
            <Link
              href="/admin"
              className="underline decoration-zinc-300 hover:text-zinc-600 dark:decoration-zinc-600 dark:hover:text-zinc-300"
            >
              admin panel
            </Link>
            {' '}to create the first one.
          </p>
        </div>
      ) : (
        // ── Article list ─────────────────────────────────────────────────────
        // Each item is a full-row link so the entire card is clickable, not
        // just the title text. divide-y draws separators between items without
        // needing explicit margin/padding on each.
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {articles.map(({ slug, frontmatter }) => (
            <li key={slug}>
              <Link
                href={`/articles/${slug}`}
                className="group flex flex-col gap-1 py-5"
              >
                {/* Title — underlines on hover via group-hover so the whole
                    row triggers it, not just hovering the text directly. */}
                <span className="text-base font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
                  {frontmatter.title}
                </span>

                {/* Description — optional, not every article will have one */}
                {frontmatter.description && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {frontmatter.description}
                  </span>
                )}

                {/* Date — optional, formatted as "May 18, 2026" */}
                {frontmatter.date && (
                  <time
                    dateTime={frontmatter.date}
                    className="text-xs text-zinc-400 dark:text-zinc-500"
                  >
                    {new Date(frontmatter.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

    </div>
  )
}
