"use client"

import { useState, useEffect } from "react"
import SplashScreen from "./SplashScreen"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSplashFinish = () => {
    setShowSplash(false)
  }

  // Prevent hydration mismatch by not rendering splash on server
  if (!isClient) {
    return <div className="opacity-0">{children}</div>
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  return <>{children}</>
} 