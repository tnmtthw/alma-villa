"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  // Auto-redirect countdown
  useEffect(() => {
    if (!isOpen) {
      setCountdown(5) // Reset countdown when modal closes
      return
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Auto-redirect to home page when countdown reaches 0
      handleGoHome()
    }
  }, [isOpen, countdown])

  const handleGoHome = () => {
    // Clear any registration data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('residentInfoData')
      localStorage.removeItem('selectedIdType')
      localStorage.removeItem('capturedPhoto')
      localStorage.removeItem('credentialsData')
      localStorage.removeItem('agreeToTerms')
      localStorage.removeItem('type')
      localStorage.removeItem('frontId')
      localStorage.removeItem('backId')
    }
    
    // Close modal first
    onClose()
    
    // Navigate to home page
    router.push('/')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle className="h-16 w-16 text-[#23479A] mb-4" />
          <h2 className="text-xl font-semibold text-black mb-2">
            Registration Received
          </h2>
          <p className="text-black mb-6">
            Your registration has been received. Please wait for 2-3 working days to verify your registration. 
            An email will be sent to you once your account is verified along with your credentials.
          </p>
          
          {/* Countdown and Auto-redirect Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Redirecting to home page in{' '}
              <span className="font-semibold text-[#23479A]">{countdown}</span> seconds
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-[#23479A] hover:bg-[#23479A]/90 text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Stay Here
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}