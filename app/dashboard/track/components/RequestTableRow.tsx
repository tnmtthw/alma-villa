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

interface RequestTableRowProps {
  request: RequestItem
  onCancel: (id: string) => void
  onDecline: (id: string) => void
  onDownload: (id: string) => void
  onUpdateStatus: (id: string) => void
  onClaim: (id: string) => void
  formatDate: (iso: string) => string
}

/**
 * RequestTableRow component for displaying document request information in desktop table view
 * @param request - The document request data
 * @param onCancel - Handler for cancel action
 * @param onDecline - Handler for decline action
 * @param onDownload - Handler for download action
 * @param onUpdateStatus - Handler for update status action
 * @param onClaim - Handler for claim action
 * @param formatDate - Function to format date strings
 */
export default function RequestTableRow({
  request,
  onCancel,
  onDecline,
  onDownload,
  onUpdateStatus,
  onClaim,
  formatDate
}: RequestTableRowProps) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-2.5 px-3">
        <div className="font-mono text-xs font-medium text-slate-900">
          {request.reference}
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#23479A]/10 rounded-lg">
            <FileText className="h-3.5 w-3.5 text-[#23479A]" />
          </div>
          <span className="font-medium text-slate-900 text-xs">{request.documentType}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-slate-600 text-[11px]">
        {formatDate(request.requestedAt)}
      </td>
      <td className="py-2.5 px-3">
        <StatusBadge status={request.status} />
      </td>
      <td className="py-2.5 px-3">
        <div className="flex justify-center gap-1.5 min-w-[240px]">
          <ActionButtons
            status={request.status}
            requestId={request.id}
            onCancel={onCancel}
            onDecline={onDecline}
            onDownload={onDownload}
            onUpdateStatus={onUpdateStatus}
            onClaim={onClaim}
            className="flex-1"
          />
        </div>
      </td>
    </tr>
  )
}
