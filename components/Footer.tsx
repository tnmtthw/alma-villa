import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, MapPin, Phone, Clock } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: "Forms", href: "/forms" },
        { label: "News", href: "/news" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Document Request", href: "/request" },
        { label: "Business Permit", href: "/services/business" },
        { label: "Barangay Clearance", href: "/services/clearance" },
        { label: "Certificates", href: "/services/certificates" },
      ],
    },
    {
      title: "Contact Info",
      links: [
        { label: "Barangay Alma Villa", href: "#" },
        { label: "Gloria, Oriental Mindoro", href: "#" },
        { label: "almavilla.gloria@gmail.com", href: "mailto:almavilla.gloria@gmail.com" },
        { label: "Contact: Coming Soon", href: "#" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Mail, href: "mailto:almavilla.gloria@gmail.com", label: "Email" },
    { icon: Phone, href: "#", label: "Phone" },
    { icon: MapPin, href: "#", label: "Location" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-[#23479A] via-[#1e40af] to-[#1e3f8a] text-white overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/assets/img/Logo.png"
                alt="Alma Villa Logo"
                width={40}
                height={40}
                className="object-contain brightness-0 invert"
              />
              <div>
                <span className="text-xl font-bold text-white">Alma Villa</span>
                <p className="text-sm text-white/70">Barangay Portal</p>
              </div>
            </Link>
            
            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              Serving the community of Gloria, Oriental Mindoro with dedication and excellence.
            </p>

            {/* Compact Office Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Office Hours</h3>
              </div>
              <div className="space-y-1 text-xs text-white/80">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="text-white">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white">8:00 AM - 12:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-bold text-white relative">
                {section.title}
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-white rounded-full"></div>
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/80 hover:text-white transition-colors duration-300 hover:translate-x-1 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs text-white/80">
                © {currentYear} Barangay Alma Villa, Gloria, Oriental Mindoro. All rights reserved.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/80 hidden sm:block">Follow us:</span>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={index}
                      href={social.href}
                      className="flex items-center justify-center w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer