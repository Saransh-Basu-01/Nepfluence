"use client"

import { AlertTriangle, BadgeCheck, ShieldCheck } from "lucide-react"
import { MetricCard } from "./MetricCard"

export function TrustPanel() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <MetricCard icon={BadgeCheck} label="Verified creators" value="4/5" detail="Manual profile review" />
      <MetricCard icon={AlertTriangle} label="Open disputes" value="0" detail="Admin queue clear" />
      <MetricCard icon={ShieldCheck} label="Escrow protected" value="100%" detail="Brand to creator only" />
      <div className="rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] p-5 shadow-sm lg:col-span-3">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Trust rules</p>
        <h2 className="mt-1 text-lg font-black text-[#1f252b]">Marketplace guardrails</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Campaign brief locks after creator acceptance.", "Creator never deposits money to brand.", "Disputes hold escrow until admin resolution."].map((rule) => (
            <div key={rule} className="rounded-[18px] bg-white p-4 text-sm font-semibold leading-6 text-[#505852] ring-1 ring-[#e8e2d9]">{rule}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
