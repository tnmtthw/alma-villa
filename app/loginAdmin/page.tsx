"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Shield, User, Lock, AlertCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!formData.username.trim()) {
      setError("Username is required")
      setIsLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock authentication logic
      if (formData.username === "admin" && formData.password === "Admin@123456") {
        // Success - redirect to admin dashboard
        alert("Login successful! Redirecting to admin dashboard...")
        // In a real app: router.push('/admin/dashboard')
      } else {
        setError("Invalid username or password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23479A] via-[#23479A]/90 to-[#1a3c7a] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/assets/img/herosection.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="w-full max-w-md relative z-10">

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            {/* Logo with Security Badge */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Main Logo Container */}
                <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100">
                  <Image
                    src="/assets/img/Logo.png"
                    alt="Alma Villa Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
                
                {/* Security Badge */}
                <div className="absolute -bottom-2 -right-2 bg-[#23479A] p-2 rounded-full shadow-lg border-2 border-white">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            
            {/* Title and Description */}
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Administrative Portal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Barangay Alma Villa Secure Access
              </CardDescription>
            </div>

            {/* Security Level Indicator */}
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-xs font-medium text-red-700">Restricted Access</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <div className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Administrator Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your administrator username"
                    className="pl-10 border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    className="pl-10 pr-10 border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e as any)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/admin/forgot-password"
                  className="text-sm text-[#23479A] hover:text-[#23479A]/80 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleSubmit}
                className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white py-3 font-semibold text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Access Admin Portal
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Security Notice</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-[#23479A] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">Secure Access Protocol</p>
                  <p className="text-xs leading-relaxed">
                    This portal is restricted to authorized administrative personnel only. 
                    All access attempts are logged and monitored for security purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Need help accessing your account?{" "}
                <Link
                  href="/admin/support"
                  className="text-[#23479A] hover:text-[#23479A]/80 hover:underline"
                >
                  Contact IT Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-xs">
            © 2025 Barangay Alma Villa, Gloria, Oriental Mindoro
          </p>
          <p className="text-white/40 text-xs mt-1">
            Administrative Portal v2.0 • Secure Access System
          </p>
        </div>
      </div>
    </div>
  )
}