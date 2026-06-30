"use client"

import { LayoutDashboard } from "lucide-react"
import type { ReactNode } from "react"

export function InfoCard({ icon: Icon, title, body }: { icon: typeof LayoutDashboard; title: string; body: ReactNode }) {
  return (
    <div className="rounded-[22px] border border-[#e8e2d9] bg-white p-4">
      <span className="grid size-9 place-items-center rounded-full bg-[#f0ece5] text-[#505852]">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-black text-[#1f252b]">{title}</h3>
      <p className="mt-2 text-xs font-semibold leading-5 text-[#69716b]">{body}</p>
    </div>
  )
}
