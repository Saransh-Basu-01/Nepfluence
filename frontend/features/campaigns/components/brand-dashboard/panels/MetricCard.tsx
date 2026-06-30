"use client"

import type { LucideIcon } from "lucide-react"

export function MetricCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[22px] border border-[#e8e2d9] bg-[#fbfaf7] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#8a8175]">{label}</p>
          <p className="mt-3 text-2xl font-black tracking-tight text-[#1f252b]">{value}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#ede7dc] text-[#1f252b]">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-[#69716b]">{detail}</p>
    </div>
  )
}
