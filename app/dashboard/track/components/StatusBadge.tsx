"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Eye, Clock, FileText, AlertCircle } from "lucide-react"

export type RequestStatus = "processing" | "approved" | "request_for_payment" | "ready_to_claim" | "ready_for_pickup" | "completed" | "rejected"

interface StatusConfig {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ElementType
  description: string
}

/**
 * Configuration for different document request statuses
 */
const getStatusConfig = (status: RequestStatus): StatusConfig => {
  const configs: Record<RequestStatus, StatusConfig> = {
    processing: {
      label: "Processing",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: FileText,
      description: "Document is being prepared"
    },
    approved: {
      label: "Approved",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: Eye,
      description: "Document is Approved"
    },
    request_for_payment: {
      label: "Request for Payment",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: Clock,
      description: "Your request is in queue for review"
    },
    ready_to_claim: {
      label: "Ready to Claim",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: CheckCircle,
      description: "Document is ready for download"
    },
    ready_for_pickup: {
      label: "Ready for Pickup",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: CheckCircle,
      description: "Document is ready for pickup at barangay"
    },
    completed: {
      label: "Completed",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: CheckCircle,
      description: "Document has been claimed"
    },
    rejected: {
      label: "Rejected",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: AlertCircle,
      description: "Request requires attention"
    }
  }

  return configs[status] || {
    label: "Unknown",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: FileText,
    description: "Status not recognized"
  }
}

interface StatusBadgeProps {
  status: RequestStatus
  showDot?: boolean
  className?: string
}

/**
 * Reusable StatusBadge component for displaying document request status
 * @param status - The current status of the document request
 * @param showDot - Whether to show the colored dot indicator
 * @param className - Additional CSS classes
 */
export default function StatusBadge({ status, showDot = true, className = "" }: StatusBadgeProps) {
  const config = getStatusConfig(status)
  const StatusIcon = config.icon

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showDot && (
        <div 
          className={`w-2 h-2 rounded-full ${config.borderColor.replace('border-', 'bg-').replace('-200', '-400')}`}
        />
      )}
      <Badge className={`${config.bgColor} ${config.color} text-xs border-0`}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    </div>
  )
}

// Export the status config function for use in other components
export { getStatusConfig }
export type { StatusConfig }
