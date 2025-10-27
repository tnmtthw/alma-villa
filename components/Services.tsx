"use client"

import { useScrollAnimation } from "@/lib/useScrollAnimation"
import Link from "next/link"

const services = [
  {
    title: "Document Request",
    description: "Request various barangay documents and certificates online with ease and convenience.",
    icon: "/file.svg",
    href: "/dashboard/request",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Downloadable Forms",
    description: "Download and fill out necessary forms for your transactions quickly and efficiently.",
    icon: "/window.svg",
    href: "/dashboard/Download",
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Global Services",
    description: "Access our comprehensive barangay services from anywhere in the world, anytime.",
    icon: "/globe.svg",
    href: "/services",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  }
]

const Services = () => {
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })

  return (
    <section id="services-section" ref={sectionRef} className="relative -mt-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div 
          className={`
            bg-white rounded-2xl shadow-xl p-12
            transition-all duration-700 ease-out ${
            sectionVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#23479A]">Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our mission is to drive progress and enhance the lives of our community members by delivering 
              superior services and solutions that exceed expectations.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`
                  text-center group cursor-pointer
                  transition-all duration-500 ease-out hover:-translate-y-2
                `}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`
                    w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center
                    transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg
                  `}>
                    <img
                      src={service.icon}
                      alt={`${service.title} icon`}
                      className={`w-8 h-8 ${service.iconColor} filter`}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#23479A] transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Read More Link */}
                <Link 
                  href={service.href || "#"}
                  className="inline-flex items-center text-[#23479A] font-medium text-sm hover:text-blue-700 transition-colors duration-200 group"
                >
                  Read more 
                  <svg 
                    className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              href="/services"
              className="
                inline-flex items-center px-8 py-4 bg-[#23479A] text-white font-semibold rounded-xl
                hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg
                focus:outline-none focus:ring-4 focus:ring-blue-200
              "
            >
              Explore All Services
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services

