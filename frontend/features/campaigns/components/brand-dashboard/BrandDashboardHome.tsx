"use client"

import { ChevronRight, Megaphone, UsersRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ApplicationStatus, MarketplaceApplication as Application, MarketplaceCampaign as Campaign } from "@/features/shared/marketplaceStore"
import { ActivityPanel, ApplicationQueue, CampaignList } from "./BrandDashboardPanels"
import { type Activity, campaignImage, initialCampaigns } from "./brand-dashboard.shared"

type BrandDashboardHomeProps = {
  activities: Activity[]
  analytics: { label: string; value: string; detail: string; icon: LucideIcon }[]
  campaigns: Campaign[]
  pendingApplications: Application[]
  onCreateCampaign: () => void
  onDiscoverCreators: () => void
  onManageCampaigns: () => void
  onPublishCampaign: (id: number) => void
  onReviewApplication: (id: number, status: ApplicationStatus) => void
}

export function BrandDashboardHome({
  activities,
  analytics,
  campaigns,
  pendingApplications,
  onCreateCampaign,
  onDiscoverCreators,
  onManageCampaigns,
  onPublishCampaign,
  onReviewApplication,
}: BrandDashboardHomeProps) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="overflow-hidden rounded-[22px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-sm">
          <div className="grid gap-5 p-5 text-[#1f252b] lg:grid-cols-[1fr_320px]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#f0ece5] px-3 py-1 text-xs font-black text-[#505852]">
                <Megaphone className="size-4" aria-hidden="true" />
                Brand campaign studio
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight">Run campaigns from brief to payout</h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-[#69716b]">
                Manage campaign drafts, creator applications, escrow deposits, collaboration rooms, deliverables, and trust signals from one polished brand workspace.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button className="h-10 rounded-full bg-[#1f252b] px-5 text-xs font-black text-white hover:bg-[#303840]" type="button" onClick={onCreateCampaign}>
                  Create campaign <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
                <Button className="h-10 rounded-full border-[#ded8cf] bg-white px-5 text-xs font-black text-[#1f252b] hover:bg-[#f5f1ea]" variant="outline" type="button" onClick={onDiscoverCreators}>
                  Discover creators <UsersRound className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-[20px] border border-[#e8e2d9] bg-white">
              <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${campaignImage(campaigns[0] ?? initialCampaigns[0])})` }} />
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Featured live campaign</p>
                <p className="mt-1 text-base font-black">{campaigns[0]?.title ?? "Himal Glow winter launch"}</p>
                <p className="mt-1 text-xs font-semibold text-[#69716b]">{campaigns[0]?.applications ?? 18} applications in review</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-[#e8e2d9] p-5 sm:grid-cols-2 xl:grid-cols-4">
            {analytics.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="rounded-[18px] border border-[#e8e2d9] bg-white p-4">
                  <span className="grid size-9 place-items-center rounded-full bg-[#f0ece5] text-[#1f252b]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="mt-4 text-2xl font-black tracking-tight">{item.value}</div>
                  <div className="mt-1 text-xs font-black text-[#505852]">{item.label}</div>
                  <div className="mt-1 text-xs font-semibold text-[#8a8175]">{item.detail}</div>
                </div>
              )
            })}
          </div>
        </div>

        <ActivityPanel activities={activities} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <CampaignList campaigns={campaigns.slice(0, 3)} onPublish={onPublishCampaign} onManage={onManageCampaigns} compact />
        <ApplicationQueue applications={pendingApplications.slice(0, 3)} campaigns={campaigns} onReview={onReviewApplication} />
      </section>
    </div>
  )
}
