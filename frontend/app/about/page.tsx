import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] px-5 py-10 font-[Arial,Helvetica,sans-serif] text-[#17171f]">
      <section className="mx-auto max-w-3xl rounded-[8px] border border-[#e4e7f1] bg-white p-6 shadow-sm">
        <Link className="inline-flex items-center gap-2 text-sm font-black text-[#6174f8]" href="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
        <p className="mt-8 text-sm font-black uppercase text-[#6174f8]">About Nepfluence</p>
        <h1 className="mt-3 text-4xl font-black tracking-normal">A local creator collaboration workspace.</h1>
        <p className="mt-4 text-base font-medium leading-7 text-[#606675]">
          Nepfluence connects brands and creators through campaign briefs, creator applications, escrow protected
          collaborations, chat, deliverable review, and payout tracking.
        </p>
      </section>
    </main>
  )
}
