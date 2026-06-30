"use client"

import {
  Boxes,
  Building2,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Megaphone,
  UsersRound,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
  MarketplaceCampaign as Campaign,
} from "@/features/shared/marketplaceStore"
export type Section =
  | "Dashboard"
  | "Campaigns"
  | "Applications"
  | "Collaborations"
  | "Messages"
  | "Discover Creators"
  | "Payments"
  | "Brand Profile"
  | "Trust & Reports"

export type Activity = {
  id: number
  message: string
  tone: "blue" | "green" | "amber" | "red"
}

export const navItems: { label: Section; icon: LucideIcon }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Campaigns", icon: Megaphone },
  { label: "Applications", icon: ClipboardList },
  { label: "Collaborations", icon: Boxes },
  { label: "Messages", icon: MessageSquare },
  { label: "Discover Creators", icon: UsersRound },
  { label: "Payments", icon: CreditCard },
  { label: "Brand Profile", icon: Building2 },
  { label: "Trust & Reports", icon: FileText },
]

export const creators = [
  {
    name: "Aarati Rai",
    handle: "@aaratiugc",
    country: "NP",
    niche: "Beauty UGC",
    followers: "42K",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Nischal Gurung",
    handle: "@trailnischal",
    country: "NP",
    niche: "Travel reels",
    followers: "35K",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Sanya Mehta",
    handle: "@sanyastyle",
    country: "IN",
    niche: "Fashion",
    followers: "88K",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Pratik Lama",
    handle: "@momoreels",
    country: "NP",
    niche: "Food",
    followers: "27K",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=320&q=80",
  },
  {
    name: "Kabir Rao",
    handle: "@kabircreates",
    country: "IN",
    niche: "Lifestyle",
    followers: "103K",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=320&q=80",
  },
]

export type Creator = (typeof creators)[number]

export const creatorWorkSamples = [
  {
    title: "Skincare morning reel",
    creator: "@aaratiugc",
    platform: "Instagram Reels",
    metric: "8.4% engagement",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Local cafe product story",
    creator: "@aaratiugc",
    platform: "TikTok",
    metric: "31K views",
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Beauty shelf UGC",
    creator: "@aaratiugc",
    platform: "YouTube Shorts",
    metric: "12 brand saves",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "Cleanser hook test",
    creator: "@aaratiugc",
    platform: "Instagram Reels",
    metric: "4.9% CTR",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=640&q=80",
  },
  {
    title: "GRWM product mention",
    creator: "@aaratiugc",
    platform: "TikTok",
    metric: "18K saves",
    image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=640&q=80",
  },
]

export const creatorAnalytics = {
  "@aaratiugc": {
    engagementRate: "8.4%",
    avgViews: "31K",
    avgLikes: "2.6K",
    monthlyReach: "284K",
    saves: "18K",
    completionRate: "71%",
    responseTime: "12h",
    audience: [
      { label: "Nepal", value: "68%" },
      { label: "India", value: "21%" },
      { label: "Other", value: "11%" },
    ],
    age: [
      { label: "18-24", value: "44%" },
      { label: "25-34", value: "39%" },
      { label: "35+", value: "17%" },
    ],
  },
}

export const initialCampaigns: Campaign[] = [
  {
    id: 1,
    brand: "Himal Glow",
    title: "Himal Glow winter launch",
    niche: "Beauty",
    budget: 120000,
    country: "NP",
    platform: "Instagram Reels",
    status: "OPEN",
    applications: 18,
    accepted: 2,
    reach: 284000,
    deadline: "2026-06-12",
    brief: "Short UGC videos for a skincare launch with local creator voiceover.",
  },
  {
    id: 2,
    brand: "8848 Momo House",
    title: "8848 Momo House reels",
    niche: "Food",
    budget: 78000,
    country: "NP",
    platform: "TikTok",
    status: "DRAFT",
    applications: 0,
    accepted: 0,
    reach: 0,
    deadline: "2026-06-18",
    brief: "Creator visit and food reaction reels for new menu.",
  },
  {
    id: 3,
    brand: "Trail Tea",
    title: "Trail Tea creator stories",
    niche: "Lifestyle",
    budget: 95000,
    country: "IN",
    platform: "Instagram Stories",
    status: "PAUSED",
    applications: 9,
    accepted: 1,
    reach: 124000,
    deadline: "2026-06-22",
    brief: "Lifestyle story campaign for tea bundles.",
  },
]

export const lifecycleSteps = [
  "Create campaign as DRAFT",
  "Publish campaign as OPEN",
  "Influencers apply in PENDING state",
  "Accept creator and lock campaign brief",
  "Deposit escrow to unlock chat",
  "Review deliverables and request revision if needed",
  "Approve work and release payment",
]

export const emptyCampaignForm = {
  title: "",
  niche: "Beauty",
  budget: "50000",
  country: "NP" as "NP" | "IN",
  platform: "Instagram Reels",
  deadline: "",
  brief: "",
}

export function money(value: number) {
  return `NPR ${value.toLocaleString("en-IN")}`
}

export function campaignImage(campaign: Pick<Campaign, "niche" | "title">) {
  const key = `${campaign.niche} ${campaign.title}`.toLowerCase()

  if (key.includes("food") || key.includes("momo")) {
    return "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=760&q=80"
  }

  if (key.includes("tea") || key.includes("lifestyle")) {
    return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=760&q=80"
  }

  return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=760&q=80"
}

export function creatorImage(handle: string) {
  return creators.find((creator) => creator.handle === handle)?.image ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80"
}

export function statusClass(status: string) {
  if (["OPEN", "HELD", "IN_PROGRESS", "ACCEPTED", "APPROVED", "RELEASED"].includes(status)) {
    return "bg-[#e9f8ef] text-[#16864f]"
  }
  if (["DRAFT", "PENDING", "ESCROW_PENDING", "SUBMITTED"].includes(status)) {
    return "bg-[#fff5df] text-[#9b6500]"
  }
  if (["PAUSED", "REJECTED"].includes(status)) {
    return "bg-[#fff0f0] text-[#b83232]"
  }
  return "bg-[#f0ece5] text-[#505852]"
}

