import AuthPanel from "@/features/auth/components/AuthPanel"

type RegisterPageProps = {
  searchParams?: Promise<{
    role?: string
  }>
}

function normalizeRole(role?: string) {
  return role === "creator" ? "creator" : "brand"
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams

  return <AuthPanel mode="register" role={normalizeRole(params?.role)} />
}
