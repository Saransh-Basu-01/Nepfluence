import type { ApiError, StandardResponse } from "@/types/api.types"
import { readAuthToken } from "@/lib/auth"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

type RequestOptions = RequestInit & {
  auth?: boolean
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("Accept", "application/json")

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const token = options.auth === false ? null : readAuthToken()
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  })

  const payload = (await response.json().catch(() => null)) as StandardResponse<T> | ApiError | null

  if (!response.ok) {
    const message =
      payload && "message" in payload
        ? payload.message
        : payload && "detail" in payload && typeof payload.detail === "string"
          ? payload.detail
          : "Request failed"
    throw new Error(message)
  }

  if (payload && "data" in payload) {
    return payload.data
  }

  return payload as T
}
