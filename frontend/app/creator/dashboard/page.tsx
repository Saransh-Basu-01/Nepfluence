import ProtectedRoute from "@/features/auth/components/ProtectedRoute"
import CreatorDashboardOverview from "@/features/creator/components/CreatorDashboardOverview"

export default function CreatorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["creator"]}>
      <CreatorDashboardOverview />
    </ProtectedRoute>
  )
}
