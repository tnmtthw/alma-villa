"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Camera, User } from "lucide-react"
import { useState } from "react"

interface ProfilePictureProps {
  capturedPhoto?: string | null
  firstName?: string
  lastName?: string
  middleName?: string
  size?: "sm" | "md" | "lg" | "xl"
  showBadge?: boolean
  className?: string
}

export default function ProfilePicture({
  capturedPhoto,
  firstName,
  lastName,
  middleName,
  size = "lg",
  showBadge = true,
  className = ""
}: ProfilePictureProps) {
  const [imageError, setImageError] = useState(false)

  // Generate initials from name
  const getInitials = () => {
    const names = [firstName, middleName, lastName].filter(Boolean)
    return names.map((name) => name?.[0] || '').join('').toUpperCase() || 'U'
  }

  // Size configurations
  const sizeConfig = {
    sm: { avatar: "h-8 w-8", badge: "h-4 w-4", text: "text-xs" },
    md: { avatar: "h-12 w-12", badge: "h-6 w-6", text: "text-sm" },
    lg: { avatar: "h-20 w-20 sm:h-24 sm:w-24", badge: "h-8 w-8 sm:h-10 sm:w-10", text: "text-lg sm:text-xl" },
    xl: { avatar: "h-32 w-32", badge: "h-12 w-12", text: "text-2xl" }
  }

  const config = sizeConfig[size]

  // Determine if we should show the captured photo
  const shouldShowCapturedPhoto = capturedPhoto && !imageError && capturedPhoto !== ""

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <Avatar className={config.avatar}>
        {shouldShowCapturedPhoto ? (
          <AvatarImage 
            src={capturedPhoto} 
            alt="Profile picture"
            onError={() => setImageError(true)}
            className="object-cover"
          />
        ) : (
          <AvatarImage src="/placeholder-avatar.jpg" alt="Profile picture" />
        )}
        <AvatarFallback className="bg-[#23479A] text-white">
          {shouldShowCapturedPhoto ? (
            <Camera className={`${config.text} text-white/80`} />
          ) : (
            <span className={config.text}>
              {getInitials()}
            </span>
          )}
        </AvatarFallback>
      </Avatar>

      {showBadge && (
        <div className={`absolute -bottom-1 -right-1 ${config.badge} rounded-full bg-white border-0 border-gray-200 shadow-sm flex items-center justify-center`}>
          <BadgeCheck className={`${config.badge} text-green-500`} />
        </div>
      )}
    </div>
  )
}
