"use client"

import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import ProfilePicture from "@/components/ProfilePicture"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Settings,
  User2,
  HelpCircle,
  Moon,
  ChevronDown,
  ListChecks,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import useSWR from 'swr'
import { usePathname } from "next/navigation"

interface NavigationItem {
  icon: React.ElementType
  label: string
  href: string
}

const navigationItems: NavigationItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: FileText,
    label: "Request",
    href: "/dashboard/request",
  },
 
  {
    icon: Newspaper,
    label: "News",
    href: "/dashboard/news",
  },
  {
    icon: FileText,
    label: "Downloadable Forms",
    href: "/dashboard/Download",
  },
  {
    icon: ListChecks,
    label: "Track Requests",
    href: "/dashboard/track",
  },
]

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

export function MainNav() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const { data } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  // Safely construct full name with null checks
  const fullName = [data?.firstName, data?.middleName, data?.lastName]
    .filter(Boolean) // Remove null/undefined values
    .join(' ') || session?.user?.name || 'User'; // Fallback to session name or 'User'

  const userName = fullName;
  const userEmail = data?.email || session?.user?.email;
  const [mounted, setMounted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Here you would implement actual dark mode functionality
    // document.documentElement.classList.toggle('dark')
  }

  // Helper function to safely get initials
  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
  }

  // Helper function to safely get first name
  const getFirstName = (name: string) => {
    if (!name || typeof name !== 'string') return 'User';
    return name.split(' ')[0] || 'User';
  }

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center max-w-7xl mx-auto px-4 md:px-8">
        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mr-3 md:mr-4 h-9 w-9 p-0 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] p-0 bg-white border-r border-gray-200 shadow-lg"
          >
            <SheetHeader className="p-6 md:p-8 border-b border-gray-200 bg-white">
              <SheetTitle className="text-gray-900">Alma Villa</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-4rem)] bg-white">
              <div className="p-6 md:p-8 space-y-1 bg-white">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-[#23479A] transition-colors duration-200"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault()
            if (typeof window === 'undefined') return
            if (pathname?.startsWith('/dashboard')) {
              return
            }
            if (pathname === '/') {
              window.location.reload()
            } else {
              window.location.assign('/')
            }
          }}
          className="flex items-center space-x-2 mr-4 md:mr-6"
        >
          <Image
            src="/assets/img/Logo.png"
            alt="Alma Villa Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="hidden sm:inline-block text-lg md:text-xl font-semibold" style={{ color: '#23479A' }}>
            Alma Villa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 flex-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-[#23479A] transition-colors duration-200"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="ml-auto flex items-center">
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 rounded-xl px-3 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                      <AvatarFallback className="bg-[#23479A] text-white text-xs font-medium">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block">
                      <span className="text-sm font-medium text-gray-700">
                        {getFirstName(userName)}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-white border border-gray-200 shadow-lg rounded-xl p-0 mt-2"
                align="end"
                forceMount
              >
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                      <AvatarFallback className="bg-[#23479A] text-white text-sm font-medium">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                    </div>
                   
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Link href="/dashboard/profile" className="flex items-center w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-3">
                        <User2 className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    {/* <Link href="/help" className="flex items-center w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-3">
                        <HelpCircle className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Help Center</span>
                    </Link> */}
                  </DropdownMenuItem>

                  {/* <DropdownMenuItem onClick={toggleDarkMode} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-3">
                        <Moon className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </div>
                  </DropdownMenuItem> */}

                  <DropdownMenuItem asChild className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    {/* <Link href="/upgrade" className="flex items-center w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 mr-3">
                        <Settings className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Upgrade Plan</span>
                    </Link> */}
                  </DropdownMenuItem>
                </div>

                {/* Sign Out Section */}
                <div className="border-t border-gray-100 py-2">
                  <DropdownMenuItem onClick={() => signOut()} className="px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors text-red-600 hover:text-red-700">
                    <div className="flex items-center w-full">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 mr-3">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium">Sign Out</span>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}