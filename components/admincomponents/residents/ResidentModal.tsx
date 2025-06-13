// components/admincomponents/residents/ResidentModals.tsx
"use client"

import { useState } from "react"
import { BaseModal } from "@/components/shared/modals/BaseModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertCircle,
  X,
  Plus
} from "lucide-react"

// Add Individual Resident Modal
interface AddResidentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function AddResidentModal({ isOpen, onClose, onSubmit }: AddResidentModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    birthDate: "",
    age: "",
    gender: "",
    civilStatus: "",
    nationality: "Filipino",
    religion: "",
    email: "",
    mobileNumber: "",
    emergencyContact: "",
    emergencyNumber: "",
    houseNumber: "",
    street: "",
    purok: "",
    barangay: "Alma Villa",
    city: "Gloria",
    province: "Oriental Mindoro",
    zipCode: "",
    residencyLength: "",
    role: "Resident"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      id: `manual-${Date.now()}`,
      type: "Manual Entry",
      frontId: "",
      backId: "",
      capturedPhoto: "",
      password: "",
      createdAt: new Date().toISOString()
    })
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      birthDate: "",
      age: "",
      gender: "",
      civilStatus: "",
      nationality: "Filipino",
      religion: "",
      email: "",
      mobileNumber: "",
      emergencyContact: "",
      emergencyNumber: "",
      houseNumber: "",
      street: "",
      purok: "",
      barangay: "Alma Villa",
      city: "Gloria",
      province: "Oriental Mindoro",
      zipCode: "",
      residencyLength: "",
      role: "Resident"
    })
    onClose()
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add New Resident" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange("middleName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                value={formData.suffix}
                onChange={(e) => handleInputChange("suffix", e.target.value)}
                placeholder="Jr., Sr., III"
              />
            </div>
            <div>
              <Label htmlFor="birthDate">Birth Date *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="civilStatus">Civil Status *</Label>
              <Select value={formData.civilStatus} onValueChange={(value) => handleInputChange("civilStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select civil status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                placeholder="09XXXXXXXXX"
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact *</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="emergencyNumber">Emergency Number *</Label>
              <Input
                id="emergencyNumber"
                value={formData.emergencyNumber}
                onChange={(e) => handleInputChange("emergencyNumber", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="houseNumber">House Number *</Label>
              <Input
                id="houseNumber"
                value={formData.houseNumber}
                onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="street">Street *</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="purok">Purok *</Label>
              <Input
                id="purok"
                value={formData.purok}
                onChange={(e) => handleInputChange("purok", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="residencyLength">Length of Residency (years) *</Label>
              <Input
                id="residencyLength"
                type="number"
                value={formData.residencyLength}
                onChange={(e) => handleInputChange("residencyLength", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#23479A] hover:bg-[#1e3a82]">
            <Plus className="h-4 w-4 mr-2" />
            Add Resident
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}

// Mass Import Modal
interface MassImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => void
}

export function MassImportModal({ isOpen, onClose, onImport }: MassImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type.includes('csv') || file.type.includes('excel') || file.type.includes('sheet'))) {
      handleFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile)
      setSelectedFile(null)
      onClose()
    }
  }

  const downloadTemplate = () => {
    // Create sample CSV template
    const headers = [
      "firstName", "lastName", "middleName", "suffix", "birthDate", "age", "gender", 
      "civilStatus", "nationality", "religion", "email", "mobileNumber", 
      "emergencyContact", "emergencyNumber", "houseNumber", "street", "purok", 
      "barangay", "city", "province", "zipCode", "residencyLength"
    ]
    
    const sampleData = [
      "Juan", "Dela Cruz", "Santos", "", "1990-01-15", "33", "male", 
      "single", "Filipino", "Catholic", "juan@email.com", "09123456789",
      "Maria Dela Cruz", "09187654321", "123", "Maharlika St", "Purok 1",
      "Alma Villa", "Gloria", "Oriental Mindoro", "5201", "5"
    ]

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "residents_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Mass Import Residents" size="md">
      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Import Instructions</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Use the template for correct column format</li>
                <li>• Required fields must not be empty</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Template */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? "border-[#23479A] bg-blue-50" 
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
        >
          {selectedFile ? (
            <div className="space-y-3">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">Drop your file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile}
            className="bg-[#23479A] hover:bg-[#1e3a82]"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Residents
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}