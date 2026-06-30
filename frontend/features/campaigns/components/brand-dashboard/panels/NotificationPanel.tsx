"use client"

import { X } from "lucide-react"
import type { Activity } from "../brand-dashboard.shared"

export function NotificationPanel({ activities, onClose }: { activities: Activity[]; onClose: () => void }) {
  return (
    <section className="fixed right-5 top-20 z-50 w-[min(380px,calc(100vw-2rem))] rounded-[24px] border border-[#e8e2d9] bg-[#fbfaf7] shadow-[0_18px_50px_rgba(31,37,43,0.16)]">
      <div className="flex items-start justify-between gap-3 border-b border-[#e8e2d9] p-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Notifications</p>
          <h2 className="mt-1 text-lg font-black text-[#1f252b]">Workspace updates</h2>
        </div>
        <button className="grid size-9 place-items-center rounded-full bg-[#f0ece5] text-[#1f252b] transition hover:bg-[#e4ddd2]" type="button" aria-label="Close notifications" onClick={onClose}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-2 p-4">
        {activities.map((activity) => (
          <p key={activity.id} className="rounded-[18px] bg-white p-3 text-sm font-semibold leading-6 text-[#505852] ring-1 ring-[#e8e2d9]">
            {activity.message}
          </p>
        ))}
      </div>
    </section>
  )
}
