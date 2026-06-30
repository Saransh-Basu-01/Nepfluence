import Link from "next/link"
import { ArrowRight } from "lucide-react"

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Creators", href: "/login?role=creator" },
  { label: "Pricing", href: "/pricing" },
]

export default function Navbar() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-[#e8e2d9] bg-[#fbfaf7]/88 font-sans backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Nepfluence home">
          <span className="grid size-8 rotate-[-35deg] grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, index) => (
              <span key={index} className="rounded-full bg-[#1f252b]" style={{ opacity: index % 2 === 0 ? 1 : 0.34 }} />
            ))}
          </span>
          <span className="text-lg font-black tracking-tight text-[#1f252b]">nepfluence</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} className="text-sm font-bold text-[#69716b] transition hover:text-[#1f252b]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link className="hidden h-10 items-center rounded-full border border-[#ded8cf] bg-white px-4 text-sm font-black text-[#1f252b] transition hover:bg-[#f5f1ea] sm:inline-flex" href="/login?role=brand">
            Login
          </Link>
          <Link className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1f252b] px-4 text-sm font-black text-white shadow-[0_10px_22px_rgba(31,37,43,0.16)] transition hover:-translate-y-0.5 hover:bg-[#363d43]" href="/register?role=brand">
            Start free
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </header>
  )
}
