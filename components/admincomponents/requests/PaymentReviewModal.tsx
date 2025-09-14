import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, CreditCard, Image as ImageIcon } from "lucide-react"
import { DocumentRequest } from "./types"

interface PaymentReviewModalProps {
  isOpen: boolean
  onClose: () => void
  request: DocumentRequest | null
  onApprovePayment: (request: DocumentRequest) => void
  onRejectPayment: (request: DocumentRequest) => void
}

export default function PaymentReviewModal({
  isOpen,
  onClose,
  request,
  onApprovePayment,
  onRejectPayment,
}: PaymentReviewModalProps) {
  if (!request) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#23479A]" />
            Payment Review - {request.id}
          </DialogTitle>
          <DialogDescription>
            Review and verify the payment proof submitted by the user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Amount Due</label>
              <p className="text-lg font-semibold text-gray-900">{request.fee}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Payment Reference</label>
              <p className="text-sm text-gray-900">{request.paymentReference}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Payment Proof</label>
            <div className="mt-2 border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-center h-48 bg-white rounded border-dashed border-2 border-gray-300">
                {request.proofOfPayment ? (
                  <img
                    src={request.proofOfPayment}
                    alt="Payment Proof"
                    className="h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No payment proof uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="flex gap-3">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                onApprovePayment(request)
                onClose()
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Payment
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onRejectPayment(request)
                onClose()
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Payment
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 