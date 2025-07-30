"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ResidentInfoProps {
  onNextAction: () => void
}

interface FormData {
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
  birthDate: string;
  age: string;
  gender: string;
  civilStatus: string;
  nationality: string;
  religion: string;
  email: string;
  mobileNumber: string;
  emergencyContact: string;
  emergencyNumber: string;
  houseNumber: string; // Keep for backend compatibility but don't display
  street: string;
  purok: string; // Keep as purok for backend compatibility (display as Sitio)
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  residencyLength: string;
}

const initialFormData: FormData = {
  lastName: "",
  firstName: "",
  middleName: "",
  suffix: "",
  birthDate: "",
  age: "",
  gender: "",
  civilStatus: "",
  nationality: "",
  religion: "",
  email: "",
  mobileNumber: "",
  emergencyContact: "",
  emergencyNumber: "",
  houseNumber: "N/A", // Hidden field - set default value for backend
  street: "N/A", // Hidden field - set default value for backend
  purok: "", // Keep as purok for backend compatibility
  barangay: "Alma Villa", // Default value
  city: "Gloria", // Auto-filled municipality
  province: "Oriental Mindoro", // Auto-filled province
  zipCode: "5209", // Auto-filled ZIP code
  residencyLength: ""
}

const sampleData: FormData = {
  lastName: "Dela Cruz",
  firstName: "Juan",
  middleName: "Santos", // Optional
  suffix: "",
  birthDate: "1990-01-15",
  age: "35", // Will be calculated automatically
  gender: "male",
  civilStatus: "single",
  nationality: "Filipino",
  religion: "Catholic",
  email: "juan.delacruz@email.com",
  mobileNumber: "+639123456789", // 11 digits with +63
  emergencyContact: "Maria Dela Cruz",
  emergencyNumber: "+639187654321",
  houseNumber: "N/A", // Hidden field - set default value for backend
  street: "N/A", // Hidden field - set default value for backend
  purok: "Sitio 1", // Keep as purok for backend compatibility
  barangay: "Alma Villa", // Default value
  city: "Gloria", // Auto-filled municipality
  province: "Oriental Mindoro", // Auto-filled province
  zipCode: "5209", // Auto-filled ZIP code
  residencyLength: "5"
}

export default function ResidentInfo({ onNextAction }: ResidentInfoProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isClient, setIsClient] = useState(false)
  const [isMinor, setIsMinor] = useState(false)

  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
    
    // Load saved data from localStorage only on client-side
    const savedData = localStorage.getItem('residentInfoData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Ensure auto-filled fields maintain their values
        const updatedData = {
          ...parsedData,
          barangay: "Alma Villa",
          city: "Gloria",
          province: "Oriental Mindoro",
          zipCode: "5209",
          houseNumber: parsedData.houseNumber || "N/A",
          street: parsedData.street || "N/A"
        }
        setFormData(updatedData)
        
        // Check if the loaded data shows a minor
        if (updatedData.birthDate) {
          const age = calculateAge(updatedData.birthDate)
          setIsMinor(parseInt(age) < 18)
        }
      } catch (error) {
        console.error('Error parsing saved resident data:', error)
      }
    }
  }, [])

  // Save to localStorage whenever form data changes (only on client-side)
  useEffect(() => {
    if (isClient) {
      // Ensure critical fields are always maintained during data updates
      const dataToSave = {
        ...formData,
        houseNumber: formData.houseNumber || "N/A", // Ensure this is never empty
        street: formData.street || "N/A", // Ensure this is never empty
        barangay: "Alma Villa", // Always enforce correct barangay
        city: "Gloria", // Always enforce correct municipality
        province: "Oriental Mindoro", // Always enforce correct province
        zipCode: "5209" // Always enforce correct ZIP
      }
      localStorage.setItem('residentInfoData', JSON.stringify(dataToSave))
    }
  }, [formData, isClient])

  // Calculate age automatically when birthDate changes
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return ""
    
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age.toString()
  }

  // Format mobile number with +63 and numbers only
  const formatMobileNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // If it starts with 63, keep it as is
    if (digits.startsWith('63')) {
      const withoutCountryCode = digits.slice(2)
      // Limit to 10 digits after country code (total 12: +63 + 10)
      const limited = withoutCountryCode.slice(0, 10)
      return `+63${limited}`
    }
    
    // If it starts with 0, replace with +63
    if (digits.startsWith('0')) {
      const withoutZero = digits.slice(1)
      // Limit to 10 digits after removing 0 (total 11: +63 + 10)
      const limited = withoutZero.slice(0, 10)
      return `+63${limited}`
    }
    
    // If it's just digits, add +63
    // Limit to 10 digits (total 11: +63 + 10)
    const limited = digits.slice(0, 10)
    return limited ? `+63${limited}` : ""
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    if (id === 'birthDate') {
      const age = calculateAge(value)
      const calculatedAge = parseInt(age)
      
      // Check if the person is a minor (under 18)
      setIsMinor(calculatedAge < 18 && calculatedAge > 0)
      
      setFormData(prev => ({
        ...prev,
        [id]: value,
        age: age
      }))
    } else if (id === 'mobileNumber' || id === 'emergencyNumber') {
      const formatted = formatMobileNumber(value)
      setFormData(prev => ({
        ...prev,
        [id]: formatted
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }))
    }
  }

  const handleSelectChange = (value: string, id: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const isFormValid = () => {
    const requiredFields = [
      'lastName',
      'firstName',
      // middleName is optional
      'birthDate',
      'age',
      'gender',
      'civilStatus',
      'nationality',
      'religion',
      'email',
      'emergencyContact',
      'emergencyNumber',
      // houseNumber and street are auto-filled, don't validate user input
      'purok', // Keep as purok for backend compatibility
      // barangay, city, province, zipCode are auto-filled, don't validate user input
      'residencyLength'
    ]

    // Validate user-inputted fields only
    const userFieldsValid = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData]
      return value !== undefined && value !== null && value.toString().trim() !== ''
    })

    // Ensure auto-filled fields are present (they should always be)
    const autoFieldsPresent = 
      formData.barangay === "Alma Villa" &&
      formData.city === "Gloria" &&
      formData.province === "Oriental Mindoro" &&
      formData.zipCode === "5209" &&
      (formData.houseNumber === "N/A" || formData.houseNumber !== "") &&
      (formData.street === "N/A" || formData.street !== "")

    // Don't allow proceed if user is a minor
    return userFieldsValid && autoFieldsPresent && !isMinor
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Double-check if user is minor before proceeding
    if (isMinor) {
      return // Prevent form submission
    }
    
    // Ensure all required backend fields are properly set before proceeding
    const completeFormData = {
      ...formData,
      // Ensure these fields are always set for backend compatibility
      houseNumber: formData.houseNumber || "N/A", // Default for hidden field
      street: formData.street || "N/A", // Default for hidden field
      barangay: "Alma Villa", // Fixed barangay
      city: "Gloria", // Fixed municipality  
      province: "Oriental Mindoro", // Fixed province
      zipCode: "5209" // Fixed ZIP code
    }
    
    // Update the stored data with complete information
    if (isClient) {
      localStorage.setItem('residentInfoData', JSON.stringify(completeFormData))
    }
    
    // Log for verification during development (remove in production)
    console.log('Registration Data Being Collected:', completeFormData)
    
    onNextAction()
  }

  const fillWithSampleData = () => {
    setFormData(sampleData)
    // Check if sample data shows a minor
    const age = parseInt(sampleData.age)
    setIsMinor(age < 18)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2px] shadow-lg p-6 max-w-[1100px] mx-auto">
      <div className="border-b border-gray-200/50 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-500 mt-1">Please fill in all required information accurately.</p>
        <Button
          type="button"
          onClick={fillWithSampleData}
          variant="outline"
          className="mt-2 text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
        >
          Fill with Sample Data
        </Button>
      </div>

      {/* Minor Age Warning */}
      {isMinor && (
        <div className="mb-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>You are not of legal age.</strong> Registration is only available for individuals who are 18 years old or above. 
              Please contact the barangay office directly for assistance if you need services as a minor.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <form className="space-y-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Personal Details */}
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[2px] shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-[#23479A] text-white w-6 h-6 rounded-full text-sm flex items-center justify-center mr-2">1</span>
                Personal Details
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    className="mt-1"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    className="mt-1"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="middleName">Middle Name (Optional)</Label>
                  <Input
                    id="middleName"
                    placeholder="Enter middle name"
                    className="mt-1"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    placeholder="Jr., Sr., III, etc."
                    className="mt-1"
                    value={formData.suffix}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    className={`mt-1 ${isMinor ? 'border-red-300 focus:border-red-500' : ''}`}
                    required
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    max="2025-12-31"
                  />
                  {isMinor && formData.birthDate && (
                    <p className="text-xs text-red-600 mt-1">
                      Age must be 18 or above to register
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    className={`mt-1 bg-gray-100 ${isMinor ? 'border-red-300' : ''}`}
                    required
                    value={formData.age}
                    readOnly
                    placeholder="Calculated from birth date"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange(value, 'gender')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="civilStatus">Civil Status</Label>
                  <Select
                    value={formData.civilStatus}
                    onValueChange={(value) => handleSelectChange(value, 'civilStatus')}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                      <SelectItem value="separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    placeholder="Enter nationality"
                    className="mt-1"
                    required
                    value={formData.nationality}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="religion">Religion</Label>
                  <Input
                    id="religion"
                    placeholder="Enter religion"
                    className="mt-1"
                    required
                    value={formData.religion}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact and Address Information */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[2px] shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-[#23479A] text-white w-6 h-6 rounded-full text-sm flex items-center justify-center mr-2">2</span>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className="mt-1"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number (Optional)</Label>
                  <Input
                    id="mobileNumber"
                    placeholder="+639123456789 (11 digits)"
                    className="mt-1"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    maxLength={13} // +63 + 10 digits
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: +63 followed by 10 digits</p>
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Person</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Enter full name"
                    className="mt-1"
                    required
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyNumber">Emergency Contact Number</Label>
                  <Input
                    id="emergencyNumber"
                    placeholder="+639123456789 (11 digits)"
                    className="mt-1"
                    required
                    value={formData.emergencyNumber}
                    onChange={handleInputChange}
                    maxLength={13} // +63 + 10 digits
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: +63 followed by 10 digits</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-[2px] shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-[#23479A] text-white w-6 h-6 rounded-full text-sm flex items-center justify-center mr-2">3</span>
                Address Information
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label htmlFor="purok">Sitio</Label>
                  <Input
                    id="purok"
                    placeholder="Enter sitio"
                    className="mt-1"
                    required
                    value={formData.purok}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="barangay">Barangay</Label>
                  <Input
                    id="barangay"
                    className="mt-1 bg-gray-100"
                    required
                    value={formData.barangay}
                    readOnly
                    placeholder="Alma Villa"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default barangay name</p>
                </div>
                <div>
                  <Label htmlFor="city">Municipality</Label>
                  <Input
                    id="city"
                    className="mt-1 bg-gray-100"
                    required
                    value={formData.city}
                    readOnly
                    placeholder="Gloria"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default municipality name</p>
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    className="mt-1 bg-gray-100"
                    required
                    value={formData.province}
                    readOnly
                    placeholder="Oriental Mindoro"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default province name</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      className="mt-1 bg-gray-100"
                      required
                      value={formData.zipCode}
                      readOnly
                      placeholder="5209"
                    />
                    <p className="text-xs text-gray-500 mt-1">Default ZIP code</p>
                  </div>
                  <div>
                    <Label htmlFor="residencyLength">Length of Residency (years)</Label>
                    <Input
                      id="residencyLength"
                      type="number"
                      className="mt-1"
                      required
                      value={formData.residencyLength}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200/50">
          <Button
            type="submit"
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`rounded-[2px] px-8 ${
              isMinor 
                ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                : "bg-[#23479A] hover:bg-[#23479A]/90"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isMinor ? "You must be 18 or older to proceed" : ""}
          >
            Next Step
          </Button>
        </div>
      </form>
    </div>
  )
}