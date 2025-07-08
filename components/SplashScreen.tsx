"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface SplashScreenProps {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onFinish, 500) // Wait for fade out animation
    }, 2500) // Show splash for 2.5 seconds

    return () => clearTimeout(timer)
  }, [onFinish])

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#23479A] via-[#2850b0] to-[#1a3a7a]"
      >
        <div className="text-center">
          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
              <Image
                src="/assets/img/Logo.png"
                alt="Alma Villa Logo"
                width={80}
                height={80}
                className="object-contain w-16 h-16 md:w-20 md:h-20"
                priority
              />
            </div>
          </motion.div>

          {/* App Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Alma Villa Verifast
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              Barangay Management System
            </p>
          </motion.div>

          {/* Flying Documents Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center"
          >
            {/* Document Container */}
            <div className="relative w-32 h-20 mb-6 overflow-hidden">
              {/* Document 1 */}
              <motion.div
                animate={{
                  x: [-100, 150],
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0
                }}
                className="absolute top-2 left-0"
              >
                <div className="w-8 h-10 bg-white rounded-sm shadow-lg flex flex-col">
                  <div className="h-2 bg-blue-200 rounded-t-sm"></div>
                  <div className="flex-1 p-1 space-y-0.5">
                    <div className="h-0.5 bg-gray-300 rounded"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </motion.div>

              {/* Document 2 */}
              <motion.div
                animate={{
                  x: [-120, 130],
                  y: [5, -5, 5],
                  rotate: [0, -3, 0]
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute top-6 left-0"
              >
                <div className="w-8 h-10 bg-white rounded-sm shadow-lg flex flex-col">
                  <div className="h-2 bg-green-200 rounded-t-sm"></div>
                  <div className="flex-1 p-1 space-y-0.5">
                    <div className="h-0.5 bg-gray-300 rounded"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </motion.div>

              {/* Document 3 */}
              <motion.div
                animate={{
                  x: [-80, 170],
                  y: [-5, 10, -5],
                  rotate: [0, 2, 0]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute top-0 left-0"
              >
                <div className="w-8 h-10 bg-white rounded-sm shadow-lg flex flex-col">
                  <div className="h-2 bg-purple-200 rounded-t-sm"></div>
                  <div className="flex-1 p-1 space-y-0.5">
                    <div className="h-0.5 bg-gray-300 rounded"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/80 text-sm"
            >
              Processing documents...
            </motion.p>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Circles */}
            <motion.div
              animate={{ 
                x: [0, 30, 0],
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                x: [0, -25, 0],
                y: [0, 15, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute top-3/4 right-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ 
                x: [0, 20, 0],
                y: [0, -30, 0],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
              className="absolute top-1/2 right-1/3 w-12 h-12 bg-white/10 rounded-full blur-xl"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#23479A] via-[#2850b0] to-[#1a3a7a]"
    >
      <div className="text-center">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
            <Image
              src="/assets/img/Logo.png"
              alt="Alma Villa Logo"
              width={80}
              height={80}
              className="object-contain w-16 h-16 md:w-20 md:h-20"
              priority
            />
          </div>
        </motion.div>

        {/* App Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Alma Villa Verifast
          </h1>
          <p className="text-blue-100 text-sm md:text-base">
            Barangay Management System
          </p>
        </motion.div>

        {/* Flying Documents Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Document Container */}
          <div className="relative w-32 h-20 mb-6 overflow-hidden">
            {/* Document 1 */}
            <motion.div
              animate={{
                x: [-100, 150],
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0
              }}
              className="absolute top-2 left-0"
            >
              <div className="w-8 h-10 bg-white rounded-sm shadow-lg flex flex-col">
                <div className="h-2 bg-blue-200 rounded-t-sm"></div>
                <div className="flex-1 p-1 space-y-0.5">
                  <div className="h-0.5 bg-gray-300 rounded"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </motion.div>

            {/* Document 2 */}
            <motion.div
              animate={{
                x: [-120, 130],
                y: [5, -5, 5],
                rotate: [0, -3, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute top-6 left-0"
            >
              <div className="w-8 h-10 bg-white rounded-sm shadow-lg flex flex-col">
                <div className="h-2 bg-green-200 rounded-t-sm"></div>
                <div className="flex-1 p-1 space-y-0.5">
                  <div className="h-0.5 bg-gray-300 rounded"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </motion.div>

            {/* Document 3 */}
            <motion.div
              animate={{
                x: [-80, 170],
                y: [-5, 10, -5],
                rotate: [0, 2, 0]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-0 left-0"
            >
              <div className="w-8 h-10 bg-white rounded-sm shadow-lg flex flex-col">
                <div className="h-2 bg-purple-200 rounded-t-sm"></div>
                <div className="flex-1 p-1 space-y-0.5">
                  <div className="h-0.5 bg-gray-300 rounded"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-0.5 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/80 text-sm"
          >
            Processing documents...
          </motion.p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Circles */}
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              x: [0, -25, 0],
              y: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute top-3/4 right-1/4 w-20 h-20 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              x: [0, 20, 0],
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            className="absolute top-1/2 right-1/3 w-12 h-12 bg-white/10 rounded-full blur-xl"
          />
        </div>
      </div>
    </motion.div>
  )
} 