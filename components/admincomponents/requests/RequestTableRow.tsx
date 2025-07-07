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
  Download
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
  const StatusIcon = statusConfig.icon

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{request.id}</p>
            {request.urgentRequest && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{request.purpose}</p>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#23479A]/10 text-[#23479A]">
              {request.userFullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{request.userFullName}</p>
            <p className="text-sm text-gray-600">{request.userEmail}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <p className="font-medium text-gray-900">{request.documentType}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FileText className="h-3 w-3" />
            {request.attachments.length} attachment{request.attachments.length !== 1 ? 's' : ''}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Badge className={`${statusConfig.color} border-transparent`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusConfig.label}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <p className="text-sm text-gray-900">{formatDate(request.requestDate)}</p>
          <p className="text-xs text-gray-500">Updated: {formatDate(request.lastUpdated)}</p>
        </div>
      </TableCell>

      <TableCell>
        <p className="text-sm text-gray-900">{formatDate(request.estimatedCompletion)}</p>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <p className="font-medium text-gray-900">{request.fee}</p>
          {request.paymentReference && (
            <p className="text-xs text-green-600">Payment submitted</p>
          )}
        </div>
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewDetails(request)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(request)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Status
            </DropdownMenuItem>
            {request.paymentProof && (
              <DropdownMenuItem onClick={() => onPaymentReview(request)}>
                <CreditCard className="h-4 w-4 mr-2" />
                Review Payment
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
} 