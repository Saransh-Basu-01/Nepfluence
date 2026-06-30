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

export function NotificationPanel({ activities, onClose }: { activities: Activity[]; onClose: () => void }) {
  return (
    <section className="fixed right-5 top-20 z-50 w-[min(380px,calc(100vw-2rem))] rounded-[8px] border border-[#e4e7f1] bg-white shadow-[0_18px_50px_rgba(25,28,50,0.2)]">
      <div className="flex items-start justify-between gap-3 border-b border-[#edf0f6] p-4">
        <div>
          <p className="text-xs font-black uppercase text-[#6174f8]">Notifications</p>
          <h2 className="text-lg font-black">Creator updates</h2>
        </div>
        <button className="grid size-8 place-items-center rounded-full bg-[#f3f5fb]" type="button" aria-label="Close notifications" onClick={onClose}>
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-3 p-4">
        {activities.map((activity) => (
          <p key={activity.id} className="rounded-[8px] bg-[#f7f8fb] p-3 text-sm font-bold leading-6 text-[#606675]">
            {activity.message}
          </p>
        ))}
      </div>
    </section>
  )
}