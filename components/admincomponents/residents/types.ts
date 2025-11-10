// app/components/admincomponents/residents/types.ts

export interface Resident {
  id: string
  lastName: string
  firstName: string
  middleName: string
  suffix: string
  birthDate: string
  age: string
  gender: "male" | "female"
  civilStatus: "single" | "married" | "widowed" | "divorced" | "separated"
  nationality: string
  religion: string
  email: string
  mobileNumber: string
  emergencyContact: string
  emergencyNumber: string
  houseNumber: string
  street: string
  purok: string
  barangay: string
  city: string
  province: string
  zipCode: string
  residencyLength: string
  type: string
  frontId: string
  backId: string
  capturedPhoto: string
  password: string
  role: "Unverified" | "Verified" | "Admin" | "Rejected" | "Inactive"
  createdAt: string
  isActive?: boolean | null
  lastLogin?: string | null
}

export interface ResidentStats {
  total: number
  active: number
  inactive: number
  newThisMonth: number
  maleCount: number
  femaleCount: number
  adminCount: number
}

export interface ResidentFilters {
  search: string
  gender: string
  role: string
  status: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}

export interface ResidentTableProps {
  residents: Resident[]
  selectedResidents: string[]
  onSelect: (id: string, checked: boolean) => void
  onSelectAll: () => void
  onView: (resident: Resident) => void
  onEdit: (resident: Resident) => void
  onDelete: (id: string) => void
  onStatusChange?: (id: string, status: "Active" | "Inactive") => void
}