"use client"

import { CheckCircle2, IndianRupee, WalletCards } from "lucide-react"
import type { MarketplaceCollaboration as Collaboration } from "@/features/shared/marketplaceStore"
import { money } from "../brand-dashboard.shared"
import { CollaborationsPanel } from "./CollaborationsPanel"
import { MetricCard } from "./MetricCard"

export function PaymentsPanel({
  collaborations,
  paymentTotal,
  onDeposit,
  onApprove,
}: {
  collaborations: Collaboration[]
  paymentTotal: number
  onDeposit: (id: number) => void
  onApprove: (id: number) => void
}) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={WalletCards} label="Escrow held" value={money(paymentTotal)} detail="Held until deliverables are approved" />
        <MetricCard icon={IndianRupee} label="Pending deposit" value={collaborations.filter((item) => item.escrow === "PENDING").length.toString()} detail="Required before collaboration chat" />
        <MetricCard icon={CheckCircle2} label="Released payouts" value={collaborations.filter((item) => item.escrow === "RELEASED").length.toString()} detail="Queued creator payments" />
      </div>
      <CollaborationsPanel collaborations={collaborations} onDeposit={onDeposit} onApprove={onApprove} />
    </section>
  )
}
