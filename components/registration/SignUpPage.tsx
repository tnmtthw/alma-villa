"use client"

import { useState } from "react"
import ResidentInfo from "@/components/registration/ResidentInfo"
import DocumentUpload from "@/components/registration/DocumentUpload"
import FaceCapture from "@/components/registration/FaceCapture"
import Credentials from "@/components/registration/Credentials"
import SuccessModal from "@/components/registration/SuccessModal"

export default function SignUpPage() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const totalPhases = 4

  const phases = [
    { number: 1, title: "Resident Information" },
    { number: 2, title: "Valid ID Upload" },
    { number: 3, title: "Face Verification" },
    { number: 4, title: "Account Setup" }
  ]

  const handleRegistrationComplete = () => {
    setShowSuccessModal(true)
  }

  const renderPhase = () => {
    switch (currentPhase) {
      case 1:
        return <ResidentInfo onNext={() => setCurrentPhase(2)} />
      case 2:
        return <DocumentUpload 
          onNext={() => setCurrentPhase(3)} 
          onBack={() => setCurrentPhase(1)} 
        />
      case 3:
        return <FaceCapture 
          onNext={() => setCurrentPhase(4)} 
          onBack={() => setCurrentPhase(2)} 
        />
      case 4:
        return <Credentials 
          onBack={() => setCurrentPhase(3)}
          onComplete={handleRegistrationComplete}
        />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#23479A] transition-all duration-300"
                  style={{ width: `${((currentPhase - 1) / (totalPhases - 1)) * 100}%` }}
                />
              </div>

              {/* Progress Steps */}
              <div className="relative flex justify-between">
                {phases.map((phase) => (
                  <div 
                    key={phase.number}
                    className="relative z-10 flex flex-col items-center gap-2"
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors duration-300
                        ${currentPhase >= phase.number 
                          ? "border-[#23479A] bg-[#23479A] text-white" 
                          : "border-gray-300 bg-white text-gray-500"}`}
                    >
                      {phase.number}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 hidden sm:block
                      ${currentPhase >= phase.number ? "text-[#23479A]" : "text-gray-500"}`}>
                      {phase.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="py-8">
          {renderPhase()}
        </div>

        {/* Success Modal */}
        <SuccessModal 
          isOpen={showSuccessModal} 
          onClose={() => setShowSuccessModal(false)} 
        />
      </div>
    </div>
  )
} 