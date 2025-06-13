"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Activity,
  User2,
  Users,
  Briefcase,
  Phone,
  MapPin,
  Mail,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  MoreHorizontal,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  FileSpreadsheet,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Upload,
  Download,
  SlidersHorizontal,
  Check,
  X,
  UserPlus,
  Info,
  FileUp,
} from "lucide-react"
import FileViewer from "./FileViewer"
import ImageUpload from "./ImageUpload"
import { Textarea } from "@/components/ui/textarea"

// Sample residents data
const sampleResidents = [
  {
    id: "RES-001",
    firstName: "Juan",
    lastName: "Dela Cruz",
    middleName: "Santos",
    age: 34,
    gender: "Male",
    birthDate: "1990-03-15",
    civilStatus: "Married",
    address: "123 Maharlika St, Purok 1",
    phone: "09123456789",
    email: "juan.delacruz@email.com",
    occupation: "Teacher",
    status: "Active" as const,
    dateRegistered: "2023-01-15",
    emergencyContact: "Maria Dela Cruz",
    emergencyPhone: "09187654321",
    avatar: "JD"
  },
  {
    id: "RES-002",
    firstName: "Maria",
    lastName: "Santos",
    middleName: "Garcia",
    age: 28,
    gender: "Female",
    birthDate: "1995-07-22",
    civilStatus: "Single",
    address: "456 Rizal Ave, Purok 2",
    phone: "09234567890",
    email: "maria.santos@email.com",
    occupation: "Nurse",
    status: "Active" as const,
    dateRegistered: "2023-02-20",
    emergencyContact: "Ana Santos",
    emergencyPhone: "09298765432",
    avatar: "MS"
  },
  {
    id: "RES-003",
    firstName: "Pedro",
    lastName: "Reyes",
    middleName: "Lopez",
    age: 45,
    gender: "Male",
    birthDate: "1979-11-08",
    civilStatus: "Married",
    address: "789 Bonifacio St, Purok 3",
    phone: "09345678901",
    email: "pedro.reyes@email.com",
    occupation: "Mechanic",
    status: "Inactive" as const,
    dateRegistered: "2022-12-10",
    emergencyContact: "Rosa Reyes",
    emergencyPhone: "09309876543",
    avatar: "PR"
  },
  {
    id: "RES-004",
    firstName: "Ana",
    lastName: "Garcia",
    middleName: "Cruz",
    age: 31,
    gender: "Female",
    birthDate: "1992-05-14",
    civilStatus: "Widowed",
    address: "321 Luna St, Purok 1",
    phone: "09456789012",
    email: "ana.garcia@email.com",
    occupation: "Shopkeeper",
    status: "Active" as const,
    dateRegistered: "2023-03-12",
    emergencyContact: "Luis Garcia",
    emergencyPhone: "09401234567",
    avatar: "AG"
  },
  {
    id: "RES-005",
    firstName: "Carlos",
    lastName: "Martinez",
    middleName: "Fernandez",
    age: 52,
    gender: "Male",
    birthDate: "1971-09-03",
    civilStatus: "Married",
    address: "654 Del Pilar St, Purok 2",
    phone: "09567890123",
    email: "carlos.martinez@email.com",
    occupation: "Farmer",
    status: "Active" as const,
    dateRegistered: "2022-11-25",
    emergencyContact: "Elena Martinez",
    emergencyPhone: "09512345678",
    avatar: "CM"
  },
]

// Sample pending registrations data
const samplePendingRegistrations = [
  {
    id: "REG-001",
    firstName: "Elena",
    lastName: "Rivera",
    middleName: "Santos",
    age: 29,
    gender: "Female",
    birthDate: "1995-08-20",
    civilStatus: "Single",
    address: "789 Mabini St, Purok 4",
    phone: "09567890123",
    email: "elena.rivera@email.com",
    occupation: "Software Engineer",
    dateSubmitted: "2024-03-15",
    emergencyContact: "Manuel Rivera",
    emergencyPhone: "09567890124",
    avatar: "ER",
    documents: [
      {
        type: "Valid ID Photo",
        status: "submitted",
        url: "https://picsum.photos/800/600?random=1",
        name: "national-id.jpg"
      },
      {
        type: "Profile Picture",
        status: "submitted",
        url: "https://picsum.photos/800/600?random=2",
        name: "profile-photo.jpg"
      },
      {
        type: "Proof of Residence",
        status: "pending",
        url: "",
        name: ""
      }
    ]
  },
  {
    id: "REG-002",
    firstName: "Marco",
    lastName: "Tan",
    middleName: "Lee",
    age: 35,
    gender: "Male",
    birthDate: "1989-04-12",
    civilStatus: "Married",
    address: "456 Rizal Ave, Purok 2",
    phone: "09234567891",
    email: "marco.tan@email.com",
    occupation: "Business Owner",
    dateSubmitted: "2024-03-14",
    emergencyContact: "Lisa Tan",
    emergencyPhone: "09234567892",
    avatar: "MT",
    documents: [
      {
        type: "Valid ID Photo",
        status: "submitted",
        url: "https://picsum.photos/800/600?random=3",
        name: "drivers-license.jpg"
      },
      {
        type: "Profile Picture",
        status: "pending",
        url: "",
        name: ""
      },
      {
        type: "Proof of Residence",
        status: "submitted",
        url: "https://picsum.photos/800/600?random=4",
        name: "utility-bill.jpg"
      }
    ]
  }
];

interface Resident {
  id: string
  firstName: string
  lastName: string
  middleName: string
  age: number
  gender: string
  birthDate: string
  civilStatus: string
  address: string
  phone: string
  email: string
  occupation: string
  status: "Active" | "Inactive" | "Rejected"
  dateRegistered: string
  emergencyContact: string
  emergencyPhone: string
  avatar: string
  rejectionReason?: string
}

export default function ModernResidentsTable() {
  const [residents, setResidents] = useState<Resident[]>(sampleResidents)
  const [pendingRegistrations, setPendingRegistrations] = useState(samplePendingRegistrations)
  const [rejectedResidents, setRejectedResidents] = useState<Resident[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterGender, setFilterGender] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResidents, setSelectedResidents] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddOptionsModal, setShowAddOptionsModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [residentToDelete, setResidentToDelete] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"residents" | "pending" | "rejected">("residents")
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [importFile, setImportFile] = useState<File | null>(null)

  // Add new resident form state
  const [newResident, setNewResident] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    age: "",
    gender: "",
    birthDate: "",
    civilStatus: "",
    address: "",
    phone: "",
    email: "",
    occupation: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const itemsPerPage = 10

  // Filter and search residents
  const filteredResidents = residents.filter((resident) => {
    const matchesSearch =
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.occupation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatusFilter = filterStatus === "All" || resident.status === filterStatus
    const matchesGenderFilter = filterGender === "All" || resident.gender === filterGender

    return matchesSearch && matchesStatusFilter && matchesGenderFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedResidents = filteredResidents.slice(startIndex, startIndex + itemsPerPage)

  // Handle status change
  const handleStatusChange = (id: string, newStatus: "Active" | "Inactive") => {
    setResidents(residents.map(resident =>
      resident.id === id ? { ...resident, status: newStatus } : resident
    ))
  }

  // Handle delete
  const handleDelete = (id: string) => {
    setResidents(residents.filter(resident => resident.id !== id))
    setShowDeleteAlert(false)
    setResidentToDelete(null)
  }

  // Handle bulk actions
  const handleBulkStatusChange = (newStatus: "Active" | "Inactive") => {
    setResidents(residents.map(resident =>
      selectedResidents.includes(resident.id)
        ? { ...resident, status: newStatus }
        : resident
    ))
    setSelectedResidents([])
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedResidents.length === paginatedResidents.length) {
      setSelectedResidents([])
    } else {
      setSelectedResidents(paginatedResidents.map(resident => resident.id))
    }
  }

  // Stats calculations
  const stats = {
    total: residents.length,
    active: residents.filter(r => r.status === "Active").length,
    inactive: residents.filter(r => r.status === "Inactive").length,
    newThisMonth: 12,
    maleCount: residents.filter(r => r.gender === "Male").length,
    femaleCount: residents.filter(r => r.gender === "Female").length,
  }

  // Grid view component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedResidents.map((resident) => (
        <Card key={resident.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#23479A] hover:border-l-[#23479A]/80">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#23479A] to-[#23479A]/80 flex items-center justify-center text-white font-semibold text-sm">
                  {resident.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {resident.firstName} {resident.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">{resident.id}</p>
                </div>
              </div>
              <Badge variant={resident.status === "Active" ? "default" : "secondary"} className="text-xs">
                {resident.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <User2 className="h-3 w-3" />
                <span>{resident.age} years • {resident.gender}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Briefcase className="h-3 w-3" />
                <span>{resident.occupation}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{resident.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedResident(resident)
                  setShowViewModal(true)
                }}
                className="text-[#23479A] hover:bg-[#23479A]/10 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange(
                      resident.id,
                      resident.status === "Active" ? "Inactive" : "Active"
                    )}
                  >
                    {resident.status === "Active" ? (
                      <>
                        <UserX className="mr-2 h-3 w-3" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-3 w-3" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      setResidentToDelete(resident.id)
                      setShowDeleteAlert(true)
                    }}
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Handle registration approval
  const handleApproveRegistration = (registration: any) => {
    // Convert registration to resident
    const newResident: Resident = {
      id: `RES-${String(residents.length + 1).padStart(3, '0')}`,
      firstName: registration.firstName,
      lastName: registration.lastName,
      middleName: registration.middleName,
      age: registration.age,
      gender: registration.gender,
      birthDate: registration.birthDate,
      civilStatus: registration.civilStatus,
      address: registration.address,
      phone: registration.phone,
      email: registration.email,
      occupation: registration.occupation,
      status: "Active",
      dateRegistered: new Date().toISOString().split('T')[0],
      emergencyContact: registration.emergencyContact,
      emergencyPhone: registration.emergencyPhone,
      avatar: registration.avatar
    };

    // Add to residents and remove from pending
    setResidents([...residents, newResident]);
    setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== registration.id));
    setShowRegistrationModal(false);
  };

  // Handle registration rejection
  const handleRejectRegistration = (registration: any) => {
    // Convert registration to rejected resident
    const rejectedResident: Resident = {
      id: `REJ-${String(rejectedResidents.length + 1).padStart(3, '0')}`,
      firstName: registration.firstName,
      lastName: registration.lastName,
      middleName: registration.middleName,
      age: registration.age,
      gender: registration.gender,
      birthDate: registration.birthDate,
      civilStatus: registration.civilStatus,
      address: registration.address,
      phone: registration.phone,
      email: registration.email,
      occupation: registration.occupation,
      status: "Rejected",
      dateRegistered: new Date().toISOString().split('T')[0],
      emergencyContact: registration.emergencyContact,
      emergencyPhone: registration.emergencyPhone,
      avatar: registration.avatar,
      rejectionReason: rejectionReason
    };

    // Add to rejected residents and remove from pending
    setRejectedResidents([...rejectedResidents, rejectedResident]);
    setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== registration.id));
    setShowRegistrationModal(false);
    setShowRejectDialog(false);
    setRejectionReason(""); // Reset the rejection reason
  };

  // Simplified file upload handler for UI demo
  const handleFileUpload = () => {
    // Update the documents array with a demo file
    const updatedDocs = selectedRegistration.documents.map((doc: any) => {
      if (doc.type === uploadingDoc) {
        return {
          ...doc,
          status: "submitted",
          file: "sample-image.jpg",
          url: "https://picsum.photos/800/600",
          name: "sample-image.jpg"
        }
      }
      return doc
    })

    // Update the registration
    const updatedRegistration = {
      ...selectedRegistration,
      documents: updatedDocs
    }

    setPendingRegistrations(
      pendingRegistrations.map((reg) =>
        reg.id === selectedRegistration.id ? updatedRegistration : reg
      )
    )
    setSelectedRegistration(updatedRegistration)
    setUploadingDoc(null)
  }

  // Handle file import
  const handleFileImport = (file: File) => {
    setImportFile(file);
    // Here you would typically process the Excel file
    // For now, we'll just close the modal
    setShowImportModal(false);
  };

  // Handle new resident form submission
  const handleAddResident = () => {
    const resident: Resident = {
      id: `RES-${String(residents.length + 1).padStart(3, '0')}`,
      firstName: newResident.firstName,
      lastName: newResident.lastName,
      middleName: newResident.middleName,
      age: parseInt(newResident.age),
      gender: newResident.gender,
      birthDate: newResident.birthDate,
      civilStatus: newResident.civilStatus,
      address: newResident.address,
      phone: newResident.phone,
      email: newResident.email,
      occupation: newResident.occupation,
      status: "Active",
      dateRegistered: new Date().toISOString().split('T')[0],
      emergencyContact: newResident.emergencyContact,
      emergencyPhone: newResident.emergencyPhone,
      avatar: `${newResident.firstName[0]}${newResident.lastName[0]}`,
    };

    setResidents([...residents, resident]);
    setShowAddModal(false);
    // Reset form
    setNewResident({
      firstName: "",
      lastName: "",
      middleName: "",
      age: "",
      gender: "",
      birthDate: "",
      civilStatus: "",
      address: "",
      phone: "",
      email: "",
      occupation: "",
      emergencyContact: "",
      emergencyPhone: "",
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      {/* Modern Header */}
      <div className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Residents Management
            </h1>
            <p className="text-gray-600">
              Manage and track all barangay residents with advanced filtering and analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-[#23479A] text-white" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[#23479A] text-white" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
              className="border-[#23479A]/20 text-[#23479A] hover:bg-[#23479A]/5"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-[#23479A]/20 text-[#23479A] hover:bg-[#23479A]/5"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              size="sm"
              className="bg-[#23479A] hover:bg-[#23479A]/90 shadow-lg"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Resident
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="bg-gradient-to-br from-[#23479A] to-[#23479A]/80 text-white border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Inactive</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
                <UserX className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">New</p>
                  <p className="text-2xl font-bold">{stats.newThisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Male</p>
                  <p className="text-2xl font-bold">{stats.maleCount}</p>
                </div>
                <User2 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Female</p>
                  <p className="text-2xl font-bold">{stats.femaleCount}</p>
                </div>
                <User2 className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("residents")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "residents"
                ? "border-[#23479A] text-[#23479A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Verified Residents
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "pending"
                ? "border-[#23479A] text-[#23479A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Pending Registrations
            {pendingRegistrations.length > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {pendingRegistrations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "rejected"
                ? "border-[#23479A] text-[#23479A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Rejected Residents
            {rejectedResidents.length > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {rejectedResidents.length}
              </span>
            )}
          </button>
        </div>

        {/* Enhanced Search and Filter */}
        <Card className="border-0 bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, ID, email, or occupation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
            </div>

            {/* Enhanced Bulk Actions */}
            {selectedResidents.length > 0 && (
              <div className="mt-3 p-3 bg-gradient-to-r from-[#23479A]/10 to-blue-50 rounded-lg border border-[#23479A]/20">
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
                      onClick={() => handleBulkStatusChange("Active")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkStatusChange("Inactive")}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Deactivate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Delete ${selectedResidents.length} residents?`)) {
                          setResidents(residents.filter(r => !selectedResidents.includes(r.id)))
                          setSelectedResidents([])
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Area */}
      {activeTab === "residents" ? (
        <>
          {viewMode === "grid" ? (
            <div className="p-4">
              <GridView />
            </div>
          ) : (
            <Card className="border-0 bg-white rounded-none">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100">
                      <TableHead className="w-10">
                        <Checkbox
                          checked={selectedResidents.length === paginatedResidents.length && paginatedResidents.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="border-gray-300"
                        />
                      </TableHead>
                      <TableHead className="font-medium text-gray-600">Resident</TableHead>
                      <TableHead className="font-medium text-gray-600">Details</TableHead>
                      <TableHead className="font-medium text-gray-600">Contact</TableHead>
                      <TableHead className="font-medium text-gray-600">Address</TableHead>
                      <TableHead className="font-medium text-gray-600">Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedResidents.map((resident) => (
                      <TableRow
                        key={resident.id}
                        className="border-b border-gray-50 hover:bg-gray-50/60"
                      >
                        <TableCell className="w-10">
                          <Checkbox
                            checked={selectedResidents.includes(resident.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedResidents([...selectedResidents, resident.id])
                              } else {
                                setSelectedResidents(selectedResidents.filter(id => id !== resident.id))
                              }
                            }}
                            className="border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#23479A] flex items-center justify-center text-white font-medium text-sm">
                              {resident.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {resident.firstName} {resident.lastName}
                              </p>
                              <p className="text-sm text-gray-500 font-mono">{resident.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User2 className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm">{resident.age} years • {resident.gender}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm text-gray-600">{resident.occupation}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm font-mono">{resident.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm text-gray-600">{resident.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 line-clamp-2">{resident.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={resident.status === "Active" ? "default" : "secondary"}
                            className={resident.status === "Active"
                              ? "bg-green-50 text-green-700 border-0"
                              : "bg-gray-50 text-gray-700 border-0"
                            }
                          >
                            <Activity className="h-3.5 w-3.5 mr-1" />
                            {resident.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] bg-white">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedResident(resident)
                                  setShowViewModal(true)
                                }}
                                className="hover:bg-gray-50 cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-gray-50 cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-100" />
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(
                                  resident.id,
                                  resident.status === "Active" ? "Inactive" : "Active"
                                )}
                                className="hover:bg-gray-50 cursor-pointer"
                              >
                                {resident.status === "Active" ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>Activate</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-gray-50 cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setResidentToDelete(resident.id)
                                  setShowDeleteAlert(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredResidents.length)}</span> of{" "}
                  <span className="font-medium">{filteredResidents.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-200"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-gray-200"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      ) : activeTab === "pending" ? (
        <Card className="border-0 bg-white rounded-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-medium text-gray-600">Registration ID</TableHead>
                  <TableHead className="font-medium text-gray-600">Applicant</TableHead>
                  <TableHead className="font-medium text-gray-600">Details</TableHead>
                  <TableHead className="font-medium text-gray-600">Contact</TableHead>
                  <TableHead className="font-medium text-gray-600">Documents</TableHead>
                  <TableHead className="font-medium text-gray-600">Date Submitted</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRegistrations.map((registration) => (
                  <TableRow
                    key={registration.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60"
                  >
                    <TableCell className="font-mono text-sm">{registration.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-sm">
                          {registration.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {registration.firstName} {registration.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{registration.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User2 className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm">{registration.age} years • {registration.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600">{registration.occupation}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm font-mono">{registration.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600 line-clamp-1">{registration.address}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {registration.documents.map((doc: any) => (
                          <div key={doc.type} className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                doc.status === "submitted"
                                  ? "border-green-200 text-green-700 bg-green-50"
                                  : "border-yellow-200 text-yellow-700 bg-yellow-50"
                              }
                            >
                              {doc.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(registration.dateSubmitted).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowRegistrationModal(true);
                        }}
                        className="text-[#23479A] hover:text-[#23479A]/80"
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card className="border-0 bg-white rounded-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-medium text-gray-600">Resident ID</TableHead>
                  <TableHead className="font-medium text-gray-600">Resident</TableHead>
                  <TableHead className="font-medium text-gray-600">Details</TableHead>
                  <TableHead className="font-medium text-gray-600">Contact</TableHead>
                  <TableHead className="font-medium text-gray-600">Address</TableHead>
                  <TableHead className="font-medium text-gray-600">Date Rejected</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedResidents.map((resident) => (
                  <TableRow
                    key={resident.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60"
                  >
                    <TableCell className="font-mono text-sm">{resident.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-medium text-sm">
                          {resident.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {resident.firstName} {resident.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{resident.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User2 className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm">{resident.age} years • {resident.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600">{resident.occupation}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm font-mono">{resident.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-600">{resident.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-2">{resident.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(resident.dateRegistered).toLocaleDateString()}
                      </div>
                      {resident.rejectionReason && (
                        <div className="text-sm text-red-600 mt-1">
                          Reason: {resident.rejectionReason}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedResident(resident);
                          setShowViewModal(true);
                        }}
                        className="text-[#23479A] hover:text-[#23479A]/80"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Enhanced View Resident Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b border-gray-200 pb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#23479A] flex items-center justify-center text-white font-bold text-lg">
                {selectedResident?.avatar}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedResident?.firstName} {selectedResident?.lastName}
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600">
                  Resident ID: {selectedResident?.id} • {selectedResident?.occupation}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-6 pt-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge
                  variant={selectedResident.status === "Active" ? "default" : "secondary"}
                  className={`px-3 py-1 ${selectedResident.status === "Active"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  {selectedResident.status} Resident
                </Badge>
                <p className="text-sm text-gray-500">
                  Registered: {new Date(selectedResident.dateRegistered).toLocaleDateString()}
                </p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <Card className="border-l-4 border-l-[#23479A]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User2 className="h-5 w-5 text-[#23479A]" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                        <p className="font-semibold text-gray-900">
                          {selectedResident.firstName} {selectedResident.middleName} {selectedResident.lastName}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Age</Label>
                        <p className="font-semibold text-gray-900">{selectedResident.age} years old</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Gender</Label>
                        <p className="font-semibold text-gray-900">{selectedResident.gender}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Birth Date</Label>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedResident.birthDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Civil Status</Label>
                        <p className="font-semibold text-gray-900">{selectedResident.civilStatus}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Occupation</Label>
                        <p className="font-semibold text-gray-900">{selectedResident.occupation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-500" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Address</Label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="font-semibold text-gray-900">{selectedResident.address}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="font-semibold text-gray-900 font-mono">{selectedResident.phone}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="font-semibold text-gray-900">{selectedResident.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-l-4 border-l-red-500 lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User2 className="h-5 w-5 text-red-500" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                        <p className="font-semibold text-gray-900">{selectedResident.emergencyContact}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Contact Number</Label>
                        <p className="font-semibold text-gray-900 font-mono">{selectedResident.emergencyPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
                <Button className="bg-[#23479A] hover:bg-[#23479A]/90">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Resident
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Resident
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the resident record and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => residentToDelete && handleDelete(residentToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Registration Review Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b border-gray-200 pb-3">
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#23479A]" />
              Registration Review
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {selectedRegistration?.id} • Submitted on {selectedRegistration?.dateSubmitted}
            </DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-6 pt-6">
              {/* Personal Information */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User2 className="h-5 w-5 text-orange-500" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      <p className="font-semibold text-gray-900">
                        {selectedRegistration.firstName} {selectedRegistration.middleName} {selectedRegistration.lastName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Age</Label>
                      <p className="font-semibold text-gray-900">{selectedRegistration.age} years old</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Gender</Label>
                      <p className="font-semibold text-gray-900">{selectedRegistration.gender}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Civil Status</Label>
                      <p className="font-semibold text-gray-900">{selectedRegistration.civilStatus}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Occupation</Label>
                      <p className="font-semibold text-gray-900">{selectedRegistration.occupation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-orange-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="font-semibold text-gray-900">{selectedRegistration.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <p className="font-semibold text-gray-900 font-mono">{selectedRegistration.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                      <p className="font-semibold text-gray-900">{selectedRegistration.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-orange-500" />
                    Required Photos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedRegistration.documents.map((doc: any) => (
                      <div key={doc.type} className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${doc.status === "submitted" ? "bg-green-50" : "bg-yellow-50"
                              }`}>
                              <ImageIcon className={`h-5 w-5 ${doc.status === "submitted" ? "text-green-600" : "text-yellow-600"
                                }`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.type}</p>
                              <p className="text-sm text-gray-500">
                                {doc.status === "submitted" ? (
                                  <>
                                    {doc.name}
                                    {doc.url && (
                                      <button
                                        onClick={() => setSelectedFile(doc)}
                                        className="ml-2 text-blue-600 hover:text-blue-700 hover:underline"
                                      >
                                        Preview
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  'No image uploaded'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              doc.status === "submitted"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-yellow-200 text-yellow-700 bg-yellow-50"
                            }>
                              {doc.status}
                            </Badge>
                            {doc.status === "submitted" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedFile(doc)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                View Image
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setUploadingDoc(doc.type)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Upload
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Upload Area */}
                        {uploadingDoc === doc.type && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <ImageUpload onImageUpload={handleFileUpload} />
                          </div>
                        )}

                        {/* Image Preview */}
                        {doc.status === "submitted" && doc.url && (
                          <div className="rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={doc.url}
                              alt={doc.type}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rejection Dialog */}
              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent className="sm:max-w-md bg-white">
                  <DialogHeader className="border-b border-gray-100 pb-3">
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                      <X className="h-5 w-5" />
                      Reject Registration
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                      Please provide a reason for rejecting this registration. This will help maintain transparency and record-keeping.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="rejectionReason" className="text-gray-700">Rejection Reason</Label>
                      <Textarea
                        id="rejectionReason"
                        placeholder="Enter the reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="h-32 resize-none border-gray-200 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectDialog(false);
                        setRejectionReason("");
                      }}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectRegistration(selectedRegistration)}
                      disabled={!rejectionReason.trim()}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Confirm Rejection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Action Buttons */}
              <DialogFooter className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Registration
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRegistrationModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleApproveRegistration(selectedRegistration)}
                    className="bg-[#23479A] hover:bg-[#23479A]/90 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve Registration
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* File Viewer Modal */}
      {selectedFile && (
        <FileViewer
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {/* Add Options Modal */}
      <Dialog open={showAddOptionsModal} onOpenChange={setShowAddOptionsModal}>
        <DialogContent className="sm:max-w-md bg-white p-0 gap-0">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Add New Resident
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Choose how you want to add new residents to the system.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="border-t border-gray-100">
            <button
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              onClick={() => {
                setShowAddOptionsModal(false);
                setShowAddModal(true);
              }}
            >
              <div className="h-10 w-10 rounded-full bg-[#23479A]/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-[#23479A]" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Individual Addition</h3>
                <p className="text-sm text-gray-500">
                  Add a single resident with detailed information manually.
                </p>
              </div>
            </button>
          </div>

          <div className="border-t border-gray-100">
            <button
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              onClick={() => {
                setShowAddOptionsModal(false);
                setShowImportModal(true);
              }}
            >
              <div className="h-10 w-10 rounded-full bg-[#23479A]/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-[#23479A]" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Bulk Import</h3>
                <p className="text-sm text-gray-500">
                  Import multiple residents at once using an Excel file.
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="border-b border-gray-100 pb-3">
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-[#23479A]" />
              Import Residents
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Upload an Excel file containing resident information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#23479A] transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileImport(file);
                  }
                }}
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FileUp className="h-8 w-8 text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    Excel files only (*.xlsx, *.xls)
                  </p>
                </div>
              </label>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5" />
              <div>
                <p className="font-medium">Important:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Use our template for correct formatting</li>
                  <li>All required fields must be filled</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full text-[#23479A] border-[#23479A]"
              onClick={() => {
                // Here you would typically provide a template download
                // For now, we'll just show a message
                alert("Template download functionality will be implemented");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b border-gray-100 pb-3">
            <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#23479A]" />
              Add New Resident
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Fill in the resident's information. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">First Name *</Label>
                  <Input
                    id="firstName"
                    value={newResident.firstName}
                    onChange={(e) => setNewResident({ ...newResident, firstName: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-gray-700">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={newResident.middleName}
                    onChange={(e) => setNewResident({ ...newResident, middleName: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter middle name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={newResident.lastName}
                    onChange={(e) => setNewResident({ ...newResident, lastName: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-gray-700">Birth Date *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={newResident.birthDate}
                    onChange={(e) => setNewResident({ ...newResident, birthDate: e.target.value })}
                    className="border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newResident.age}
                    onChange={(e) => setNewResident({ ...newResident, age: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700">Gender *</Label>
                  <Select
                    value={newResident.gender}
                    onValueChange={(value) => setNewResident({ ...newResident, gender: value })}
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="civilStatus" className="text-gray-700">Civil Status *</Label>
                  <Select
                    value={newResident.civilStatus}
                    onValueChange={(value) => setNewResident({ ...newResident, civilStatus: value })}
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select civil status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-gray-700">Occupation *</Label>
                  <Input
                    id="occupation"
                    value={newResident.occupation}
                    onChange={(e) => setNewResident({ ...newResident, occupation: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter occupation"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Contact Information</h3>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">Address *</Label>
                <Input
                  id="address"
                  value={newResident.address}
                  onChange={(e) => setNewResident({ ...newResident, address: e.target.value })}
                  className="border-gray-200"
                  placeholder="Enter complete address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newResident.phone}
                    onChange={(e) => setNewResident({ ...newResident, phone: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newResident.email}
                    onChange={(e) => setNewResident({ ...newResident, email: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact" className="text-gray-700">Contact Person *</Label>
                  <Input
                    id="emergencyContact"
                    value={newResident.emergencyContact}
                    onChange={(e) => setNewResident({ ...newResident, emergencyContact: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone" className="text-gray-700">Contact Number *</Label>
                  <Input
                    id="emergencyPhone"
                    value={newResident.emergencyPhone}
                    onChange={(e) => setNewResident({ ...newResident, emergencyPhone: e.target.value })}
                    className="border-gray-200"
                    placeholder="Enter emergency contact number"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-gray-100 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="border-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddResident}
              className="bg-[#23479A] hover:bg-[#23479A]/90 text-white"
              disabled={
                !newResident.firstName ||
                !newResident.lastName ||
                !newResident.age ||
                !newResident.gender ||
                !newResident.birthDate ||
                !newResident.civilStatus ||
                !newResident.address ||
                !newResident.phone ||
                !newResident.email ||
                !newResident.occupation ||
                !newResident.emergencyContact ||
                !newResident.emergencyPhone
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}