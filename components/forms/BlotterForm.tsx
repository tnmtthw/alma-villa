"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, FileText } from "lucide-react"

interface BlotterFormProps {
  onSubmit: (formData: any) => void
  onBackAction: () => void
}

interface FormData {
  fullName: string
  address: string
  contactNumber: string
  email: string
  purpose: string
  incidentDate: string
  incidentTime: string
  incidentLocation: string
  respondentName: string
  respondentAddress: string
  incidentDescription: string
  witnessNames: string
  urgentRequest: boolean
  attachments: File[]
}

// PDF Generation Function
const generateBlotterPDF = (data: FormData) => {
  const content = `
REPUBLIC OF THE PHILIPPINES
Province of Oriental Mindoro
Municipality of Gloria
BARANGAY ALMA VILLA

BARANGAY BLOTTER REPORT

Entry No: ${Date.now()}
Date Filed: ${new Date().toLocaleDateString()}
Time Filed: ${new Date().toLocaleTimeString()}

COMPLAINANT INFORMATION:
Name: ${data.fullName}
Address: ${data.address}
Contact Number: ${data.contactNumber}
Email: ${data.email}

INCIDENT DETAILS:
Date of Incident: ${new Date(data.incidentDate).toLocaleDateString()}
Time of Incident: ${data.incidentTime}
Place of Incident: ${data.incidentLocation}

RESPONDENT/SUBJECT:
Name: ${data.respondentName || 'Not specified'}
Address: ${data.respondentAddress || 'Not specified'}

NATURE OF COMPLAINT:
${data.incidentDescription}

WITNESS(ES):
${data.witnessNames || 'None'}

Purpose: ${data.purpose}

This complaint is entered in the barangay blotter for record purposes.

                                    _____________________
                                    BARANGAY SECRETARY
                                    Barangay Alma Villa

                                    _____________________
                                    BARANGAY CAPTAIN
                                    Barangay Alma Villa

Document Fee: FREE
Processing Time: Same day
${data.urgentRequest ? 'URGENT REQUEST - Priority processing requested' : ''}

Submitted: ${new Date().toLocaleString()}
  `
  
  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `blotter-report-${data.fullName.replace(/\s+/g, '-')}-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function BlotterForm({ onSubmit, onBackAction }: BlotterFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    contactNumber: "",
    email: "",
    purpose: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    respondentName: "",
    respondentAddress: "",
    incidentDescription: "",
    witnessNames: "",
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
      generateBlotterPDF(formData)
      
      // Submit form data
      await onSubmit({
        documentType: "complaint-blotter",
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
      fullName: "Maria Santos Cruz",
      address: "456 Rizal Street, Purok 2, Barangay Alma Villa",
      contactNumber: "09187654321",
      email: "maria.cruz@email.com",
      purpose: "Official record and possible legal action",
      incidentDate: "2024-06-01",
      incidentTime: "14:30",
      incidentLocation: "Corner of Maharlika and Rizal Street, Barangay Alma Villa",
      respondentName: "John Doe",
      respondentAddress: "789 Maharlika Street, Purok 3, Barangay Alma Villa",
      incidentDescription: "Neighbor dispute regarding property boundary. The respondent has been encroaching on my property and refusing to acknowledge the proper boundary lines despite showing them the official documents.",
      witnessNames: "Pedro Garcia - 09123456789, Ana Lopez - 09198765432",
      urgentRequest: false,
      attachments: []
    })
  }

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Complaint/Blotter Report Form</CardTitle>
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
          Please provide accurate and detailed information about the incident for proper documentation.
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Complainant Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Complainant Information</h3>
            
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
                <Label htmlFor="address">Complete Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  placeholder="House No., Street, Purok, Barangay"
                />
              </div>
            </div>
          </div>

          {/* Incident Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Incident Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="incidentDate">Date of Incident *</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange("incidentDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="incidentTime">Time of Incident *</Label>
                <Input
                  id="incidentTime"
                  type="time"
                  value={formData.incidentTime}
                  onChange={(e) => handleInputChange("incidentTime", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="incidentLocation">Location of Incident *</Label>
                <Input
                  id="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={(e) => handleInputChange("incidentLocation", e.target.value)}
                  required
                  placeholder="Specific location where incident occurred"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="incidentDescription">Detailed Description of Incident *</Label>
              <Textarea
                id="incidentDescription"
                value={formData.incidentDescription}
                onChange={(e) => handleInputChange("incidentDescription", e.target.value)}
                required
                placeholder="Provide a detailed description of what happened. Include all relevant facts and circumstances."
                rows={6}
              />
            </div>
          </div>

          {/* Respondent Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Respondent/Subject Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="respondentName">Respondent/Subject Name</Label>
                <Input
                  id="respondentName"
                  value={formData.respondentName}
                  onChange={(e) => handleInputChange("respondentName", e.target.value)}
                  placeholder="Name of person involved (if known)"
                />
              </div>
              <div>
                <Label htmlFor="respondentAddress">Respondent Address</Label>
                <Input
                  id="respondentAddress"
                  value={formData.respondentAddress}
                  onChange={(e) => handleInputChange("respondentAddress", e.target.value)}
                  placeholder="Address of respondent (if known)"
                />
              </div>
            </div>
          </div>

          {/* Witness Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Witness Information</h3>
            
            <div>
              <Label htmlFor="witnessNames">Witness Names and Contact Information</Label>
              <Textarea
                id="witnessNames"
                value={formData.witnessNames}
                onChange={(e) => handleInputChange("witnessNames", e.target.value)}
                placeholder="List witness names and contact numbers (if any). Format: Name - Contact Number"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: Juan Dela Cruz - 09123456789, Maria Santos - 09187654321
              </p>
            </div>
          </div>

          {/* Purpose Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Request Details</h3>
            
            <div>
              <Label htmlFor="purpose">Purpose of This Report *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                required
                placeholder="Please specify why you are filing this report (e.g., for legal purposes, insurance claim, official record, etc.)"
                rows={3}
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Supporting Evidence</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer rounded-md font-medium text-[#23479A] hover:text-[#23479A]/80"
                  >
                    <span>Upload evidence documents</span>
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
                  Photos, documents, or any evidence related to the incident - PDF, JPG, PNG, DOC up to 10MB each
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
              This is an urgent matter requiring immediate attention
            </Label>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notice:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• All information provided must be true and accurate</li>
              <li>• False statements may result in legal consequences</li>
              <li>• This report will be part of official barangay records</li>
              <li>• You may be required to appear for mediation or hearings</li>
            </ul>
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
                "Submit Report"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}