"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload, X, FileText, Building, User } from "lucide-react"

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
    // Handle form submission
    console.log("Business Permit Form submitted:", formData)
    alert("Business permit application submitted successfully!")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#23479A]/10 rounded-lg">
                <Building className="h-6 w-6 text-[#23479A]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#23479A]">Business Permit Application</CardTitle>
                <CardDescription>Complete the form to apply for a business permit</CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Badge variant="outline" className="text-[#23479A] border-[#23479A]">
              Fee: ₱200
            </Badge>
            <Badge variant="outline">
              Processing: 3-5 days
            </Badge>
            <Button
              type="button"
              onClick={fillWithSampleData}
              variant="outline"
              size="sm"
            >
              Fill Sample Data
            </Button>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-[#23479A]" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Enter business name"
                  required
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
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

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="businessAddress">Business Address *</Label>
                <Input
                  id="businessAddress"
                  placeholder="Enter complete business address"
                  required
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  placeholder="Enter contact number"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#23479A]" />
              Owner Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Full Name *</Label>
                <Input
                  id="ownerName"
                  placeholder="Enter owner's full name"
                  required
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerContactNumber">Owner Contact Number *</Label>
                <Input
                  id="ownerContactNumber"
                  placeholder="Enter owner's contact number"
                  required
                  value={formData.ownerContactNumber}
                  onChange={(e) => handleInputChange('ownerContactNumber', e.target.value)}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="ownerAddress">Owner Address *</Label>
                <Input
                  id="ownerAddress"
                  placeholder="Enter owner's complete address"
                  required
                  value={formData.ownerAddress}
                  onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#23479A]" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessActivity">Business Activity Description *</Label>
              <Textarea
                id="businessActivity"
                placeholder="Describe the nature of your business activities"
                className="min-h-[100px]"
                required
                value={formData.businessActivity}
                onChange={(e) => handleInputChange('businessActivity', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                <Input
                  id="numberOfEmployees"
                  type="number"
                  placeholder="Enter number of employees"
                  required
                  value={formData.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capitalInvestment">Capital Investment (PHP) *</Label>
                <Input
                  id="capitalInvestment"
                  type="number"
                  placeholder="Enter capital investment amount"
                  required
                  value={formData.capitalInvestment}
                  onChange={(e) => handleInputChange('capitalInvestment', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingHours">Operating Hours *</Label>
              <Input
                id="operatingHours"
                placeholder="e.g., 8:00 AM - 6:00 PM, Monday to Saturday"
                required
                value={formData.operatingHours}
                onChange={(e) => handleInputChange('operatingHours', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle>Purpose of Application</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="State the purpose for this business permit application"
                required
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Supporting Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
            <CardDescription>
              Upload any required documents such as business registration, location map, etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="supportingDocs"
                      className="relative cursor-pointer rounded-md font-medium text-[#23479A] hover:text-[#23479A]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#23479A]/20"
                    >
                      <span>Upload files</span>
                      <input
                        id="supportingDocs"
                        name="supportingDocs"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, PNG, JPG up to 10MB each</p>
                </div>
              </div>

              {supportingDocs.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  <div className="space-y-2">
                    {supportingDocs.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
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
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                * Required fields must be completed before submission
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#23479A] hover:bg-[#23479A]/90"
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}