"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Globe, CheckCircle, Clock, Users } from "lucide-react"
import Link from "next/link"

const services = [
  {
    title: "Document Request",
    description: "Request various barangay documents and certificates online with ease",
    icon: FileText,
    href: "/dashboard/request",
    features: ["Barangay Clearance", "Certificate of Residency", "Good Moral Certificate", "Indigency Certificate"],
    color: "bg-blue-500"
  },
  {
    title: "Online Forms",
    description: "Download and fill out necessary forms for your transactions",
    icon: FileText,
    href: "/forms",
    features: ["Business Permit Application", "Barangay Clearance Form", "Certificate Request Form", "Complaint Form"],
    color: "bg-emerald-500"
  },
  {
    title: "Global Services",
    description: "Access our services from anywhere in the world",
    icon: Globe,
    href: "/services",
    features: ["24/7 Online Access", "Digital Document Processing", "Remote Verification", "International Support"],
    color: "bg-purple-500"
  }
]

const additionalServices = [
  {
    title: "Business Permits",
    description: "Apply for business permits and licenses",
    icon: FileText,
    status: "Available"
  },
  {
    title: "Community Programs",
    description: "Join various community development programs",
    icon: Users,
    status: "Available"
  },
  {
    title: "Emergency Services",
    description: "24/7 emergency response and assistance",
    icon: Clock,
    status: "24/7 Available"
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-[#23479A] py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Barangay Alma Villa offers comprehensive services to serve our community with dedication and excellence.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our primary services designed to meet your essential needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${service.color} text-white rounded-2xl mb-6`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button asChild className="w-full bg-[#23479A] hover:bg-[#23479A]/90">
                      <Link href={service.href} className="flex items-center justify-center gap-2">
                        Access Service
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              More services to support our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#23479A]/10 rounded-xl">
                      <Icon className="h-6 w-6 text-[#23479A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {service.status}
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to assist you with any questions or concerns about our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/contact" className="flex items-center gap-2">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-[#23479A] hover:bg-[#23479A]/90">
              <Link href="/dashboard" className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
