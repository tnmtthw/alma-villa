"use client"

import Link from "next/link"
import Image from "next/image"
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
  Bell,
  BadgeCheck
} from "lucide-react"

const navigationItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: FileText,
    label: "Request",
    href: "/request",
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
  const userName = "Juan Dela Cruz" // This should come from your auth state
  const userRole = "Resident"

  return (
    <nav className="w-full border-b bg-white">
      <div className="flex h-16 items-center max-w-7xl mx-auto px-8">
        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mr-4 h-9 w-9 p-0 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-8 border-b">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="p-8 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
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
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Image
            src="/assets/img/Logo.png"
            alt="Alma Villa Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="hidden md:inline-block text-xl font-semibold" style={{ color: '#23479A' }}>
            Alma Villa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-[#23479A]"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-[#23479A] text-white">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white rounded-xl shadow-lg border-none p-2">
              {/* User Info Section */}
              <div className="px-2 py-2 mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-[#23479A] text-white text-sm">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{userName}</span>
                    <BadgeCheck className="h-4 w-4 text-[#23479A]" />
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-500 pl-8">
                  {userRole.toLowerCase()}@mail.com
                </div>
              </div>

              <DropdownMenuSeparator className="bg-gray-100 my-1" />

              <DropdownMenuItem className="rounded-lg hover:bg-gray-50 cursor-pointer gap-2 p-2 text-sm">
                <Settings className="h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-100 my-1" />

              <DropdownMenuItem className="rounded-lg hover:bg-gray-50 cursor-pointer gap-2 p-2 text-sm text-red-600">
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
} 