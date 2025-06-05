import { Suspense } from "react"
import AdminContent from "@/components/admincomponents/AdminContent"

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23479A]"></div>
      </div>
    }>
      <AdminContent />
    </Suspense>
  )
}