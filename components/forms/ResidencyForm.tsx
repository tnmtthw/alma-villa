"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, FileText } from "lucide-react"

interface ResidencyFormProps {
  onSubmit: (formData: any) => void
  onBackAction: () => void
}

interface FormData {
  fullName: string
  address: string
  contactNumber: string
  email: string
  purpose: string
  dateOfResidency: string
  previousAddress: string
  urgentRequest: boolean
  attachments: File[]
}

// PDF Generation Function
const generateResidencyCertificatePDF = (data: FormData) => {
  const content = `
REPUBLIC OF THE PHILIPPINES
Province of Oriental Mindoro
Municipality of Gloria
BARANGAY ALMA VILLA

CERTIFICATE OF RESIDENCY

TO WHOM IT MAY CONCERN:

This is to certify that ${data.fullName} is a bonafide resident of ${data.address}, Barangay Alma Villa, Gloria, Oriental Mindoro.

The above-named person has been residing in this barangay since ${new Date(data.dateOfResidency).toLocaleDateString()}.

${data.previousAddress ? `Previous Address: ${data.previousAddress}` : ''}

This certification is issued upon the request of the interested party for ${data.purpose}.

Contact Information:
Email: ${data.email}
Phone: ${data.contactNumber}

Given this ${new Date().getDate()}th day of ${new Date().toLocaleString('default', { month: 'long' })}, ${new Date().getFullYear()}.

                                    _____________________
                                    BARANGAY CAPTAIN
                                    Barangay Alma Villa

Document Fee: ₱30.00
Processing Time: 1 day
${data.urgentRequest ? 'URGENT REQUEST - Additional processing fee may apply' : ''}

Submitted: ${new Date().toLocaleString()}
  `
  
  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `certificate-of-residency-${data.fullName.replace(/\s+/g, '-')}-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ResidencyForm({ onSubmit, onBackAction }: ResidencyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
    purpose: "",
    dateOfResidency: "",
    previousAddress: "",
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
      generateResidencyCertificatePDF(formData)
      
      // Submit form data
      await onSubmit({
        documentType: "certificate-of-residency",
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
    setFormData({
      fullName: "Maria Elena Santos",
      address: "789 Sampaguita Street, Purok 3, Barangay Alma Villa",
      contactNumber: "09198765432",
      email: "maria.santos@email.com",
      purpose: "Bank account opening and loan application",
      dateOfResidency: "2020-03-15",
      previousAddress: "456 Mabini Street, Barangay San Jose, Calapan City",
      urgentRequest: false,
      attachments: []
    })
  }

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Certificate of Residency Application Form</CardTitle>
          <Button
            type="button"
            onClick={fillSampleData}
            variant="outline"
            className="text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
          >
            Fill Sample Data
          </Button>
        </div>
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
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  required
                  placeholder="09XXXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="address">Current Complete Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  placeholder="House No., Street, Purok, Barangay Alma Villa"
                />
              </div>
            </div>
          </div>

          {/* Residency Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Residency Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfResidency">Date Started Residing in Barangay *</Label>
                <Input
                  id="dateOfResidency"
                  type="date"
                  value={formData.dateOfResidency}
                  onChange={(e) => handleInputChange("dateOfResidency", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="previousAddress">Previous Address</Label>
                <Input
                  id="previousAddress"
                  value={formData.previousAddress}
                  onChange={(e) => handleInputChange("previousAddress", e.target.value)}
                  placeholder="Your previous address (if applicable)"
                />
              </div>
            </div>
          </div>

          {/* Purpose Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Request Details</h3>
            
            <div>
              <Label htmlFor="purpose">Purpose of Request *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                required
                placeholder="Please specify the purpose for this certificate of residency (e.g., bank requirements, employment, etc.)"
                rows={3}
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
                  Valid ID, Utility Bills - PDF, JPG, PNG, DOC up to 10MB each
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
            <Checkbox
              id="urgentRequest"
              checked={formData.urgentRequest}
              onCheckedChange={(checked: boolean) => handleInputChange("urgentRequest", checked)}
            />
            <Label htmlFor="urgentRequest" className="text-sm">
              This is an urgent request (additional fees may apply)
            </Label>
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
      </CardContent>
    </Card>
  )
}