"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  FileDown,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Eye,
  RefreshCw,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
} from "lucide-react"

// Mock data for demonstration - using same status values as request flow
const mockTransactions = [
  {
    id: "TXN-00001",
    residentName: "Mary Joy Ramos",
    purpose: "Barangay Clearance",
    purposeSubtext: "Bank Of Requirements",
    amount: 30.00,
    modeOfPayment: "Gcash",
    dateTime: "2024-01-15 10:30 AM",
    receivedBy: "Admin",
    status: "completed",
  },
  {
    id: "TXN-00002",
    residentName: "Mary Joy Ramos",
    purpose: "Barangay Clearance",
    purposeSubtext: "Bank Of Requirements",
    amount: 30.00,
    modeOfPayment: "Gcash",
    dateTime: "2024-01-15 11:00 AM",
    receivedBy: "Admin",
    status: "payment_sent",
  },
  {
    id: "TXN-00003",
    residentName: "John Doe",
    purpose: "Business Permit",
    purposeSubtext: "Business Registration",
    amount: 200.00,
    modeOfPayment: "Cash",
    dateTime: "2024-01-15 2:15 PM",
    receivedBy: "Admin",
    status: "completed",
  },
  {
    id: "TXN-00004",
    residentName: "Jane Smith",
    purpose: "Certificate of Residency",
    purposeSubtext: "Employment Requirements",
    amount: 30.00,
    modeOfPayment: "PayMaya",
    dateTime: "2024-01-14 3:45 PM",
    receivedBy: "Admin",
    status: "pending",
  },
  {
    id: "TXN-00005",
    residentName: "Robert Johnson",
    purpose: "Certificate of Indigency",
    purposeSubtext: "Medical Assistance",
    amount: 30.00,
    modeOfPayment: "Gcash",
    dateTime: "2024-01-14 9:20 AM",
    receivedBy: "Admin",
    status: "completed",
  },
  {
    id: "TXN-00006",
    residentName: "Sarah Lee",
    purpose: "Barangay Clearance",
    purposeSubtext: "Employment Requirements",
    amount: 30.00,
    modeOfPayment: "Gcash",
    dateTime: "2024-01-13 4:30 PM",
    receivedBy: "Admin",
    status: "rejected",
  },
]

export default function CashMovementPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")

  // Calculate statistics - using same status values as request flow
  const totalReceived = mockTransactions.reduce((sum, tx) => {
    // Count completed payments as received
    if (tx.status === "completed") return sum + tx.amount
    return sum
  }, 0)

  const pendingPayment = mockTransactions.filter((tx) => 
    tx.status === "pending" || tx.status === "payment_sent"
  ).length

  const successfulTransactions = mockTransactions.filter((tx) => tx.status === "completed").length

  // Calculate trends and changes (mock data for demonstration)
  const previousTotalReceived = totalReceived * 0.85 // Example: 15% increase
  const totalReceivedChange = totalReceived - previousTotalReceived
  const totalReceivedChangePercent = previousTotalReceived > 0 
    ? ((totalReceivedChange / previousTotalReceived) * 100).toFixed(1)
    : "0.0"

  const previousPending = pendingPayment > 0 ? pendingPayment - 1 : 0
  const pendingChange = pendingPayment - previousPending
  const pendingChangePercent = previousPending > 0 
    ? ((pendingChange / previousPending) * 100).toFixed(1)
    : "0.0"

  const previousSuccessful = successfulTransactions > 0 ? successfulTransactions - 2 : 0
  const successfulChange = successfulTransactions - previousSuccessful
  const successfulChangePercent = previousSuccessful > 0 
    ? ((successfulChange / previousSuccessful) * 100).toFixed(1)
    : "0.0"

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((tx) => {
    const statusMatch = statusFilter === "all" || tx.status.toLowerCase() === statusFilter.toLowerCase()
    // Add date filtering logic here if needed
    return statusMatch
  })

  // Status configuration - matching the request flow statuses
  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase()

    const configs: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: "Pending", color: "bg-orange-100 text-orange-800", icon: Clock },
      processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Eye },
      approved: { label: "Approved", color: "bg-purple-100 text-purple-800", icon: RefreshCw },
      payment_sent: { label: "Payment Sent", color: "bg-yellow-100 text-yellow-800", icon: CreditCard },
      ready_to_claim: { label: "Ready to Claim", color: "bg-green-100 text-green-800", icon: CheckCircle },
      completed: { label: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle }
    }

    const config = configs[normalizedStatus] || { 
      label: "Unknown", 
      color: "bg-gray-100 text-gray-800", 
      icon: FileText 
    }

    const Icon = config.icon

    return (
      <Badge className={`${config.color} border border-current/20`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const handleExportPDF = () => {
    // Export PDF functionality
    console.log("Exporting to PDF...")
  }

  const handleExportExcel = () => {
    // Export Excel functionality
    console.log("Exporting to Excel...")
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">
            CASH MOVEMENT
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base uppercase">
            LIST OF ALL RECEIVED PAYMENT
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="flex items-center gap-2 border border-gray-300 rounded-md"
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="flex items-center gap-2 border border-gray-300 rounded-md"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Received Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-50 ring-1 ring-white/20">
              <div className="h-6 w-6 flex items-center justify-center text-blue-600 font-bold text-xl">
                ₱
              </div>
            </div>
            {totalReceived > 0 && (
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-gray-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                +{totalReceivedChangePercent}%
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900 leading-none">
                ₱{totalReceived.toFixed(2)}
              </h3>
              {totalReceived > 0 && (
                <span className="text-sm text-emerald-600 font-medium pb-1">
                  +₱{totalReceivedChange.toFixed(2)}
                </span>
              )}
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Total Received
              </p>
              <p className="text-xs text-gray-500">
                Completed Payments
              </p>
            </div>
          </div>
        </div>

        {/* Pending Payment Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-50 ring-1 ring-white/20">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            {pendingPayment > 0 && (
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-gray-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                +{pendingChangePercent}%
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900 leading-none">
                {pendingPayment}
              </h3>
              {pendingPayment > 0 && (
                <span className="text-sm text-emerald-600 font-medium pb-1">
                  +{pendingChange}
                </span>
              )}
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Pending Payment
              </p>
              <p className="text-xs text-gray-500">
                Awaiting Review
              </p>
            </div>
          </div>
        </div>

        {/* Successful Transaction Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 ring-1 ring-white/20">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            {successfulTransactions > 0 && (
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-gray-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3" />
                +{successfulChangePercent}%
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-gray-900 leading-none">
                {successfulTransactions}
              </h3>
              {successfulTransactions > 0 && (
                <span className="text-sm text-emerald-600 font-medium pb-1">
                  +{successfulChange}
                </span>
              )}
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Successful Transaction
              </p>
              <p className="text-xs text-gray-500">
                Processed Successfully
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="payment_sent">Payment Sent</SelectItem>
              <SelectItem value="ready_to_claim">Ready to Claim</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 border border-gray-300 rounded-md"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <Card className="border border-gray-300 rounded-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-300">
                  <TableHead className="font-semibold text-gray-900">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-gray-900">Resident Name</TableHead>
                  <TableHead className="font-semibold text-gray-900">Purpose of Payment</TableHead>
                  <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-900">Mode of Payment</TableHead>
                  <TableHead className="font-semibold text-gray-900">Date & Time</TableHead>
                  <TableHead className="font-semibold text-gray-900">Received By</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-b border-gray-200">
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.residentName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.purpose}</div>
                          <div className="text-sm text-gray-500">{transaction.purposeSubtext}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">₱{transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.modeOfPayment}</TableCell>
                      <TableCell>{transaction.dateTime}</TableCell>
                      <TableCell>{transaction.receivedBy}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

