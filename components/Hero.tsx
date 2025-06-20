"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ChatBot from "@/components/Chatbot"

const Hero = () => {
  return (
    <>
      <section className="relative bg-[#23479A] pb-12">
        {/* Background Pattern */}
        <div
          className="absolute inset-x-0 bottom-0 h-[420px]"
          style={{
            backgroundImage: 'url(/assets/img/herosection.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'repeat-x',
            opacity: '0.15'
          }}
        />

        <div className="max-w-7xl mx-auto px-8 py-6 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="relative z-10 text-white">
              <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-3">
                Welcome to Alma Villa Barangay Portal
              </h1>
              <p className="text-sm text-white/80 mb-4">
                Your one-stop platform for accessing barangay services, submitting requests, and staying updated with community news.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="bg-white text-[#23479A] hover:bg-white/90"
                >
                  <Link href="/account/signup">Register as Resident</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/services">View Services</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/assets/img/heroimage.png"
                alt="Barangay Portal Illustration"
                width={350}
                height={350}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* ChatBot Component */}
      <ChatBot />
    </>
  )
}

export default Hero