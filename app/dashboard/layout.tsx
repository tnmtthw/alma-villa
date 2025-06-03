import { MainNav } from "@/components/MainNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main>{children}</main>
    </div>
  )
} 