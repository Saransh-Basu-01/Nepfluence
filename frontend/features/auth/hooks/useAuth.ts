"use client"

import { login, logout, readMockSession, register } from "@/lib/auth"

export function useAuth() {
  return {
    session: readMockSession(),
    login,
    logout,
    register,
  }
}
