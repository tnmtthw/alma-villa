"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  FileText, 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Filter,
  Calendar,
  User,
  CreditCard,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  ArrowUpDown,
  Plus
} from "lucide-react"

// Types
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

interface RequestStats {
  total: number
  pending: number
  underReview: number
  processing: number
  paymentPending: number
  readyForClaim: number
  completed: number
  rejected: number
  urgent: number
}

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
  const [sortBy, setSortBy] = useState("requestDate")
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

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof DocumentRequest]
      let bValue = b[sortBy as keyof DocumentRequest]

      if (typeof aValue === "string") aValue = aValue.toLowerCase()
      if (typeof bValue === "string") bValue = bValue.toLowerCase()

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [requests, searchTerm, statusFilter, documentTypeFilter, urgentFilter, sortBy, sortOrder])

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Requests</h1>
          <p className="text-gray-600 mt-1">Manage and process document requests from residents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#23479A] hover:bg-[#23479A]/90 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Review</p>
                <p className="text-2xl font-bold text-blue-600">{stats.underReview}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.paymentPending}</p>
              </div>
              <CreditCard className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-green-600">{stats.readyForClaim}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, document type, or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="payment_pending">Payment Pending</SelectItem>
                  <SelectItem value="ready_for_claim">Ready for Claim</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  <SelectItem value="Barangay Clearance">Barangay Clearance</SelectItem>
                  <SelectItem value="Certificate of Residency">Certificate of Residency</SelectItem>
                  <SelectItem value="Business Permit">Business Permit</SelectItem>
                  <SelectItem value="Certificate of Indigency">Certificate of Indigency</SelectItem>
                  <SelectItem value="Cedula">Cedula</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgentFilter} onValueChange={setUrgentFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Requests ({filteredRequests.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-1"
              >
                <ArrowUpDown className="h-3 w-3" />
                Sort: {sortOrder === "asc" ? "Oldest" : "Newest"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Details</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status)
                const StatusIcon = statusConfig.icon

                return (
                  <TableRow key={request.id} className="hover:bg-gray-50">
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
                          <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(request)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                          {request.paymentProof && (
                            <DropdownMenuItem onClick={() => handlePaymentReview(request)}>
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
              })}
            </TableBody>
          </Table>

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

      {/* Request Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#23479A]" />
              Request Details - {selectedRequest?.id}
            </DialogTitle>
            <DialogDescription>
              Complete information about this document request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
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
                      <p className="text-sm text-gray-900">{selectedRequest.documentType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Purpose</label>
                      <p className="text-sm text-gray-900">{selectedRequest.purpose}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">
                        {(() => {
                          const statusConfig = getStatusConfig(selectedRequest.status)
                          const StatusIcon = statusConfig.icon
                          return (
                            <Badge className={`${statusConfig.color} border-transparent`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          )
                        })()}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fee</label>
                      <p className="text-sm text-gray-900">{selectedRequest.fee}</p>
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
                      <p className="text-sm text-gray-900">{selectedRequest.userFullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedRequest.userEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{selectedRequest.userPhone}</p>
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
                      {JSON.stringify(selectedRequest.formData, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              {selectedRequest.paymentReference && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Reference</label>
                      <p className="text-sm text-gray-900">{selectedRequest.paymentReference}</p>
                    </div>
                    {selectedRequest.paymentProof && (
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
              {selectedRequest.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedRequest.attachments.map((attachment, index) => (
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
              {selectedRequest.adminNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-900">{selectedRequest.adminNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => selectedRequest && handleUpdateStatus(selectedRequest)}
              className="bg-[#23479A] hover:bg-[#23479A]/90"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusUpdateModalOpen} onOpenChange={setIsStatusUpdateModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Change the status and add notes for request {selectedRequest?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">New Status</label>
              <Select 
                value={updateStatusData.newStatus} 
                onValueChange={(value) => setUpdateStatusData(prev => ({ ...prev, newStatus: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="payment_pending">Payment Pending</SelectItem>
                  <SelectItem value="ready_for_claim">Ready for Claim</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Admin Notes</label>
              <textarea
                value={updateStatusData.adminNotes}
                onChange={(e) => setUpdateStatusData(prev => ({ ...prev, adminNotes: e.target.value }))}
                placeholder="Add internal notes about this request..."
                className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-[#23479A] focus:border-[#23479A]"
                rows={3}
              />
            </div>

            {updateStatusData.newStatus === "rejected" && (
              <div>
                <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
                <textarea
                  value={updateStatusData.rejectionReason}
                  onChange={(e) => setUpdateStatusData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                  placeholder="Provide reason for rejection (will be sent to user)..."
                  className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-[#23479A] focus:border-[#23479A]"
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdateSubmit}
              className="bg-[#23479A] hover:bg-[#23479A]/90"
              disabled={!updateStatusData.newStatus}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Review Modal */}
      <Dialog open={isPaymentReviewModalOpen} onOpenChange={setIsPaymentReviewModalOpen}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#23479A]" />
              Payment Review - {selectedRequest?.id}
            </DialogTitle>
            <DialogDescription>
              Review and verify the payment proof submitted by the user
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount Due</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.fee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Reference</label>
                  <p className="text-sm text-gray-900">{selectedRequest.paymentReference}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Payment Proof</label>
                <div className="mt-2 border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-center h-48 bg-white rounded border-dashed border-2 border-gray-300">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Payment proof image</p>
                      <p className="text-xs text-gray-500">{selectedRequest.paymentProof}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // Approve payment
                    setRequests(prev => prev.map(req => 
                      req.id === selectedRequest.id 
                        ? { ...req, status: "processing", lastUpdated: new Date().toISOString() }
                        : req
                    ))
                    setIsPaymentReviewModalOpen(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Payment
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    // Reject payment
                    setRequests(prev => prev.map(req => 
                      req.id === selectedRequest.id 
                        ? { ...req, status: "payment_pending", lastUpdated: new Date().toISOString() }
                        : req
                    ))
                    setIsPaymentReviewModalOpen(false)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Payment
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentReviewModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 