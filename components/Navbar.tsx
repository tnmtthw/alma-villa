"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogIn, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface MenuItem {
  href: string
  label: string
}

const menuItems: MenuItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/forms", label: "Forms" },
  { href: "/news", label: "News" },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  if (isDashboard) {
    return null
  }

  return (
    <nav className="w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/assets/img/Logo.png"
              alt="Alma Villa Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-semibold" style={{ color: '#23479A' }}>Alma Villa</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden">
          <Button
            variant="default"
            asChild
            className="bg-[#23479A] hover:bg-[#23479A]/90 rounded-[2px] hidden sm:flex"
          >
            <Link href="/account/login" className="flex items-center gap-2 text-white">
              Log In Resident
              <LogIn className="h-4 w-4" />
            </Link>
          </Button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-[#23479A]"
            >
              {item.label}
            </Link>
          ))}
          <Button
            variant="default"
            asChild
            className="bg-[#23479A] hover:bg-[#23479A]/90 rounded-[2px]"
          >
            <Link href="/account/login" className="flex items-center gap-2 text-white">
              Log In Resident
              <LogIn className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="flex flex-col space-y-4 px-4 py-6 bg-white border-t">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-[#23479A]"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              variant="default"
              asChild
              className="bg-[#23479A] hover:bg-[#23479A]/90 rounded-[2px] w-full sm:hidden"
            >
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In Resident
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 