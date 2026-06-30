import ProtectedRoute from "@/features/auth/components/ProtectedRoute"
import BrandDashboardOverview from "@/features/campaigns/components/BrandDashboardOverview"

export default function BrandDashboardAliasPage() {
  return (
    <ProtectedRoute allowedRoles={["brand"]}>
      <BrandDashboardOverview />
    </ProtectedRoute>
  )
}
