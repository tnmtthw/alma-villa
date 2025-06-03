"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const Hero = () => {
  return (
    <section className="relative bg-[#23479A] pb-28">
      {/* Background Pattern */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[250px]"
        style={{
          backgroundImage: 'url(/assets/img/herosection.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'repeat-x',
          opacity: '0.15'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-8 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative z-10 text-white">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Welcome to Alma Villa Barangay Portal
            </h1>
            <p className="text-lg text-white/80 mb-8">
              Your one-stop platform for accessing barangay services, submitting requests, and staying updated with community news.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                className="bg-white text-[#23479A] hover:bg-white/90"
              >
                <Link href="/register">Register as Resident</Link>
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
          
          <div className="relative hidden lg:block">
            <Image
              src="/assets/img/heroimage.png"
              alt="Barangay Portal Illustration"
              width={450}
              height={450}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 