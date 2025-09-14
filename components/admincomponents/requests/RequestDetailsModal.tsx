import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Image as ImageIcon } from "lucide-react"

// Import types
interface DocumentRequest {
  id: string
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  documentType: string
  purpose: string
  status: "processing" | "approved" | "payment_sent" | "ready_to_claim" | "completed" | "rejected"
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
  proofOfPayment?: string
  attachments: string[]
}

interface RequestDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  request: DocumentRequest | null
  onUpdateStatus: (request: DocumentRequest) => void
  getStatusConfig: (status: DocumentRequest["status"]) => {
    label: string
    color: string
    icon: any
  }
}

export default function RequestDetailsModal({
  isOpen,
  onClose,
  request,
  onUpdateStatus,
  getStatusConfig,
}: RequestDetailsModalProps) {
  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#23479A]" />
            Request Details - {request.id}
          </DialogTitle>
          <DialogDescription>
            Complete information about this document request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Document Type</label>
                  <p className="text-sm text-gray-900">{request.documentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Purpose</label>
                  <p className="text-sm text-gray-900">{request.purpose}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {(() => {
                      const statusConfig = getStatusConfig(request.status)
                      const safeConfig = statusConfig || {
                        label: "Unknown",
                        color: "bg-gray-100 text-gray-700",
                        icon: FileText,
                      }
                      const StatusIcon = safeConfig.icon
                      return (
                        <Badge className={`${safeConfig.color} border-transparent`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {safeConfig.label}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fee</label>
                  <p className="text-sm text-gray-900">{request.fee}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-sm text-gray-900">{request.userFullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{request.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm text-gray-900">{request.userPhone}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Form Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(request.formData, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {request.paymentReference && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Reference</label>
                  <p className="text-sm text-gray-900">{request.paymentReference}</p>
                </div>
                {request.paymentProof && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Proof</label>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        View Payment Proof
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {request.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {request.attachments.map((attachment, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                    >
                      <FileText className="h-6 w-6" />
                      <span className="text-xs">Attachment {index + 1}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {request.adminNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900">{request.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => onUpdateStatus(request)}
            className="bg-[#23479A] hover:bg-[#23479A]/90"
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 