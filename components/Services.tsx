"use client"

import Card from "./Card"
import { useScrollAnimation } from "@/lib/useScrollAnimation"

const services = [
  {
    title: "Document Request",
    description: "Request various barangay documents and certificates online",
    icon: "/file.svg",
    href: "/dashboard/request"
  },
  {
    title: "Online Forms",
    description: "Download and fill out necessary forms for your transactions",
    icon: "/window.svg",
    href: "/forms"
  },
  {
    title: "Global Services",
    description: "Access our services from anywhere in the world",
    icon: "/globe.svg",
    href: "/services"
  }
]

const Services = () => {
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 })

  return (
    <section ref={sectionRef} className="relative -mt-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`transition-all duration-700 ease-out ${
                sectionVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Card
                {...service}
                className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services 