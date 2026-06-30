"use client"

import { ArrowRight, Edit3, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CreatorCampaign, Collaboration, Activity, CreatorWorkspaceProfile } from "./creator-dashboard.shared"
import { ActivityPanel, CampaignsPanel, CollaborationsPanel, MetricCard, MiniStat } from "./CreatorDashboardPanels"

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "CR"
}

type CreatorDashboardHomeProps = {
  activities: Activity[]
  campaigns: CreatorCampaign[]
  collaborations: Collaboration[]
  campaignSearch: string
  creatorProfile: CreatorWorkspaceProfile
  stats: { label: string; value: string; detail: string; icon: LucideIcon }[]
  onApply: (id: number) => void
  onBrowseCampaigns: () => void
  onEditProfile: () => void
  onMarkPaid: (id: number) => void
  onSearch: (search: string) => void
  onSubmit: (id: number) => void
  onWithdraw: (id: number) => void
}

export function CreatorDashboardHome({
  activities,
  campaigns,
  collaborations,
  campaignSearch,
  creatorProfile,
  stats,
  onApply,
  onBrowseCampaigns,
  onEditProfile,
  onMarkPaid,
  onSearch,
  onSubmit,
  onWithdraw,
}: CreatorDashboardHomeProps) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[28px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_18px_46px_rgba(31,37,43,0.07)]">
          <div className="relative grid gap-5 bg-[#e8e2d9] p-5 lg:grid-cols-[1fr_280px]">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1500&q=80)" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf7] via-[#fbfaf7]/92 to-[#fbfaf7]/70" />
            <div>
              <p className="relative inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-[#1f252b] ring-1 ring-[#e8e2d9]">
                <Sparkles className="size-4" aria-hidden="true" />
                Creator command center
              </p>
              <h2 className="relative mt-4 max-w-2xl text-3xl font-black tracking-tight text-[#1f252b]">Manage brand deals from application to payout</h2>
              <p className="relative mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#505852]">
                Browse matching campaigns, track applications, submit deliverables, and keep payout steps clear.
              </p>
              <div className="relative mt-5 flex flex-wrap gap-2">
                <Button className="h-10 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#363d43]" type="button" onClick={onBrowseCampaigns}>
                  Browse campaigns <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button className="h-10 rounded-full border-[#ded8cf] bg-white/70 px-4 text-xs font-black text-[#1f252b] hover:bg-white" variant="outline" type="button" onClick={onEditProfile}>
                  Edit profile <Edit3 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="relative rounded-[24px] border border-[#e8e2d9] bg-white/82 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid size-16 place-items-center rounded-[20px] bg-[#1f252b] text-lg font-black text-white ring-4 ring-white">
                  {initials(creatorProfile.creator)}
                </div>
                <div>
                  <p className="text-lg font-black text-[#1f252b]">{creatorProfile.creator}</p>
                  <p className="text-sm font-bold text-[#69716b]">{creatorProfile.handle}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <MiniStat label="Followers" value={creatorProfile.followers} />
                <MiniStat label="Accounts" value={creatorProfile.connectedPlatforms.length.toString()} />
                <MiniStat label="Profile" value={creatorProfile.connectedPlatforms.length ? "Live" : "Draft"} />
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Creator home</p>
            <h3 className="mt-1 text-xl font-black tracking-tight text-[#1f252b]">Live performance snapshot</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => <MetricCard key={item.label} icon={item.icon} label={item.label} value={item.value} detail={item.detail} />)}
            </div>
          </div>
        </div>
        <ActivityPanel activities={activities} />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <CampaignsPanel campaigns={campaigns.slice(0, 3)} search={campaignSearch} onSearch={onSearch} onApply={onApply} onWithdraw={onWithdraw} compact />
        <CollaborationsPanel collaborations={collaborations} onSubmit={onSubmit} onMarkPaid={onMarkPaid} />
      </section>
    </div>
  )
}
