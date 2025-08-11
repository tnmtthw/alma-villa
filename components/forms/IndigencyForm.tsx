"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText } from "lucide-react"

interface IndigencyFormProps {
  onSubmit: (formData: any) => void
  onBackAction: () => void
}

interface FormData {
  // Personal Information - only what's needed for the PDF
  fullName: string
  age: string
  
  // Purpose and supporting info
  purpose: string
  urgentRequest: boolean
  attachments: File[]
}

const sampleData: FormData = {
  fullName: "Rosa Maria Garcia",
  age: "48",
  purpose: "To apply for medical assistance for my son's operation",
  urgentRequest: true,
  attachments: []
}

// PDF Generation Function
const generateIndigencyCertificatePDF = (data: FormData) => {
  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()
  
  const content = `
CERTIFICATE OF INDIGENCY

To whom it may concern:

This is to certify that ${data.fullName}, legal age, resident of Alma Villa, Gloria Oriental Mindoro belongs to an indigent family.

This further certifies that their only source of income is through daily paid labor and their income is not enough to suffice their daily consumption. The Family doesn't have any real property for taxation purposes according to the Assessor and Treasury office of this Municipality.

This Certificate of Indigency is being issued upon the request for whatever legal purposes it may serve.

Any instance extended to him/her is highly appreciated.

ISSUED this ${day} day of ${month}, ${year} at the office of the Barangay Chairperson

Certified by:

_____________________
BARANGAY CAPTAIN

Document Fee: FREE
Processing Time: 2-3 days
Purpose: ${data.purpose}
${data.urgentRequest ? 'URGENT REQUEST - Priority processing requested' : ''}

Submitted: ${new Date().toLocaleString()}
  `
  
  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `certificate-of-indigency-${data.fullName.replace(/\s+/g, '-')}-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function IndigencyForm({ onSubmit, onBackAction }: IndigencyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
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
      generateIndigencyCertificatePDF(formData)
      
      // Submit form data
      await onSubmit({
        documentType: "certificate-of-indigency",
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
          <CardTitle className="text-xl">Certificate of Indigency Application Form</CardTitle>
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
          Please provide your basic information for the Certificate of Indigency request.
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
          </div>

          {/* Purpose Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Certificate Purpose</h3>
            
            <div>
              <Label htmlFor="purpose">Purpose of This Certificate *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                required
                placeholder="Please specify what you will use this certificate for (e.g., medical assistance, educational assistance, legal aid, etc.)"
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
                  Valid ID, Utility Bills, Medical Records, etc. - PDF, JPG, PNG, DOC up to 10MB each
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
              This is an urgent request requiring immediate processing
            </Label>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notice:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• All information provided must be true and accurate</li>
              <li>• False statements may result in legal consequences</li>
              <li>• This certificate is for assistance purposes only</li>
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