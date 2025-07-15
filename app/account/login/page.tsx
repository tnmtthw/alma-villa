"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Lock, Clock } from "lucide-react"
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
  const [isLocked, setIsLocked] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const router = useRouter()

  // Reset state when email changes significantly
  const resetLoginState = () => {
    setIsLocked(false)
    setCooldownTime(0)
    setErrorMessage("")
    setAttemptsLeft(3)
  }

  // Check lockout status on component mount and when email changes
  useEffect(() => {
    const checkLockoutStatus = async () => {
      if (!email || email.length < 3) return // Only check for valid email inputs
      
      try {
        const response = await fetch("/api/auth/check-lockout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })

        const result = await response.json()

        if (response.status === 423) {
          // User is still locked
          setIsLocked(true)
          setCooldownTime(result.timeLeft || 0)
          setErrorMessage(result.error)
        } else if (response.status === 200) {
          // User is not locked, but may have some failed attempts
          setIsLocked(false)
          setAttemptsLeft(result.attemptsLeft)
          // Don't clear error message here, let it stay if there was a previous error
        }
      } catch (error) {
        // Silent fail - don't show error for status check
      }
    }

    // Reset state when email is cleared or too short
    if (!email || email.length < 3) {
      resetLoginState()
      return
    }

    // Check status when component mounts or email changes (with debounce)
    const timeoutId = setTimeout(() => {
      if (email && email.includes('@')) {
        checkLockoutStatus()
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [email])

  // Countdown timer effect
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            setErrorMessage("")
            setAttemptsLeft(3)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [cooldownTime])

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Check if account is locked
    if (isLocked && cooldownTime > 0) {
      setIsLoading(false)
      return
    }

    try {
      // Use NextAuth directly and handle the response
      const response = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      })

      if (response?.error) {
        // Parse custom error messages from our auth.js
        if (response.error.startsWith("LOCKED:")) {
          const [, timeLeft, message] = response.error.split(":", 3)
          setIsLocked(true)
          setCooldownTime(parseInt(timeLeft) || 60)
          setErrorMessage(message)
        } else if (response.error.startsWith("ATTEMPTS:")) {
          const [, attemptsLeft, message] = response.error.split(":", 3)
          setAttemptsLeft(parseInt(attemptsLeft))
          setErrorMessage(`${message}. ${attemptsLeft} attempts remaining.`)
        } else if (response.error === "Configuration") {
          setErrorMessage("Your account is not verified. Please check your email to verify your account.")
        } else if (response.error === "CredentialsSignin") {
          setErrorMessage("Invalid email or password. Please try again.")
        } else {
          setErrorMessage("Something went wrong. Please try again.")
        }
      } else if (response?.ok) {
        // Reset all states on successful login
        setAttemptsLeft(3)
        setIsLocked(false)
        setCooldownTime(0)
        setTimeout(() => {
          router.replace("/admin")
        }, 500)
      } else {
        setErrorMessage("Something went wrong. Please try again.")
      }
    } catch (err) {
      console.error("Sign-in error:", err)
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
            <div className={`mb-4 p-3 rounded-[2px] text-sm ${
              isLocked 
                ? "bg-orange-50 border border-orange-200 text-orange-600" 
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {errorMessage}
            </div>
          )}

          {/* Cooldown Timer */}
          {isLocked && cooldownTime > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[2px] text-blue-600 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Account locked. Try again in <strong>{cooldownTime}</strong> seconds.
                </span>
              </div>
            </div>
          )}

          {/* Attempts Warning */}
          {!isLocked && attemptsLeft < 3 && attemptsLeft > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-[2px] text-yellow-600 text-sm">
              <strong>Warning:</strong> {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} remaining before account lockout.
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
                  disabled={isLoading || isLocked}
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
                  disabled={isLoading || isLocked}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  disabled={isLoading || isLocked}
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
                  disabled={isLoading || isLocked}
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
              disabled={isLoading || isLocked}
            >
              {isLocked && cooldownTime > 0 
                ? `Locked (${cooldownTime}s)` 
                : isLoading 
                  ? "Signing in..." 
                  : "Sign in"
              }
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