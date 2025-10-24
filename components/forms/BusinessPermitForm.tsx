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
import { ArrowLeft, Upload, X, FileText, Building, User, Eye } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { useSession } from "next-auth/react"

interface BusinessPermitFormProps {
  onBackAction: () => void
  onSubmit: (formData: any) => void
}

interface AttachmentFile extends File {
  preview?: string
}

interface FormData {
  businessName: string
  businessLocation: string
  operatorName: string
  operatorAddress: string
  amountPaid: string
  orNumbers: string
  attachments: AttachmentFile[]
}


export default function BusinessPermitForm({ onBackAction, onSubmit }: BusinessPermitFormProps) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessLocation: "",
    operatorName: "",
    operatorAddress: "",
    amountPaid: "",
    orNumbers: "",
    attachments: []
  })
  const { addToast } = useToast()
  const { data: session } = useSession()
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<{ url: string; type: string; name: string } | null>(null)

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles: AttachmentFile[] = Array.from(files).map((file) => {
        const f = file as AttachmentFile
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (ev) => {
            f.preview = ev.target?.result as string
            // force re-render to reflect late preview read
            setFormData(prev => ({ ...prev }))
          }
          reader.readAsDataURL(file)
        }
        return f
      })

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const openImagePreview = (src: string) => setSelectedImagePreview(src)
  const closeImagePreview = () => setSelectedImagePreview(null)

  const openFilePreview = (file: File) => {
    try {
      const url = URL.createObjectURL(file)
      setFilePreview({ url, type: file.type, name: file.name })
    } catch (_e) {
      // fallback handled by lack of preview
    }
  }

  const closeFilePreview = () => {
    if (filePreview?.url) URL.revokeObjectURL(filePreview.url)
    setFilePreview(null)
  }


  // Removed PDF generation; using API submission instead

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate required fields
      const required: Array<keyof FormData> = [
        'businessName', 'businessLocation', 'operatorName', 'operatorAddress', 'amountPaid', 'orNumbers'
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

      // Prepare payload for Document API
      const additionalInfo = `Amount Paid: ${formData.amountPaid}; OR Numbers: ${formData.orNumbers}`
      const documentData = {
        userId: session?.user.id,
        businessName: formData.businessName,
        businessLocation: formData.businessLocation,
        operatorName: formData.operatorName,
        operatorAddress: formData.operatorAddress,
        additionalInfo,
        purpose: `Business Permit for ${formData.businessName}`,
        type: "Business Permit",
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
        description: "Business permit application submitted successfully!",
        variant: "default",
      })

      onSubmit({
        documentType: "business-permit",
        formData,
        submittedAt: new Date().toISOString()
      })

      // Reset form
      setFormData({
        businessName: "",
        businessLocation: "",
        operatorName: "",
        operatorAddress: "",
        amountPaid: "",
        orNumbers: "",
        attachments: []
      })

    } catch (error) {
      console.error("Error submitting form:", error)
      addToast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button
              type="button"
              onClick={onBackAction}
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-4">
            <Badge variant="outline" className="text-[#23479A] border-[#23479A]">
              Fee: ₱200
            </Badge>
            <Badge variant="outline">
              Processing: 3-5 days
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information (matching PDF format) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-[#23479A]" />
              Business or Trade Activity
            </CardTitle>
            <CardDescription>
              Business Name or Trade Activity (as it will appear on the permit)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name or Trade Activity *</Label>
              <Input
                id="businessName"
                placeholder="Enter business name or trade activity"
                required
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessLocation">Sitio *</Label>
              <Input
                id="businessLocation"
                placeholder="Street/Purok (location within Barangay Alma Villa)"
                required
                value={formData.businessLocation}
                onChange={(e) => handleInputChange('businessLocation', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter specific street or purok within Barangay Alma Villa, Gloria, Oriental Mindoro
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Operator/Manager Information (matching PDF format) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#23479A]" />
              Operator/Manager Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="operatorName">Operator/Manager Full Name *</Label>
              <Input
                id="operatorName"
                placeholder="Enter operator or manager's full name"
                required
                value={formData.operatorName}
                onChange={(e) => handleInputChange('operatorName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorAddress">Sitio *</Label>
              <Input
                id="operatorAddress"
                placeholder="Street/Purok (address within Barangay Alma Villa)"
                required
                value={formData.operatorAddress}
                onChange={(e) => handleInputChange('operatorAddress', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter specific street or purok within Barangay Alma Villa, Gloria, Oriental Mindoro
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#23479A]" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid (PHP) *</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  placeholder="Enter amount paid"
                  required
                  value={formData.amountPaid}
                  onChange={(e) => handleInputChange('amountPaid', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orNumbers">OR Numbers *</Label>
                <Input
                  id="orNumbers"
                  placeholder="Enter Official Receipt numbers"
                  required
                  value={formData.orNumbers}
                  onChange={(e) => handleInputChange('orNumbers', e.target.value)}
                />
              </div>
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
              <div className="flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
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

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          {file.type.startsWith('image/') && (file as AttachmentFile).preview ? (
                            <img
                              src={(file as AttachmentFile).preview as string}
                              alt="Preview"
                              className="h-10 w-10 rounded object-cover border cursor-pointer"
                              onClick={() => openImagePreview((file as AttachmentFile).preview as string)}
                            />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500" />
                          )}
                          <div className="min-w-0">
                            <span className="text-sm text-gray-700 break-all">{file.name}</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <Button
                            type="button"
                            onClick={() => file.type.startsWith('image/') && (file as AttachmentFile).preview ? openImagePreview((file as AttachmentFile).preview as string) : openFilePreview(file)}
                            variant="outline"
                            className="h-8 px-2"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeFile(index)}
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Preview Modal */}
        {selectedImagePreview && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm transition-opacity"
                onClick={closeImagePreview}
              />

              <div className="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-3xl">
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="mb-4 w-full flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Image Preview</h3>
                    <Button
                      onClick={closeImagePreview}
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="max-w-full max-h-[70vh] overflow-auto bg-gray-50 rounded-lg p-4">
                    <img
                      src={selectedImagePreview}
                      alt="Document preview"
                      className="max-w-full h-auto rounded shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal (PDF and others) */}
        {filePreview && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm transition-opacity"
                onClick={closeFilePreview}
              />

              <div className="relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-4xl">
                <div className="flex flex-col p-4">
                  <div className="mb-4 w-full flex justify-between items-center">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{filePreview.name}</h3>
                      <p className="text-xs text-gray-500">{filePreview.type || 'Unknown type'}</p>
                    </div>
                    <Button
                      onClick={closeFilePreview}
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {filePreview.type === 'application/pdf' ? (
                    <div className="w-full h-[70vh] bg-gray-50 rounded-lg overflow-hidden">
                      <iframe src={filePreview.url} className="w-full h-full" title="PDF Preview" />
                    </div>
                  ) : filePreview.type.startsWith('image/') ? (
                    <div className="max-w-full max-h-[70vh] overflow-auto bg-gray-50 rounded-lg p-4">
                      <img src={filePreview.url} alt="Preview" className="max-w-full h-auto rounded shadow-lg" />
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-600">
                      Preview not available for this file type. You can download it below.
                      <div className="mt-4">
                        <a
                          href={filePreview.url}
                          download={filePreview.name}
                          className="inline-flex items-center px-3 py-2 rounded border text-[#23479A] border-[#23479A] hover:bg-[#23479A]/5"
                        >
                          Download File
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <p className="text-sm text-gray-600">
                * Required fields must be completed before submission
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={onBackAction}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#23479A] hover:bg-[#23479A]/90 w-full sm:w-auto"
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