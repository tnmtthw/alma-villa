"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

interface CredentialsProps {
  onBackAction: () => void
  onCompleteAction: () => void
}

interface CredentialsFormData {
  username: string;
  password: string;
}

const sampleData: CredentialsFormData = {
  username: "juan.delacruz",
  password: "Test@123456"
}

export default function Credentials({ onBackAction: onBack, onCompleteAction: onComplete }: CredentialsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(() => {
    // Try to load saved terms acceptance from sessionStorage
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('agreeToTerms') === 'true'
    }
    return false
  })

  const [formData, setFormData] = useState<CredentialsFormData>(() => {
    // Try to load saved credentials from sessionStorage
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('credentialsData')
      return savedData ? JSON.parse(savedData) : {
        username: "",
        password: ""
      }
    }
    return {
      username: "",
      password: ""
    }
  })

  // Save form data whenever it changes
  useEffect(() => {
    sessionStorage.setItem('credentialsData', JSON.stringify(formData))
  }, [formData])

  // Save terms acceptance whenever it changes
  useEffect(() => {
    sessionStorage.setItem('agreeToTerms', agreeToTerms.toString())
  }, [agreeToTerms])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Clear saved data before submitting
    sessionStorage.removeItem('credentialsData')
    sessionStorage.removeItem('agreeToTerms')
    // Handle form submission
    onComplete()
  }

  const fillWithSampleData = () => {
    setFormData(sampleData)
    setAgreeToTerms(true)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2px] shadow-lg p-4 sm:p-6 max-w-[1100px] mx-auto">
      <div className="border-b border-gray-200/50 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Account Setup</h2>
        <p className="text-sm text-gray-500 mt-1">Create your login credentials and accept the terms of service.</p>
        <Button
          type="button"
          onClick={fillWithSampleData}
          variant="outline"
          className="mt-2 text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 w-full sm:w-auto"
        >
          Fill with Sample Data
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Credentials */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Login Credentials</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="mt-1 h-12 text-base"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="pr-12 h-12 text-base"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="outline"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 border-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              required
              className="mt-1 flex-shrink-0"
            />
            <div className="min-w-0">
              <Label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-[#23479A] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>
                {" "}and{" "}
                <a
                  href="/privacy"
                  className="text-[#23479A] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Mobile Optimized */}
        <div className="pt-6 border-t border-gray-200/50">
          {/* Mobile: Stack buttons vertically */}
          <div className="flex flex-col space-y-3 sm:hidden">
            <Button
              type="submit"
              className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px] h-12 text-base font-medium"
            >
              Complete Registration
            </Button>
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px] h-12 text-base"
            >
              Previous Step
            </Button>
          </div>
          
          {/* Desktop: Side by side */}
          <div className="hidden sm:flex sm:justify-between sm:space-x-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px] h-12"
            >
              Previous Step
            </Button>
            <Button
              type="submit"
              className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px] h-12"
            >
              Complete Registration
            </Button>
          </div>
        </div>

        {/* Extra spacing for mobile to prevent overlap with browser UI */}
        <div className="h-8 sm:hidden" />
      </form>
    </div>
  )
}