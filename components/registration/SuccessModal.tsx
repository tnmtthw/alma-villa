"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <CheckCircle className="h-16 w-16 text-[#23479A] mb-4" />
          <h2 className="text-xl font-semibold text-black mb-2">
            Registration Received
          </h2>
          <p className="text-black">
            Your registration has been received. Please wait for 2-3 working days to verify your registration. 
            An email will be sent to you once your account is verified along with your credentials.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
} 