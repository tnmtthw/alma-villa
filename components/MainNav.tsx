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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#23479A] text-white">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                sideOffset={5} 
                align="end" 
                className="w-56 bg-white border border-gray-200 shadow-md"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRole.toLowerCase()}@mail.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
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