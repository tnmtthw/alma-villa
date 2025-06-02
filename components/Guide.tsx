import { Download, UserCheck, Scan } from "lucide-react"
import Image from "next/image"

const Guide = () => {
  const steps = [
    {
      image: "/assets/img/downloadphone.png",
      title: "Download the App",
      description: "Install the eGov App on your smartphone or tablet through the App Store or Google Play Store."
    },
    {
      image: "/assets/img/signupphone.png",
      title: "Register an Account",
      description: "Provide your mobile number and authenticate with a One-Time Pin"
    },
    {
      image: "/assets/img/verifiedphone.png",
      title: "Verify your Identity",
      description: "Enter your basic information and complete the facial recognition technology"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gray-600 mb-2">Sign up now</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Sign up in 3 simple steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Arrow Connections */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 hidden md:block">
            {/* First Arrow */}
            <svg className="absolute left-[28%] w-[33%]" height="20" preserveAspectRatio="none">
              <line 
                x1="0" 
                y1="10" 
                x2="100%" 
                y2="10" 
                stroke="#2563EB" 
                strokeWidth="2"
                strokeDasharray="4 8"
              />
              <path 
                d="M 100%,0 L 100%,20 L calc(100% + 16),10 Z" 
                fill="#2563EB"
              />
            </svg>
            {/* Second Arrow */}
            <svg className="absolute left-[61%] w-[33%]" height="20" preserveAspectRatio="none">
              <line 
                x1="0" 
                y1="10" 
                x2="100%" 
                y2="10" 
                stroke="#2563EB" 
                strokeWidth="2"
                strokeDasharray="4 8"
              />
              <path 
                d="M 100%,0 L 100%,20 L calc(100% + 16),10 Z" 
                fill="#2563EB"
              />
            </svg>
          </div>

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center z-10 bg-white"
            >
              {/* Illustration */}
              <div className="mb-6 relative w-64 h-64">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Guide 