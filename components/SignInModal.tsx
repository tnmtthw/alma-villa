"use client"

import React from "react"
import { X, LogIn, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-[#23479A]/10 rounded-full flex items-center justify-center mb-6">
            <User className="h-8 w-8 text-[#23479A]" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Sign In Required
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please sign in to your account to view all announcements and news updates, 
            access detailed information, and stay updated with the latest community news.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-lg py-3 font-medium"
            >
              <Link href="/account/login" className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3 font-medium"
            >
              Maybe Later
            </Button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link 
              href="/account/register" 
              className="text-[#23479A] hover:underline font-medium"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInModal
