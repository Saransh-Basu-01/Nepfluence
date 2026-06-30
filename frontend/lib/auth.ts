import type { AuthSession, UserRole } from "@/features/auth/types/auth.types"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const sessionKey = "nepfluence-session"
const creatorOnboardingPrefix = "nepfluence-creator-onboarding"
const brandOnboardingPrefix = "nepfluence-brand-onboarding"

type BackendUserRole = "brand" | "influencer" | "admin"

type BackendUser = {
  id: number
  username: string
  email: string
  role: BackendUserRole
}

type TokenResponse = {
  access_token: string
  token_type: string
}

type RegisterInput = {
  username: string
  email: string
  password: string
  role: UserRole
  phoneNumber?: string
  country?: string
  companyEmail?: string
  companyWebsite?: string
}

type LoginInput = {
  email: string
  password: string
  roleHint?: UserRole
}

function toBackendRole(role: UserRole): BackendUserRole {
  return role === "creator" ? "influencer" : role
}

function toFrontendRole(role: BackendUserRole): UserRole {
  return role === "influencer" ? "creator" : role
}

function tokenExpiry() {
  return new Date(Date.now() + 30 * 60 * 1000).toISOString()
}

function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return null
  window.localStorage.setItem(sessionKey, JSON.stringify(session))
  return session
}

async function parseError(response: Response) {
  const payload = await response.json().catch(() => null)
  return payload?.detail ?? payload?.message ?? "Request failed"
}

export function readMockSession(): AuthSession | null {
  if (typeof window === "undefined") return null

  const rawSession = window.localStorage.getItem(sessionKey)
  return rawSession ? (JSON.parse(rawSession) as AuthSession) : null
}

export function readAuthToken() {
  return readMockSession()?.accessToken ?? null
}

export function updateStoredSession(updates: Partial<Pick<AuthSession, "email" | "username">>) {
  const session = readMockSession()
  if (!session) return null

  return saveSession({
    ...session,
    ...updates,
  })
}

export function hasCompletedCreatorOnboarding(userId?: string) {
  if (typeof window === "undefined" || !userId) return false
  return window.localStorage.getItem(`${creatorOnboardingPrefix}:${userId}`) === "complete"
}

export function completeCreatorOnboarding(userId?: string) {
  if (typeof window === "undefined" || !userId) return
  window.localStorage.setItem(`${creatorOnboardingPrefix}:${userId}`, "complete")
}

export function hasCompletedBrandOnboarding(userId?: string) {
  if (typeof window === "undefined" || !userId) return false
  return window.localStorage.getItem(`${brandOnboardingPrefix}:${userId}`) === "complete"
}

export function completeBrandOnboarding(userId?: string) {
  if (typeof window === "undefined" || !userId) return
  window.localStorage.setItem(`${brandOnboardingPrefix}:${userId}`, "complete")
}

export function nextRouteForSession(session: AuthSession | null) {
  if (!session) return "/login"
  if (session.role === "creator" && !hasCompletedCreatorOnboarding(session.userId)) {
    return "/creator/onboarding"
  }
  if (session.role === "brand" && !hasCompletedBrandOnboarding(session.userId)) {
    return "/brand/onboarding"
  }
  return session.role === "creator" ? "/creator/dashboard" : "/dashboard"
}

export async function register(input: RegisterInput) {
  const response = await fetch(`${apiBaseUrl}/api/users/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: input.username,
      email: input.email,
      password: input.password,
      role: toBackendRole(input.role),
      phone_number: input.phoneNumber || undefined,
      country: input.country || undefined,
      company_email: input.companyEmail || undefined,
      company_website: input.companyWebsite || undefined,
    }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return login({ email: input.email, password: input.password, roleHint: input.role })
}

export async function login(input: LoginInput) {
  const body = new URLSearchParams()
  body.set("username", input.email)
  body.set("password", input.password)

  const tokenResponse = await fetch(`${apiBaseUrl}/api/users/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  if (!tokenResponse.ok) {
    throw new Error(await parseError(tokenResponse))
  }

  const token = (await tokenResponse.json()) as TokenResponse
  const userResponse = await fetch(`${apiBaseUrl}/api/users/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token.access_token}`,
    },
  })

  if (!userResponse.ok) {
    throw new Error(await parseError(userResponse))
  }

  const user = (await userResponse.json()) as BackendUser
  const userRole = toFrontendRole(user.role)

  if (input.roleHint && userRole !== input.roleHint) {
    mockLogout()
    throw new Error(`This is a ${userRole} account. Please use the ${userRole} login page.`)
  }

  return saveSession({
    userId: String(user.id),
    email: user.email,
    username: user.username,
    role: userRole,
    accessToken: token.access_token,
    accessTokenExpiresAt: tokenExpiry(),
  })
}

export function mockLogin(role: UserRole, email = "demo@nepfluence.com", accessToken = "") {
  if (typeof window === "undefined") return null

  const session: AuthSession = {
    userId: "preview-user",
    email,
    username: email.split("@")[0],
    role,
    accessToken,
    accessTokenExpiresAt: tokenExpiry(),
  }

  return saveSession(session)
}

export function mockLogout() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(sessionKey)
}

export const logout = mockLogout
