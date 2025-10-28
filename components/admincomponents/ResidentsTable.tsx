// app/components/admincomponents/ResidentsTable.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Trash2, Clock, CheckCircle, XCircle, Archive, Loader2, AlertCircle, AlertTriangle, X } from "lucide-react"
import { useToast } from "@/components/ui/toast"

// Import components
import ResidentsHeader from "./residents/ResidentHeader"
import ResidentsStats from "./residents/ResidentsStats"
import ResidentsTabsNavigation from "./residents/ResidentsTabsNavigation"
import ResidentTableRow from "./residents/ResidentTableRow"
import { Resident, ResidentStats } from "./residents/types"
import { PendingResident } from "./residents/pendingTypes"

// Import the new modal components
import { DetailViewModal, PendingRegistrationReviewModal, ResidentViewModal } from "@/components/shared/modals/DetailViewModal"
import { AddResidentModal, MassImportModal } from "./residents/ResidentModal"
import ResidentsGridView from "./residents/ResidentsGridView"
import useSWR from 'swr';

const fetcher = async (url: string | URL | Request) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};


export default function ResidentsTable() {
  const { addToast } = useToast()
  const [allResidents, setAllResidents] = useState<Resident[]>([])
  const [activeTab, setActiveTab] = useState<"residents" | "pending" | "rejected">("residents")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGender, setFilterGender] = useState("All")
  const [filterRole, setFilterRole] = useState("All")
  const [selectedResidents, setSelectedResidents] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [loading, setLoading] = useState(true)

  // Modal states
  const [selectedPendingResident, setSelectedPendingResident] = useState<PendingResident | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [isResidentViewModalOpen, setIsResidentViewModalOpen] = useState(false)
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false)
  const [isMassImportModalOpen, setIsMassImportModalOpen] = useState(false)

  // Enhanced Delete Modal State
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    resident: null as Resident | null,
    isDeleting: false,
    confirmText: "",
    error: ""
  })

  // Bulk Delete Modal State
  const [bulkDeleteModalState, setBulkDeleteModalState] = useState({
    isOpen: false,
    residentCount: 0,
    isDeleting: false,
    confirmText: "",
    error: ""
  })

  // Fetch residents data from API
  const { data, error: swrError, isLoading: swrLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, fetcher);

  // Update residents when data changes
  useEffect(() => {
    if (data) {
      setAllResidents(data)
      setLoading(false)
    }
  }, [data])

  // Function to refresh data
  const fetchResidents = async () => {
    try {
      await mutate()
    } catch (err: unknown) {
      console.error('Error fetching residents:', err)
    }
  }

  // Filter residents by role for different tabs
  const residents = useMemo(() =>
    allResidents.filter(r => r.role === "Verified" || r.role === "Admin"),
    [allResidents]
  )

  const pendingResidents = useMemo(() =>
    allResidents.filter(r => r.role === "Unverified"),
    [allResidents]
  )

  const rejectedResidents = useMemo(() =>
    allResidents.filter(r => r.role === "Rejected"),
    [allResidents]
  )

  const archivedResidents = useMemo(() =>
    allResidents.filter(r => r.role === "Inactive"),
    [allResidents]
  )

  // Calculate stats
  const stats: ResidentStats = useMemo(() => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const newThisMonth = residents.filter(resident => {
      const createdDate = new Date(resident.createdAt)
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
    }).length

    return {
      total: residents.length,
      active: residents.filter(r => r.role === "Verified").length,
      inactive: archivedResidents.length,
      newThisMonth,
      maleCount: residents.filter(r => r.gender === "male").length,
      femaleCount: residents.filter(r => r.gender === "female").length,
      adminCount: residents.filter(r => r.role === "Admin").length,
    }
  }, [residents, archivedResidents])

  // Tab counts
  const tabCounts = {
    residents: residents.length,
    pending: pendingResidents.length,
    rejected: rejectedResidents.length
  }

  // Filter current data
  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      const matchesSearch =
        resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.mobileNumber.includes(searchTerm) ||
        resident.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesGender = filterGender === "All" || resident.gender === filterGender.toLowerCase()
      const matchesRole = filterRole === "All" || resident.role === filterRole

      return matchesSearch && matchesGender && matchesRole
    })
  }, [residents, searchTerm, filterGender, filterRole])

  // Action Handlers
  const handleViewResident = (resident: Resident) => {
    setSelectedResident(resident)
    setIsResidentViewModalOpen(true)
  }

  const handleEditResident = (resident: Resident) => {
    console.log("Edit resident:", resident)
    alert(`Editing ${resident.firstName} ${resident.lastName}`)
  }

  const handleUpdateResident = async (updatedResident: Resident) => {
    try {
      // Update API
      const response = await fetch(`/api/user/set-role?id=${updatedResident.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedResident,
          role: updatedResident.role
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update resident')
      }

      // Refresh data from API
      await fetchResidents()

      // Show success toast with role information
      const roleDisplayName = updatedResident.role === "Admin" ? "Administrator" : "Regular Resident"
      addToast({
        title: "Account Updated Successfully!",
        description: `${updatedResident.firstName} ${updatedResident.lastName}'s role has been changed to ${roleDisplayName}`,
        variant: "default"
      })

      // Close the view modal after update
      setIsResidentViewModalOpen(false)
      setSelectedResident(null)
    } catch (error) {
      console.error('Error updating resident:', error)
      addToast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update resident account. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleArchiveResident = async (resident: Resident) => {
    try {
      // Update API - change role to Inactive
      const response = await fetch(`http://localhost:3000/api/user/${resident.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resident,
          role: 'Inactive'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to archive resident')
      }

      // Refresh data from API
      await fetchResidents()

      // Close the view modal after archiving
      setIsResidentViewModalOpen(false)
      setSelectedResident(null)

      addToast({
        title: "Resident Archived",
        description: `${resident.firstName} ${resident.lastName} has been moved to archived residents`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error archiving resident:', error)
      addToast({
        title: "Archive Failed",
        description: error instanceof Error ? error.message : "Failed to archive resident. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteResident = async (resident: Resident) => {
    setDeleteModalState({
      isOpen: true,
      resident,
      isDeleting: false,
      confirmText: "",
      error: ""
    })
  }

  const executeDeleteResident = async () => {
    if (!deleteModalState.resident) return

    setDeleteModalState(prev => ({ ...prev, isDeleting: true, error: "" }))

    try {
      const response = await fetch(`http://localhost:3000/api/user/${deleteModalState.resident.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete resident')
      }

      // Refresh data from API
      await fetchResidents()

      // Close the view modal after deletion if open
      setIsResidentViewModalOpen(false)
      setSelectedResident(null)

      // Close delete modal and reset state
      setDeleteModalState({
        isOpen: false,
        resident: null,
        isDeleting: false,
        confirmText: "",
        error: ""
      })

      // Show success toast
      addToast({
        title: "Resident Deleted",
        description: `${deleteModalState.resident.firstName} ${deleteModalState.resident.lastName} has been permanently removed from the system`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error deleting resident:', error)
      setDeleteModalState(prev => ({
        ...prev,
        isDeleting: false,
        error: 'Failed to delete resident. Please try again.'
      }))
    }
  }

  const handleSelectAll = () => {
    if (selectedResidents.length === filteredResidents.length) {
      setSelectedResidents([])
    } else {
      setSelectedResidents(filteredResidents.map(resident => resident.id))
    }
  }

  const handleSelectResident = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedResidents([...selectedResidents, id])
    } else {
      setSelectedResidents(selectedResidents.filter(resId => resId !== id))
    }
  }

  const handleBulkDelete = async () => {
    setBulkDeleteModalState({
      isOpen: true,
      residentCount: selectedResidents.length,
      isDeleting: false,
      confirmText: "",
      error: ""
    })
  }

  const executeBulkDelete = async () => {
    setBulkDeleteModalState(prev => ({ ...prev, isDeleting: true, error: "" }))

    try {
      await Promise.all(selectedResidents.map(id =>
        fetch(`http://localhost:3000/api/user/${id}`, { method: 'DELETE' })
      ))

      // Refresh data from API
      await fetchResidents()
      setSelectedResidents([])

      // Close modal and reset state
      setBulkDeleteModalState({
        isOpen: false,
        residentCount: 0,
        isDeleting: false,
        confirmText: "",
        error: ""
      })

      addToast({
        title: "Bulk Delete Successful",
        description: `${bulkDeleteModalState.residentCount} residents have been permanently deleted from the system`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error deleting residents:', error)
      setBulkDeleteModalState(prev => ({
        ...prev,
        isDeleting: false,
        error: 'Failed to delete residents. Please try again.'
      }))
    }
  }

  const handleBulkArchive = async () => {
    if (confirm(`Archive ${selectedResidents.length} residents?`)) {
      try {
        await Promise.all(selectedResidents.map(id => {
          const resident = allResidents.find(r => r.id === id)
          if (resident) {
            return fetch(`http://localhost:3000/api/user/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...resident,
                role: 'Inactive'
              })
            })
          }
          return Promise.resolve()
        }))

        // Refresh data from API
        await fetchResidents()
        setSelectedResidents([])
        addToast({
          title: "Residents Archived",
          description: `${selectedResidents.length} residents have been moved to archived residents`,
          variant: "default"
        })
      } catch (error) {
        console.error('Error archiving residents:', error)
        addToast({
          title: "Archive Failed",
          description: error instanceof Error ? error.message : "Failed to archive residents. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  // Pending Registration Handlers
  const handleReviewPendingResident = (resident: PendingResident) => {
    setSelectedPendingResident(resident)
    setIsReviewModalOpen(true)
  }

  const handleApprovePendingResident = async (resident: PendingResident) => {
    try {
      const apiResident = allResidents.find(r => r.id === resident.id)
      if (!apiResident) {
        throw new Error('Resident not found')
      }

      const response = await fetch(`/api/user/set-verified?id=${resident.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resident.email,
          role: 'Verified'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve resident')
      }

      // Refresh data from API
      await fetchResidents()

      setIsReviewModalOpen(false)
      setSelectedPendingResident(null)

      addToast({
        title: "Registration Approved",
        description: `${resident.firstName} ${resident.lastName} has been approved and added as a verified resident`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error approving resident:', error)
      addToast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve resident registration. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRejectPendingResident = async (resident: PendingResident, reason: string) => {
    try {
      const apiResident = allResidents.find(r => r.id === resident.id)
      if (!apiResident) {
        throw new Error('Resident not found')
      }

      const response = await fetch(`/api/user/set-role?id=${resident.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...apiResident,
          role: 'Rejected'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to reject resident')
      }

      // Refresh data from API
      await fetchResidents()

      setIsReviewModalOpen(false)
      setSelectedPendingResident(null)

      addToast({
        title: "Registration Rejected",
        description: `${resident.firstName} ${resident.lastName}'s application has been rejected`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error rejecting resident:', error)
      addToast({
        title: "Rejection Failed",
        description: error instanceof Error ? error.message : "Failed to reject resident registration. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Role update handler for resident view modal
  const handleUpdateResidentRole = (resident: Resident, newRole: string) => {
    // Map the display role to the actual role value
    const roleMapping: { [key: string]: "Admin" | "Verified" } = {
      "Regular Resident": "Verified",
      "Admin": "Admin"
    };

    const updatedResident: Resident = {
      ...resident,
      role: roleMapping[newRole] || "Verified"
    }
    handleUpdateResident(updatedResident)
  }

  // Header action handlers
  const handleImport = (type: "individual" | "mass") => {
    if (type === "individual") {
      setIsAddResidentModalOpen(true)
    } else {
      setIsMassImportModalOpen(true)
    }
  }

  const handleExport = () => {
    // Convert residents data to CSV
    const headers = [
      "ID", "First Name", "Last Name", "Middle Name", "Email", "Mobile",
      "Gender", "Age", "Civil Status", "Address", "Role", "Date Registered"
    ]

    const csvData = residents.map(resident => [
      resident.id,
      resident.firstName,
      resident.lastName,
      resident.middleName,
      resident.email,
      resident.mobileNumber,
      resident.gender,
      resident.age,
      resident.civilStatus,
      `${resident.street}, ${resident.purok}, ${resident.barangay}`,
      resident.role,
      new Date(resident.createdAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `residents_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleAddResident = () => {
    setIsAddResidentModalOpen(true)
  }

  const handleAddResidentSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/resident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          type: "Manual Entry",
          frontId: "",
          backId: "",
          capturedPhoto: "",
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add resident')
      }

      // Refresh data from API
      await fetchResidents()
      addToast({
        title: "Resident Added",
        description: `${data.firstName} ${data.lastName} has been successfully added to the system`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error adding resident:', error)
      addToast({
        title: "Add Failed",
        description: error instanceof Error ? error.message : "Failed to add resident. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleMassImport = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/admin/resident/import', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to import residents')
      }

      addToast({
        title: "Import Successful",
        description: `File "${file.name}" has been uploaded and processed successfully`,
        variant: "default"
      })
      // Refresh data after import
      await fetchResidents()
    } catch (error) {
      console.error('Error importing residents:', error)
      addToast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import residents. Please check your file format.",
        variant: "destructive"
      })
    }
  }

  // Loading state
  if (swrLoading || loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#23479A]" />
          <p className="text-gray-600">Loading residents...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (swrError) {
    return (
      <div className="w-full min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load residents</h3>
            <p className="text-gray-600 mb-4">{swrError instanceof Error ? swrError.message : 'An error occurred'}</p>
            <Button onClick={fetchResidents} className="bg-[#23479A] hover:bg-[#1e3d8a]">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render different content based on active tab
  const renderPendingRegistrations = () => (
    <Card className="border-0 bg-white rounded-none">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-12">
                <Checkbox className="border-gray-300" />
              </TableHead>
              <TableHead className="font-medium text-gray-600">Applicant</TableHead>
              <TableHead className="font-medium text-gray-600">Details</TableHead>
              <TableHead className="font-medium text-gray-600">Contact</TableHead>
              <TableHead className="font-medium text-gray-600">Address</TableHead>
              <TableHead className="font-medium text-gray-600">Documents</TableHead>
              <TableHead className="font-medium text-gray-600">Status</TableHead>
              <TableHead className="font-medium text-gray-600">Submitted</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingResidents.length === 0 ? (
              <TableRow>
                <td colSpan={9} className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Clock className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending registrations</h3>
                  <p className="text-gray-500">All applications have been processed</p>
                </td>
              </TableRow>
            ) : (
              pendingResidents.map((resident) => (
                <TableRow key={resident.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="w-12 px-6 py-4">
                    <Checkbox className="border-gray-300" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-500 text-white font-medium flex items-center justify-center">
                        {resident.firstName[0]}{resident.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {resident.firstName} {resident.lastName}
                        </p>
                        <p className="text-sm text-gray-500">REG-{resident.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm capitalize">{resident.age} years • {resident.gender}</div>
                      <div className="text-sm text-gray-600">{resident.civilStatus} • {resident.religion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-mono">{resident.mobileNumber}</div>
                      <div className="text-sm text-gray-600 truncate max-w-[200px]">{resident.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 line-clamp-2 max-w-[250px]">
                      {resident.street}, {resident.purok}, {resident.barangay}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {resident.frontId && resident.backId && resident.capturedPhoto ? '3/3' : '0/3'} Submitted
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Unverified
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(resident.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => handleReviewPendingResident(resident as any)}
                    >
                      Review
                    </Button>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )

  const renderRejectedResidents = () => (
    <Card className="border-0 bg-white rounded-none">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="w-12">
                <Checkbox className="border-gray-300" />
              </TableHead>
              <TableHead className="font-medium text-gray-600">Applicant</TableHead>
              <TableHead className="font-medium text-gray-600">Details</TableHead>
              <TableHead className="font-medium text-gray-600">Contact</TableHead>
              <TableHead className="font-medium text-gray-600">Address</TableHead>
              <TableHead className="font-medium text-gray-600">Status</TableHead>
              <TableHead className="font-medium text-gray-600">Rejected Date</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rejectedResidents.length === 0 ? (
              <TableRow>
                <td colSpan={8} className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <XCircle className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected applications</h3>
                  <p className="text-gray-500">No applications have been rejected</p>
                </td>
              </TableRow>
            ) : (
              rejectedResidents.map((resident) => (
                <TableRow key={resident.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="w-12 px-6 py-4">
                    <Checkbox className="border-gray-300" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-500 text-white font-medium flex items-center justify-center">
                        {resident.firstName[0]}{resident.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {resident.firstName} {resident.lastName}
                        </p>
                        <p className="text-sm text-gray-500">REJ-{resident.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm capitalize">{resident.age} years • {resident.gender}</div>
                      <div className="text-sm text-gray-600">{resident.civilStatus} • {resident.religion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-mono">{resident.mobileNumber}</div>
                      <div className="text-sm text-gray-600 truncate max-w-[200px]">{resident.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 line-clamp-2 max-w-[250px]">
                      {resident.street}, {resident.purok}, {resident.barangay}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(resident.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      View
                    </Button>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      <div className="p-6 space-y-6">
        {/* Header */}
        <ResidentsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          onImport={handleImport}
          onExport={handleExport}
          onAddResident={handleAddResident}
          totalResidents={stats.total}
        />

        {/* Stats - only show for residents tab */}
        {activeTab === "residents" && <ResidentsStats stats={stats} />}

        {/* Tabs Navigation */}
        <ResidentsTabsNavigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setSelectedResidents([]) // Clear selection when switching tabs
          }}
          counts={tabCounts}
        />

        {/* Filters */}
        <Card className="border-0 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, ID, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-3">
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Gender</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>

                {/* Only show role filter for residents tab */}
                {activeTab === "residents" && (
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Roles</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Verified">Regular Residents</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedResidents.length > 0 && activeTab === "residents" && (
              <div className="mt-4 p-3 bg-gradient-to-r from-[#23479A]/10 to-blue-50 rounded-lg border border-[#23479A]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#23479A] text-white flex items-center justify-center text-sm font-medium">
                      {selectedResidents.length}
                    </div>
                    <span className="text-sm font-medium text-[#23479A]">
                      {selectedResidents.length} resident{selectedResidents.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleBulkArchive}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                    {/* <Button
                      size="sm"
                      onClick={handleBulkDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button> */}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content based on active tab */}
        {activeTab === "residents" && (
          viewMode === "table" ? (
            <Card className="border-0 bg-white rounded-none">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedResidents.length === filteredResidents.length && filteredResidents.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="border-gray-300"
                        />
                      </TableHead>
                      <TableHead className="font-medium text-gray-600">Resident</TableHead>
                      <TableHead className="font-medium text-gray-600">Details</TableHead>
                      <TableHead className="font-medium text-gray-600">Contact</TableHead>
                      <TableHead className="font-medium text-gray-600">Address</TableHead>
                      <TableHead className="font-medium text-gray-600">Role</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidents.map((resident) => (
                      <ResidentTableRow
                        key={resident.id}
                        resident={(resident)}
                        isSelected={selectedResidents.includes(resident.id)}
                        onSelect={handleSelectResident}
                        onView={(r) => handleViewResident((resident))}
                        onUpdate={handleUpdateResident}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {filteredResidents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No residents found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterGender !== "All" || filterRole !== "All"
                      ? "Try adjusting your search or filters"
                      : "No residents have been added yet"
                    }
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <ResidentsGridView
              residents={filteredResidents}
              selectedResidents={selectedResidents}
              onSelectResident={handleSelectResident}
              onSelectAll={handleSelectAll}
              onView={handleViewResident}
              onEdit={handleEditResident}
              onUpdate={handleUpdateResident}
              onArchive={handleArchiveResident}
              onDelete={handleDeleteResident}
            />
          )
        )}

        {/* Pending Registrations Tab */}
        {activeTab === "pending" && renderPendingRegistrations()}

        {/* Rejected Residents Tab */}
        {activeTab === "rejected" && renderRejectedResidents()}

        {/* Pagination */}
        {activeTab === "residents" && filteredResidents.length > 0 && (
          <Card className="border-0 bg-white rounded-none">
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{Math.min(10, filteredResidents.length)}</span> of{" "}
                <span className="font-medium">{filteredResidents.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="border-gray-200"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page 1 of 1
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="border-gray-200"
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Review Modal for Pending Registrations */}
      <PendingRegistrationReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false)
          setSelectedPendingResident(null)
        }}
        resident={selectedPendingResident}
        onApprove={handleApprovePendingResident}
        onReject={handleRejectPendingResident}
      />

      {/* View Modal for Verified Residents */}
      <ResidentViewModal
        isOpen={isResidentViewModalOpen}
        onClose={() => {
          setIsResidentViewModalOpen(false)
          setSelectedResident(null)
        }}
        resident={selectedResident}
        onUpdateRole={handleUpdateResidentRole}
      />

      {/* Add Individual Resident Modal */}
      <AddResidentModal
        isOpen={isAddResidentModalOpen}
        onClose={() => setIsAddResidentModalOpen(false)}
        onSubmit={handleAddResidentSubmit}
      />

      {/* Mass Import Modal */}
      <MassImportModal
        isOpen={isMassImportModalOpen}
        onClose={() => setIsMassImportModalOpen(false)}
        onImport={handleMassImport}
      />

      {/* Enhanced Delete Confirmation Modal */}
      {deleteModalState.isOpen && deleteModalState.resident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Delete Resident Account</h2>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteModalState({ isOpen: false, resident: null, isDeleting: false, confirmText: "", error: "" })}
                className="h-8 w-8 p-0 hover:bg-gray-100"
                disabled={deleteModalState.isDeleting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Permanent Deletion Warning
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>You are about to permanently delete:</p>
                      <p className="font-semibold mt-1">
                        {deleteModalState.resident.firstName} {deleteModalState.resident.lastName}
                      </p>
                      <p className="mt-2">This will:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Remove all personal information</li>
                        <li>Delete all document submissions</li>
                        <li>Remove access to all services</li>
                        <li>Cannot be recovered or undone</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Input */}
              <div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-700">
                  To confirm deletion, type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> below:
                </Label>
                <Input
                  value={deleteModalState.confirmText}
                  onChange={(e) => setDeleteModalState(prev => ({ ...prev, confirmText: e.target.value }))}
                  placeholder="Type DELETE to confirm"
                  className={`font-mono ${deleteModalState.error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-red-500 focus:ring-red-500/20'}`}
                  disabled={deleteModalState.isDeleting}
                />
                {deleteModalState.confirmText && deleteModalState.confirmText !== "DELETE" && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Please type "DELETE" exactly as shown
                  </p>
                )}
              </div>

              {/* Error Message */}
              {deleteModalState.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {deleteModalState.error}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModalState({ isOpen: false, resident: null, isDeleting: false, confirmText: "", error: "" })}
                  disabled={deleteModalState.isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeDeleteResident}
                  disabled={deleteModalState.confirmText !== "DELETE" || deleteModalState.isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {deleteModalState.isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Bulk Delete Confirmation Modal */}
      {bulkDeleteModalState.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Bulk Delete Residents</h2>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBulkDeleteModalState({ isOpen: false, residentCount: 0, isDeleting: false, confirmText: "", error: "" })}
                className="h-8 w-8 p-0 hover:bg-gray-100"
                disabled={bulkDeleteModalState.isDeleting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Bulk Deletion Warning
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>You are about to permanently delete:</p>
                      <p className="font-semibold mt-1 text-lg">
                        {bulkDeleteModalState.residentCount} resident{bulkDeleteModalState.residentCount > 1 ? 's' : ''}
                      </p>
                      <p className="mt-2">This will permanently remove:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>All personal information for {bulkDeleteModalState.residentCount} residents</li>
                        <li>All document submissions</li>
                        <li>All service access records</li>
                        <li>This action cannot be recovered or undone</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Input */}
              <div className="space-y-3">
                <Label className="block text-sm font-medium text-gray-700">
                  To confirm bulk deletion, type <span className="font-mono bg-gray-100 px-1 rounded">DELETE ALL</span> below:
                </Label>
                <Input
                  value={bulkDeleteModalState.confirmText}
                  onChange={(e) => setBulkDeleteModalState(prev => ({ ...prev, confirmText: e.target.value }))}
                  placeholder="Type DELETE ALL to confirm"
                  className={`font-mono ${bulkDeleteModalState.error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-red-500 focus:ring-red-500/20'}`}
                  disabled={bulkDeleteModalState.isDeleting}
                />
                {bulkDeleteModalState.confirmText && bulkDeleteModalState.confirmText !== "DELETE ALL" && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Please type "DELETE ALL" exactly as shown
                  </p>
                )}
              </div>

              {/* Error Message */}
              {bulkDeleteModalState.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {bulkDeleteModalState.error}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setBulkDeleteModalState({ isOpen: false, residentCount: 0, isDeleting: false, confirmText: "", error: "" })}
                  disabled={bulkDeleteModalState.isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeBulkDelete}
                  disabled={bulkDeleteModalState.confirmText !== "DELETE ALL" || bulkDeleteModalState.isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {bulkDeleteModalState.isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting {bulkDeleteModalState.residentCount} residents...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete {bulkDeleteModalState.residentCount} Residents
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}