import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, Download, FileText, User, Calendar, MapPin } from "lucide-react"
import { DocumentRequest } from "./types"
import { useToast } from "@/components/ui/toast"
import ClaimClearanceButton from "@/app/dashboard/pdfgenerator/ClaimClearance"
import ClaimResidencyButton from "@/app/dashboard/pdfgenerator/ClaimResidency"
import ClaimIndigencyButton from "@/app/dashboard/pdfgenerator/ClaimIndigency"
import ClaimGoodMoralButton from "@/app/dashboard/pdfgenerator/ClaimGoodMoral"
import ClaimBusinessButton from "@/app/dashboard/pdfgenerator/ClaimBusiness"

interface PickupPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  request: DocumentRequest | null
}

export default function PickupPaymentModal({
  isOpen,
  onClose,
  request,
}: PickupPaymentModalProps) {
  const { addToast } = useToast()

  if (!request) return null

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleDownload = async (documentType: string) => {
    try {
      const response = await fetch(`/api/document/set-status?id=${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const result = await response.json()

      if (result.success) {
        console.log(`Status updated to completed for request ${request.id}`)

        // Show success toast notification
        addToast({
          title: "Document Downloaded Successfully",
          description: `${documentType} has been downloaded and marked as completed`,
        })

        // Auto-close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        console.error('Failed to update status:', result.error)
        addToast({
          title: "Status Update Failed",
          description: "Document downloaded but failed to update status",
          variant: "destructive"
        })
      }

      console.log(`Downloaded ${documentType} for request ${request.id}`)
    } catch (error) {
      console.error('Error downloading document:', error)
      addToast({
        title: "Download Failed",
        description: "Failed to download the document. Please try again.",
        variant: "destructive"
      })
    }
  }

  const renderClaimButton = () => {
    // Transform DocumentRequest to the format expected by claim buttons
    // For admin context, we override pickupOption to allow printing
    const transformedRequest = {
      id: request.id,
      fullName: request.formData?.fullName || request.userFullName,
      age: request.formData?.age || "",
      birthDate: request.formData?.birthDate || "",
      civilStatus: request.formData?.civilStatus || "",
      placeOfBirth: request.formData?.placeOfBirth || "",
      citizenship: request.formData?.citizenship || "",
      purok: request.formData?.purok || "",
      type: request.documentType,
      requestDate: request.requestDate,
      purpose: request.purpose,
      fee: request.fee,
      status: request.status,
      // Override pickupOption for admin context to allow printing
      pickupOption: "online", // This allows the claim buttons to work
    }

    switch (request.documentType) {
      case "Barangay Clearance":
        return (
          <ClaimClearanceButton request={transformedRequest} />
        )
      case "Certificate of Residency":
        return (
          <ClaimResidencyButton request={transformedRequest} />
        )
      case "Certificate of Indigency":
        return (
          <ClaimIndigencyButton request={transformedRequest} />
        )
      case "Certificate of Good Moral Character":
        return (
          <ClaimGoodMoralButton request={transformedRequest} />
        )
      case "Business Permit":
        return (
          <ClaimBusinessButton
            request={{
              id: request.id,
              businessName: request.formData?.businessName || "",
              businessLocation: request.formData?.businessLocation || "",
              operatorName: request.formData?.operatorName || "",
              operatorAddress: request.formData?.operatorAddress || "",
              updatedAt: request.lastUpdated,
              requestDate: request.requestDate,
              status: request.status,
            }} />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#23479A]" />
            Payment Details - {request.id}
          </DialogTitle>
          <DialogDescription>
            Payment information for approved document request with pickup option
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.userFullName}</p>
                  <p className="text-xs text-gray-600">{request.userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{request.documentType}</p>
                  <p className="text-xs text-gray-600">Purpose: {request.purpose}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Request Date</p>
                  <p className="text-xs text-gray-600">{formatDate(request.requestDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pickup Required</p>
                  <p className="text-xs text-gray-600">Physical pickup at barangay office</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Document Fee:</span>
                <span className="text-lg font-bold text-gray-900">{getFeeByType(request.documentType)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Processing Status:</span>
                <span className="text-sm text-green-600 font-medium">Approved - Ready for Payment</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                <span className="text-sm text-gray-600">Cash on Pickup</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Pickup Instructions</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Bring a valid ID for verification</li>
              <li>• Payment of {getFeeByType(request.documentType)} is required upon pickup</li>
              <li>• Visit the barangay office during business hours</li>
              <li>• Contact the office if you have any questions</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {renderClaimButton()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
