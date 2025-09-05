"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ChatBot from "@/components/Chatbot"
import { useScrollAnimation } from "@/lib/useScrollAnimation"

const Hero = () => {
  const { elementRef: textRef, isVisible: textVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })
  const { elementRef: imageRef, isVisible: imageVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })

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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content - Left Side */}
            <div 
              ref={textRef}
              className={`relative z-10 text-white transition-all duration-1000 ease-out ${
                textVisible 
                  ? 'translate-x-0 opacity-100' 
                  : '-translate-x-8 opacity-0'
              }`}
            >
              <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-3">
                Welcome to Alma Villa Barangay Portal
              </h1>
              <p className="text-sm text-white/80 mb-4">
                Your one-stop platform for accessing barangay services, submitting requests, and staying updated with community news.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/services">View Services</Link>
                </Button>
              </div>
            </div>

            {/* Image - Right Side */}
            <div 
              ref={imageRef}
              className={`relative flex justify-center lg:justify-end items-center transition-all duration-1000 ease-out delay-300 ${
                imageVisible 
                  ? 'translate-x-0 opacity-100 scale-100' 
                  : 'translate-x-8 opacity-0 scale-95'
              }`}
            >
              <div className="relative w-full max-w-[400px] lg:max-w-[450px]">
                <Image
                  src="/assets/img/heroimage.png"
                  alt="Barangay Portal Illustration"
                  width={450}
                  height={400}
                  className="object-contain w-full h-auto ml-auto"
                  priority
                />
              </div>
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