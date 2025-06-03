"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, X } from "lucide-react"

interface BusinessPermitFormProps {
  onBack: () => void
}

interface FormData {
  // Business Information
  businessName: string
  businessType: string
  businessAddress: string
  contactNumber: string
  emailAddress: string
  
  // Owner Information
  ownerName: string
  ownerAddress: string
  ownerContactNumber: string
  
  // Business Details
  businessActivity: string
  numberOfEmployees: string
  capitalInvestment: string
  operatingHours: string
  
  // Purpose
  purpose: string
}

const sampleData: FormData = {
  businessName: "Juan's Sari-Sari Store",
  businessType: "retail",
  businessAddress: "123 Maharlika Street, Purok 1, Alma Villa",
  contactNumber: "09123456789",
  emailAddress: "juan.store@email.com",
  ownerName: "Juan Dela Cruz",
  ownerAddress: "123 Maharlika Street, Purok 1, Alma Villa",
  ownerContactNumber: "09123456789",
  businessActivity: "General merchandise and food items retail",
  numberOfEmployees: "2",
  capitalInvestment: "50000",
  operatingHours: "6:00 AM - 10:00 PM",
  purpose: "Business permit renewal for continued operation"
}

export default function BusinessPermitForm({ onBack }: BusinessPermitFormProps) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    businessAddress: "",
    contactNumber: "",
    emailAddress: "",
    ownerName: "",
    ownerAddress: "",
    ownerContactNumber: "",
    businessActivity: "",
    numberOfEmployees: "",
    capitalInvestment: "",
    operatingHours: "",
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
    console.log("Business Permit Form submitted:", formData)
    alert("Business permit application submitted successfully!")
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Permit Application</h1>
        <p className="text-sm text-gray-600">Complete the form to apply for a business permit</p>
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
        {/* Business Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Business Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Enter business name"
                className="mt-1"
                required
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleInputChange('businessType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                placeholder="Enter complete business address"
                className="mt-1"
                required
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="Enter contact number"
                className="mt-1"
                required
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="Enter email address"
                className="mt-1"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Owner Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ownerName">Owner Full Name</Label>
              <Input
                id="ownerName"
                placeholder="Enter owner's full name"
                className="mt-1"
                required
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="ownerContactNumber">Owner Contact Number</Label>
              <Input
                id="ownerContactNumber"
                placeholder="Enter owner's contact number"
                className="mt-1"
                required
                value={formData.ownerContactNumber}
                onChange={(e) => handleInputChange('ownerContactNumber', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="ownerAddress">Owner Address</Label>
              <Input
                id="ownerAddress"
                placeholder="Enter owner's complete address"
                className="mt-1"
                required
                value={formData.ownerAddress}
                onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Business Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="businessActivity">Business Activity Description</Label>
              <Textarea
                id="businessActivity"
                placeholder="Describe the nature of your business activities"
                className="mt-1"
                required
                value={formData.businessActivity}
                onChange={(e) => handleInputChange('businessActivity', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="numberOfEmployees">Number of Employees</Label>
              <Input
                id="numberOfEmployees"
                type="number"
                placeholder="Enter number of employees"
                className="mt-1"
                required
                value={formData.numberOfEmployees}
                onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="capitalInvestment">Capital Investment (PHP)</Label>
              <Input
                id="capitalInvestment"
                type="number"
                placeholder="Enter capital investment amount"
                className="mt-1"
                required
                value={formData.capitalInvestment}
                onChange={(e) => handleInputChange('capitalInvestment', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input
                id="operatingHours"
                placeholder="e.g., 8:00 AM - 6:00 PM, Monday to Saturday"
                className="mt-1"
                required
                value={formData.operatingHours}
                onChange={(e) => handleInputChange('operatingHours', e.target.value)}
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
              placeholder="State the purpose for this business permit application"
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
            <Label>Upload Supporting Documents</Label>
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