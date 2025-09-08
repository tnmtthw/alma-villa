import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Eye, 
  AlertTriangle,
  FileText,
  RefreshCw,
  CreditCard,
  Download,
  Edit
} from "lucide-react"

// Import types
interface DocumentRequest {
  id: string
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  documentType: string
  purpose: string
  status: "pending" | "under_review" | "processing" | "payment_pending" | "ready_for_claim" | "completed" | "rejected"
  requestDate: string
  estimatedCompletion: string
  lastUpdated: string
  fee: string
  paymentReference?: string
  paymentProof?: string
  rejectionReason?: string
  adminNotes?: string
  urgentRequest: boolean
  formData: any
  attachments: string[]
}

interface RequestTableRowProps {
  request: DocumentRequest
  onViewDetails: (request: DocumentRequest) => void
  onUpdateStatus: (request: DocumentRequest) => void
  onPaymentReview: (request: DocumentRequest) => void
  getStatusConfig: (status: DocumentRequest["status"]) => {
    label: string
    color: string
    icon: any
  }
  formatDate: (dateString: string) => string
}

export default function RequestTableRow({
  request,
  onViewDetails,
  onUpdateStatus,
  onPaymentReview,
  getStatusConfig,
  formatDate,
}: RequestTableRowProps) {
  const statusConfig = getStatusConfig(request.status)
  const safeConfig = statusConfig || {
    label: "Unknown",
    color: "bg-gray-100 text-gray-700",
    icon: FileText,
  }
  const StatusIcon = safeConfig.icon

  return (
    <TableRow className="hover:bg-gray-50/50">
      {/* Request Details */}
      <TableCell className="p-3 md:p-4">
        <div className="space-y-1">
          <p className="font-medium text-gray-900 text-sm md:text-base">{request.id}</p>
          <p className="text-xs md:text-sm text-gray-600">{request.purpose}</p>
          {request.urgentRequest && (
            <Badge className="bg-red-100 text-red-800 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          )}
        </div>
      </TableCell>

      {/* User */}
      <TableCell className="p-3 md:p-4">
        <div className="space-y-1">
          <p className="font-medium text-gray-900 text-sm md:text-base">{request.userFullName}</p>
          <p className="text-xs md:text-sm text-gray-600">{request.userEmail}</p>
        </div>
      </TableCell>

      {/* Document */}
      <TableCell className="p-3 md:p-4">
        <div className="space-y-1">
          <p className="font-medium text-gray-900 text-sm md:text-base">{request.documentType}</p>
          <p className="text-xs md:text-sm text-gray-600">Fee: {request.fee}</p>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="p-3 md:p-4">
        <Badge className={`${safeConfig.color} text-xs`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">{safeConfig.label}</span>
          <span className="sm:hidden">{safeConfig.label.split(' ')[0]}</span>
        </Badge>
      </TableCell>

      {/* Request Date */}
      <TableCell className="p-3 md:p-4">
        <p className="text-xs md:text-sm text-gray-900">{formatDate(request.requestDate)}</p>
      </TableCell>

      {/* Estimated Completion */}
      <TableCell className="p-3 md:p-4">
        <p className="text-xs md:text-sm text-gray-900">{formatDate(request.estimatedCompletion)}</p>
      </TableCell>

      {/* Fee */}
      <TableCell className="p-3 md:p-4">
        <p className="font-medium text-gray-900 text-sm md:text-base">{request.fee}</p>
      </TableCell>

      {/* Actions */}
      <TableCell className="p-3 md:p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={() => onViewDetails(request)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(request)}>
              <Edit className="mr-2 h-4 w-4" />
              Update Status
            </DropdownMenuItem>
            {request.status === "payment_pending" && (
              <DropdownMenuItem onClick={() => onPaymentReview(request)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Review Payment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
} 