"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Home,
  BarChart3,
  Calendar,
  Mail,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigationItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
    badge: null,
  },
  {
    icon: FileText,
    label: "Requests",
    href: "/admin/requests",
    badge: 12,
  },
  {
    icon: Users,
    label: "Residents",
    href: "/admin/residents",
    badge: null,
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/admin/analytics",
    badge: null,
  },
  {
    icon: Calendar,
    label: "Events",
    href: "/admin/events",
    badge: 3,
  },
  {
    icon: Mail,
    label: "Messages",
    href: "/admin/messages",
    badge: 5,
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/admin/notifications",
    badge: 8,
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
    badge: null,
  },
]

export function AdminNav({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const adminName = "Juan Dela Cruz"
  const adminRole = "Barangay Administrator"
  const adminEmail = "admin@almavilla.gov.ph"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsSidebarOpen(false)
  }

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white/90 backdrop-blur-sm border-r border-gray-200/70 transition-all duration-300 flex flex-col shadow-xl ${
          isSidebarCollapsed ? "w-16" : "w-64"
        } fixed lg:static inset-y-0 left-0 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/img/Logo.png"
                alt="Alma Villa Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              {!isSidebarCollapsed && (
                <div>
                  <h1 className="font-bold text-gray-900 text-base">Alma Villa</h1>
                  <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className={`flex items-center justify-center ${isSidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`}>
                  <Icon className={`${isSidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4'} flex-shrink-0 ${isActive ? "text-white" : "text-gray-500"}`} />
                </div>
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <span 
                        className={`text-xs h-5 px-2 rounded-full flex items-center justify-center font-semibold ${
                          isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200/70">
          {isSidebarCollapsed ? (
            <button
              onClick={toggleCollapse}
              className="w-full h-12 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{adminName}</p>
                <p className="text-xs text-gray-500 truncate">{adminRole}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <div className="p-4 pb-0">
          <header className="bg-white/80 backdrop-blur-sm border border-gray-200/70 px-6 shadow-lg rounded-2xl">
            <div className="flex items-center justify-between h-16">
              {/* Left side */}
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Collapsed sidebar expand button */}
                {isSidebarCollapsed && (
                  <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                )}

                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-12 pr-4 py-3 w-80 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2">
                {/* Search button for mobile */}
                <button className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors">
                  <Search className="h-5 w-5" />
                </button>

                {/* Notifications */}
                <button className="relative flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm font-medium">
                    3
                  </span>
                </button>

                {/* Help */}
                <button className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="relative h-10 w-10 rounded-lg hover:ring-2 hover:ring-blue-500/30 hover:ring-offset-2 transition-all ml-2"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isMounted && isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-200/70 py-2 z-50 backdrop-blur-sm">
                      <div className="px-6 py-4 border-b border-gray-200/70">
                        <p className="text-sm font-semibold text-gray-900">{adminName}</p>
                        <p className="text-xs text-gray-500 mt-1">{adminEmail}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">{adminRole}</p>
                      </div>
                      <div className="py-2">
                        <button className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <User className="mr-3 h-4 w-4" />
                          Profile Settings
                        </button>
                        <button className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="mr-3 h-4 w-4" />
                          Preferences
                        </button>
                        <button className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <HelpCircle className="mr-3 h-4 w-4" />
                          Help & Support
                        </button>
                        <div className="border-t border-gray-200/70 my-2"></div>
                        <button className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 pt-4">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isMounted && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Click outside to close profile dropdown */}
      {isMounted && isProfileOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  )
}