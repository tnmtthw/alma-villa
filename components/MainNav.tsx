"use client"

import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  History, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Newspaper, 
  Settings, 
  User2,
  HelpCircle,
  Moon,
  ChevronDown
} from "lucide-react"
import { useState, useEffect } from "react"

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
    icon: History,
    label: "History",
    href: "/history",
  },
  {
    icon: Newspaper,
    label: "News",
    href: "/news",
  },
  {
    icon: FileText,
    label: "Forms",
    href: "/forms",
  },
]

export function MainNav() {
  const userName = "Juan Dela Cruz"
  const userEmail = "juan.delacruz@email.com"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
        <Link href="/" className="flex items-center space-x-2 mr-4 md:mr-6">
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
                  variant="outline" 
                  className="h-9 rounded-full px-2 md:px-3 border-0 hover:bg-gray-50 transition-colors duration-200"
                >
                  <User2 className="h-5 w-5 mr-1 md:mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block mr-1">
                    {userName.split(' ')[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-white" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center w-full">
                    <User2 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile?tab=settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}