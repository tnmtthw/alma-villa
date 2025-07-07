"use client"

import React, { useState, useMemo } from "react"
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
  Plus
} from "lucide-react"

// Import our reusable components
import StatsCard from "./requests/StatsCard"
import RequestsFilters from "./requests/RequestsFilters"
import RequestTableRow from "./requests/RequestTableRow"
import RequestDetailsModal from "./requests/RequestDetailsModal"
import StatusUpdateModal from "./requests/StatusUpdateModal"
import PaymentReviewModal from "./requests/PaymentReviewModal"

// Import types
import { DocumentRequest, RequestStats } from "./requests/types"

// Mock data - Replace with actual API calls
const mockRequests: DocumentRequest[] = [
  {
    id: "REQ-2024-001",
    userId: "user123",
    userFullName: "Juan Dela Cruz",
    userEmail: "juan.delacruz@email.com",
    userPhone: "+63 912 345 6789",
    documentType: "Barangay Clearance",
    purpose: "Employment requirement",
    status: "payment_pending",
    requestDate: "2024-01-15T08:30:00Z",
    estimatedCompletion: "2024-01-20T17:00:00Z",
    lastUpdated: "2024-01-16T14:20:00Z",
    fee: "₱50.00",
    paymentReference: "GCash-123456789",
    paymentProof: "/uploads/payment_proof_001.jpg",
    urgentRequest: false,
    formData: {
      fullName: "Juan Dela Cruz",
      address: "123 Main St, Barangay Alma Villa",
      dateOfBirth: "1990-05-15",
      civilStatus: "Single"
    },
    attachments: ["/uploads/valid_id_001.jpg"]
  },
  {
    id: "REQ-2024-002",
    userId: "user456",
    userFullName: "Maria Santos",
    userEmail: "maria.santos@email.com",
    userPhone: "+63 917 654 3210",
    documentType: "Certificate of Residency",
    purpose: "School enrollment",
    status: "under_review",
    requestDate: "2024-01-16T10:15:00Z",
    estimatedCompletion: "2024-01-18T17:00:00Z",
    lastUpdated: "2024-01-16T15:30:00Z",
    fee: "₱30.00",
    urgentRequest: true,
    formData: {
      fullName: "Maria Santos",
      address: "456 Secondary St, Barangay Alma Villa",
      yearsOfResidency: "5 years"
    },
    attachments: ["/uploads/utility_bill_002.jpg", "/uploads/valid_id_002.jpg"]
  },
  {
    id: "REQ-2024-003",
    userId: "user789",
    userFullName: "Roberto Garcia",
    userEmail: "roberto.garcia@email.com",
    userPhone: "+63 920 111 2222",
    documentType: "Business Permit",
    purpose: "Business registration",
    status: "ready_for_claim",
    requestDate: "2024-01-10T14:45:00Z",
    estimatedCompletion: "2024-01-17T17:00:00Z",
    lastUpdated: "2024-01-17T09:00:00Z",
    fee: "₱200.00",
    paymentReference: "Bank Transfer-987654321",
    urgentRequest: false,
    formData: {
      businessName: "Garcia Sari-Sari Store",
      businessType: "Retail",
      businessAddress: "789 Commerce Ave, Barangay Alma Villa"
    },
    attachments: ["/uploads/business_plan_003.pdf", "/uploads/location_map_003.jpg"]
  }
]

export default function RequestsManagement() {
  const [requests, setRequests] = useState<DocumentRequest[]>(mockRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all")
  const [urgentFilter, setUrgentFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
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

  // Calculate statistics
  const stats: RequestStats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === "pending").length,
      underReview: requests.filter(r => r.status === "under_review").length,
      processing: requests.filter(r => r.status === "processing").length,
      paymentPending: requests.filter(r => r.status === "payment_pending").length,
      readyForClaim: requests.filter(r => r.status === "ready_for_claim").length,
      completed: requests.filter(r => r.status === "completed").length,
      rejected: requests.filter(r => r.status === "rejected").length,
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

      const matchesStatus = statusFilter === "all" || request.status === statusFilter
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
    const configs = {
      pending: { label: "Pending", color: "bg-orange-100 text-orange-800", icon: Clock },
      under_review: { label: "Under Review", color: "bg-blue-100 text-blue-800", icon: Eye },
      processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: RefreshCw },
      payment_pending: { label: "Payment Pending", color: "bg-yellow-100 text-yellow-800", icon: CreditCard },
      ready_for_claim: { label: "Ready for Claim", color: "bg-green-100 text-green-800", icon: CheckCircle },
      completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle }
    }
    return configs[status]
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

  const handleStatusUpdateSubmit = () => {
    if (!selectedRequest) return

    setRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? {
            ...req,
            status: updateStatusData.newStatus as DocumentRequest["status"],
            adminNotes: updateStatusData.adminNotes,
            rejectionReason: updateStatusData.rejectionReason,
            lastUpdated: new Date().toISOString()
          }
        : req
    ))

    setIsStatusUpdateModalOpen(false)
    setSelectedRequest(null)
  }

  const handleApprovePayment = (request: DocumentRequest) => {
    setRequests(prev => prev.map(req => 
      req.id === request.id 
        ? { ...req, status: "processing", lastUpdated: new Date().toISOString() }
        : req
    ))
  }

  const handleRejectPayment = (request: DocumentRequest) => {
    setRequests(prev => prev.map(req => 
      req.id === request.id 
        ? { ...req, status: "payment_pending", lastUpdated: new Date().toISOString() }
        : req
    ))
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

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Document Requests</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Manage and process document requests from residents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
      />

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg md:text-xl">Document Requests ({filteredRequests.length})</CardTitle>
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