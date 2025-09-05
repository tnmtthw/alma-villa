"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, FileText } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { useSession } from "next-auth/react"
import useSWR from 'swr'

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

interface ResidencyFormProps {
  onSubmit: (formData: any) => void
  onBackAction: () => void
}

interface FormData {
  // Personal Information - only what's needed for the PDF
  fullName: string
  age: string
  address: string

  // Purpose and supporting info
  purpose: string
  attachments: File[]
}


export default function ResidencyForm({ onSubmit, onBackAction }: ResidencyFormProps) {
  const { addToast } = useToast()
  const { data: session } = useSession()
  const { data } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  const [formData, setFormData] = useState<FormData>({
    fullName: data.firstName + " " + data.lastName,
    age: data.age,
    address: data.purok,
    purpose: "",
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
      // Basic validation
      const requiredFields: Array<keyof FormData> = ['fullName', 'age', 'address', 'purpose']
      const missing = requiredFields.filter(field => !String(formData[field] ?? '').trim())
      if (missing.length) {
        addToast({
          title: "Validation Error",
          description: `Please fill in all required fields: ${missing.join(', ')}`,
          variant: "destructive",
        })
        return
      }

      const documentData: Record<string, any> = {
        userId: session?.user.id,
        fullName: formData.fullName,
        age: formData.age,
        purok: formData.address,
        purpose: formData.purpose,
        type: "Certificate of Residency",
      }

      const response = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit document')
      }

      const result = await response.json()
      if (!result?.success) {
        throw new Error(result?.error || 'Submission failed')
      }

      addToast({
        title: "Success!",
        description: "Certificate of Residency request submitted successfully!",
        variant: "default",
      })

      // Notify parent (if needed)
      await onSubmit({
        documentType: "certificate-of-residency",
        formData,
        submittedAt: new Date().toISOString()
      })

      // Reset form
      setFormData({
        fullName: "",
        age: "",
        address: "",
        purpose: "",
        attachments: []
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      addToast({
        title: "Error",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillSampleData = () => {
    setFormData({
      fullName: "Maria Elena Santos",
      age: "35",
      address: "Sitio 3",
      purpose: "Bank account opening and loan application",
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
        <p className="text-sm text-gray-600 mt-2">
          Please provide your basic information for the Certificate of Residency request.
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
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

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                placeholder="Street/Purok (address within Barangay Alma Villa)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter specific address within Barangay Alma Villa (Gloria Oriental Mindoro will be added automatically)
              </p>
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
                placeholder="e.g., Bank requirements, Employment, Legal proceedings, etc."
              />
            </div>
          </div>

          {/* File Upload Section */}
          {/* <div className="space-y-4">
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
        </div> */}

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
    </Card >
  )
}