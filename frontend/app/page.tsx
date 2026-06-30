import Link from "next/link"
import { ArrowRight } from "lucide-react"
import HeroSection from "../features/home/HeroSection"
import HowItWorks from "../features/home/HowItWork"
import Navbar from "@/components/Layout/Navbar"

export default function HomePage() {
  return (
    <main className="bg-[#f5f3ef]">
      <Navbar />
      <HeroSection />
      <HowItWorks />

      <section className="bg-[#f5f3ef] px-4 py-16 font-sans text-[#1f252b] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[34px] border border-[#e8e2d9] bg-[#1f252b] p-6 text-white shadow-[0_24px_70px_rgba(31,37,43,0.16)] md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/52">Start small, connect the real flow</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Launch the first campaign workspace for your brand.
            </h2>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/68">
              Create a brand account, discover creators, and keep the MVP workflow moving without visual clutter.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#1f252b] transition hover:-translate-y-0.5" href="/register?role=brand">
              Create brand account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/16 px-6 text-sm font-black text-white transition hover:bg-white/8" href="/login?role=creator">
              Creator login
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
