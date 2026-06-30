export type StandardResponse<T> = {
  data: T
  message?: string
  requestId?: string
}

export type ApiError = {
  message: string
  code?: string
  details?: Record<string, unknown>
}

export type PaginatedResponse<T> = StandardResponse<{
  items: T[]
  page: number
  pageSize: number
  total: number
}>
