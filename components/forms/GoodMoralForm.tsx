"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { useSession } from "next-auth/react"
import useSWR from 'swr'

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

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
  citizenship: string
  residentOf: string

  // Purpose and supporting info
  purpose: string
  attachments: File[]
}

const sampleData: FormData = {
  fullName: "Maria Santos Cruz",
  dateOfBirth: "1985-08-15",
  placeOfBirth: "Gloria, Oriental Mindoro",
  civilStatus: "married",
  citizenship: "Filipino",
  residentOf: "Sitio 2",
  purpose: "Employment requirements",
  attachments: []
}

export default function GoodMoralForm({ onSubmit, onBackAction }: GoodMoralFormProps) {
  const { addToast } = useToast()
  const { data: session } = useSession()
  const { data } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  const [formData, setFormData] = useState<FormData>({
    fullName: data.firstName + " " + data.lastName,
    dateOfBirth: data.birthDate,
    placeOfBirth: data.placeOfBirth,
    civilStatus: data.civilStatus,
    citizenship: data.nationality,
    residentOf: data.purok,
    purpose: "",
    attachments: []
  })

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
      // Validate required fields (age is auto-calculated)
      const required: Array<keyof FormData> = [
        'fullName', 'dateOfBirth', 'placeOfBirth', 'civilStatus', 'citizenship', 'residentOf', 'purpose'
      ]
      const missing = required.filter(f => !String(formData[f] ?? '').trim())
      if (missing.length) {
        addToast({
          title: "Validation Error",
          description: `Please fill in all required fields: ${missing.join(', ')}`,
          variant: "destructive",
        })
        return
      }


      const calculatedAge = formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : ""

      const documentData = {
        userId: session?.user.id,
        fullName: formData.fullName,
        birthDate: formData.dateOfBirth,
        placeOfBirth: formData.placeOfBirth,
        age: calculatedAge,
        civilStatus: formData.civilStatus,
        citizenship: formData.citizenship,
        purok: formData.residentOf,
        purpose: formData.purpose,
        type: "Certificate of Good Moral Character",
      }

      const response = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) throw new Error('Failed to submit document')
      const result = await response.json()
      if (!result?.success) throw new Error(result?.error || 'Submission failed')

      addToast({
        title: "Success!",
        description: "Good Moral certificate request submitted successfully!",
        variant: "default",
      })

      await onSubmit({
        documentType: "good-moral-character",
        formData,
        submittedAt: new Date().toISOString()
      })

      // Reset form
      setFormData({
        fullName: "",
        dateOfBirth: "",
        placeOfBirth: "",
        civilStatus: "",
        citizenship: "",
        residentOf: "",
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
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                    <SelectItem value="Separated">Separated</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
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
                <Label htmlFor="residentOf">Sitio</Label>
                <Input
                  id="residentOf"
                  value={formData.residentOf}
                  onChange={(e) => handleInputChange("residentOf", e.target.value)}
                  required
                  placeholder="Sitio"
                />
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
