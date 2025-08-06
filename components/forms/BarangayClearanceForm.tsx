"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Upload, X, CheckCircle, Clock, Mail, DollarSign, Eye } from "lucide-react"

interface BarangayClearanceFormProps {
  onBackAction: () => void
}

interface DocumentFile extends File {
  preview?: string
}

interface FormData {
  // Personal Information (matching the document)
  fullName: string
  age: string
  birthDate: string
  birthPlace: string
  civilStatus: string
  citizenship: string
  
  // Address Information (simplified to match document)
  residenceAddress: string
  
  // Purpose and Legal Requirements
  purpose: string
  urgency: string
  additionalInfo: string
  
  // Contact Information (for processing)
  contactNumber: string
  emailAddress: string
}

const sampleData: FormData = {
  fullName: "Juan Santos Dela Cruz",
  age: "33",
  birthDate: "January 15, 1990",
  birthPlace: "Gloria, Oriental Mindoro",
  civilStatus: "Single",
  citizenship: "Filipino",
  residenceAddress: "123 Maharlika Street, Purok 1, Alma Villa, Gloria, Oriental Mindoro",
  purpose: "employment",
  urgency: "normal",
  additionalInfo: "Required for submission to HR department by end of month",
  contactNumber: "09123456789",
  emailAddress: "juan.delacruz@email.com"
}

export default function BarangayClearanceForm({ onBackAction }: BarangayClearanceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
    birthDate: "",
    birthPlace: "",
    civilStatus: "",
    citizenship: "Filipino", // Default as per document
    residenceAddress: "",
    purpose: "",
    urgency: "",
    additionalInfo: "",
    contactNumber: "",
    emailAddress: ""
  })

  const [supportingDocs, setSupportingDocs] = useState<DocumentFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).map(file => {
        const documentFile = file as DocumentFile
        
        // Create preview for image files
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            documentFile.preview = e.target?.result as string
            setSupportingDocs(prev => [...prev])
          }
          reader.readAsDataURL(file)
        }
        
        return documentFile
      })
      
      setSupportingDocs(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const fileToRemove = supportingDocs[index]
    // Cleanup preview URL
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    setSupportingDocs(supportingDocs.filter((_, i) => i !== index))
  }

  const openImagePreview = (preview: string) => {
    setSelectedImagePreview(preview)
  }

  const closeImagePreview = () => {
    setSelectedImagePreview(null)
  }

  const getFileIcon = (file: DocumentFile) => {
    if (file.type.startsWith('image/')) {
      return file.preview ? (
        <img 
          src={file.preview} 
          alt="Preview" 
          className="w-12 h-12 object-cover rounded border cursor-pointer hover:opacity-75"
          onClick={() => openImagePreview(file.preview!)}
        />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
          <Upload className="h-4 w-4 text-gray-400" />
        </div>
      )
    } else {
      return (
        <div className="w-12 h-12 bg-red-100 rounded border flex items-center justify-center">
          <span className="text-xs font-medium text-red-600">PDF</span>
        </div>
      )
    }
  }

  const fillWithSampleData = () => {
    setFormData(sampleData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if at least one supporting document is uploaded
    if (supportingDocs.length === 0) {
      alert("Please upload at least one supporting document before submitting.")
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Barangay Clearance Form submitted:", formData)
      setIsSubmitting(false)
      setShowSuccessModal(true)
    }, 2000)
  }

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    // Navigate to request page
    window.location.href = "/dashboard/request"
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Button
            onClick={onBackAction}
            variant="ghost"
            className="text-[#23479A] hover:bg-[#23479A]/10 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Barangay Clearance Application</h1>
        <p className="text-sm text-gray-600">Complete the form to apply for a barangay clearance certificate</p>
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
        {/* Personal Information Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your complete name (First Middle Last)"
                className="mt-1"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">As it appears on your birth certificate or valid ID</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  className="mt-1"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Date of Birth *</Label>
                <Input
                  id="birthDate"
                  placeholder="e.g., January 15, 1990"
                  className="mt-1"
                  required
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Format: Month Day, Year</p>
              </div>
            </div>

            <div>
              <Label htmlFor="birthPlace">Birth Place *</Label>
              <Input
                id="birthPlace"
                placeholder="Enter your place of birth (City/Municipality, Province)"
                className="mt-1"
                required
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="civilStatus">Civil Status *</Label>
                <Select
                  value={formData.civilStatus}
                  onValueChange={(value) => handleInputChange('civilStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select civil status" />
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
                  placeholder="Enter citizenship"
                  className="mt-1"
                  required
                  value={formData.citizenship}
                  onChange={(e) => handleInputChange('citizenship', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Usually "Filipino" for Philippine citizens</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Residence Information</h2>
          
          <div>
            <Label htmlFor="residenceAddress">Complete Residence Address *</Label>
            <Textarea
              id="residenceAddress"
              placeholder="Enter your complete address including house number, street, purok/zone, barangay, city/municipality, province"
              className="mt-1"
              required
              rows={3}
              value={formData.residenceAddress}
              onChange={(e) => handleInputChange('residenceAddress', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 123 Maharlika Street, Purok 1, Alma Villa, Gloria, Oriental Mindoro
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="09XXXXXXXXX"
                className="mt-1"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">For updates on your application</p>
            </div>

            <div>
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="your@email.com"
                className="mt-1"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">For electronic notifications</p>
            </div>
          </div>
        </div>

        {/* Purpose and Legal Requirements */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Purpose and Legal Requirements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="purpose">Purpose of Clearance *</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange('purpose', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employment">Employment/Job Application</SelectItem>
                  <SelectItem value="scholarship">Scholarship Application</SelectItem>
                  <SelectItem value="visa">Visa Application/Travel</SelectItem>
                  <SelectItem value="bank">Bank Account Opening</SelectItem>
                  <SelectItem value="loan">Loan Application</SelectItem>
                  <SelectItem value="legal">Legal Proceedings</SelectItem>
                  <SelectItem value="business">Business Registration</SelectItem>
                  <SelectItem value="school">School Enrollment</SelectItem>
                  <SelectItem value="insurance">Insurance Claims</SelectItem>
                  <SelectItem value="government">Government Requirements</SelectItem>
                  <SelectItem value="police">Police Clearance Application</SelectItem>
                  <SelectItem value="nbi">NBI Clearance Application</SelectItem>
                  <SelectItem value="passport">Passport Application</SelectItem>
                  <SelectItem value="other">Other Legal Purposes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="urgency">Processing Time *</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => handleInputChange('urgency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select processing time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular (2-3 working days)</SelectItem>
                  <SelectItem value="urgent">Rush (1 working day)</SelectItem>
                  <SelectItem value="same-day">Same Day (Additional fee applies)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information/Special Instructions</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Please provide any additional details about your request, special instructions, or deadline requirements..."
              className="mt-1"
              rows={3}
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            />
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Supporting Documents</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Required Documents:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Valid Government-issued ID (front and back)</li>
              <li>• Proof of Residency (Utility bill, lease contract, etc.)</li>
              <li>• Birth Certificate (if required for specific purpose)</li>
              <li>• Marriage Certificate (if married and relevant to purpose)</li>
            </ul>
          </div>
          
          <div>
            <Label>Upload At Least One of the Supporting Documents *</Label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <label
                    htmlFor="supportingDocs"
                    className="relative cursor-pointer rounded-md font-medium text-[#23479A] hover:text-[#23479A]/80"
                  >
                    <span>Upload at least one required document</span>
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
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB each</p>
              </div>
            </div>

            {supportingDocs.length > 0 && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Uploaded Documents:</p>
                {supportingDocs.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB • {file.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                      {file.type.startsWith('image/') && file.preview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openImagePreview(file.preview!)}
                          className="text-xs px-2 py-1 h-7"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeFile(index)}
                      variant="outline"
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 ml-2"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Declaration */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900">Declaration</h3>
          <p className="text-sm text-gray-700">
            I hereby certify that the information provided above is true and correct to the best of my knowledge. 
            I understand that any false information may result in the rejection of my application and may be 
            subject to legal action. I also acknowledge that I am a person of good moral character and integrity 
            with no derogatory records whatsoever.
          </p>
          <p className="text-sm text-gray-700">
            This clearance is being requested for legal purposes only and I will use it in accordance with 
            the law and regulations.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white px-8 py-3 text-base"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing Application...
              </>
            ) : (
              "Submit Barangay Clearance Request"
            )}
          </Button>
        </div>
      </form>

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
                
                <div className="mt-4">
                  <Button
                    onClick={closeImagePreview}
                    className="bg-[#23479A] hover:bg-[#23479A]/90 text-white"
                  >
                    Close Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-25 backdrop-blur-sm transition-opacity"
              onClick={() => setShowSuccessModal(false)}
            />
            
            <div className=" relative transform overflow-hidden rounded-lg bg-white/95 backdrop-blur-sm text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-md">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Request Has Been Submitted
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-left">
                    <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <p className="text-gray-700">
                      Document processing time is <strong>1-3 working days</strong>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-left">
                    <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <p className="text-gray-700">
                      An email will be received once the document is ready for pickup or download
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3 text-left">
                    <DollarSign className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      Make sure to pay to download the document online or pay at the barangay office upon pickup
                    </p>
                  </div>
                </div>
                
                <div className="w-full">
                  <Button
                    onClick={handleCloseModal}
                    className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white"
                  >
                    Close - Go to Request Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    
    </div>
  )
}