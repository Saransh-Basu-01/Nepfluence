"use client"

import { Button } from "@/components/ui/button"
import type { ApplicationStatus, MarketplaceApplication as Application, MarketplaceCampaign as Campaign } from "@/features/shared/marketplaceStore"
import { creatorImage, statusClass } from "../brand-dashboard.shared"

export function ApplicationQueue({
  applications,
  campaigns,
  onReview,
  showResolved = false,
}: {
  applications: Application[]
  campaigns: Campaign[]
  onReview: (id: number, status: ApplicationStatus) => void
  showResolved?: boolean
}) {
  const visibleApplications = showResolved ? applications : applications.filter((application) => application.status === "PENDING")

  return (
    <section className="rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-sm">
      <div className="flex flex-col gap-2 border-b border-[#e8e2d9] p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Creator review</p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-[#1f252b]">Applications</h2>
        </div>
        <p className="max-w-sm text-xs font-semibold leading-5 text-[#69716b]">Accepting a creator opens the collaboration workflow and escrow requirement.</p>
      </div>

      <div className="divide-y divide-[#e8e2d9]">
        {visibleApplications.map((application) => (
          <article key={application.id} className="p-4 transition hover:bg-white/60">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex min-w-0 gap-3">
                <div className="size-14 shrink-0 rounded-[18px] bg-cover bg-center ring-1 ring-[#e8e2d9]" style={{ backgroundImage: `url(${creatorImage(application.handle)})` }} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-black text-[#1f252b]">{application.creator}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusClass(application.status)}`}>{application.status}</span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-[#69716b]">{application.handle} / {application.niche} / {application.followers} followers</p>
                  <p className="mt-1 text-xs font-semibold text-[#8a8175]">
                    Applying to {campaigns.find((campaign) => campaign.id === application.campaignId)?.title ?? "campaign"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span className="rounded-full bg-[#f0ece5] px-3 py-1 text-xs font-black text-[#505852]">{application.match}% match</span>
                {application.status === "PENDING" && (
                  <>
                    <Button className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white hover:bg-[#303840]" type="button" onClick={() => onReview(application.id, "ACCEPTED")}>
                      Accept
                    </Button>
                    <Button className="h-9 rounded-full border-[#e8caca] px-4 text-xs font-black text-[#9f1d1d]" variant="outline" type="button" onClick={() => onReview(application.id, "REJECTED")}>
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </article>
        ))}

        {visibleApplications.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm font-black text-[#1f252b]">No applications here yet</p>
            <p className="mt-2 text-xs font-semibold text-[#69716b]">Published campaigns will collect creator applications in this queue.</p>
          </div>
        )}
      </div>
    </section>
  )
}
