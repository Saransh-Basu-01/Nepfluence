"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BadgeHelp, Camera, Check, Music2, Pin, Radio, Video, X } from "lucide-react"
import ProtectedRoute from "@/features/auth/components/ProtectedRoute"
import { completeCreatorOnboarding, hasCompletedCreatorOnboarding, readMockSession } from "@/lib/auth"

type Platform = {
  label: string
  action: "Connect" | "Add"
  recommended?: boolean
  icon: typeof Camera
}

const platforms: Platform[] = [
  { label: "Instagram", action: "Connect", recommended: true, icon: Camera },
  { label: "Tiktok", action: "Connect", icon: Music2 },
  { label: "Youtube", action: "Connect", icon: Video },
  { label: "X", action: "Add", icon: X },
  { label: "Twitch", action: "Add", icon: Radio },
  { label: "Pinterest", action: "Add", icon: Pin },
]

function CreatorOnboardingContent() {
  const router = useRouter()
  const [connected, setConnected] = useState<string[]>([])
  const canValidate = connected.length > 0
  const recommended = useMemo(() => platforms.filter((platform) => platform.action === "Connect"), [])
  const additional = useMemo(() => platforms.filter((platform) => platform.action === "Add"), [])

  useEffect(() => {
    const session = readMockSession()
    if (hasCompletedCreatorOnboarding(session?.userId)) {
      router.replace("/creator/dashboard")
    }
  }, [router])

  function togglePlatform(label: string) {
    setConnected((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]))
  }

  function finishOnboarding() {
    const session = readMockSession()
    if (session?.userId) {
      window.localStorage.setItem(`nepfluence-creator-socials:${session.userId}`, JSON.stringify(connected))
    }
    completeCreatorOnboarding(session?.userId)
    router.replace("/creator/dashboard")
  }

  return (
    <main className="grid min-h-screen bg-[#f7f8fa] text-[#090b12] lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[640px]">
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">Can we get to know each other?</h1>
          <p className="mt-5 max-w-[520px] text-sm font-medium leading-6 text-[#536071]">
            Connect your social media accounts with Nepfluence Creator Space to verify your account and unlock more collaboration opportunities.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black">Connect social accounts</h2>
              <span className="rounded-full bg-[#eef1ff] px-3 py-1 text-xs font-black text-[#263cff]">Recommended</span>
            </div>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-[#315cff]" type="button">
              <BadgeHelp className="size-4" aria-hidden="true" />
              How to connect?
            </button>
          </div>

          <div className="mt-3 grid gap-2">
            {recommended.map((platform) => (
              <PlatformRow key={platform.label} platform={platform} connected={connected.includes(platform.label)} onToggle={() => togglePlatform(platform.label)} />
            ))}
          </div>

          <h2 className="mt-8 text-base font-black">Add social handle</h2>
          <div className="mt-3 grid gap-2">
            {additional.map((platform) => (
              <PlatformRow key={platform.label} platform={platform} connected={connected.includes(platform.label)} onToggle={() => togglePlatform(platform.label)} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            <button className="h-10 rounded-[8px] px-4 text-sm font-bold text-[#315cff]" type="button" onClick={finishOnboarding}>
              Skip for now
            </button>
            <button
              className="inline-flex h-11 min-w-28 items-center justify-center rounded-[8px] bg-[#0b18ff] px-5 text-sm font-black text-white transition disabled:bg-[#dfe3eb] disabled:text-[#9aa3b2]"
              disabled={!canValidate}
              type="button"
              onClick={finishOnboarding}
            >
              Validate
            </button>
          </div>
        </div>
      </section>

      <section className="hidden min-h-screen overflow-hidden lg:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1520975682031-a7a23d955759?auto=format&fit=crop&w=1400&q=85)",
          }}
        />
      </section>
    </main>
  )
}

function PlatformRow({ platform, connected, onToggle }: { platform: Platform; connected: boolean; onToggle: () => void }) {
  const Icon = platform.icon

  return (
    <button
      className="flex h-[62px] w-full items-center justify-between rounded-[8px] border border-[#dde2ea] bg-white px-5 text-left transition hover:border-[#aeb8ff]"
      type="button"
      onClick={onToggle}
    >
      <span className="inline-flex items-center gap-4">
        <Icon className="size-5 text-[#0b0d14]" aria-hidden="true" />
        <span className="text-sm font-black">{platform.label}</span>
      </span>
      <span
        className={`inline-flex h-9 min-w-20 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-medium ${
          connected ? "border-[#0b18ff] bg-[#eef1ff] text-[#0b18ff]" : "border-[#0b18ff] bg-white text-[#0b18ff]"
        }`}
      >
        {connected && <Check className="size-4" aria-hidden="true" />}
        {connected ? "Added" : platform.action}
      </span>
    </button>
  )
}

export default function CreatorOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={["creator"]}>
      <CreatorOnboardingContent />
    </ProtectedRoute>
  )
}
