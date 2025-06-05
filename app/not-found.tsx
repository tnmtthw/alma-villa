import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search, FileText, Phone, Mail } from "lucide-react"

export default function NotFound() {
  const quickLinks = [
    {
      title: "Go Home",
      description: "Return to homepage",
      href: "/",
      icon: Home,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Services",
      description: "View our services",
      href: "/services",
      icon: FileText,
      color: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      title: "Contact Us",
      description: "Get in touch",
      href: "/contact",
      icon: Phone,
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#23479A]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          {/* Large 404 Text */}
          <div className="relative">
            <h1 className="text-[12rem] sm:text-[16rem] lg:text-[20rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#23479A] to-blue-600 leading-none select-none">
              404
            </h1>
            
            {/* Floating Elements */}
            <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 animate-bounce">
              <div className="w-8 h-8 bg-[#23479A]/20 rounded-full blur-sm"></div>
            </div>
            <div className="absolute top-1/3 right-1/4 transform animate-pulse">
              <div className="w-6 h-6 bg-blue-400/30 rounded-full blur-sm"></div>
            </div>
            <div className="absolute bottom-1/3 left-1/3 transform animate-ping">
              <div className="w-4 h-4 bg-indigo-400/40 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Barangay Logo Integration */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-white/50 flex items-center justify-center">
              <img
                src="/assets/img/Logo.png"
                alt="Alma Villa Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Mukhang nawala ang pahina na inyong hinahanap. Maaaring na-move na ito o hindi na available.
          </p>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            The page you're looking for might have been moved, deleted, or doesn't exist.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <Link key={index} href={link.href}>
                  <div className="group bg-white/80 backdrop-blur-sm hover:bg-white border border-white/50 hover:border-white/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${link.color} text-white rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h4>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            asChild
            size="lg"
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Back to Homepage
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 px-8 py-3 rounded-xl font-semibold"
          >
            <Link href="/services" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Browse Services
            </Link>
          </Button>
        </div>

        {/* Contact Information */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 max-w-2xl mx-auto">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h4>
          <p className="text-gray-600 mb-4">
            If you think this is an error or need assistance, please contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:almavilla.gloria@gmail.com"
              className="flex items-center gap-2 text-[#23479A] hover:text-[#23479A]/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              almavilla.gloria@gmail.com
            </a>
            <span className="hidden sm:block text-gray-400">•</span>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              Contact: Coming Soon
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Barangay Alma Villa, Gloria, Oriental Mindoro
          </p>
        </div>
      </div>
    </div>
  )
}