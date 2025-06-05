import { MainNav } from "@/components/MainNav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      <main >
        <div >
          {children}
        </div>
      </main>
    </div>
  )
}