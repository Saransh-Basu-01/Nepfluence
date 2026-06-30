"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Send, ShieldCheck } from "lucide-react"
import ProtectedRoute from "@/features/auth/components/ProtectedRoute"
import { completeBrandOnboarding, hasCompletedBrandOnboarding, readMockSession } from "@/lib/auth"

const startSectionKey = "nepfluence-brand-start-section"

function BrandOnboardingContent() {
  const router = useRouter()

  useEffect(() => {
    const session = readMockSession()
    if (hasCompletedBrandOnboarding(session?.userId)) {
      router.replace("/dashboard")
    }
  }, [router])

  function exploreCreators() {
    const session = readMockSession()
    completeBrandOnboarding(session?.userId)
    window.localStorage.setItem(startSectionKey, "Discover Creators")
    router.replace("/dashboard")
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_18%_92%,#7a66ff_0,#9d7cf7_18%,transparent_38%),radial-gradient(circle_at_72%_54%,#64e9ef_0,#aef7ff_28%,transparent_54%),linear-gradient(130deg,#ffe8ef_0%,#fff5e8_35%,#e7f4ff_100%)] px-5 py-10 text-[#172033]">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[28px] bg-white px-8 py-10 shadow-[0_30px_100px_rgba(63,75,120,0.18)] sm:px-14 sm:py-12">
          <h1 className="text-4xl font-black tracking-normal sm:text-5xl">
            Welcome to <span className="text-[#d80df0]">Nepfluence</span>
          </h1>
          <p className="mt-5 max-w-xl text-base font-bold leading-7 text-[#2d3546]">
            Your brand workspace is ready. Start by discovering creators who fit your campaign goals, audience, and content style.
          </p>

          <div className="mt-10">
            <h2 className="text-xl font-black">With Nepfluence, you can:</h2>
            <div className="mt-5 grid gap-4 text-sm font-semibold leading-6 text-[#5a6678]">
              <Benefit icon={Search} text="Find creator matches for product launches, local campaigns, and brand storytelling." />
              <Benefit icon={Send} text="Move from shortlist to conversation without scattered messages and spreadsheets." />
              <Benefit icon={ShieldCheck} text="Keep campaign briefs, applications, escrow, deliverables, and payouts in one workspace." />
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <MiniCard title="Campaign-ready" body="Review creator fit before you publish." />
            <MiniCard title="Clear workflow" body="Track each collaboration from brief to payout." />
            <MiniCard title="Built locally" body="Designed for Nepali brand and creator teams." />
          </div>

          <div className="mt-10 flex justify-center">
            <button
              className="h-14 rounded-full bg-[linear-gradient(90deg,#e000ff,#ff4e2b)] px-9 text-lg font-black text-white shadow-[0_14px_30px_rgba(224,0,255,0.24)] transition hover:-translate-y-0.5"
              type="button"
              onClick={exploreCreators}
            >
              Explore creators
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

function Benefit({ icon: Icon, text }: { icon: typeof Search; text: string }) {
  return (
    <p className="flex items-start gap-3">
      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#f2e8ff] text-[#d80df0]">
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      {text}
    </p>
  )
}

function MiniCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[8px] border border-[#edf0f6] bg-white p-4 shadow-[0_12px_30px_rgba(76,88,128,0.08)]">
      <p className="text-sm font-black text-[#172033]">{title}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[#667085]">{body}</p>
    </div>
  )
}

export default function BrandOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={["brand"]}>
      <BrandOnboardingContent />
    </ProtectedRoute>
  )
}
