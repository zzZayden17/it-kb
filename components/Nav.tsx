import Link from 'next/link'

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-bold text-white transition-colors hover:text-[#4241fe]"
        >
          IT Knowledge Base
        </Link>
        <nav>
          <Link
            href="/articles"
            className="text-sm font-medium text-white transition-colors hover:text-[#4241fe]"
          >
            Articles
          </Link>
        </nav>
      </div>
    </header>
  )
}
