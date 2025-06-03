import Link from "next/link"
import Image from "next/image"
import { Facebook, Mail, MapPin, Phone } from "lucide-react"

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
      title: "Contact Us",
      links: [
        { label: "Barangay Alma Villa", href: "#" },
        { label: "Gloria, Oriental Mindoro", href: "#" },
        { label: "Contact No: Coming Soon", href: "#" },
        { label: "almavilla.gloria@gmail.com", href: "mailto:almavilla.gloria@gmail.com" },
      ],
    },
  ]

  return (
    <footer className="bg-[#23479A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/assets/img/Logo.png"
                alt="Alma Villa Logo"
                width={40}
                height={40}
                className="object-contain brightness-0 invert"
              />
              <span className="text-xl font-semibold text-white">Alma Villa</span>
            </Link>
            <p className="text-sm text-white/80">
              Serving the community of Gloria, Oriental Mindoro with dedication and excellence. Your trusted partner in local governance.
            </p>
          </div>

          {/* Quick Links and Contact */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Office Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Office Hours</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Monday - Friday</li>
              <li>8:00 AM - 5:00 PM</li>
              <li>Saturday</li>
              <li>8:00 AM - 12:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/80">
              © {currentYear} Barangay Alma Villa, Gloria, Oriental Mindoro. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="mailto:almavilla.gloria@gmail.com" className="text-white/80 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                <MapPin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 