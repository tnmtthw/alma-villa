"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface CedulaFormProps {
  onBackAction: () => void
}

interface FormData {
  // Personal Information
  lastName: string
  firstName: string
  middleName: string
  suffix: string
  birthDate: string
  birthPlace: string
  age: string
  gender: string
  civilStatus: string
  nationality: string
  
  // Contact Information
  address: string
  contactNumber: string
  
  // Employment Information
  profession: string
  employer: string
  employerAddress: string
  monthlyIncome: string
  
  // Tax Information
  tinNumber: string
  ctcNumber: string
  
  // Purpose
  purpose: string
}

const sampleData: FormData = {
  lastName: "Dela Cruz",
  firstName: "Juan",
  middleName: "Santos",
  suffix: "",
  birthDate: "1990-01-15",
  birthPlace: "Gloria, Oriental Mindoro",
  age: "33",
  gender: "male",
  civilStatus: "single",
  nationality: "Filipino",
  address: "123 Maharlika Street, Purok 1, Alma Villa, Gloria, Oriental Mindoro",
  contactNumber: "09123456789",
  profession: "Store Owner",
  employer: "Self-employed",
  employerAddress: "123 Maharlika Street, Purok 1, Alma Villa",
  monthlyIncome: "25000",
  tinNumber: "123-456-789-000",
  ctcNumber: "12345678",
  purpose: "For employment requirements"
}

export default function CedulaForm({ onBackAction }: CedulaFormProps) {
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    birthDate: "",
    birthPlace: "",
    age: "",
    gender: "",
    civilStatus: "",
    nationality: "",
    address: "",
    contactNumber: "",
    profession: "",
    employer: "",
    employerAddress: "",
    monthlyIncome: "",
    tinNumber: "",
    ctcNumber: "",
    purpose: ""
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Handle form submission
    console.log("Cedula Form submitted:", formData)
    alert("Cedula application submitted successfully!")
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Community Tax Certificate (Cedula) Application</h1>
        <p className="text-sm text-gray-600">Complete the form to apply for a Community Tax Certificate</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                className="mt-1"
                required
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="birthPlace">Place of Birth</Label>
              <Input
                id="birthPlace"
                placeholder="Enter place of birth"
                className="mt-1"
                required
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              />
            </div>

            <div>
              <Label>Gender</Label>
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
              <Label>Civil Status</Label>
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
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="address">Complete Address</Label>
              <Input
                id="address"
                placeholder="Enter complete address"
                className="mt-1"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="Enter contact number"
                className="mt-1"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Employment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="profession">Profession/Occupation</Label>
              <Input
                id="profession"
                placeholder="Enter profession or occupation"
                className="mt-1"
                required
                value={formData.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="employer">Employer/Business Name</Label>
              <Input
                id="employer"
                placeholder="Enter employer or business name"
                className="mt-1"
                value={formData.employer}
                onChange={(e) => handleInputChange('employer', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="employerAddress">Employer Address</Label>
              <Input
                id="employerAddress"
                placeholder="Enter employer address"
                className="mt-1"
                value={formData.employerAddress}
                onChange={(e) => handleInputChange('employerAddress', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (PHP)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="Enter monthly income"
                className="mt-1"
                required
                value={formData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Tax Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="tinNumber">TIN Number (if available)</Label>
              <Input
                id="tinNumber"
                placeholder="Enter TIN number"
                className="mt-1"
                value={formData.tinNumber}
                onChange={(e) => handleInputChange('tinNumber', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="ctcNumber">Previous CTC Number (if renewal)</Label>
              <Input
                id="ctcNumber"
                placeholder="Enter previous CTC number"
                className="mt-1"
                value={formData.ctcNumber}
                onChange={(e) => handleInputChange('ctcNumber', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Purpose</h2>
          
          <div>
            <Label htmlFor="purpose">Purpose of Application</Label>
            <Textarea
              id="purpose"
              placeholder="State the purpose for this cedula application"
              className="mt-1"
              required
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
            />
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