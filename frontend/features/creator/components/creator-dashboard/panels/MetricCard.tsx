"use client"

import { LayoutDashboard } from "lucide-react"

export function MetricCard({ icon: Icon, label, value, detail }: { icon: typeof LayoutDashboard; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[22px] border border-[#e8e2d9] bg-white p-4 shadow-[0_10px_28px_rgba(31,37,43,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-[#f0ece5] text-[#505852]">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-[#f5f3ef] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#8a8175]">Live</span>
      </div>
      <div className="mt-4 text-2xl font-black tracking-tight text-[#1f252b]">{value}</div>
      <div className="mt-1 text-sm font-black text-[#505852]">{label}</div>
      <div className="mt-1 text-xs font-semibold leading-5 text-[#69716b]">{detail}</div>
    </div>
  )
}
