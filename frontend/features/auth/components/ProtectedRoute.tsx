"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { readMockSession } from "@/lib/auth"
import type { UserRole } from "@/features/auth/types/auth.types"

type ProtectedRouteProps = {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

function defaultDashboard(role: UserRole) {
  return role === "creator" ? "/creator/dashboard" : "/dashboard"
}

function isSessionValid() {
  const session = readMockSession()

  if (!session?.accessToken) return null
  if (Date.parse(session.accessTokenExpiresAt) <= Date.now()) return null

  return session
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const session = isSessionValid()

    if (!session) {
      const role = pathname.startsWith("/creator") ? "creator" : "brand"
      router.replace(`/login?role=${role}`)
      return
    }

    if (!allowedRoles.includes(session.role)) {
      router.replace(defaultDashboard(session.role))
      return
    }

    setIsAllowed(true)
  }, [allowedRoles, pathname, router])

  if (!isAllowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f7ff] px-6 text-center text-[#241655]">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6e70ee]">Checking access</p>
      </main>
    )
  }

  return children
}
