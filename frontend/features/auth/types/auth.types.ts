export type UserRole = "brand" | "creator" | "admin"

export type AuthMode = "login" | "register"

export type AuthSession = {
  userId: string
  email: string
  username?: string
  role: UserRole
  accessToken: string
  accessTokenExpiresAt: string
}
