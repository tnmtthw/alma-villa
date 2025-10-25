import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, CreditCard, Image as ImageIcon, ZoomIn, Download, RotateCw, X } from "lucide-react"
import { DocumentRequest } from "./types"
import { useState } from "react"

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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageZoom, setImageZoom] = useState(1)
  const [imageRotation, setImageRotation] = useState(0)

  if (!request) return null

  const handleDownloadImage = async () => {
    if (!request.proofOfPayment) return

    try {
      const response = await fetch(request.proofOfPayment)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `payment-proof-${request.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const resetImageControls = () => {
    setImageZoom(1)
    setImageRotation(0)
  }

  const getFeeByType = (type: string) => {
    switch (type) {
      case "Barangay Clearance":
        return "₱50";
      case "Certificate of Residency":
        return "₱30";
      case "Certificate of Indigency":
        return "₱30";
      case "Business Permit":
        return "₱200";
      case "Certificate of Good Moral Character":
        return "₱120";
      default:
        return "₱0";
    }
  };

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
              <p className="text-lg font-semibold text-gray-900">{getFeeByType(request.documentType)}</p>
            </div>
            {/* <div>
              <label className="text-sm font-medium text-gray-500">Payment Reference</label>
              <p className="text-sm text-gray-900">{request.paymentReference}</p>
            </div> */}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Payment Proof</label>
            <div className="mt-2 border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="relative">
                <div className="flex items-center justify-center h-64 bg-white rounded border-dashed border-2 border-gray-300 relative overflow-hidden">
                  {request.proofOfPayment ? (
                    <>
                      <img
                        src={request.proofOfPayment}
                        alt="Payment Proof"
                        className="h-full w-full object-contain rounded cursor-pointer transition-transform hover:scale-105"
                        onClick={() => {
                          setIsImageModalOpen(true)
                          resetImageControls()
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={() => {
                            setIsImageModalOpen(true)
                            resetImageControls()
                          }}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                          onClick={handleDownloadImage}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No payment proof uploaded</p>
                    </div>
                  )}
                </div>
                {request.proofOfPayment && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">Click image to view in full size</p>
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

      {/* Fullscreen Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="bg-transparent max-w-[95vw] max-h-[95vh] p-0 border-0 backdrop-blur-sm">
          <div className="relative h-[95vh] flex items-center justify-center">
            {/* Semi-transparent overlay for better image visibility */}
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Close Button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-50 bg-white/95 hover:bg-white shadow-lg"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Image Controls */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/95 hover:bg-white shadow-lg"
                onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.25))}
                disabled={imageZoom <= 0.5}
              >
                <ZoomIn className="h-4 w-4 transform scale-75" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/95 hover:bg-white shadow-lg"
                onClick={() => setImageZoom(Math.min(3, imageZoom + 0.25))}
                disabled={imageZoom >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/95 hover:bg-white shadow-lg"
                onClick={() => setImageRotation((prev) => (prev + 90) % 360)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/95 hover:bg-white shadow-lg"
                onClick={handleDownloadImage}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/95 hover:bg-white shadow-lg"
                onClick={resetImageControls}
              >
                Reset
              </Button>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute bottom-4 left-4 z-50 bg-white/95 px-3 py-1 rounded-md text-sm font-medium shadow-lg">
              {Math.round(imageZoom * 100)}%
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center overflow-auto z-30">
              {request?.proofOfPayment && (
                <img
                  src={request.proofOfPayment}
                  alt="Payment Proof - Full Size"
                  className="max-w-none transition-all duration-200 ease-in-out cursor-move drop-shadow-2xl"
                  style={{
                    transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                  draggable={false}
                />
              )}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 right-4 z-50 bg-white/95 px-3 py-2 rounded-md text-xs text-gray-700 max-w-xs shadow-lg">
              <div className="space-y-1">
                <p><strong>Controls:</strong></p>
                <p>• Use +/- buttons to zoom</p>
                <p>• Click rotate to turn image</p>
                <p>• Click download to save</p>
                <p>• Press ESC or click X to close</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
} 