"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      })

      if (response?.error === "Configuration") {
        // alert("Your account is not verified. Please check your email to verify your account.")
        setErrorMessage("Your account is not verified. Please check your email to verify your account.")
      } else if (response?.error === "CredentialsSignin") {
        // alert("Invalid email or password. Please try again.")
        setErrorMessage("Invalid email or password. Please try again.")
      } else if (response?.ok) {
        // alert("Sign in successful!")
        setTimeout(() => {
          router.replace("/admin")
        }, 500)
      } else {
        // alert("Something went wrong. Please try again.")
        setErrorMessage("Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Sign-in error:", err)
      // alert("Something went wrong. Please try again.")
      setErrorMessage("Something went wrong. Please try again.")
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

      {/* Login Container */}
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

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#23479A] mb-2">
             Alma Villa Log in
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[2px] text-red-600 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 border rounded-[2px] focus:ring-2 focus:ring-[#23479A]/20 focus:border-[#23479A]"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  className="h-4 w-4 text-[#23479A] focus:ring-2 focus:ring-[#23479A]/20 border-gray-300 rounded-[2px]"
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </Label>
              </div>
              <a href="/account/forgot-password" className="text-sm text-[#23479A] hover:text-[#23479A]/80">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white py-2 px-4 rounded-[2px] disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/account/signup" className="text-[#23479A] hover:text-[#23479A]/80 font-medium">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}