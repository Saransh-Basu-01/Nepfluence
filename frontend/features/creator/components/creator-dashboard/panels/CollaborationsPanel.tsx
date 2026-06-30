"use client"

import { PlayCircle } from "lucide-react"
import { type Collaboration, statusClass } from "../creator-dashboard.shared"

export function CollaborationsPanel({
  collaborations,
  onSubmit,
  onMarkPaid,
}: {
  collaborations: Collaboration[]
  onSubmit: (id: number) => void
  onMarkPaid: (id: number) => void
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_12px_34px_rgba(31,37,43,0.06)]">
      <div className="border-b border-[#e8e2d9] px-5 py-4">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Workroom</p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-[#1f252b]">Collaborations</h2>
        <p className="mt-1 text-sm font-semibold leading-5 text-[#69716b]">Submit deliverables after escrow is held.</p>
      </div>
      <div className="grid gap-3 p-4">
        {collaborations.map((collab) => (
          <article key={collab.id} className="rounded-[22px] border border-[#e8e2d9] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-black text-[#1f252b]">{collab.campaign}</h3>
                <p className="mt-1 text-sm font-semibold text-[#69716b]">{collab.brand}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${statusClass(collab.state)}`}>{collab.state.replace("_", " ")}</span>
            </div>
            <p className="mt-4 rounded-[18px] bg-[#f5f3ef] p-3 text-sm font-semibold leading-5 text-[#505852]">{collab.deliverable}</p>
            {collab.submission && (
              <div className="mt-3 rounded-[18px] border border-[#e8e2d9] bg-[#fbfaf7] p-3">
                <div className="flex items-center gap-2 text-sm font-black text-[#1f252b]">
                  <PlayCircle className="size-4" aria-hidden="true" />
                  Video submitted
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-[#69716b]">{collab.submission.caption}</p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {collab.state === "IN_PROGRESS" && (
                <button className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white" type="button" onClick={() => onSubmit(collab.id)}>
                  Submit video
                </button>
              )}
              {collab.state === "SUBMITTED" && (
                <button className="h-9 rounded-full bg-[#16864f] px-4 text-xs font-black text-white" type="button" onClick={() => onMarkPaid(collab.id)}>
                  Simulate payout
                </button>
              )}
              {collab.escrow === "PENDING" && (
                <span className="inline-flex h-9 items-center rounded-full bg-[#fff5df] px-4 text-xs font-black text-[#9b6500]">Escrow pending</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
