"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, Menu, Home, Settings, FileText, Newspaper } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSession, signOut } from 'next-auth/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MenuItem {
  href: string
  label: string
  icon: React.ElementType
}

const menuItems: MenuItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Settings },
  { href: "/forms", label: "Forms", icon: FileText },
  { href: "/news", label: "News", icon: Newspaper },
]

const Navbar = () => {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")
  const { data: session } = useSession();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (typeof window === "undefined") return
    if (pathname === "/") {
      window.location.reload()
    } else {
      window.location.assign("/")
    }
  }

  const handleNewsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault()
      // Add a small delay to ensure the page is fully loaded
      setTimeout(() => {
        const newsSection = document.getElementById('news-section')
        if (newsSection) {
          newsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        } else {
          console.log('News section not found')
        }
      }, 100)
    }
    // If not on homepage, let the default link behavior work
  }


  if (isDashboard) {
    return null
  }

  return (
    <nav className="w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" onClick={handleLogoClick} className="flex items-center space-x-3">
            <Image
              src="/assets/img/Logo.png"
              alt="Alma Villa Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-lg md:text-xl font-semibold" style={{ color: '#23479A' }}>Alma Villa</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden h-9 w-9 p-0"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] p-0 bg-white border-l border-gray-200 shadow-lg"
          >
            <SheetHeader className="p-6 border-b border-gray-200 bg-white">
              <SheetTitle className="text-gray-900 text-left">Menu</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-4rem)] bg-white">
              <div className="p-6 space-y-1 bg-white">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={
                      item.label === "News" ? handleNewsClick : 
                      undefined
                    }
                    className="flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-[#23479A] transition-colors duration-200 w-full"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Auth Button */}
                <div className="pt-4 border-t border-gray-200">
                  {session ? (
                    <Button
                      variant="default"
                      onClick={() => signOut()}
                      className="bg-[#23479A] hover:bg-[#23479A]/90 rounded-[2px] w-full"
                    >
                      <span className="flex items-center gap-2 text-white">
                        Logout
                        <LogOut className="h-4 w-4" />
                      </span>
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      asChild
                      className="bg-[#23479A] hover:bg-[#23479A]/90 rounded-[2px] w-full"
                    >
                      <Link href="/account/login" className="flex items-center gap-2 text-white">
                        Login
                        <LogIn className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={
                item.label === "News" ? handleNewsClick : 
                undefined
              }
              className="text-sm font-medium transition-colors hover:text-[#23479A]"
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <Button
              variant="default"
              onClick={() => signOut()}
              className="bg-[#23479A] hover:bg-[#23479A]/90 rounded-[2px]"
            >
              <span className="flex items-center gap-2 text-white">
                Logout
                <LogOut className="h-4 w-4" />
              </span>
            </Button>
          ) : (
            <Button
              variant="default"
              asChild
              className="bg-[#23479A] hover:bg-[#23479A]/90 rounded-[2px]"
            >
              <Link href="/account/login" className="flex items-center gap-2 text-white">
                Login
                <LogIn className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar