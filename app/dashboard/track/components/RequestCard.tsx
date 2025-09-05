"use client"

import { FileText } from "lucide-react"
import StatusBadge, { RequestStatus } from "./StatusBadge"
import ActionButtons from "./ActionButtons"

interface RequestItem {
  id: string
  documentType: string
  reference: string
  requestedAt: string
  status: RequestStatus
}

interface RequestCardProps {
  request: RequestItem
  onCancel: (id: string) => void
  onDecline: (id: string) => void
  onDownload: (id: string) => void
  onUpdateStatus: (id: string) => void
  onClaim: (id: string) => void
  formatDate: (iso: string) => string
}

/**
 * RequestCard component for displaying document request information in mobile view
 * @param request - The document request data
 * @param onCancel - Handler for cancel action
 * @param onDecline - Handler for decline action
 * @param onDownload - Handler for download action
 * @param onUpdateStatus - Handler for update status action
 * @param onClaim - Handler for claim action
 * @param formatDate - Function to format date strings
 */
export default function RequestCard({
  request,
  onCancel,
  onDecline,
  onDownload,
  onUpdateStatus,
  onClaim,
  formatDate
}: RequestCardProps) {
  return (
    <div className="border-b border-slate-100 last:border-b-0 p-4 hover:bg-slate-50/50 transition-colors">
      <div className="space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#23479A]/10 rounded-lg flex-shrink-0">
              <FileText className="h-4 w-4 text-[#23479A]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-900 text-sm leading-tight">
                {request.documentType}
              </h3>
              <p className="font-mono text-xs text-slate-600 mt-0.5">
                {request.reference}
              </p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
        
        {/* Date */}
        <div className="text-xs text-slate-500">
          Requested: {formatDate(request.requestedAt)}
        </div>

        {/* Actions */}
        <ActionButtons
          status={request.status}
          requestId={request.id}
          onCancel={onCancel}
          onDecline={onDecline}
          onDownload={onDownload}
          onUpdateStatus={onUpdateStatus}
          onClaim={onClaim}
        />
      </div>
    </div>
  )
}
