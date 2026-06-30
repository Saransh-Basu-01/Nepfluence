"use client"

import { FormEvent, ReactNode } from "react"
import { Upload, X } from "lucide-react"
import { emptyCampaignForm, lifecycleSteps } from "./brand-dashboard.shared"

export function CampaignFormModal({
  form,
  onChange,
  onClose,
  onSubmit,
}: {
  form: typeof emptyCampaignForm
  onChange: (form: typeof emptyCampaignForm) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#1f252b]/34 px-4 py-6">
      <form className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_24px_70px_rgba(31,37,43,0.24)]" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4 border-b border-[#e8e2d9] p-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Campaigns</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#1f252b]">Create campaign draft</h2>
            <p className="mt-1 max-w-xl text-sm font-semibold leading-6 text-[#69716b]">Save a draft first, then publish when the brief and budget feel ready.</p>
          </div>
          <button className="grid size-9 place-items-center rounded-full bg-[#f0ece5] text-[#1f252b] transition hover:bg-[#e4ddd2]" type="button" aria-label="Close campaign form" onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Campaign title">
            <input required className="input" value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} placeholder="e.g. Himal Glow creator launch" />
          </Field>
          <Field label="Niche">
            <select className="input" value={form.niche} onChange={(event) => onChange({ ...form, niche: event.target.value })}>
              {["Beauty", "Food", "Travel", "Lifestyle", "Fashion", "Tech"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Budget">
            <input className="input" value={form.budget} onChange={(event) => onChange({ ...form, budget: event.target.value })} inputMode="numeric" />
          </Field>
          <Field label="Country">
            <select className="input" value={form.country} onChange={(event) => onChange({ ...form, country: event.target.value as "NP" | "IN" })}>
              <option value="NP">Nepal</option>
              <option value="IN">India</option>
            </select>
          </Field>
          <Field label="Platform">
            <select className="input" value={form.platform} onChange={(event) => onChange({ ...form, platform: event.target.value })}>
              {["Instagram Reels", "TikTok", "YouTube Shorts", "Instagram Stories"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Deadline">
            <input className="input" type="date" value={form.deadline} onChange={(event) => onChange({ ...form, deadline: event.target.value })} />
          </Field>
          <Field label="Brief" wide>
            <textarea required className="input min-h-28 resize-none py-3" value={form.brief} onChange={(event) => onChange({ ...form, brief: event.target.value })} placeholder="Describe content format, must-have shots, revision rules, and approval criteria." />
          </Field>
          <div className="rounded-[20px] bg-white p-4 ring-1 ring-[#e8e2d9] md:col-span-2">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f0ece5] text-[#1f252b]">
                <Upload className="size-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold leading-6 text-[#505852]">
                Media upload will connect to storage later. For now, this creates a clean campaign draft in the MVP workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e8e2d9] p-5 sm:flex-row sm:justify-end">
          <button className="h-10 rounded-full border border-[#ded8cf] px-4 text-sm font-black text-[#505852]" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="h-10 rounded-full bg-[#1f252b] px-4 text-sm font-black text-white transition hover:bg-[#303840]" type="submit">
            Save draft
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`text-xs font-black text-[#505852] ${wide ? "md:col-span-2" : ""}`}>
      {label}
      <div className="mt-2 [&_.input]:w-full [&_.input]:rounded-[18px] [&_.input]:border [&_.input]:border-[#ded8cf] [&_.input]:bg-white [&_.input]:px-4 [&_.input]:text-sm [&_.input]:font-semibold [&_.input]:text-[#1f252b] [&_.input]:outline-none [&_.input]:transition [&_.input]:focus:border-[#1f252b] [&_.input]:focus:ring-4 [&_.input]:focus:ring-[#1f252b]/8 [&_select.input]:h-11 [&_input.input]:h-11">
        {children}
      </div>
    </label>
  )
}

export function LifecycleModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#1f252b]/34 px-4">
      <section className="w-full max-w-lg rounded-[28px] border border-[#e8e2d9] bg-[#fbfaf7] p-5 shadow-[0_24px_70px_rgba(31,37,43,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Workflow</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#1f252b]">Campaign to payout</h2>
          </div>
          <button className="grid size-9 place-items-center rounded-full bg-[#f0ece5] text-[#1f252b] transition hover:bg-[#e4ddd2]" type="button" aria-label="Close lifecycle" onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {lifecycleSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-[18px] bg-white p-3 ring-1 ring-[#e8e2d9]">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1f252b] text-xs font-black text-white">{index + 1}</span>
              <p className="text-sm font-semibold leading-6 text-[#505852]">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function SupportPanel({ onClose }: { onClose: () => void }) {
  return (
    <section className="fixed bottom-20 right-5 z-50 w-[min(380px,calc(100vw-2rem))] rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_18px_50px_rgba(31,37,43,0.16)]">
      <div className="flex items-start justify-between gap-3 border-b border-[#e8e2d9] p-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Support</p>
          <h2 className="mt-1 text-lg font-black text-[#1f252b]">Integration notes</h2>
        </div>
        <button className="grid size-8 place-items-center rounded-full bg-[#f0ece5] text-[#1f252b] transition hover:bg-[#e4ddd2]" type="button" aria-label="Close support" onClick={onClose}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-3 p-4 text-sm font-semibold leading-6 text-[#505852]">
        <p className="rounded-[18px] bg-white p-3 ring-1 ring-[#e8e2d9]">Campaigns, applications, collaboration rooms, payments, and trust reports are now styled as one brand workspace.</p>
        <p className="rounded-[18px] bg-[#f0ece5] p-3">Remaining backend gaps should be wired route by route as FastAPI endpoints are added.</p>
      </div>
    </section>
  )
}
