"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, X } from "lucide-react"

interface BarangayClearanceFormProps {
  onBackAction: () => void
}

interface FormData {
  // Personal Information
  lastName: string
  firstName: string
  middleName: string
  suffix: string
  birthDate: string
  age: string
  gender: string
  civilStatus: string
  nationality: string
  
  // Address Information
  houseNumber: string
  street: string
  purok: string
  barangay: string
  city: string
  province: string
  zipCode: string
  residencyLength: string
  
  // Contact Information
  contactNumber: string
  emailAddress: string
  
  // Purpose
  purpose: string
  urgency: string
  additionalInfo: string
}

const sampleData: FormData = {
  lastName: "Dela Cruz",
  firstName: "Juan",
  middleName: "Santos",
  suffix: "",
  birthDate: "1990-01-15",
  age: "33",
  gender: "male",
  civilStatus: "single",
  nationality: "Filipino",
  houseNumber: "123",
  street: "Maharlika Street",
  purok: "Purok 1",
  barangay: "Alma Villa",
  city: "Gloria",
  province: "Oriental Mindoro",
  zipCode: "5204",
  residencyLength: "5",
  contactNumber: "09123456789",
  emailAddress: "juan.delacruz@email.com",
  purpose: "employment",
  urgency: "normal",
  additionalInfo: "Required for submission to HR department by end of month"
}

export default function BarangayClearanceForm({ onBackAction }: BarangayClearanceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    birthDate: "",
    age: "",
    gender: "",
    civilStatus: "",
    nationality: "",
    houseNumber: "",
    street: "",
    purok: "",
    barangay: "",
    city: "",
    province: "",
    zipCode: "",
    residencyLength: "",
    contactNumber: "",
    emailAddress: "",
    purpose: "",
    urgency: "",
    additionalInfo: ""
  })

  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setSupportingDocs([...supportingDocs, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setSupportingDocs(supportingDocs.filter((_, i) => i !== index))
  }

  const fillWithSampleData = () => {
    setFormData(sampleData)
  }

  // Auto-calculate age when birth date changes
  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age.toString()
  }

  const handleBirthDateChange = (value: string) => {
    handleInputChange('birthDate', value)
    if (value) {
      const calculatedAge = calculateAge(value)
      handleInputChange('age', calculatedAge)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Handle form submission
    console.log("Barangay Clearance Form submitted:", formData)
    alert("Barangay clearance application submitted successfully!")
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Barangay Clearance Application</h1>
        <p className="text-sm text-gray-600">Complete the form to apply for a barangay clearance certificate</p>
      </div>

      <Button
        type="button"
        onClick={fillWithSampleData}
        variant="outline"
        className="mb-6 border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
      >
        Fill with Sample Data
      </Button>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                className="mt-1"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                className="mt-1"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                placeholder="Enter middle name"
                className="mt-1"
                required
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                placeholder="Jr., Sr., III, etc."
                className="mt-1"
                value={formData.suffix}
                onChange={(e) => handleInputChange('suffix', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Date of Birth</Label>
              <Input
                id="birthDate"
                type="date"
                className="mt-1"
                required
                value={formData.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                className="mt-1"
                required
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                readOnly={!!formData.birthDate}
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
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
              <Label htmlFor="civilStatus">Civil Status</Label>
              <Select
                value={formData.civilStatus}
                onValueChange={(value) => handleInputChange('civilStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                placeholder="Enter nationality"
                className="mt-1"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Address Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="houseNumber">House/Unit Number</Label>
              <Input
                id="houseNumber"
                placeholder="Enter house number"
                className="mt-1"
                required
                value={formData.houseNumber}
                onChange={(e) => handleInputChange('houseNumber', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="street">Street Name</Label>
              <Input
                id="street"
                placeholder="Enter street name"
                className="mt-1"
                required
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="purok">Purok/Zone</Label>
              <Input
                id="purok"
                placeholder="Enter purok/zone"
                className="mt-1"
                required
                value={formData.purok}
                onChange={(e) => handleInputChange('purok', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="barangay">Barangay</Label>
              <Input
                id="barangay"
                placeholder="Enter barangay"
                className="mt-1"
                required
                value={formData.barangay}
                onChange={(e) => handleInputChange('barangay', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="city">City/Municipality</Label>
              <Input
                id="city"
                placeholder="Enter city"
                className="mt-1"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                placeholder="Enter province"
                className="mt-1"
                required
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="Enter ZIP code"
                className="mt-1"
                required
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="residencyLength">Length of Residency (years)</Label>
              <Input
                id="residencyLength"
                type="number"
                placeholder="Years"
                className="mt-1"
                required
                value={formData.residencyLength}
                onChange={(e) => handleInputChange('residencyLength', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="09XXXXXXXXX"
                className="mt-1"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="your@email.com"
                className="mt-1"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Purpose</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="purpose">Purpose of Clearance</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange('purpose', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employment">Employment/Job Application</SelectItem>
                  <SelectItem value="scholarship">Scholarship Application</SelectItem>
                  <SelectItem value="visa">Visa Application/Travel</SelectItem>
                  <SelectItem value="bank">Bank Account Opening</SelectItem>
                  <SelectItem value="loan">Loan Application</SelectItem>
                  <SelectItem value="legal">Legal Proceedings</SelectItem>
                  <SelectItem value="business">Business Registration</SelectItem>
                  <SelectItem value="school">School Enrollment</SelectItem>
                  <SelectItem value="insurance">Insurance Claims</SelectItem>
                  <SelectItem value="government">Government Requirements</SelectItem>
                  <SelectItem value="other">Other Purpose</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => handleInputChange('urgency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (1-2 days)</SelectItem>
                  <SelectItem value="urgent">Urgent (Same day)</SelectItem>
                  <SelectItem value="rush">Rush (Within hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Please provide any additional details about your request..."
                className="mt-1"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Supporting Documents</h2>
          
          <div>
            <Label>Upload Supporting Documents (Optional)</Label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <label
                    htmlFor="supportingDocs"
                    className="relative cursor-pointer rounded-md font-medium text-[#23479A] hover:text-[#23479A]/80"
                  >
                    <span>Upload files</span>
                    <input
                      id="supportingDocs"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
              </div>
            </div>

            {supportingDocs.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                {supportingDocs.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <Button
                      type="button"
                      onClick={() => removeFile(index)}
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white px-8"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}