"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"

interface CredentialsProps {
  onBack: () => void
}

export default function Credentials({ onBack }: CredentialsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const securityQuestions = [
    "What was your first pet's name?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What was the name of your first school?",
    "What is your favorite book?",
    "What was your childhood nickname?"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="bg-white rounded-[2px] shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Setup</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
              </p>
            </div>

            <div>
              <Label htmlFor="pin">6-Digit PIN</Label>
              <div className="relative mt-1">
                <Input
                  id="pin"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Questions */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Security Questions</h3>
          
          {[1, 2].map((num) => (
            <div key={num} className="space-y-4">
              <div>
                <Label htmlFor={`question${num}`}>Security Question {num}</Label>
                <Select
                  id={`question${num}`}
                  className="mt-1"
                  required
                >
                  <option value="">Select a security question</option>
                  {securityQuestions.map((question) => (
                    <option key={question} value={question}>
                      {question}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor={`answer${num}`}>Your Answer</Label>
                <Input
                  id={`answer${num}`}
                  type="text"
                  placeholder="Enter your answer"
                  className="mt-1"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#23479A] focus:ring-[#23479A]"
                required
              />
            </div>
            <div className="ml-3">
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