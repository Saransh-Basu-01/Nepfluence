"use client"

import { type Activity } from "../creator-dashboard.shared"

export function ActivityPanel({ activities }: { activities: Activity[] }) {
  return (
    <section className="rounded-[28px] border border-[#e8e2d9] bg-[#fbfaf7] p-5 shadow-[0_18px_46px_rgba(31,37,43,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a8175]">Updates</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-[#1f252b]">Activity</h2>
        </div>
        <span className="rounded-full bg-[#f0ece5] px-3 py-1 text-xs font-black text-[#505852]">Live</span>
      </div>
      <div className="mt-5 space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 rounded-[18px] bg-white p-3">
            <span className={`mt-1 size-2.5 shrink-0 rounded-full ${activity.tone === "green" ? "bg-[#16864f]" : activity.tone === "amber" ? "bg-[#e5a122]" : "bg-[#1f252b]"}`} />
            <p className="text-sm font-semibold leading-6 text-[#505852]">{activity.message}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
