"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/lib/useScrollAnimation"

const Guide = () => {
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.05 })
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 })

  const steps = [
    {
      image: "/assets/img/Step1.png",
      title: "Download the App",
      description: "Install the Alma Villa Verifast App on your smartphone or tablet through the App Store or Google Play Store."
    },
    {
      image: "/assets/img/Step2.png",
      title: "Registration",
      description: "Fill out your information by opening the app and entering your personal details such as your full name, address, contact number, and other required fields."
    },
    {
      image: "/assets/img/Step3.png",
      title: "Upload Valid ID",
      description: "Take a clear photo or upload a scanned copy of a government-issued ID to verify your identity."
    },
    {
      image: "/assets/img/Step4.png",
      title: "Capture Your Facial Photo",
      description: "Use your phone's camera to take a live facial photo. This helps ensure secure and accurate identity verification."
    },
    {
      image: "/assets/img/Step5.png",
      title: "Create Your Login Credentials",
      description: "Set a secure username and password that you will use to log in to the app. Make sure to remember your credentials for future access."
    }
  ]

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-800 ease-out ${
            titleVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
        >
          <p className="text-gray-600 mb-2">Sign up now</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Sign up in 5 simple steps
          </h2>
        </div>

        {/* Desktop & Tablet Layout - 3x3 Grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* First Row - Steps 1, 2, 3 */}
            {steps.slice(0, 3).map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col items-center text-center p-4 transition-all duration-700 ease-out group cursor-pointer ${
                  sectionVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Illustration with hover zoom */}
                <div className="mb-6 relative w-64 h-64 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out group-hover:scale-105">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                {/* Content with hover effects */}
                <div className="transition-all duration-300 ease-out group-hover:scale-105">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#23479A] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Second Row - Steps 4, 5 (centered) */}
            <div className="col-span-3 flex justify-center gap-8 mt-8">
              {steps.slice(3, 5).map((step, index) => (
                <div
                  key={step.title}
                  className={`flex flex-col items-center text-center p-4 max-w-xs transition-all duration-700 ease-out group cursor-pointer ${
                    sectionVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${(index + 3) * 200}ms` }}
                >
                  {/* Illustration with hover zoom */}
                  <div className="mb-6 relative w-64 h-64 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out group-hover:scale-105">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Content with hover effects */}
                  <div className="transition-all duration-300 ease-out group-hover:scale-105">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#23479A] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Third Row - Empty as requested */}
            <div className="col-span-3 mt-8">
              {/* Empty row for future content if needed */}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="grid grid-cols-1 md:hidden gap-8 px-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex flex-col items-center text-center p-4 transition-all duration-700 ease-out group cursor-pointer ${
                sectionVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Illustration with hover zoom */}
              <div className="mb-6 relative w-72 h-72 overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out group-hover:scale-105">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              {/* Content with hover effects */}
              <div className="transition-all duration-300 ease-out group-hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#23479A] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm max-w-xs leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                  {step.description}
                </p>
              </div>

              {/* Mobile Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="mt-6 mb-2 transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-6 h-8" fill="none" stroke="#2563EB" strokeWidth="2">
                    <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Guide