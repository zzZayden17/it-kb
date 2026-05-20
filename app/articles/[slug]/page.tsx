import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticle } from '@/lib/github'
import { parseArticle } from '@/lib/markdown'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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
  const { slug } = await params

  let raw: string
  try {
    ;({ raw } = await getArticle(slug))
  } catch {
    notFound()
  }

  const { frontmatter, html } = await parseArticle(raw)

  return (
    <>
      <Nav />

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20">

          <Link
            href="/articles"
            className="mb-12 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-[#4241fe]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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

          <header className="mb-12 border-b border-zinc-200 pb-10">
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-zinc-900">
              {frontmatter.title}
            </h1>

            {frontmatter.description && (
              <p className="mt-4 text-lg leading-8 text-zinc-500">
                {frontmatter.description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {frontmatter.date && (
                <time
                  dateTime={frontmatter.date}
                  className="text-xs text-zinc-400"
                >
                  {new Date(frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}

              {frontmatter.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#4241fe]/10 px-3 py-0.5 text-xs font-semibold text-[#4241fe] ring-1 ring-[#4241fe]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div
            className="article-body text-zinc-800"
            dangerouslySetInnerHTML={{ __html: html }}
          />

        </div>
      </main>

      <Footer />
    </>
  )
}
