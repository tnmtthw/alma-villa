"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

interface CredentialsProps {
  onBack: () => void
  onComplete: () => void
}

interface CredentialsFormData {
  username: string;
  password: string;
}

const sampleData: CredentialsFormData = {
  username: "juan.delacruz",
  password: "Test@123456"
}

export default function Credentials({ onBack, onComplete }: CredentialsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(() => {
    // Try to load saved terms acceptance from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agreeToTerms') === 'true'
    }
    return false
  })

  const [formData, setFormData] = useState<CredentialsFormData>(() => {
    // Try to load saved credentials from localStorage
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('credentialsData')
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
    localStorage.setItem('credentialsData', JSON.stringify(formData))
  }, [formData])

  // Save terms acceptance whenever it changes
  useEffect(() => {
    localStorage.setItem('agreeToTerms', agreeToTerms.toString())
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
    localStorage.removeItem('credentialsData')
    localStorage.removeItem('agreeToTerms')
    // Handle form submission
    onComplete()
  }

  const fillWithSampleData = () => {
    setFormData(sampleData)
    setAgreeToTerms(true)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2px] shadow-lg p-6 max-w-[1100px] mx-auto">
      <div className="border-b border-gray-200/50 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Account Setup</h2>
        <p className="text-sm text-gray-500 mt-1">Create your login credentials and accept the terms of service.</p>
        <Button
          type="button"
          onClick={fillWithSampleData}
          variant="outline"
          className="mt-2 text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="mt-1"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="pr-10"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="outline"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 border-0"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
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
            />
            <div>
              <Label
                htmlFor="terms"
                className="text-sm text-gray-600"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-[#23479A] hover:underline"
                  target="_blank"
                >
                  Terms and Conditions
                </a>
                {" "}and{" "}
                <a
                  href="/privacy"
                  className="text-[#23479A] hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-4 pt-6 border-t">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px]"
          >
            Previous Step
          </Button>
          <Button
            type="submit"
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px]"
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  )
} 