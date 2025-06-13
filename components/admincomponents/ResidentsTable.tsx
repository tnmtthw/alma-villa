// app/components/admincomponents/ResidentsTable.tsx
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, Trash2, Clock, CheckCircle, XCircle, Archive } from "lucide-react"

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

// Sample verified residents data
const sampleResidents: Resident[] = [
  {
    id: "1b800952-1e2a-40ff-908e-d7c0be8ae1fe",
    lastName: "Dela Cruz",
    firstName: "Juan",
    middleName: "Santos",
    suffix: "",
    birthDate: "1990-01-15",
    age: "33",
    gender: "male",
    civilStatus: "single",
    nationality: "Filipino",
    religion: "Catholic",
    email: "juan.delacruz@email.com",
    mobileNumber: "09123456789",
    emergencyContact: "Maria Dela Cruz",
    emergencyNumber: "09187654321",
    houseNumber: "123",
    street: "Maharlika Street",
    purok: "Purok 1",
    barangay: "San Antonio",
    city: "Quezon City",
    province: "Metro Manila",
    zipCode: "1100",
    residencyLength: "5",
    type: "PhilSys ID/National ID",
    frontId: "https://wq8gj23taekk62rr.public.blob.vercel-storage.com/AlmaVilla/idDocuments/1749777598717-front_id.jpg",
    backId: "https://wq8gj23taekk62rr.public.blob.vercel-storage.com/AlmaVilla/idDocuments/1749777598719-back_id.jpg",
    capturedPhoto: "https://wq8gj23taekk62rr.public.blob.vercel-storage.com/AlmaVilla/verifiedPhoto/1749777598716-captured_photo.jpg",
    password: "$2b$12$XsEP53xHOrBMzd/YMhDwNuAIVdFPaAH4IskdkKnpePA5FLZuZQjcK",
    role: "Admin",
    createdAt: "2025-06-13T01:20:00.298Z"
  },
  {
    id: "2c901063-2f3b-51ff-a19f-e8d1cf9bf2ff",
    lastName: "Santos",
    firstName: "Maria",
    middleName: "Garcia",
    suffix: "",
    birthDate: "1995-08-22",
    age: "28",
    gender: "female",
    civilStatus: "married",
    nationality: "Filipino",
    religion: "Catholic",
    email: "maria.santos@email.com",
    mobileNumber: "09234567890",
    emergencyContact: "Carlos Santos",
    emergencyNumber: "09298765432",
    houseNumber: "456",
    street: "Rizal Avenue",
    purok: "Purok 2",
    barangay: "San Antonio",
    city: "Quezon City",
    province: "Metro Manila",
    zipCode: "1100",
    residencyLength: "3",
    type: "Driver's License",
    frontId: "https://example.com/front2.jpg",
    backId: "https://example.com/back2.jpg",
    capturedPhoto: "https://example.com/photo2.jpg",
    password: "$2b$12$example2",
    role: "Resident",
    createdAt: "2024-03-10T10:15:00.298Z"
  }
]

// Sample pending registrations data
const samplePendingResidents: PendingResident[] = [
  {
    id: "pending-001",
    lastName: "Rivera",
    firstName: "Elena",
    middleName: "Santos",
    suffix: "",
    birthDate: "1995-08-20",
    age: "29",
    gender: "female",
    civilStatus: "single",
    nationality: "Filipino",
    religion: "Catholic",
    email: "elena.rivera@email.com",
    mobileNumber: "09567890123",
    emergencyContact: "Manuel Rivera",
    emergencyNumber: "09567890124",
    houseNumber: "789",
    street: "Mabini Street",
    purok: "Purok 4",
    barangay: "San Antonio",
    city: "Quezon City",
    province: "Metro Manila",
    zipCode: "1100",
    residencyLength: "2",
    type: "Driver's License",
    frontId: "https://example.com/front1.jpg",
    backId: "https://example.com/back1.jpg",
    capturedPhoto: "https://example.com/photo1.jpg",
    dateSubmitted: "2024-03-15T08:30:00.298Z",
    status: "pending",
    documents: {
      frontId: { url: "https://example.com/front1.jpg", status: "submitted" },
      backId: { url: "https://example.com/back1.jpg", status: "submitted" },
      capturedPhoto: { url: "https://example.com/photo1.jpg", status: "pending" }
    }
  },
  {
    id: "pending-002",
    lastName: "Tan",
    firstName: "Marco",
    middleName: "Lee",
    suffix: "",
    birthDate: "1989-04-12",
    age: "35",
    gender: "male",
    civilStatus: "married",
    nationality: "Filipino",
    religion: "Buddhist",
    email: "marco.tan@email.com",
    mobileNumber: "09234567891",
    emergencyContact: "Lisa Tan",
    emergencyNumber: "09234567892",
    houseNumber: "456",
    street: "Rizal Avenue",
    purok: "Purok 2",
    barangay: "San Antonio",
    city: "Quezon City",
    province: "Metro Manila",
    zipCode: "1100",
    residencyLength: "1",
    type: "Passport",
    frontId: "https://example.com/front2.jpg",
    backId: "https://example.com/back2.jpg",
    capturedPhoto: "https://example.com/photo2.jpg",
    dateSubmitted: "2024-03-14T10:15:00.298Z",
    status: "under_review",
    documents: {
      frontId: { url: "https://example.com/front2.jpg", status: "approved" },
      backId: { url: "https://example.com/back2.jpg", status: "rejected", notes: "Image quality too low" },
      capturedPhoto: { url: "https://example.com/photo2.jpg", status: "submitted" }
    }
  }
]

// Sample rejected residents data
const sampleRejectedResidents: PendingResident[] = [
  {
    id: "rejected-001",
    lastName: "Garcia",
    firstName: "Carlos",
    middleName: "Rodriguez",
    suffix: "Jr.",
    birthDate: "1985-12-05",
    age: "38",
    gender: "male",
    civilStatus: "divorced",
    nationality: "Filipino",
    religion: "Catholic",
    email: "carlos.garcia@email.com",
    mobileNumber: "09876543210",
    emergencyContact: "Ana Garcia",
    emergencyNumber: "09876543211",
    houseNumber: "321",
    street: "Luna Street",
    purok: "Purok 5",
    barangay: "San Antonio",
    city: "Quezon City",
    province: "Metro Manila",
    zipCode: "1100",
    residencyLength: "0",
    type: "Voter's ID",
    frontId: "https://example.com/front3.jpg",
    backId: "https://example.com/back3.jpg",
    capturedPhoto: "https://example.com/photo3.jpg",
    dateSubmitted: "2024-03-10T14:20:00.298Z",
    status: "rejected",
    reviewNotes: "Documentation insufficient. Birth certificate and proof of address required.",
    documents: {
      frontId: { url: "https://example.com/front3.jpg", status: "rejected", notes: "Expired ID" },
      backId: { url: "https://example.com/back3.jpg", status: "rejected", notes: "Not readable" },
      capturedPhoto: { url: "https://example.com/photo3.jpg", status: "approved" }
    }
  }
]

export default function ResidentsTable() {
  const [residents, setResidents] = useState<Resident[]>(sampleResidents)
  const [pendingResidents, setPendingResidents] = useState<PendingResident[]>(samplePendingResidents)
  const [rejectedResidents, setRejectedResidents] = useState<PendingResident[]>(sampleRejectedResidents)
  const [archivedResidents, setArchivedResidents] = useState<Resident[]>([])
  const [activeTab, setActiveTab] = useState<"residents" | "pending" | "rejected">("residents")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGender, setFilterGender] = useState("All")
  const [filterRole, setFilterRole] = useState("All")
  const [selectedResidents, setSelectedResidents] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  
  // Modal states
  const [selectedPendingResident, setSelectedPendingResident] = useState<PendingResident | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [isResidentViewModalOpen, setIsResidentViewModalOpen] = useState(false)
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false)
  const [isMassImportModalOpen, setIsMassImportModalOpen] = useState(false)

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
      active: residents.length,
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

  const handleUpdateResident = (updatedResident: Resident) => {
    setResidents(residents.map(r => 
      r.id === updatedResident.id ? updatedResident : r
    ))
    
    if (updatedResident.role !== residents.find(r => r.id === updatedResident.id)?.role) {
      alert(`${updatedResident.firstName} ${updatedResident.lastName} role updated to ${updatedResident.role}`)
    } else {
      alert(`${updatedResident.firstName} ${updatedResident.lastName} account updated`)
    }
    
    // Close the view modal after update
    setIsResidentViewModalOpen(false)
    setSelectedResident(null)
  }

  const handleArchiveResident = (resident: Resident) => {
    setArchivedResidents([...archivedResidents, resident])
    setResidents(residents.filter(r => r.id !== resident.id))
    setSelectedResidents(selectedResidents.filter(id => id !== resident.id))
    
    // Close the view modal after archiving
    setIsResidentViewModalOpen(false)
    setSelectedResident(null)
    
    alert(`${resident.firstName} ${resident.lastName} has been archived`)
  }

  const handleDeleteResident = (resident: Resident) => {
    setResidents(residents.filter(r => r.id !== resident.id))
    setSelectedResidents(selectedResidents.filter(id => id !== resident.id))
    
    // Close the view modal after deletion
    setIsResidentViewModalOpen(false)
    setSelectedResident(null)
    
    alert(`${resident.firstName} ${resident.lastName} has been permanently deleted`)
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

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedResidents.length} residents?`)) {
      setResidents(residents.filter(r => !selectedResidents.includes(r.id)))
      setSelectedResidents([])
      alert(`${selectedResidents.length} residents deleted`)
    }
  }

  const handleBulkArchive = () => {
    if (confirm(`Archive ${selectedResidents.length} residents?`)) {
      const residentsToArchive = residents.filter(r => selectedResidents.includes(r.id))
      setArchivedResidents([...archivedResidents, ...residentsToArchive])
      setResidents(residents.filter(r => !selectedResidents.includes(r.id)))
      setSelectedResidents([])
      alert(`${residentsToArchive.length} residents archived`)
    }
  }

  // Pending Registration Handlers
  const handleReviewPendingResident = (resident: PendingResident) => {
    setSelectedPendingResident(resident)
    setIsReviewModalOpen(true)
  }

  const handleApprovePendingResident = (resident: PendingResident) => {
    const newResident: Resident = {
      ...resident,
      role: "Resident",
      password: "", // Will be set during account activation
      createdAt: new Date().toISOString()
    }
    
    setResidents([...residents, newResident])
    setPendingResidents(pendingResidents.filter(r => r.id !== resident.id))
    setIsReviewModalOpen(false)
    setSelectedPendingResident(null)
    
    alert(`${resident.firstName} ${resident.lastName} has been approved and added as a resident`)
  }

  const handleRejectPendingResident = (resident: PendingResident, reason: string) => {
    const rejectedResident: PendingResident = {
      ...resident,
      status: "rejected",
      reviewNotes: reason
    }
    
    setRejectedResidents([...rejectedResidents, rejectedResident])
    setPendingResidents(pendingResidents.filter(r => r.id !== resident.id))
    setIsReviewModalOpen(false)
    setSelectedPendingResident(null)
    
    alert(`${resident.firstName} ${resident.lastName} application has been rejected`)
  }

  // Role update handler for resident view modal
  const handleUpdateResidentRole = (resident: Resident, newRole: string) => {
    const updatedResident: Resident = { 
      ...resident, 
      role: newRole as "Admin" | "Resident" 
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

  const handleAddResidentSubmit = (data: any) => {
    const newResident: Resident = {
      ...data,
      id: `manual-${Date.now()}`,
      type: "Manual Entry",
      frontId: "",
      backId: "",
      capturedPhoto: "",
      password: "",
      createdAt: new Date().toISOString()
    }
    
    setResidents([...residents, newResident])
    alert(`${data.firstName} ${data.lastName} has been added successfully`)
  }

  const handleMassImport = (file: File) => {
    // In a real implementation, you would parse the CSV/Excel file
    // and process the data. For now, we'll just show a success message
    alert(`File "${file.name}" uploaded successfully. Processing ${Math.floor(Math.random() * 50 + 10)} residents...`)
    
    // Simulate adding some residents from the import
    // In production, you'd parse the file and validate the data
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
            {pendingResidents.map((resident) => (
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
                  <div className="text-xs text-gray-500">3/3 Submitted</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {resident.status === "pending" ? "Pending" : "Under Review"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {new Date(resident.dateSubmitted).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleReviewPendingResident(resident)}
                  >
                    Review
                  </Button>
                </td>
              </TableRow>
            ))}
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
              <TableHead className="font-medium text-gray-600">Reason</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rejectedResidents.map((resident) => (
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
                    {new Date(resident.dateSubmitted).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-[200px] truncate">
                    {resident.reviewNotes || "No reason provided"}
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
            ))}
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
                      <SelectItem value="Resident">Resident</SelectItem>
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
                    <Button
                      size="sm"
                      onClick={handleBulkDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
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
                      <TableHead className="font-medium text-gray-600">Status</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResidents.map((resident) => (
                      <ResidentTableRow
                        key={resident.id}
                        resident={resident}
                        isSelected={selectedResidents.includes(resident.id)}
                        onSelect={handleSelectResident}
                        onView={handleViewResident}
                        onEdit={handleEditResident}
                        onUpdate={handleUpdateResident}
                        onArchive={handleArchiveResident}
                        onDelete={handleDeleteResident}
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
        onEdit={handleEditResident}
        onArchive={handleArchiveResident}
        onDelete={handleDeleteResident}
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
    </div>
  )
}