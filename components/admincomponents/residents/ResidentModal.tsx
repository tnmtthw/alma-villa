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
    purok: "Purok 1",
    barangay: "Alma Villa",
    city: "Gloria",
    province: "Oriental Mindoro",
    zipCode: "5209",
    residencyLength: "",
    role: "Verified"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      type: "Manual Entry",
      frontId: "",
      backId: "",
      capturedPhoto: "",
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
      role: "Verified"
    })
    onClose()
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add New Resident" size="xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                Middle Name
              </Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange("middleName", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix" className="text-sm font-medium text-gray-700">
                Suffix
              </Label>
              <Input
                id="suffix"
                value={formData.suffix}
                onChange={(e) => handleInputChange("suffix", e.target.value)}
                placeholder="Jr., Sr., III"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                Birth Date *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-gray-700">
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                Gender *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="civilStatus" className="text-sm font-medium text-gray-700">
                Civil Status *
              </Label>
              <Select value={formData.civilStatus} onValueChange={(value) => handleInputChange("civilStatus", value)}>
                <SelectTrigger className="w-full">
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
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-sm font-medium text-gray-700">
                Nationality
              </Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion" className="text-sm font-medium text-gray-700">
                Religion
              </Label>
              <Input
                id="religion"
                value={formData.religion}
                onChange={(e) => handleInputChange("religion", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
                Mobile Number
              </Label>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                placeholder="09XXXXXXXXX"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
                Emergency Contact *
              </Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyNumber" className="text-sm font-medium text-gray-700">
                Emergency Number *
              </Label>
              <Input
                id="emergencyNumber"
                value={formData.emergencyNumber}
                onChange={(e) => handleInputChange("emergencyNumber", e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="space-y-2">
              <Label htmlFor="houseNumber" className="text-sm font-medium text-gray-700">
                House Number *
              </Label>
              <Input
                id="houseNumber"
                value={formData.houseNumber}
                onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                Street *
              </Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                required
                className="w-full"
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="purok" className="text-sm font-medium text-gray-700">
                Sitio *
              </Label>
              <Input
                id="purok"
                value={formData.purok}
                onChange={(e) => handleInputChange("purok", e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barangay" className="text-sm font-medium text-gray-700">
                Barangay
              </Label>
              <Input
                id="barangay"
                value={formData.barangay}
                onChange={(e) => handleInputChange("barangay", e.target.value)}
                className="w-full bg-gray-50"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full bg-gray-50"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                Province
              </Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => handleInputChange("province", e.target.value)}
                className="w-full bg-gray-50"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                ZIP Code *
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                required
                className="w-full"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="residencyLength" className="text-sm font-medium text-gray-700">
                Length of Residency (years) *
              </Label>
              <Input
                id="residencyLength"
                type="number"
                value={formData.residencyLength}
                onChange={(e) => handleInputChange("residencyLength", e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#23479A] hover:bg-[#1e3a82] px-6 py-2 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
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
      <div className="space-y-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900 text-base">
                Import Instructions
              </h4>
              <ul className="text-sm text-blue-800 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Supported formats: CSV, Excel (.xlsx, .xls)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Maximum file size: 10MB</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Use the template for correct column format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Required fields must not be empty</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Template */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="border-green-300 text-green-700 hover:bg-green-50 px-6 py-3 flex items-center gap-3"
          >
            <Download className="h-5 w-5" />
            Download CSV Template
          </Button>
        </div>

        {/* File Upload Area */}
        <div className="relative">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${dragOver
              ? "border-[#23479A] bg-blue-50 scale-105"
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
              <div className="space-y-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove File
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-900">
                    Drop your file here
                  </p>
                  <p className="text-base text-gray-500">
                    or click to browse files
                  </p>
                </div>
              </div>
            )}

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile}
            className="bg-[#23479A] hover:bg-[#1e3a82] disabled:bg-gray-300 disabled:cursor-not-allowed px-6 py-2 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Residents
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}