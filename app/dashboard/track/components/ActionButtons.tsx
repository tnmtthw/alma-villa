"use client"

import { Button } from "@/components/ui/button"
import { XCircle, Clock, CheckCircle2 } from "lucide-react"
import { RequestStatus } from "./StatusBadge"

interface ActionButtonsProps {
  status: RequestStatus
  requestId: string
  onCancel: (id: string) => void
  onDecline: (id: string) => void
  onDownload: (id: string) => void
  onUpdateStatus: (id: string) => void
  onClaim: (id: string) => void
  className?: string
}

/**
 * ActionButtons component for handling different document request actions
 * @param status - Current status of the document request
 * @param requestId - Unique identifier for the request
 * @param onCancel - Handler for cancel action
 * @param onDecline - Handler for decline action
 * @param onDownload - Handler for download action
 * @param onUpdateStatus - Handler for update status action
 * @param onClaim - Handler for claim action
 * @param className - Additional CSS classes
 */
export default function ActionButtons({
  status,
  requestId,
  onCancel,
  onDecline,
  onDownload,
  onUpdateStatus,
  onClaim,
  className = ""
}: ActionButtonsProps) {
  const renderButtons = () => {
    switch (status) {
      case "processing":
      case "approved":
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs px-3 w-24" 
            onClick={() => onCancel(requestId)}
          >
            <XCircle className="h-3 w-3 mr-1" />
            Cancel
          </Button>
        )

      case "request_for_payment":
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-xs px-3 w-24" 
            onClick={() => onDecline(requestId)}
          >
            <Clock className="h-3 w-3 mr-1" />
            Decline
          </Button>
        )

      case "ready_to_claim":
        return (
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 w-24" 
            onClick={() => onDownload(requestId)}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Download
          </Button>
        )

      case "ready_for_pickup":
        return (
          <Button 
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 w-32" 
            onClick={() => onUpdateStatus(requestId)}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Update Status
          </Button>
        )

      case "completed":
        return (
          <Button 
            size="sm"
            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 w-36" 
            onClick={() => onClaim(requestId)}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Document Claimed
          </Button>
        )

      case "rejected":
      default:
        return null
    }
  }

  return (
    <div className={`flex gap-2 pt-2 justify-center ${className}`}>
      {renderButtons()}
    </div>
  )
}
