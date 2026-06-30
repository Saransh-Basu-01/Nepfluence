"use client"

import { ExternalLink, PlayCircle } from "lucide-react"
import type { MarketplaceCollaboration as Collaboration } from "@/features/shared/marketplaceStore"
import { statusClass } from "../brand-dashboard.shared"
import { MiniReviewStat } from "./ReviewStats"

export function CollaborationsPanel({
  collaborations,
  onDeposit,
  onApprove,
}: {
  collaborations: Collaboration[]
  onDeposit: (id: number) => void
  onApprove: (id: number) => void
}) {
  return (
    <section className="rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-sm">
      <div className="flex flex-col gap-2 border-b border-[#e8e2d9] p-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Work in progress</p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-[#1f252b]">Collaborations</h2>
        </div>
        <p className="max-w-sm text-xs font-semibold leading-5 text-[#69716b]">Escrow controls chat access, creator submission, and deliverable approval.</p>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {collaborations.map((collab) => (
          <article key={collab.id} className="rounded-[22px] border border-[#e8e2d9] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-[#1f252b]">{collab.campaign}</h3>
                <p className="mt-1 text-xs font-bold text-[#69716b]">{collab.creator}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${statusClass(collab.state)}`}>{collab.state}</span>
            </div>

            <p className="mt-4 rounded-[18px] bg-[#f5f3ef] p-3 text-sm font-semibold leading-6 text-[#505852]">{collab.deliverable}</p>

            {collab.submission ? (
              <div className="mt-4 overflow-hidden rounded-[20px] border border-[#e8e2d9] bg-[#fbfaf7]">
                <div className="grid min-h-40 place-items-center bg-[#1f252b] p-5 text-center text-white">
                  <div>
                    <PlayCircle className="mx-auto size-9 text-white/76" aria-hidden="true" />
                    <p className="mt-3 text-sm font-black">Creator video ready for review</p>
                    <a className="mt-2 inline-flex items-center gap-1 text-xs font-black text-white/76 hover:text-white" href={collab.submission.videoUrl} target="_blank" rel="noreferrer">
                      Open video draft
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <MiniReviewStat label="Format" value={collab.submission.aspectRatio} />
                    <MiniReviewStat label="Duration" value={collab.submission.duration} />
                  </div>
                  <InfoBlock label="Caption" value={collab.submission.caption || "No caption added."} />
                  <InfoBlock label="Creator notes" value={collab.submission.notes || "No notes added."} />
                  <div className="grid gap-2">
                    {[
                      ["Brief matched", collab.submission.checklist.briefMatched],
                      ["Usage rights confirmed", collab.submission.checklist.usageRights],
                      ["No copyrighted music", collab.submission.checklist.noCopyrightMusic],
                    ].map(([label, checked]) => (
                      <div key={label as string} className="flex items-center justify-between rounded-[16px] bg-white px-3 py-2 text-xs font-black text-[#505852]">
                        <span>{label}</span>
                        <span className={checked ? "text-[#16864f]" : "text-[#9f1d1d]"}>{checked ? "Done" : "Missing"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[18px] border border-dashed border-[#ded8cf] bg-[#fbfaf7] p-4 text-sm font-semibold text-[#69716b]">
                Waiting for creator to submit the required video and review form.
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {collab.escrow === "PENDING" && (
                <button className="h-9 rounded-full bg-[#1f252b] px-4 text-xs font-black text-white transition hover:bg-[#303840]" type="button" onClick={() => onDeposit(collab.id)}>
                  Deposit escrow
                </button>
              )}
              {collab.state === "IN_PROGRESS" && (
                <span className="inline-flex h-9 items-center rounded-full border border-[#ded8cf] px-4 text-xs font-black text-[#505852]">
                  Awaiting video
                </span>
              )}
              {collab.state === "SUBMITTED" && (
                <button className="h-9 rounded-full bg-[#16864f] px-4 text-xs font-black text-white transition hover:bg-[#127344] disabled:opacity-50" type="button" onClick={() => onApprove(collab.id)} disabled={!collab.submission}>
                  Approve deliverable
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a8175]">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#505852]">{value}</p>
    </div>
  )
}
