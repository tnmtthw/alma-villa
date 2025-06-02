"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

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
              Residents Log in
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email or Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or phone number"
                  className="w-full pl-10 pr-4 py-2 border rounded-[2px] focus:ring-2 focus:ring-[#23479A]/20 focus:border-[#23479A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 border rounded-[2px] focus:ring-2 focus:ring-[#23479A]/20 focus:border-[#23479A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#23479A] focus:ring-2 focus:ring-[#23479A]/20 border-gray-300 rounded-[2px]"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[#23479A] hover:text-[#23479A]/80">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white py-2 px-4 rounded-[2px]"
            >
              Sign in
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-[#23479A] hover:text-[#23479A]/80 font-medium">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
} 