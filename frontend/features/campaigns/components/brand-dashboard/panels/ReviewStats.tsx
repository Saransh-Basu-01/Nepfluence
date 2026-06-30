"use client"

export function MiniReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#f5f3ef] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8a8175]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#1f252b]">{value}</p>
    </div>
  )
}
