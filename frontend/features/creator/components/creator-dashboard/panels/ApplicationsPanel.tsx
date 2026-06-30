"use client"

import { type CreatorCampaign, statusClass } from "../creator-dashboard.shared"

export function ApplicationsPanel({ campaigns, onWithdraw }: { campaigns: CreatorCampaign[]; onWithdraw: (id: number) => void }) {
  const applications = campaigns.filter((campaign) => campaign.status !== "NOT_APPLIED")

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_12px_34px_rgba(31,37,43,0.06)]">
      <div className="border-b border-[#e8e2d9] px-5 py-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Pipeline</p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-[#1f252b]">Applications</h2>
        <p className="mt-1 text-sm font-semibold text-[#69716b]">Submitted, accepted, and rejected campaign requests.</p>
      </div>
      <div className="grid gap-3 p-4">
        {applications.map((campaign) => (
          <article key={campaign.id} className="flex flex-col gap-3 rounded-[22px] border border-[#e8e2d9] bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-base font-black text-[#1f252b]">{campaign.title}</h3>
              <p className="mt-1 text-sm font-semibold text-[#69716b]">{campaign.brand} / {campaign.platform}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-black ${statusClass(campaign.status)}`}>{campaign.status.replace("_", " ")}</span>
              {campaign.status === "PENDING" && (
                <button className="h-9 rounded-full border border-[#ded8cf] px-4 text-xs font-black text-[#9b6500]" type="button" onClick={() => onWithdraw(campaign.id)}>
                  Withdraw
                </button>
              )}
            </div>
          </article>
        ))}
        {applications.length === 0 && (
          <div className="rounded-[22px] border border-dashed border-[#ded8cf] bg-white/70 p-8 text-center">
            <p className="text-lg font-black text-[#1f252b]">No applications yet</p>
            <p className="mt-2 text-sm font-semibold text-[#69716b]">Apply from Find campaigns to start your pipeline.</p>
          </div>
        )}
      </div>
    </section>
  )
}
