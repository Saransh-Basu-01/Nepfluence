"use client"

export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-white/86 p-3 ring-1 ring-[#e8e2d9]">
      <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a8175]">{label}</div>
      <div className="mt-1 text-sm font-black text-[#1f252b]">{value}</div>
    </div>
  )
}
