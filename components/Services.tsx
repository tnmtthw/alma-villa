"use client"

import Card from "./Card"

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
  return (
    <section className="relative -mt-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.title}
              {...service}
              className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services 