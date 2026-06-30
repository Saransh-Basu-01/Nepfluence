import AuthPanel from "@/features/auth/components/AuthPanel"

type LoginPageProps = {
  searchParams?: Promise<{
    role?: string
  }>
}

function normalizeRole(role?: string) {
  return role === "creator" ? "creator" : "brand"
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return <AuthPanel mode="login" role={normalizeRole(params?.role)} />
}
