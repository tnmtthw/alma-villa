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
  onBackAction: () => void
  onSubmit: (formData: any) => void
}

interface FormData {
  // Business Information (as per PDF format)
  businessName: string
  businessLocation: string
  
  // Operator/Manager Information (as per PDF format)
  operatorName: string
  operatorAddress: string
  
  // Payment Information (for PDF)
  amountPaid: string
  orNumbers: string
  
  // Supporting documents
  attachments: File[]
}

const sampleData: FormData = {
  businessName: "Juan's Sari-Sari Store",
  businessLocation: "Purok 1",
  operatorName: "Juan Dela Cruz",
  operatorAddress: "123 Maharlika Street",
  amountPaid: "200",
  orNumbers: "12345678",
  attachments: []
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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

  const fillWithSampleData = () => {
    setFormData(sampleData)
  }

  // PDF Generation Function
  const generateBusinessPermitPDF = (data: FormData) => {
    const currentDate = new Date()
    const day = currentDate.getDate()
    const month = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()
    
    const content = `
BARANGAY BUSINESS PERMIT

TO WHOM IT MAY CONCERN:

This is to certify that the business or trade activity described below:

( ${data.businessName} )

BARANGAY ALMA VILLA

Barangay Alma Villa, Gloria, Oriental Mindoro
Location

( ${data.operatorName} )

Barangay Alma Villa, Gloria, Oriental Mindoro
Address

Being applied for the corresponding Mayor's Permit has been found to be:
_______/Complying with the provisions of existing Barangay Ordinance,
Rules and regulations being enforced in this Barangay.
_______/ Partially complying with the provisions of existing Barangay
Ordinances, rules and regulations being enforced in this Barangay
In view of the foregoing, this Barangay thru the undersigned:

_______/Interposes NO objection for the issuance of the corresponding
Mayor's Permit being applied for.
_______/Recommends only the issuance of a Temporary Mayor's Permit
For not more than three (3) months and within that period the
requirements under existing barangay ordinances, rules and
regulations on that matter should be totally complied with, otherwise
this barangay would take the necessary actions, with legal bounds, to
stop its continued operation.

Signed and issued this ${day} day of ${month} ${year} Alma Villa, Gloria Oriental Mindoro

Amount paid: ${data.amountPaid}

OR Numbers: ${data.orNumbers}

Issued On: ${currentDate.toLocaleDateString()}
Issued At: Barangay Alma Villa

                    _____________________
                    MARIFE M. SOL
                    Punong Barangay

Processing Fee: ₱200
Processing Time: 3-5 days

Submitted: ${new Date().toLocaleString()}
    `
    
    // Create and download the file
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `business-permit-${data.businessName.replace(/\s+/g, '-')}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Generate PDF for admin
      generateBusinessPermitPDF(formData)
      
      // Submit form data
      onSubmit({
        documentType: "business-permit",
        formData,
        submittedAt: new Date().toISOString()
      })
      
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your application. Please try again.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
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
              <Label htmlFor="businessLocation">Location *</Label>
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
              <Label htmlFor="operatorAddress">Address *</Label>
              <Input
                id="operatorAddress"
                placeholder="Street/Purok (address within Barangay Alma Villa)"
                required
                value={formData.operatorAddress}
                onChange={(e) => handleInputChange('operatorAddress', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter specific address within Barangay Alma Villa, Gloria, Oriental Mindoro
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
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
                  onClick={onBackAction}
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