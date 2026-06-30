"use client"

import {
  BriefcaseBusiness,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Search,
  Send,
  UserRound,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  CampaignStatus,
  DeliverableSubmission,
  MarketplaceCampaign,
  MarketplaceCollaboration,
} from "@/features/shared/marketplaceStore"
export type Section = "Dashboard" | "Find Campaigns" | "Applications" | "Collaborations" | "Messages" | "Payouts" | "Profile"
export type CreatorApplicationStatus = "NOT_APPLIED" | "PENDING" | "ACCEPTED" | "REJECTED"
export type CreatorCampaign = Omit<MarketplaceCampaign, "status"> & {
  campaignStatus: CampaignStatus
  match: number
  status: CreatorApplicationStatus
}
export type Collaboration = MarketplaceCollaboration

export type Activity = {
  id: number
  message: string
  tone: "blue" | "green" | "amber"
}

export type CreatorWorkspaceProfile = {
  profileId?: number
  creator: string
  handle: string
  country: "NP" | "IN"
  niche: string
  followers: string
  bio: string
  location: string
  connectedPlatforms: string[]
  analytics: { label: string; value: string; detail: string }[]
}

export const emptySubmissionForm: Omit<DeliverableSubmission, "submittedAt"> = {
  videoUrl: "",
  postUrl: "",
  caption: "",
  notes: "",
  aspectRatio: "9:16",
  duration: "30s",
  checklist: {
    briefMatched: true,
    usageRights: true,
    noCopyrightMusic: true,
  },
}

export const navItems: { label: Section; icon: LucideIcon }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Find Campaigns", icon: Search },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Collaborations", icon: MessageSquare },
  { label: "Messages", icon: Send },
  { label: "Payouts", icon: CreditCard },
  { label: "Profile", icon: UserRound },
]

export const creatorProfileImage = "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=640&q=80"

export const portfolioShots = [
  {
    title: "Skincare morning reel",
    type: "Video",
    metric: "8.4% engagement",
    platform: "Instagram Reels",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Local cafe product story",
    type: "Video",
    metric: "31K views",
    platform: "TikTok",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Beauty shelf UGC",
    type: "Video",
    metric: "12 brand saves",
    platform: "YouTube Shorts",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Cleanser hook test",
    type: "Video",
    metric: "4.9% CTR",
    platform: "Instagram Reels",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "GRWM product mention",
    type: "Video",
    metric: "18K saves",
    platform: "TikTok",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=640&q=80",
  },
]

export const creatorAnalytics = [
  { label: "Engagement", value: "8.4%", detail: "Likes, comments, saves" },
  { label: "Avg views", value: "31K", detail: "Last 30 days" },
  { label: "Avg likes", value: "2.6K", detail: "Per video" },
  { label: "Reach", value: "284K", detail: "Monthly estimate" },
  { label: "Saves", value: "18K", detail: "High intent" },
  { label: "Completion", value: "71%", detail: "Video watch-through" },
]

export function campaignImage(campaign: Pick<MarketplaceCampaign, "niche" | "title">) {
  const key = `${campaign.niche} ${campaign.title}`.toLowerCase()

  if (key.includes("food") || key.includes("momo")) {
    return "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=760&q=80"
  }

  if (key.includes("tea") || key.includes("lifestyle")) {
    return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=760&q=80"
  }

  return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=760&q=80"
}

export function money(value: number) {
  return `NPR ${value.toLocaleString("en-IN")}`
}

export function statusClass(status: string) {
  if (["ACCEPTED", "APPROVED", "PAID", "HELD", "RELEASED", "IN_PROGRESS"].includes(status)) {
    return "bg-[#e9f8ef] text-[#16864f]"
  }
  if (["PENDING", "ESCROW_PENDING", "SUBMITTED"].includes(status)) {
    return "bg-[#fff5df] text-[#9b6500]"
  }
  if (status === "REJECTED") {
    return "bg-[#fff0f0] text-[#b83232]"
  }
  return "bg-[#eef1ff] text-[#6070e8]"
}

