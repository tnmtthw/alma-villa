"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Lock, Clock, Shield, AlertTriangle, Mail, CheckCircle, XCircle } from "lucide-react"
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
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [accountStatus, setAccountStatus] = useState<"checking" | "registered" | "unregistered" | "unverified" | null>(null)
  const router = useRouter()

  // Reset state when email changes significantly
  const resetLoginState = () => {
    setIsLocked(false)
    setCooldownTime(0)
    setErrorMessage("")
    setAttemptsLeft(3)
    setAccountStatus(null)
  }

  // Check if account exists and its verification status
  const checkAccountStatus = async (userEmail = email) => {
    if (!userEmail || userEmail.length < 3) return
    
    setIsCheckingStatus(true)
    setAccountStatus("checking")
    
    try {
      const response = await fetch("/api/auth/check-lockout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })

      const result = await response.json()

      if (response.status === 404) {
        // Account doesn't exist
        setAccountStatus("unregistered")
        setErrorMessage("")
      } else if (response.status === 423 || result.isLocked) {
        // User is locked
        setIsLocked(true)
        setCooldownTime(result.timeLeft || 0)
        setAttemptsLeft(0)
        setErrorMessage(result.error || "Account temporarily locked")
        setAccountStatus("registered")
      } else if (response.ok) {
        // User is not locked
        setIsLocked(false)
        setCooldownTime(0)
        setAttemptsLeft(result.attemptsLeft || 3)
        setAccountStatus("registered")
        
        // Check if account is unverified
        if (result.role === "Unverified") {
          setAccountStatus("unverified")
          setErrorMessage("Your account is not verified. Please check your email to verify your account.")
        } else if (result.loginAttempts > 0) {
          setErrorMessage(`${result.loginAttempts} previous failed attempts. ${result.attemptsLeft} attempts remaining.`)
        } else {
          setErrorMessage("")
        }
      }
    } catch (error) {
      console.error("Error checking account status:", error)
      setAccountStatus(null)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  // Check account status when email changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email && email.includes('@')) {
        checkAccountStatus(email)
      } else {
        resetLoginState()
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [email])

  // Countdown timer for lockout
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isLocked && cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            setIsLocked(false)
            setAttemptsLeft(3)
            setErrorMessage("")
            // Recheck status after lockout expires
            setTimeout(() => checkAccountStatus(), 100)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLocked, cooldownTime])

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    // Check if account is locked before attempting
    if (isLocked && cooldownTime > 0) {
      setErrorMessage(`Account is locked. Try again in ${cooldownTime} seconds.`)
      setIsLoading(false)
      return
    }

    // Check if account exists before attempting login
    if (accountStatus === "unregistered") {
      setErrorMessage("No account found with this email address. Please sign up first.")
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
          setAttemptsLeft(0)
          setErrorMessage(message || "Account temporarily locked due to too many failed attempts")
          
          // Visual feedback for immediate lockout
          setTimeout(() => {
            setErrorMessage(`🔒 Account locked for ${timeLeft} seconds due to too many failed attempts`)
          }, 100)
          
        } else if (response.error.startsWith("ATTEMPTS:")) {
          const [, attemptsLeft, message] = response.error.split(":", 3)
          const remainingAttempts = parseInt(attemptsLeft) || 0
          setAttemptsLeft(remainingAttempts)
          setIsLocked(false)
          
          if (remainingAttempts === 0) {
            setErrorMessage("Too many failed attempts. Account will be locked.")
            // Recheck status immediately for potential lockout
            setTimeout(() => checkAccountStatus(), 200)
          } else {
            setErrorMessage(`${message}. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`)
          }
          
        } else if (response.error === "Unverified") {
          setAccountStatus("unverified")
          setErrorMessage("Your account is not verified. Please check your email to verify your account.")
        } else if (response.error === "CredentialsSignin") {
          setErrorMessage("Invalid email or password. Please try again.")
        } else {
          setErrorMessage(response.error || "Something went wrong. Please try again.")
        }
        
        // After any failed attempt, recheck status for real-time updates
        setTimeout(() => checkAccountStatus(), 300)
        
      } else if (response?.ok) {
        // Reset all states on successful login
        setAttemptsLeft(3)
        setIsLocked(false)
        setCooldownTime(0)
        setErrorMessage("")
        setAccountStatus(null)
        
        // Small delay for better UX
        setTimeout(() => {
          // Role-based redirect logic
          checkAndRedirectUser()
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

  // Function to check user role and redirect accordingly
  const checkAndRedirectUser = async () => {
    try {
      // Get session to determine user role
      const response = await fetch('/api/auth/session')
      const session = await response.json()
      
      if (session?.user?.role) {
        const userRole = session.user.role
        
        if (userRole === "Admin") {
          router.replace("/admin")
        } else if (userRole === "Verified" || userRole === "User") {
          router.replace("/dashboard") 
        } else {
          // For other roles like "Unverified", redirect to homepage
          router.replace("/")
        }
      } else {
        // Fallback to dashboard if role is unclear
        router.replace("/dashboard")
      }
    } catch (error) {
      console.error("Error checking user role:", error)
      // Fallback redirect
      router.replace("/dashboard")
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
            opacity: '0.1'
          }}
        />
      </div>

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/assets/img/Logo.png"
                alt="Alma Villa Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Alma Villa account</p>
          </div>

          {/* Account Status Indicator */}
          {accountStatus === "checking" && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[2px] text-blue-600 text-sm">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Checking account status...</span>
              </div>
            </div>
          )}

          {accountStatus === "unregistered" && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-[2px] text-orange-600 text-sm">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>No account found with this email address.</span>
              </div>
              <div className="mt-2 text-xs">
                <a href="/account/signup" className="text-orange-700 hover:text-orange-800 underline">
                  Create an account here
                </a>
              </div>
            </div>
          )}

          {accountStatus === "unverified" && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-[2px] text-yellow-600 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Your account is not verified.</span>
              </div>
              <div className="mt-2 text-xs">
                Please check your email for verification instructions.
              </div>
            </div>
          )}

          {accountStatus === "registered" && !isLocked && !errorMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-[2px] text-green-600 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Account found and ready to sign in.</span>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errorMessage && (
            <div className={`mb-4 p-3 rounded-[2px] text-sm ${
              isLocked
                ? "bg-red-50 border border-red-200 text-red-600"
                : attemptsLeft <= 1 && attemptsLeft > 0
                ? "bg-orange-50 border border-orange-200 text-orange-600" 
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              <div className="flex items-center gap-2">
                {isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : attemptsLeft <= 1 ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Cooldown Timer */}
          {isLocked && cooldownTime > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[2px] text-red-600 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  🔒 Account locked. Try again in <strong className="font-mono">{cooldownTime}</strong> seconds.
                </span>
              </div>
              <div className="mt-2 w-full bg-red-100 rounded-full h-1.5">
                <div 
                  className="bg-red-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(cooldownTime / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Attempts Warning */}
          {!isLocked && attemptsLeft < 3 && attemptsLeft > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-[2px] text-yellow-600 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  <strong>Warning:</strong> {attemptsLeft} attempt{attemptsLeft === 1 ? '' : 's'} remaining before account lockout.
                </span>
              </div>
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
              disabled={isLoading || isLocked || accountStatus === "unregistered"}
            >
              {isLocked && cooldownTime > 0 
                ? `🔒 Locked (${cooldownTime}s)` 
                : accountStatus === "unregistered"
                ? "Account Not Found"
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