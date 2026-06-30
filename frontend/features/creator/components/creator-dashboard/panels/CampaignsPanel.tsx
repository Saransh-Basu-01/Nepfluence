"use client"

import { ArrowRight, Bookmark, CalendarDays, Heart, MessageSquare, Search, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type CreatorCampaign, campaignImage, money, statusClass } from "../creator-dashboard.shared"

export function CampaignsPanel({
  campaigns,
  search,
  onSearch,
  onApply,
  onWithdraw,
  compact = false,
}: {
  campaigns: CreatorCampaign[]
  search: string
  onSearch: (search: string) => void
  onApply: (id: number) => void
  onWithdraw: (id: number) => void
  compact?: boolean
}) {
  const visibleCampaigns = compact ? campaigns.slice(0, 2) : campaigns

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_12px_34px_rgba(31,37,43,0.06)]">
      <div className="flex flex-col gap-3 border-b border-[#e8e2d9] px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Campaigns</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-[#1f252b]">{compact ? "Recommended campaigns" : "Find campaigns"}</h2>
          <p className="mt-1 max-w-xl text-sm font-semibold leading-5 text-[#69716b]">Clean briefs that match your content, audience, and availability.</p>
        </div>
        <label className="flex h-10 min-w-0 items-center gap-2 rounded-full border border-[#ded8cf] bg-white px-3 text-sm font-semibold text-[#69716b] shadow-sm md:w-72">
          <Search className="size-4 shrink-0 text-[#8a8175]" aria-hidden="true" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search campaign or brand"
          />
        </label>
      </div>

      <div className={`grid gap-3 p-4 ${compact ? "lg:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
        {visibleCampaigns.map((campaign) => (
          <article key={campaign.id} className="group overflow-hidden rounded-[22px] border border-[#e8e2d9] bg-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(31,37,43,0.10)]">
            <div className="relative h-40 bg-[#eee8df] bg-cover bg-center" style={{ backgroundImage: `url(${campaignImage(campaign)})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f252b]/60 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusClass(campaign.status)}`}>{campaign.status.replace("_", " ")}</span>
                <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-black text-[#1f252b]">{campaign.match}% fit</span>
              </div>
              <button className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/92 text-[#1f252b] shadow-sm" type="button" aria-label="Save campaign">
                <Bookmark className="size-4" aria-hidden="true" />
              </button>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="line-clamp-2 text-lg font-black leading-5 tracking-tight text-white">{campaign.title}</h3>
                <p className="mt-1 text-xs font-bold text-white/82">{campaign.brand} / {campaign.platform}</p>
              </div>
            </div>

            <div className="p-4">
              <p className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#505852]">{campaign.brief}</p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <MiniCampaignStat label="Budget" value={money(campaign.budget)} />
                <MiniCampaignStat label="Reach" value={`${Math.round(campaign.reach / 1000)}K`} />
                <MiniCampaignStat label="Country" value={campaign.country} />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#f0ece5] px-2.5 py-1 text-[11px] font-black text-[#69716b]">{campaign.niche}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f0ece5] px-2.5 py-1 text-[11px] font-black text-[#69716b]">
                  <CalendarDays className="size-3" aria-hidden="true" />
                  {campaign.deadline}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  <IconButton label="Like campaign" icon={Heart} />
                  <IconButton label="Message brand" icon={MessageSquare} />
                  <IconButton label="Share campaign" icon={Send} />
                </div>
                <div className="flex gap-2">
                  {campaign.status === "NOT_APPLIED" && (
                    <Button className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#363d43]" type="button" onClick={() => onApply(campaign.id)}>
                      Apply <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Button>
                  )}
                  {campaign.status === "PENDING" && (
                    <Button className="h-9 rounded-full border-[#ded8cf] px-4 text-xs font-black text-[#9b6500]" variant="outline" type="button" onClick={() => onWithdraw(campaign.id)}>
                      Withdraw
                    </Button>
                  )}
                  {campaign.status === "ACCEPTED" && (
                    <span className="inline-flex h-9 items-center justify-center rounded-full bg-[#e9f8ef] px-4 text-xs font-black text-[#16864f]">Accepted</span>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function MiniCampaignStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[14px] bg-[#f5f3ef] px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a8175]">{label}</p>
      <p className="mt-1 truncate text-xs font-black text-[#1f252b]">{value}</p>
    </div>
  )
}

function IconButton({ icon: Icon, label }: { icon: typeof Heart; label: string }) {
  return (
    <button className="grid size-9 place-items-center rounded-full border border-[#ded8cf] bg-white text-[#69716b] transition hover:border-[#1f252b] hover:text-[#1f252b]" type="button" aria-label={label}>
      <Icon className="size-4" aria-hidden="true" />
    </button>
  )
}
