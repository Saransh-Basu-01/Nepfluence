/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Clock3,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  Heart,
  IndianRupee,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react"
import { FormEvent, ReactNode, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CampaignStatus,
  DeliverableSubmission,
  MarketplaceCampaign,
  MarketplaceCollaboration,
  useMarketplaceStore,
} from "@/features/shared/marketplaceStore"
import {
  type Activity,
  type Collaboration,
  type CreatorCampaign,
  creatorAnalytics,
  creatorProfileImage,
  portfolioShots,
  campaignImage,
  money,
  statusClass,
} from "../creator-dashboard.shared"

import { CollaborationsPanel } from "./CollaborationsPanel"
import { MetricCard } from "./MetricCard"
export function PayoutsPanel({
  collaborations,
  onSubmit,
  onMarkPaid,
}: {
  collaborations: Collaboration[]
  onSubmit: (id: number) => void
  onMarkPaid: (id: number) => void
}) {
  const escrowHeld = collaborations.filter((item) => item.escrow === "HELD").reduce((sum, item) => sum + item.payout, 0)
  const released = collaborations.filter((item) => item.escrow === "RELEASED").reduce((sum, item) => sum + item.payout, 0)

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={WalletCards} label="Escrow held" value={money(escrowHeld)} detail="Protected by brand deposit" />
        <MetricCard icon={IndianRupee} label="Released" value={money(released)} detail="Available after approval" />
        <MetricCard icon={Clock3} label="Pending brand escrow" value={collaborations.filter((item) => item.escrow === "PENDING").length.toString()} detail="Chat locked until deposit" />
      </div>
      <CollaborationsPanel collaborations={collaborations} onSubmit={onSubmit} onMarkPaid={onMarkPaid} />
    </section>
  )
}