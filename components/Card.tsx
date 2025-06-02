"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface CardProps {
  title: string
  description: string
  icon: string
  href: string
  className?: string
}

const Card = ({ title, description, icon, href, className }: CardProps) => {
  return (
    <Link 
      href={href}
      className={cn(
        "group flex flex-col items-center text-center p-12 rounded-lg",
        className
      )}
    >
      <div className="mb-6">
        <div className="relative h-16 w-16">
          <Image
            src={icon}
            alt={title}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-[#23479A]">
          {title}
        </h3>
        <p className="text-sm text-gray-600 max-w-[250px] mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  )
}

export default Card 