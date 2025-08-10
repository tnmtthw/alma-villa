"use client"

import React, { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  CreditCard,
  ArrowUpDown,
  Plus,
  Loader2
} from "lucide-react"

// Import our reusable components
import StatsCard from "./requests/StatsCard"
import RequestsFilters from "./requests/RequestsFilters"
import RequestTableRow from "./requests/RequestTableRow"
import RequestDetailsModal from "./requests/RequestDetailsModal"
import StatusUpdateModal from "./requests/StatusUpdateModal"
import PaymentReviewModal from "./requests/PaymentReviewModal"

import { DocumentRequest, RequestStats } from "./requests/types"

// SWR fetcher function
const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

// Custom hook for all document requests
const useDocumentRequests = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/document', fetcher)

  return {
    documents: data?.success ? data.documents : [],
    pagination: data?.pagination || { total: 0, limit: 50, offset: 0, hasMore: false },
    error,
    isLoading,
    mutate
  }
}

// Custom hook for user-specific document requests
const useUserDocumentRequests = (userId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/user/docs?userId=${userId}` : null,
    fetcher
  )

  return {
    documents: data?.success ? data.documents : [],
    pagination: data?.pagination || { total: 0, limit: 50, offset: 0, hasMore: false },
    error,
    isLoading,
    mutate
  }
}

// Transform API document data to DocumentRequest format
const transformDocumentToRequest = (document: any): DocumentRequest => {
  // Get user information from the joined user data
  const userEmail = document.user?.email || "user@example.com"
  const userPhone = document.user?.mobileNumber || ""
  const userFullName = document.user?.firstName && document.user?.lastName
    ? `${document.user.firstName} ${document.user.lastName}`.trim()
    : document.fullName || "Unknown User"

  return {
    id: document.id,
    userId: document.userId || "unknown",
    userFullName: userFullName,
    userEmail: userEmail,
    userPhone: userPhone,
    documentType: document.type || "Unknown Document",
    purpose: document.purpose || "Not specified",
    status: document.status || "pending", // Use status from document model
    requestDate: document.createdAt || new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    lastUpdated: document.createdAt || new Date().toISOString(),
    fee: "₱50.00", // Default fee
    urgentRequest: false, // Default to false
    formData: {
      fullName: document.fullName,
      suffix: document.suffix,
      birthDate: document.birthDate,
      age: document.age,
      civilStatus: document.civilStatus,
      houseNumber: document.houseNumber,
      street: document.street,
      purok: document.purok,
      residencyLength: document.residencyLength,
      purpose: document.purpose,
      additionalInfo: document.additionalInfo
    },
    attachments: [] // No attachments in current document model
  }
}

interface RequestsManagementProps {
  userId?: string
}

export default function RequestsManagement({ userId }: RequestsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all")
  const [urgentFilter, setUrgentFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [userIdFilter, setUserIdFilter] = useState("")

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isStatusUpdateModalOpen, setIsStatusUpdateModalOpen] = useState(false)
  const [isPaymentReviewModalOpen, setIsPaymentReviewModalOpen] = useState(false)
  const [updateStatusData, setUpdateStatusData] = useState({
    newStatus: "",
    adminNotes: "",
    rejectionReason: ""
  })

  const effectiveUserId = userId || userIdFilter || null

  // Fetch documents using custom hook - choose between all documents or user-specific
  const { documents: allDocuments, pagination: allPagination, error: allError, isLoading: allIsLoading, mutate: allMutate } = useDocumentRequests()
  const { documents: userDocuments, pagination: userPagination, error: userError, isLoading: userIsLoading, mutate: userMutate } = useUserDocumentRequests(effectiveUserId)

  // Use user-specific data if userId prop is provided or userIdFilter is set, otherwise use all documents
  const documents = effectiveUserId ? userDocuments : allDocuments
  const pagination = effectiveUserId ? userPagination : allPagination
  const error = effectiveUserId ? userError : allError
  const isLoading = effectiveUserId ? userIsLoading : allIsLoading
  const mutate = effectiveUserId ? userMutate : allMutate

  // Transform documents to requests format
  const requests: DocumentRequest[] = useMemo(() => {
    return documents.map(transformDocumentToRequest)
  }, [documents])

  // Calculate statistics
  const stats: RequestStats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status?.toLowerCase() === "pending").length,
      underReview: requests.filter(r => r.status?.toLowerCase() === "under_review").length,
      processing: requests.filter(r => r.status?.toLowerCase() === "processing").length,
      paymentPending: requests.filter(r => r.status?.toLowerCase() === "payment_pending").length,
      readyForClaim: requests.filter(r => r.status?.toLowerCase() === "ready_for_claim").length,
      completed: requests.filter(r => r.status?.toLowerCase() === "completed").length,
      rejected: requests.filter(r => r.status?.toLowerCase() === "rejected").length,
      urgent: requests.filter(r => r.urgentRequest).length
    }
  }, [requests])

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    let filtered = requests.filter(request => {
      const matchesSearch =
        request.userFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || request.status?.toLowerCase() === statusFilter.toLowerCase()
      const matchesDocumentType = documentTypeFilter === "all" || request.documentType === documentTypeFilter
      const matchesUrgent = urgentFilter === "all" ||
        (urgentFilter === "urgent" && request.urgentRequest) ||
        (urgentFilter === "normal" && !request.urgentRequest)

      return matchesSearch && matchesStatus && matchesDocumentType && matchesUrgent
    })

    // Sort by request date
    filtered.sort((a, b) => {
      const aDate = new Date(a.requestDate).getTime()
      const bDate = new Date(b.requestDate).getTime()
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate
    })

    return filtered
  }, [requests, searchTerm, statusFilter, documentTypeFilter, urgentFilter, sortOrder])

  // Status configuration
  const getStatusConfig = (status: DocumentRequest["status"]) => {
    // Normalize status to lowercase for consistent matching
    const normalizedStatus = status?.toLowerCase()

    const configs: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: "Pending", color: "bg-orange-100 text-orange-800", icon: Clock },
      under_review: { label: "Under Review", color: "bg-blue-100 text-blue-800", icon: Eye },
      processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: RefreshCw },
      payment_pending: { label: "Payment Pending", color: "bg-yellow-100 text-yellow-800", icon: CreditCard },
      ready_for_claim: { label: "Ready for Claim", color: "bg-green-100 text-green-800", icon: CheckCircle },
      completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle }
    }

    // Return the config for the normalized status, or default to pending if not found
    return configs[normalizedStatus] || configs.pending
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Handle request actions
  const handleViewDetails = (request: DocumentRequest) => {
    setSelectedRequest(request)
    setIsDetailsModalOpen(true)
  }

  const handleUpdateStatus = (request: DocumentRequest) => {
    setSelectedRequest(request)
    setUpdateStatusData({
      newStatus: request.status,
      adminNotes: request.adminNotes || "",
      rejectionReason: request.rejectionReason || ""
    })
    setIsStatusUpdateModalOpen(true)
  }

  const handlePaymentReview = (request: DocumentRequest) => {
    setSelectedRequest(request)
    setIsPaymentReviewModalOpen(true)
  }

  const handleStatusUpdateSubmit = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/document/set-status?id=${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: updateStatusData.newStatus,
          adminNotes: updateStatusData.adminNotes,
          rejectionReason: updateStatusData.rejectionReason
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const result = await response.json()

      if (result.success) {
        // Trigger a revalidation of the SWR data
        await mutate()
        setIsStatusUpdateModalOpen(false)
        setSelectedRequest(null)
      } else {
        throw new Error(result.error || 'Status update failed')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      // You might want to show a toast notification here
    }
  }

  const handleApprovePayment = async (request: DocumentRequest) => {
    try {
      const response = await fetch(`/api/document/set-status?id=${request.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: "processing"
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve payment')
      }

      const result = await response.json()

      if (result.success) {
        // Trigger a revalidation of the SWR data
        await mutate()
      } else {
        throw new Error(result.error || 'Payment approval failed')
      }
    } catch (error) {
      console.error('Error approving payment:', error)
      // You might want to show a toast notification here
    }
  }

  const handleRejectPayment = async (request: DocumentRequest) => {
    try {
      const response = await fetch(`/api/document/set-status?id=${request.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: "payment_pending"
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject payment')
      }

      const result = await response.json()

      if (result.success) {
        // Trigger a revalidation of the SWR data
        await mutate()
      } else {
        throw new Error(result.error || 'Payment rejection failed')
      }
    } catch (error) {
      console.error('Error rejecting payment:', error)
      // You might want to show a toast notification here
    }
  }

  // Statistics cards configuration
  const statsConfig = [
    { title: "Total", value: stats.total, icon: FileText, color: "text-blue-600" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-orange-600" },
    { title: "Review", value: stats.underReview, icon: Eye, color: "text-blue-600" },
    { title: "Processing", value: stats.processing, icon: RefreshCw, color: "text-purple-600" },
    { title: "Payment", value: stats.paymentPending, icon: CreditCard, color: "text-yellow-600" },
    { title: "Ready", value: stats.readyForClaim, icon: CheckCircle, color: "text-green-600" },
    { title: "Completed", value: stats.completed, icon: CheckCircle, color: "text-gray-600" },
    { title: "Urgent", value: stats.urgent, icon: AlertTriangle, color: "text-red-600" },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading document requests...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading requests</h3>
            <p className="text-gray-600 mb-4">Failed to load document requests. Please try again.</p>
            <Button onClick={() => mutate()} className="bg-[#23479A] hover:bg-[#23479A]/90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {effectiveUserId ? "User Document Requests" : "Document Requests"}
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {effectiveUserId
              ? "View and manage document requests for this specific user"
              : "Manage and process document requests from residents"
            }
            {effectiveUserId && (
              <span className="ml-2 text-sm text-blue-600 font-medium">
                (User ID: {effectiveUserId})
              </span>
            )}
            {pagination.total > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({pagination.total} total documents)
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => mutate()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button className="bg-[#23479A] hover:bg-[#23479A]/90 flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Manual Request</span>
            <span className="sm:hidden">Add Request</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Filters */}
      <RequestsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        documentTypeFilter={documentTypeFilter}
        setDocumentTypeFilter={setDocumentTypeFilter}
        urgentFilter={urgentFilter}
        setUrgentFilter={setUrgentFilter}
        userIdFilter={userIdFilter}
        setUserIdFilter={setUserIdFilter}
      />

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg md:text-xl">
              Document Requests ({filteredRequests.length})
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-1 w-full sm:w-auto"
              >
                <ArrowUpDown className="h-3 w-3" />
                <span className="hidden sm:inline">Sort: {sortOrder === "asc" ? "Oldest" : "Newest"}</span>
                <span className="sm:hidden">{sortOrder === "asc" ? "Oldest" : "Newest"}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile-responsive table wrapper */}
          <div className="overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Request Details</TableHead>
                  <TableHead className="min-w-[120px]">User</TableHead>
                  <TableHead className="min-w-[120px]">Document</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Request Date</TableHead>
                  <TableHead className="min-w-[120px]">Est. Completion</TableHead>
                  <TableHead className="min-w-[80px]">Fee</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <RequestTableRow
                    key={request.id}
                    request={request}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateStatus}
                    onPaymentReview={handlePaymentReview}
                    getStatusConfig={getStatusConfig}
                    formatDate={formatDate}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" || documentTypeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "No document requests have been submitted yet"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <RequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        request={selectedRequest}
        onUpdateStatus={handleUpdateStatus}
        getStatusConfig={getStatusConfig}
      />

      <StatusUpdateModal
        isOpen={isStatusUpdateModalOpen}
        onClose={() => setIsStatusUpdateModalOpen(false)}
        request={selectedRequest}
        updateStatusData={updateStatusData}
        setUpdateStatusData={setUpdateStatusData}
        onSubmit={handleStatusUpdateSubmit}
      />

      <PaymentReviewModal
        isOpen={isPaymentReviewModalOpen}
        onClose={() => setIsPaymentReviewModalOpen(false)}
        request={selectedRequest}
        onApprovePayment={handleApprovePayment}
        onRejectPayment={handleRejectPayment}
      />
    </div>
  )
} 