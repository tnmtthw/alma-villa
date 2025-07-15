import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Login Security Configuration
export const LOGIN_SECURITY = {
  MAX_ATTEMPTS: 3,
  LOCKOUT_DURATION_MINUTES: 1,
  LOCKOUT_DURATION_MS: 1 * 60 * 1000, // 1 minute in milliseconds
} as const

// Security utility functions
export const loginSecurityUtils = {
  /**
   * Format time remaining in a user-friendly way
   */
  formatTimeRemaining: (seconds: number): string => {
    if (seconds <= 0) return "0 seconds"
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'}`
    }
    
    return `${remainingSeconds} second${remainingSeconds === 1 ? '' : 's'}`
  },

  /**
   * Calculate attempts remaining
   */
  getAttemptsRemaining: (currentAttempts: number): number => {
    return Math.max(0, LOGIN_SECURITY.MAX_ATTEMPTS - currentAttempts)
  },

  /**
   * Check if account should be locked
   */
  shouldLockAccount: (attempts: number): boolean => {
    return attempts >= LOGIN_SECURITY.MAX_ATTEMPTS
  },

  /**
   * Get lockout end time
   */
  getLockoutEndTime: (startTime: Date = new Date()): Date => {
    return new Date(startTime.getTime() + LOGIN_SECURITY.LOCKOUT_DURATION_MS)
  },

  /**
   * Check if lockout has expired
   */
  isLockoutExpired: (lockoutTime: Date): boolean => {
    return new Date() > lockoutTime
  },

  /**
   * Get time remaining in lockout (in seconds)
   */
  getLockoutTimeRemaining: (lockoutEndTime: Date): number => {
    const now = new Date()
    if (now >= lockoutEndTime) return 0
    return Math.ceil((lockoutEndTime.getTime() - now.getTime()) / 1000)
  }
}
