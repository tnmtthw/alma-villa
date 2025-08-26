"use client"


import { Eye, Clock, CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react"
import { useSession } from "next-auth/react"
import useSWR from 'swr'


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import ClaimClearanceButton from './admincomponents/pdfgenerator/ClaimClearance'
import ClaimResidencyButton from './admincomponents/pdfgenerator/ClaimResidency'
import ClaimIndigencyButton from './admincomponents/pdfgenerator/ClaimIndigency'
import ClaimGoodMoralButton from './admincomponents/pdfgenerator/ClaimGoodMoral'
import ClaimBusinessButton from './admincomponents/pdfgenerator/ClaimBusiness'

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) =>
  fetch(...args).then((res) => res.json())

interface DocumentRequest {
  id: string
  fullName: string
  age: string
  birthDate: string
  placeOfBirth: string
  citizenship: string
  civilStatus: string
  houseNumber: string
  street: string
  purok: string
  type: string
  requestDate: string
  status: "pending" | "under_review" | "processing" | "ready_for_claim" | "completed" | "rejected"
  estimatedCompletion?: string
  purpose: string
  fee?: string
  progress?: number
  rejectionReason?: string

  // FOR BUSINESS PERMIT
  businessName?: string
  businessLocation?: string
  operatorName?: string
  operatorAddress?: string
  updatedAt?: string
}

const getStatusConfig = (status: DocumentRequest["status"]) => {
  const configs = {
    pending: {
      label: "Pending Review",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: Clock,
      description: "Your request is in queue for review"
    },
    under_review: {
      label: "Under Review",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: Eye,
      description: "Being reviewed by barangay staff"
    },
    processing: {
      label: "Processing",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: FileText,
      description: "Document is being prepared"
    },
    ready_for_claim: {
      label: "Ready for Claim",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: CheckCircle,
      description: "Document is ready for pickup"
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

const DocumentStatusTracker = () => {
  const { data: session } = useSession()

  const { data, error, isLoading } = useSWR(
    session?.user?.id ? `/api/user/docs?userId=${session.user.id}` : null,
    fetcher
  )

  const documents: DocumentRequest[] = data?.documents?.map((doc: any) => ({
    id: doc.id,
    fullName: doc.fullName,
    age: doc.age,
    birthDate: doc.birthDate,
    placeOfBirth: doc.placeOfBirth,
    civilStatus: doc.civilStatus,
    houseNumber: doc.houseNumber,
    street: doc.street,
    purok: doc.purok,
    type: doc.type,
    requestDate: new Date(doc.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),

    // FOR BUSINESS PERMIT
    businessName: doc.businessName,
    businessLocation: doc.businessLocation,
    operatorName: doc.operatorName,
    operatorAddress: doc.operatorAddress,
    updatedAt: doc.updatedAt,
    // FOR BUSINESS PERMIT

    status: doc.status,
    purpose: doc.purpose,
    fee: "₱50.00", // Example: replace with real fee field if available
    progress: doc.status === "pending" ? 25
      : doc.status === "under_review" ? 60
        : doc.status === "processing" ? 40
          : doc.status === "ready_for_claim" ? 100
            : doc.status === "completed" ? 100
              : 0
  })) || []

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#23479A]" />
              Document Requests
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              Track the status of your document requests
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-500 hover:text-[#23479A] border-gray-200 hover:border-[#23479A]/20 hover:bg-[#23479A]/5 w-full sm:w-auto"
          >
            View All Requests
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">

        {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-500">Failed to load document requests.</p>}

        {documents.map((request) => {
          const statusConfig = getStatusConfig(request.status)
          const StatusIcon = statusConfig.icon

          return (
            <div
              key={request.id}
              className={`group relative bg-white border rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200 ${statusConfig.borderColor} border-l-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {request.type}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusConfig.bgColor} ${statusConfig.color} border-0 whitespace-nowrap`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Request ID: {request.id}</p>
                  <p className="text-xs text-gray-500">{statusConfig.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {request.status === "ready_for_claim" && request.type === "Barangay Clearance" && (
                    <ClaimClearanceButton request={request} />
                  )}
                  {request.status === "ready_for_claim" && request.type === "Certificate of Residency" && (
                    <ClaimResidencyButton request={request} />
                  )}
                  {request.status === "ready_for_claim" && request.type === "Certificate of Indigency" && (
                    <ClaimIndigencyButton request={request} />
                  )}
                  {request.status === "ready_for_claim" && request.type === "Certificate of Good Moral Character" && (
                    <ClaimGoodMoralButton request={request} />
                  )}
                  {request.status === "ready_for_claim" && request.type === "Business Permit" && (
                    <ClaimBusinessButton
                      request={{
                        id: request.id,
                        businessName: request.businessName!,
                        businessLocation: request.businessLocation!,
                        operatorName: request.operatorName!,
                        operatorAddress: request.operatorAddress!,
                        updatedAt: request.updatedAt!,
                        requestDate: request.requestDate,
                        fee: request.fee,
                      }}
                    />
                  )}
                  {/* <Button variant="outline" size="sm" className="text-gray-600 hover:text-[#23479A]">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button> */}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-gray-900">{request.progress}%</span>
                </div>
                <Progress value={request.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Requested</p>
                    <p className="font-medium text-gray-900">{request.requestDate}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Purpose: <span className="text-gray-700">{request.purpose}</span></p>
              </div>
            </div>
          )
        })}

        {!isLoading && documents.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Requests</h3>
            <p className="text-sm text-gray-500 mb-4">You haven't submitted any document requests yet.</p>
            <Button className="bg-[#23479A] hover:bg-[#23479A]/90 text-white">
              Request Document
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  )
}

export default DocumentStatusTracker