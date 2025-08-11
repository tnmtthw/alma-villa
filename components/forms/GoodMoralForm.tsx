"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText } from "lucide-react"

interface GoodMoralFormProps {
  onSubmit: (formData: any) => void
  onBackAction: () => void
}

interface FormData {
  // Personal Information
  fullName: string
  dateOfBirth: string
  placeOfBirth: string
  civilStatus: string
  age: string
  citizenship: string
  residentOf: string
  
  // Purpose and supporting info
  purpose: string
  urgentRequest: boolean
  attachments: File[]
}

const sampleData: FormData = {
  fullName: "Maria Santos Cruz",
  dateOfBirth: "1985-08-15",
  placeOfBirth: "Gloria, Oriental Mindoro",
  civilStatus: "married",
  age: "38",
  citizenship: "Filipino",
  residentOf: "Purok 2",
  purpose: "Employment requirements",
  urgentRequest: false,
  attachments: []
}

// PDF Generation Function
const generateGoodMoralCertificatePDF = (data: FormData) => {
  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()
  
  const content = `
CERTIFICATE OF GOOD MORAL CHARACTER

TO WHOM IT MAY CONCERN:

This is to certify that ${data.fullName}, known to be of the following:

Date of Birth: ${data.dateOfBirth}
Place of Birth: ${data.placeOfBirth}
Civil Status: ${data.civilStatus}
Age: ${data.age}
Citizenship: ${data.citizenship}

A resident of ${data.residentOf}, Barangay Alma Villa, Gloria Oriental Mindoro.

This further certifies that undersigned is concerned, above name subject is a person of GOOD MORAL and INTEGRITY and has NO DEROGATORY records and NO PENDING CASE in Barangay Alma Villa.

This Certification is being issued upon the request of the party concerned for whatever legal purposes.

Issued this ${day} of ${month}, ${year} at Barangay Alma Villa, Gloria Oriental Mindoro.

                    _____________________
                    BARANGAY CAPTAIN

Document Fee: ₱50
Processing Time: 1-2 days
Purpose: ${data.purpose}
${data.urgentRequest ? 'URGENT REQUEST - Priority processing requested' : ''}

Submitted: ${new Date().toLocaleString()}
  `
  
  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `good-moral-certificate-${data.fullName.replace(/\s+/g, '-')}-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function GoodMoralForm({ onSubmit, onBackAction }: GoodMoralFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    civilStatus: "",
    age: "",
    citizenship: "Filipino",
    residentOf: "",
    purpose: "",
    urgentRequest: false,
    attachments: []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)]
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Generate PDF for admin
      generateGoodMoralCertificatePDF(formData)
      
      // Submit form data
      await onSubmit({
        documentType: "good-moral-character",
        formData,
        submittedAt: new Date().toISOString()
      })
      
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillSampleData = () => {
    setFormData(sampleData)
  }

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Certificate of Good Moral Character Application Form</CardTitle>
          <Button
            type="button"
            onClick={fillSampleData}
            variant="outline"
            className="text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
          >
            Fill Sample Data
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Please provide your personal information for the Certificate of Good Moral Character.
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                  placeholder="Enter your complete name"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                <Input
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                  required
                  placeholder="City/Municipality, Province"
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
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Civil Status *</Label>
                <Select
                  value={formData.civilStatus}
                  onValueChange={(value) => handleInputChange("civilStatus", value)}
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
                <Label htmlFor="citizenship">Citizenship *</Label>
                <Input
                  id="citizenship"
                  value={formData.citizenship}
                  onChange={(e) => handleInputChange("citizenship", e.target.value)}
                  required
                  placeholder="Filipino"
                />
              </div>
              <div>
                <Label htmlFor="residentOf">Resident of *</Label>
                <Input
                  id="residentOf"
                  value={formData.residentOf}
                  onChange={(e) => handleInputChange("residentOf", e.target.value)}
                  required
                  placeholder="Street/Purok within Barangay Alma Villa"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter specific street or purok (Barangay Alma Villa will be added automatically)
                </p>
              </div>
            </div>
          </div>

          {/* Purpose Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Certificate Purpose</h3>
            
            <div>
              <Label htmlFor="purpose">Purpose of This Certificate *</Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                required
                placeholder="e.g., Employment requirements, Scholarship application, etc."
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Supporting Documents</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer rounded-md font-medium text-[#23479A] hover:text-[#23479A]/80"
                  >
                    <span>Upload supporting documents</span>
                    <Input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </Label>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Valid ID, Birth Certificate, etc. - PDF, JPG, PNG, DOC up to 10MB each
                </p>
              </div>
            </div>

            {/* Uploaded Files Display */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files:</Label>
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeFile(index)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgent Request Option */}
          <div className="flex items-center space-x-2">
            <input
              id="urgentRequest"
              type="checkbox"
              checked={formData.urgentRequest}
              onChange={(e) => handleInputChange("urgentRequest", e.target.checked)}
              className="rounded border-gray-300 text-[#23479A] focus:ring-[#23479A]"
            />
            <Label htmlFor="urgentRequest" className="text-sm">
              This is an urgent request requiring immediate processing
            </Label>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notice:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• All information provided must be true and accurate</li>
              <li>• False statements may result in legal consequences</li>
              <li>• This certificate verifies good moral character and no pending cases</li>
              <li>• You may be required to provide additional verification</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={onBackAction}
              variant="outline"
            >
              Back
            </Button>
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
      </CardContent>
    </Card>
  )
}
