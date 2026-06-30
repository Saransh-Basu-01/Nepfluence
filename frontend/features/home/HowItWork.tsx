import { BadgeCheck, Handshake, WalletCards } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Create your workspace",
    desc: "Brands create a campaign profile. Creators build a clean portfolio and channel profile.",
    icon: BadgeCheck,
  },
  {
    step: "02",
    title: "Match and talk",
    desc: "Discover creators, filter by platform, then start an in-app message or email outreach.",
    icon: Handshake,
  },
  {
    step: "03",
    title: "Deliver and close",
    desc: "Keep briefs, submissions, approvals, and payout state in one calm workflow.",
    icon: WalletCards,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#fbfaf7] px-4 py-16 font-sans text-[#1f252b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">How it works</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">A simpler path from creator fit to finished campaign.</h2>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.step} className="rounded-[28px] border border-[#e8e2d9] bg-[#f5f3ef] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#8a8175]">{item.step}</span>
                  <span className="grid size-10 place-items-center rounded-full bg-[#fbfaf7] text-[#1f252b]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-black tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#69716b]">{item.desc}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
