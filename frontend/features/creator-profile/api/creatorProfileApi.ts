"use client"

import { apiClient } from "@/lib/api-client"

export type SocialAccount = {
  id: number
  influencer_id: number
  platform: "instagram" | "youtube" | "tiktok"
  youtube_channel_id: string
  youtube_handle: string | null
}

export type YouTubeStats = {
  channel_id: string
  channel_name: string | null
  subscribers: number | null
  total_views: number | null
  total_videos: number | null
  average_views: number | null
  engagement_rate: number | null
}

export type CreatorProfile = {
  id: number
  user_id: number
  full_name: string
  bio: string | null
  niche: string
  availability: boolean
  social_accounts: SocialAccount[]
  youtube_stats: YouTubeStats[]
}

export type CreatorProfilePayload = {
  full_name: string
  bio?: string
  niche: string
  availability?: boolean
}

export async function getMyCreatorProfile() {
  try {
    return await apiClient<CreatorProfile>("/influencer-profile/me")
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("not found")) {
      return null
    }

    throw error
  }
}

export function createMyCreatorProfile(payload: CreatorProfilePayload) {
  return apiClient<CreatorProfile>("/influencer-profile/me", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateMyCreatorProfile(payload: Partial<CreatorProfilePayload>) {
  return apiClient<CreatorProfile>("/influencer-profile/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}
