import AuthPanel from "@/features/auth/components/AuthPanel"

type SignupPageProps = {
  searchParams?: Promise<{
    role?: string
  }>
}

function normalizeRole(role?: string) {
  return role === "creator" ? "creator" : "brand"
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams

  return <AuthPanel mode="register" role={normalizeRole(params?.role)} />
}
