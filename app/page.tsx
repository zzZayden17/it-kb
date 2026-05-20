import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const categories = [
  {
    title: 'Setup & Configuration',
    desc: 'Step-by-step guides for devices, software, accounts, and network access from scratch.',
  },
  {
    title: 'Security & Compliance',
    desc: 'Endpoint protection, password policies, MFA setup, and compliance checklists.',
  },
  {
    title: 'Microsoft 365',
    desc: 'Email, Teams, SharePoint, and Intune — everything across the M365 suite.',
  },
]

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="bg-[#0d0c1e] text-white">
          <div className="mx-auto max-w-6xl px-6 py-36">

            <div className="mb-10 inline-flex items-center rounded-full bg-[#4241fe]/15 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#8584ff] ring-1 ring-[#4241fe]/25">
              Rayzina IT Team
            </div>

            <h1 className="text-6xl font-black leading-[1.05] tracking-tight">
              <span className="block text-white">IT Knowledge</span>
              <span className="block text-[#4241fe]">Base.</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-white/90">
              Guides, how-tos, and reference articles for the Rayzina IT team.
              Find answers fast and keep things running smoothly.
            </p>

            <div className="mt-12">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-lg bg-[#4241fe] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4241fe]/30 transition-all hover:bg-[#3130d4] hover:shadow-[#4241fe]/50"
              >
                Browse Articles
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
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

          </div>
        </section>

        {/* ── What's covered ─────────────────────────────────────────────────── */}
        <section className="bg-[#111111]">
          <div className="mx-auto max-w-6xl px-6 py-28">

            <p className="mb-14 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              What&apos;s covered
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {categories.map(({ title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-[#4241fe]/20 bg-white/[0.04] p-7"
                >
                  <div className="mb-5 h-1 w-8 rounded-full bg-[#4241fe]" />
                  <h2 className="text-sm font-semibold text-white">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
