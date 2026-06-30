import Link from "next/link"
import { ArrowRight, BadgeCheck, MessageSquare, Search, ShieldCheck, Sparkles } from "lucide-react"

const creatorCards = [
  {
    name: "Aarati Rai",
    handle: "@aaratiugc",
    niche: "Beauty UGC",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=640&q=80",
    sample: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "Nischal Gurung",
    handle: "@trailnischal",
    niche: "Travel reels",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=80",
    sample: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "Sanya Mehta",
    handle: "@sanyastyle",
    niche: "Fashion",
    image: "https://images.unsplash.com/photo-1606814893907-c2e42943c91f?auto=format&fit=crop&w=640&q=80",
    sample: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=640&q=80",
  },
]

export default function HeroSection() {
  return (
    <section className="bg-[#f5f3ef] px-4 pb-10 pt-8 font-sans text-[#1f252b] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="py-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e2d9] bg-[#fbfaf7] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#69716b]">
            <Sparkles className="size-4 text-[#1f252b]" aria-hidden="true" />
            Creator campaigns, simplified
          </span>

          <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.96] tracking-tight text-[#1f252b] sm:text-6xl lg:text-7xl">
            Find creators who make your brand feel local.
          </h1>
          <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-[#69716b] sm:text-lg">
            Nepfluence helps brands discover Nepali and Indian creators, manage campaign briefs, keep conversations clear, and move collaborations toward payout.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f252b] px-6 text-sm font-black text-white shadow-[0_14px_28px_rgba(31,37,43,0.18)] transition hover:-translate-y-0.5 hover:bg-[#363d43]" href="/register?role=brand">
              Start as a brand
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link className="inline-flex h-12 items-center justify-center rounded-full border border-[#ded8cf] bg-[#fbfaf7] px-6 text-sm font-black text-[#1f252b] transition hover:bg-white" href="/register?role=creator">
              Join as a creator
            </Link>
          </div>

          <div className="mt-8 grid max-w-xl gap-2 sm:grid-cols-3">
            <HeroSignal icon={Search} label="Discover" text="Creator fit by niche and country" />
            <HeroSignal icon={MessageSquare} label="Contact" text="In-app and email outreach" />
            <HeroSignal icon={ShieldCheck} label="Track" text="Briefs, escrow, and payout flow" />
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[34px] border border-[#e8e2d9] bg-[#fbfaf7] p-3 shadow-[0_24px_70px_rgba(31,37,43,0.12)]">
            <div className="rounded-[28px] bg-white p-4">
              <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Brand workspace</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight">Discover creators</h2>
                </div>
                <span className="rounded-full bg-[#f0ece5] px-3 py-1 text-xs font-black text-[#505852]">MVP ready</span>
              </div>

              <div className="mt-4 space-y-3">
                {creatorCards.map((creator) => (
                  <article key={creator.handle} className="grid grid-cols-[72px_1fr_92px] items-center gap-3 rounded-[22px] border border-[#e8e2d9] bg-[#fbfaf7] p-3">
                    <div className="size-[72px] rounded-[20px] bg-cover bg-center" style={{ backgroundImage: `url(${creator.image})` }} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-black">{creator.name}</h3>
                        <BadgeCheck className="size-4 text-[#16864f]" aria-hidden="true" />
                      </div>
                      <p className="mt-1 truncate text-xs font-black text-[#8a8175]">{creator.handle}</p>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#69716b]">{creator.niche} creator available for product demos and campaign content.</p>
                    </div>
                    <div className="h-20 rounded-[18px] bg-cover bg-center" style={{ backgroundImage: `url(${creator.sample})` }} />
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 left-5 hidden rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] p-4 shadow-[0_18px_46px_rgba(31,37,43,0.12)] sm:block">
            <p className="text-xs font-black text-[#1f252b]">Campaign flow</p>
            <p className="mt-1 text-xs font-semibold text-[#69716b]">Find, contact, collaborate, pay.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroSignal({ icon: Icon, label, text }: { icon: typeof Search; label: string; text: string }) {
  return (
    <div className="rounded-[22px] border border-[#e8e2d9] bg-[#fbfaf7] p-4">
      <Icon className="size-4 text-[#1f252b]" aria-hidden="true" />
      <p className="mt-3 text-sm font-black text-[#1f252b]">{label}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[#69716b]">{text}</p>
    </div>
  )
}
