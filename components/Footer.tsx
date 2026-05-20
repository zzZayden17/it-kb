import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-[#4241fe] bg-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-white">IT Knowledge Base</p>
            <p className="mt-1.5 text-xs text-zinc-400">Rayzina IT Team resource library</p>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/articles"
              className="text-sm text-white transition-colors hover:text-[#4241fe]"
            >
              Articles
            </Link>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-900 pt-6">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Rayzina LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
