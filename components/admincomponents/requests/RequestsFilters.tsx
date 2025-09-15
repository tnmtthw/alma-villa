import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface RequestsFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  documentTypeFilter: string
  setDocumentTypeFilter: (value: string) => void
  urgentFilter: string
  setUrgentFilter: (value: string) => void
  userIdFilter: string
  setUserIdFilter: (value: string) => void
}

export default function RequestsFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  documentTypeFilter,
  setDocumentTypeFilter,
  urgentFilter,
  setUrgentFilter,
  userIdFilter,
  setUserIdFilter,
}: RequestsFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          {/* Search and User ID Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, document type, or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Filter by User ID..."
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="payment_pending">Payment Pending</SelectItem>
                <SelectItem value="ready_for_claim">Ready for Claim</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
              <SelectTrigger className="w-full">
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
              <span className="sm:hidden">More</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 