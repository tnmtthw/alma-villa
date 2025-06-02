"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const Hero = () => {
  return (
    <section className="relative bg-[#23479A] min-h-[350px] overflow-hidden">
      {/* Background Image */}
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
      
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-20 lg:pt-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 relative z-10">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight max-w-xl">
              MAARING MO NG I PROSESO ANG MGA DOKUMENTO NA KAILANGAN MO SA BARAGAY
            </h1>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-[#23479A] hover:bg-white/90 rounded-[2px] px-6 h-11"
                asChild
              >
                <Link href="/request">
                  Request Now
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10 rounded-[2px] px-6 h-11"
                asChild
              >
                <Link href="/forms" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Forms
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content */}
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