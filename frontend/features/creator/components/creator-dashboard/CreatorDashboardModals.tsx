/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  Heart,
  IndianRupee,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react"
import { FormEvent, ReactNode, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CampaignStatus,
  DeliverableSubmission,
  MarketplaceCampaign,
  MarketplaceCollaboration,
  useMarketplaceStore,
} from "@/features/shared/marketplaceStore"
import { type Collaboration } from "./creator-dashboard.shared"

export function DeliverableSubmissionModal({
  collab,
  form,
  onChange,
  onClose,
  onSubmit,
}: {
  collab: Collaboration
  form: Omit<DeliverableSubmission, "submittedAt">
  onChange: (form: Omit<DeliverableSubmission, "submittedAt">) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4 py-6">
      <form className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[8px] bg-white shadow-[0_24px_70px_rgba(20,21,34,0.28)]" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4 border-b border-[#edf0f6] p-5">
          <div>
            <p className="text-xs font-black uppercase text-[#6174f8]">Creator deliverable</p>
            <h2 className="mt-1 text-2xl font-black">Submit campaign video</h2>
            <p className="mt-1 text-sm font-medium text-[#727887]">{collab.campaign} - {collab.brand}</p>
          </div>
          <button className="grid size-9 place-items-center rounded-full bg-[#f3f5fb]" type="button" aria-label="Close submission form" onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <SubmissionField label="Video draft URL" required>
              <input className="input" required type="url" value={form.videoUrl} onChange={(event) => onChange({ ...form, videoUrl: event.target.value })} placeholder="https://youtube.com/shorts/... or https://drive.google.com/..." />
            </SubmissionField>
            <SubmissionField label="Published post URL">
              <input className="input" type="url" value={form.postUrl} onChange={(event) => onChange({ ...form, postUrl: event.target.value })} placeholder="Instagram/TikTok post link after publishing" />
            </SubmissionField>
            <div className="grid gap-4 sm:grid-cols-2">
              <SubmissionField label="Aspect ratio">
                <select className="input" value={form.aspectRatio} onChange={(event) => onChange({ ...form, aspectRatio: event.target.value })}>
                  <option>9:16</option>
                  <option>1:1</option>
                  <option>16:9</option>
                </select>
              </SubmissionField>
              <SubmissionField label="Duration">
                <select className="input" value={form.duration} onChange={(event) => onChange({ ...form, duration: event.target.value })}>
                  <option>15s</option>
                  <option>30s</option>
                  <option>45s</option>
                  <option>60s</option>
                </select>
              </SubmissionField>
            </div>
            <SubmissionField label="Caption">
              <textarea className="input min-h-24 resize-none py-3" value={form.caption} onChange={(event) => onChange({ ...form, caption: event.target.value })} placeholder="Write the campaign caption or hook used in the video." />
            </SubmissionField>
            <SubmissionField label="Notes for brand">
              <textarea className="input min-h-24 resize-none py-3" value={form.notes} onChange={(event) => onChange({ ...form, notes: event.target.value })} placeholder="Mention changes, timing, product shots, CTA, or questions." />
            </SubmissionField>
          </div>

          <aside className="rounded-[8px] border border-[#edf0f6] bg-[#fbfcff] p-4">
            <div className="grid min-h-44 place-items-center rounded-[8px] bg-[#111322] text-center text-white">
              <div>
                <PlayCircle className="mx-auto size-10 text-[#9fb0ff]" aria-hidden="true" />
                <p className="mt-3 text-sm font-black">Video review preview</p>
                <p className="mt-1 px-6 text-xs font-bold text-white/62">Brand opens the draft URL from review queue.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["briefMatched", "Video matches campaign brief"],
                ["usageRights", "Brand can use this content"],
                ["noCopyrightMusic", "No copyrighted music"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-[8px] bg-white p-3 text-sm font-bold text-[#555866]">
                  <input
                    className="size-4 accent-[#6174f8]"
                    type="checkbox"
                    checked={form.checklist[key as keyof typeof form.checklist]}
                    onChange={(event) =>
                      onChange({
                        ...form,
                        checklist: { ...form.checklist, [key]: event.target.checked },
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </aside>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#edf0f6] p-5">
          <Button className="h-10 rounded-[8px] px-4 text-sm font-black" variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="h-10 rounded-[8px] bg-[#6174f8] px-4 text-sm font-black text-white hover:bg-[#5268df]" type="submit">
            Submit for brand review
          </Button>
        </div>
      </form>
    </div>
  )
}

function SubmissionField({ label, children, required = false }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="text-sm font-black text-[#484b57]">
      {label} {required && <span className="text-[#b83232]">*</span>}
      <div className="mt-2 [&_.input]:h-11 [&_.input]:w-full [&_.input]:rounded-[8px] [&_.input]:border [&_.input]:border-[#dfe3ee] [&_.input]:bg-white [&_.input]:px-3 [&_.input]:text-sm [&_.input]:font-bold [&_.input]:outline-none [&_.input]:transition [&_.input]:focus:border-[#6174f8] [&_.input]:focus:ring-4 [&_.input]:focus:ring-[#6174f8]/10">
        {children}
      </div>
    </label>
  )
}
