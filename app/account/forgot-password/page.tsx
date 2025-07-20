"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("No account found with this email address.")
        } else if (response.status === 500) {
          setErrorMessage("Email service is currently unavailable. Please try again later.")
        } else {
          setErrorMessage(data.error || "Something went wrong. Please try again.")
        }
        return
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error("Password reset error:", err)
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background with hero section style */}
      <div className="absolute inset-0 bg-[#23479A]">
        {/* Background pattern */}
        <div
          className="absolute inset-x-0 bottom-0 h-[250px]"
          style={{
            backgroundImage: 'url(/assets/img/herosection.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'repeat-x',
            opacity: '0.15'
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-[2px] shadow-xl w-full max-w-md p-8">
          {/* Logo */}
          <div className="flex justify-center -mt-20 mb-6">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Image
                src="/assets/img/Logo.png"
                alt="Alma Villa Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          {/* Back to Login Link */}
          <div className="mb-6">
            <Link
              href="/account/login"
              className="inline-flex items-center text-sm text-[#23479A] hover:text-[#23479A]/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#23479A] mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 text-sm">
                  Don't worry! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[2px] text-red-600 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-2 border rounded-[2px] focus:ring-2 focus:ring-[#23479A]/20 focus:border-[#23479A]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white py-2 px-4 rounded-[2px] disabled:opacity-50"
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#23479A] mb-2">
                    Check your email
                  </h1>
                  <p className="text-gray-600 text-sm mb-4">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-[#23479A] font-medium text-sm">
                    {email}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-[2px] p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    Check your spam folder or click the resend button below.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setEmail("")
                    }}
                    variant="outline"
                    className="w-full border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px]"
                  >
                    Resend email
                  </Button>

                  <Button
                    onClick={() => router.push("/account/login")}
                    className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px]"
                  >
                    Back to login
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Still having trouble?{" "}
              <a href="#" className="text-[#23479A] hover:text-[#23479A]/80 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 