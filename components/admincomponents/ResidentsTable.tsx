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
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Upload,
  Download,
  MoreHorizontal,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

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
  },
]

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
  status: "Active" | "Inactive"
  dateRegistered: string
  emergencyContact: string
  emergencyPhone: string
}

export default function ResidentsTable() {
  const [residents, setResidents] = useState<Resident[]>(sampleResidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResidents, setSelectedResidents] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [residentToDelete, setResidentToDelete] = useState<string | null>(null)
  const [newResident, setNewResident] = useState<Partial<Resident>>({
    status: "Active",
  })

  const itemsPerPage = 5

  // Filter and search residents
  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = 
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "All" || resident.status === filterStatus
    
    return matchesSearch && matchesFilter
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

  // Handle adding new resident
  const handleAddResident = () => {
    if (!newResident.firstName || !newResident.lastName || !newResident.birthDate) {
      alert("Please fill in all required fields")
      return
    }

    const birthDate = new Date(newResident.birthDate)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    const resident: Resident = {
      id: `RES-${String(residents.length + 1).padStart(3, '0')}`,
      firstName: newResident.firstName || "",
      lastName: newResident.lastName || "",
      middleName: newResident.middleName || "",
      age: age,
      gender: newResident.gender || "Male",
      birthDate: newResident.birthDate || "",
      civilStatus: newResident.civilStatus || "Single",
      address: newResident.address || "",
      phone: newResident.phone || "",
      email: newResident.email || "",
      occupation: newResident.occupation || "",
      status: "Active",
      dateRegistered: new Date().toISOString().split('T')[0],
      emergencyContact: newResident.emergencyContact || "",
      emergencyPhone: newResident.emergencyPhone || "",
    }

    setResidents([...residents, resident])
    setNewResident({ status: "Active" })
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Residents Management</h1>
          <p className="text-gray-600">Manage and track all barangay residents</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Import Residents Data</DialogTitle>
                <DialogDescription>
                  Upload a CSV or Excel file containing residents information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowImportModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowImportModal(false)}>
                    Import
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Resident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle>Add New Resident</DialogTitle>
                <DialogDescription>
                  Fill in the information below to register a new resident
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" placeholder="Enter middle name" />
                </div>
                <div>
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input id="birthDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="civilStatus">Civil Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter complete address" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="09XXXXXXXXX" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" placeholder="Enter occupation" />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="Contact person name" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddModal(false)}>
                  Add Resident
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Residents</p>
                <p className="text-xl font-bold text-gray-900">{residents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">
                  {residents.filter(r => r.status === "Active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-xl font-bold text-gray-900">
                  {residents.filter(r => r.status === "Inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search residents by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedResidents.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedResidents.length} resident(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Active")}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Inactive")}
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                >
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
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedResidents.length === paginatedResidents.length && paginatedResidents.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Resident ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResidents.map((resident) => (
              <TableRow key={resident.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedResidents.includes(resident.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedResidents([...selectedResidents, resident.id])
                      } else {
                        setSelectedResidents(selectedResidents.filter(id => id !== resident.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{resident.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {resident.firstName} {resident.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{resident.middleName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{resident.age} years old</p>
                    <p className="text-sm text-gray-500">{resident.gender}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{resident.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{resident.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{resident.address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={resident.status === "Active" ? "default" : "secondary"}>
                    {resident.status}
                  </Badge>
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
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedResident(resident)
                          setShowViewModal(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(
                          resident.id, 
                          resident.status === "Active" ? "Inactive" : "Active"
                        )}
                      >
                        {resident.status === "Active" ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
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
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResidents.length)} of {filteredResidents.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* View Resident Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Resident Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedResident?.firstName} {selectedResident?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedResident && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="font-medium">
                    {selectedResident.firstName} {selectedResident.middleName} {selectedResident.lastName}
                  </p>
                </div>
                <div>
                  <Label>Age</Label>
                  <p className="font-medium">{selectedResident.age} years old</p>
                </div>
                <div>
                  <Label>Gender</Label>
                  <p className="font-medium">{selectedResident.gender}</p>
                </div>
                <div>
                  <Label>Civil Status</Label>
                  <p className="font-medium">{selectedResident.civilStatus}</p>
                </div>
                <div>
                  <Label>Occupation</Label>
                  <p className="font-medium">{selectedResident.occupation}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Address</Label>
                  <p className="font-medium">{selectedResident.address}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="font-medium">{selectedResident.phone}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="font-medium">{selectedResident.email}</p>
                </div>
                <div>
                  <Label>Emergency Contact</Label>
                  <p className="font-medium">{selectedResident.emergencyContact}</p>
                  <p className="text-sm text-gray-500">{selectedResident.emergencyPhone}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedResident.status === "Active" ? "default" : "secondary"}>
                    {selectedResident.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resident record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => residentToDelete && handleDelete(residentToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}