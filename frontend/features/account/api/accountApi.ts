"use client"

import { apiClient } from "@/lib/api-client"

export type AccountUpdatePayload = {
  username?: string
  email?: string
  phone_number?: string
  country?: string
}

export type AccountUser = {
  id: number
  username: string
  email: string
  role: "brand" | "influencer" | "admin"
}

export function updateAccount(userId: string, payload: AccountUpdatePayload) {
  return apiClient<AccountUser>(`/api/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
}

export function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return apiClient<{ message: string }>("/api/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({
      current_password: payload.currentPassword,
      new_password: payload.newPassword,
    }),
  })
}
