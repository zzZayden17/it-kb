import Link from 'next/link'
import { listArticles, getArticle } from '@/lib/github'
import { parseFrontmatter } from '@/lib/markdown'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = { title: 'Articles' }

export default async function ArticlesIndexPage() {
  let slugs: string[] = []
  try {
    const refs = await listArticles()
    slugs = refs.map((r) => r.slug)
  } catch {
    // directory missing or API error — fall through to empty state
  }

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

  articles.sort((a, b) => {
    const da = a.frontmatter.date
    const db = b.frontmatter.date
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return new Date(db).getTime() - new Date(da).getTime()
  })

  return (
    <>
      <Nav />

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">

          <header className="mb-12">
            <h1 className="text-3xl font-bold text-zinc-900">
              Articles
            </h1>
            {articles.length > 0 && (
              <p className="mt-2 text-sm text-zinc-400">
                {articles.length} article{articles.length !== 1 ? 's' : ''}
              </p>
            )}
          </header>

          {articles.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <p className="text-sm font-medium text-zinc-400">No articles yet</p>
              <p className="text-sm text-zinc-400">
                Use the{' '}
                <Link href="/admin" className="text-[#4241fe] hover:underline">
                  admin panel
                </Link>
                {' '}to create the first one.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {articles.map(({ slug, frontmatter }) => (
                <li key={slug}>
                  <Link
                    href={`/articles/${slug}`}
                    className="group block rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-[#4241fe]/50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-base font-semibold text-zinc-900 transition-colors group-hover:text-[#4241fe]">
                        {frontmatter.title}
                      </span>
                      {frontmatter.date && (
                        <time
                          dateTime={frontmatter.date}
                          className="shrink-0 pt-0.5 text-xs text-zinc-400"
                        >
                          {new Date(frontmatter.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </time>
                      )}
                    </div>

                    {frontmatter.description && (
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {frontmatter.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#4241fe] opacity-0 transition-opacity group-hover:opacity-100">
                      Read article
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
