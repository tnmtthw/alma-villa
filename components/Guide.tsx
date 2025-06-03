import Image from "next/image"

const Guide = () => {
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gray-600 mb-2">Sign up now</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Sign up in 5 simple steps
          </h2>
        </div>

        <div className="relative">
          {/* Desktop Layout - 5 columns */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-6 px-4">
            {/* Connection Lines for Desktop */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-[10%]">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex-1 mx-4">
                  <svg className="w-full h-5" preserveAspectRatio="none">
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
                      d="M calc(100% - 8),2 L calc(100% - 8),18 L 100%,10 Z" 
                      fill="#2563EB"
                    />
                  </svg>
                </div>
              ))}
            </div>

            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center z-10 bg-white p-2"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                  {index + 1}
                </div>

                {/* Illustration */}
                <div className="mb-6 relative w-48 h-48">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Tablet Layout - 3-2 Grid */}
          <div className="hidden md:grid md:grid-cols-3 lg:hidden gap-8 px-4">
            {/* First Row - 3 steps */}
            {steps.slice(0, 3).map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                  {index + 1}
                </div>

                {/* Illustration */}
                <div className="mb-6 relative w-48 h-48">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}

            {/* Second Row - 2 steps centered */}
            <div className="col-span-3 grid grid-cols-2 gap-8 justify-items-center mt-8">
              {steps.slice(3, 5).map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center max-w-sm"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                    {index + 4}
                  </div>

                  {/* Illustration */}
                  <div className="mb-6 relative w-48 h-48">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout - Single Column */}
          <div className="grid grid-cols-1 md:hidden gap-8 px-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                  {index + 1}
                </div>

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
                <p className="text-gray-600 text-sm max-w-xs leading-relaxed">
                  {step.description}
                </p>

                {/* Mobile Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="mt-6 mb-2">
                    <svg className="w-6 h-8" fill="none" stroke="#2563EB" strokeWidth="2">
                      <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Guide