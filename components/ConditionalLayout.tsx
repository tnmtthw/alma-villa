"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"
import ClientLayout from "./ClientLayout"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if the current page is an admin or dashboard page
  const isAdminPage = pathname.startsWith('/admin')
  const isDashboardPage = pathname.startsWith('/dashboard')
  
  return (
    <ClientLayout>
      {/* Admin pages: no navbar, no footer */}
      {isAdminPage ? (
        <>{children}</>
      ) : isDashboardPage ? (
        /* Dashboard pages: no navbar, but has footer */
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      ) : (
        /* Public pages: navbar and footer */
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      )}
    </ClientLayout>
  )
}