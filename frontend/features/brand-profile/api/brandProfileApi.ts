"use client"

import { apiClient } from "@/lib/api-client"

export type BrandProfile = {
  id: number
  user_id: number
  company_name: string
  website: string | null
  description: string | null
  industry: string | null
  company_size: string | null
  is_verified: boolean
}

export type BrandProfilePayload = {
  company_name: string
  website?: string
  description?: string
  industry?: string
  company_size?: string
}

export async function getMyBrandProfile() {
  try {
    return await apiClient<BrandProfile>("/brand-profile/me")
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("not found")) {
      return null
    }

    throw error
  }
}

export function createMyBrandProfile(payload: BrandProfilePayload) {
  return apiClient<BrandProfile>("/brand-profile/me", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateMyBrandProfile(payload: Partial<BrandProfilePayload>) {
  return apiClient<BrandProfile>("/brand-profile/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}
