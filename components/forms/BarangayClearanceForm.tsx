"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, ArrowLeft, Eye, CheckCircle, Clock, Mail, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { useSession } from "next-auth/react"
import useSWR from 'swr'

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());


interface BarangayClearanceFormProps {
  onBackAction: () => void
  onSubmit: (payload: any) => void
}

interface DocumentFile extends File {
  preview?: string
}

interface FormData {
  // Personal Information
  fullName: string
  suffix: string
  birthDate: string
  civilStatus: string
  placeOfBirth: string
  citizenship: string

  // Address Information
  purok: string
  residencyLength: string

  // Purpose
  purpose: string
  additionalInfo: string

  // Contact Information (for processing)
  contactNumber: string
  emailAddress: string

  // Delivery Option
  pickupOption: string
}

const sampleData: FormData = {
  fullName: "Juan Dela Cruz",
  suffix: "Jr.",
  birthDate: "1990-01-15",
  civilStatus: "single",
  placeOfBirth: "Makati City",
  citizenship: "Filipino",
  purok: "Sitio 1",
  residencyLength: "5",
  purpose: "employment",
  additionalInfo: "Required for submission to HR department by end of month",
  contactNumber: "",
  emailAddress: "",
  pickupOption: "online"
}

export default function BarangayClearanceForm({ onBackAction, onSubmit }: BarangayClearanceFormProps) {
  const { addToast } = useToast()
  const { data: session } = useSession()
  const { data } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  const [formData, setFormData] = useState<FormData>({
    fullName: data.firstName + " " + data.lastName,
    suffix: data.suffix,
    birthDate: data.birthDate,
    placeOfBirth: data.placeOfBirth,
    citizenship: data.nationality,
    civilStatus: data.civilStatus,
    purok: data.purok,
    residencyLength: data.residencyLength,
    purpose: "",
    additionalInfo: "",
    contactNumber: "",
    emailAddress: "",
    pickupOption: "online"
  })


  const [supportingDocs, setSupportingDocs] = useState<DocumentFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null)

  // Generate today's date string in local timezone (YYYY-MM-DD)
  const todayLocalDateString = (() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })()

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

  const handleCloseModal = () => {
    setShowSuccessModal(false)
    onBackAction()
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

  // Auto-calculate age when birth date changes
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

  const handleBirthDateChange = (value: string) => {
    if (value > todayLocalDateString) {
      addToast({
        title: "Invalid Birth Date",
        description: "Birth date cannot be in the future.",
        variant: "destructive",
      })
      return
    }
    handleInputChange('birthDate', value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Prevent future birth dates
      if (formData.birthDate && formData.birthDate > todayLocalDateString) {
        addToast({
          title: "Invalid Birth Date",
          description: "Birth date cannot be later than today.",
          variant: "destructive",
        })
        return
      }

      // Validate required fields
      const requiredFields = ['fullName', 'birthDate', 'civilStatus', 'purok', 'residencyLength', 'purpose', 'civilStatus']
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormData])

      if (missingFields.length > 0) {
        addToast({
          title: "Validation Error",
          description: `Please fill in all required fields: ${missingFields.join(', ')}`,
          variant: "destructive",
        })
        return
      }

      // Calculate age from birth date
      const calculatedAge = formData.birthDate ? calculateAge(formData.birthDate) : ""

      // Prepare the data according to the Document model
      const documentData = {
        userId: session?.user.id,
        contact: session?.user.mobileNumber,
        fullName: formData.fullName,
        suffix: formData.suffix,
        birthDate: formData.birthDate,
        placeOfBirth: formData.placeOfBirth,
        citizenship: formData.citizenship,
        age: calculatedAge,
        civilStatus: formData.civilStatus,
        purok: formData.purok,
        residencyLength: formData.residencyLength,
        purpose: formData.purpose,
        additionalInfo: formData.additionalInfo,
        type: "Barangay Clearance",
        pickupOption: formData.pickupOption
      }

      const response = await fetch('/api/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit document')
      }

      const result = await response.json()

      if (result.success) {
        addToast({
          title: "Success!",
          description: "Barangay clearance application submitted successfully!",
          variant: "default",
        })

        // Notify parent so it can handle navigation back to the request page
        await onSubmit({
          documentType: "barangay-clearance",
          formData,
          submittedAt: new Date().toISOString()
        })

        // Reset form
        setFormData({
          fullName: "",
          suffix: "",
          birthDate: "",
          placeOfBirth: "",
          citizenship: "",
          civilStatus: "",
          purok: "",
          residencyLength: "",
          purpose: "",
          additionalInfo: "",
          contactNumber: "",
          emailAddress: "",
          pickupOption: "online"
        })
        setSupportingDocs([])
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      addToast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          {/* <Button
            onClick={onBackAction}
            variant="ghost"
            className="text-[#23479A] hover:bg-[#23479A]/10 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button> */}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Barangay Clearance Application</h1>
        <p className="text-sm text-gray-600">Complete the form to apply for a barangay clearance certificate</p>
      </div>

      <Button
        type="button"
        onClick={fillWithSampleData}
        variant="outline"
        className="mb-6 w-full sm:w-auto border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
      >
        Fill with Sample Data
      </Button>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                className="mt-1"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                placeholder="Jr., Sr., III, etc."
                className="mt-1"
                value={formData.suffix}
                onChange={(e) => handleInputChange('suffix', e.target.value)}
              />
            </div>


            <div>
              <Label htmlFor="birthDate">Date of Birth</Label>
              <Input
                id="birthDate"
                type="date"
                className="mt-1"
                required
                max={todayLocalDateString}
                value={formData.birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input
                id="placeOfBirth"
                placeholder="Enter place of birth"
                className="mt-1"
                value={formData.placeOfBirth}
                onChange={(e) => handleInputChange('suffix', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="citizenship">Citizenship</Label>
              <Input
                id="citizenship"
                placeholder="Enter citizenship"
                className="mt-1"
                value={formData.citizenship}
                onChange={(e) => handleInputChange('suffix', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="civilStatus">Civil Status</Label>
              <Select
                value={formData.civilStatus}
                onValueChange={(value) => handleInputChange('civilStatus', value)}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="select gender" />
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
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Address Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="purok">Sitio</Label>
              <Input
                id="purok"
                placeholder="Sitio"
                className="mt-1"
                required
                value={formData.purok}
                onChange={(e) => handleInputChange('purok', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="residencyLength">Length of Residency (years)</Label>
              <Input
                id="residencyLength"
                type="number"
                placeholder="Years"
                className="mt-1"
                required
                value={formData.residencyLength}
                onChange={(e) => handleInputChange('residencyLength', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Purpose and Legal Requirements */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Purpose</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label htmlFor="purpose">Purpose of Clearance *</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => handleInputChange('purpose', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employment/Job Application">Employment/Job Application</SelectItem>
                  <SelectItem value="Scholarship Application">Scholarship Application</SelectItem>
                  <SelectItem value="Visa Application/Travel">Visa Application/Travel</SelectItem>
                  <SelectItem value="Bank Account Opening">Bank Account Opening</SelectItem>
                  <SelectItem value="Loan Application">Loan Application</SelectItem>
                  <SelectItem value="Legal Proceedings">Legal Proceedings</SelectItem>
                  <SelectItem value="Business Registration">Business Registration</SelectItem>
                  <SelectItem value="School Enrollment">School Enrollment</SelectItem>
                  <SelectItem value="Insurance Claims">Insurance Claims</SelectItem>
                  <SelectItem value="Government Requirements">Government Requirements</SelectItem>
                  <SelectItem value="Other Purpose">Other Purpose</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pickupOption">Document Delivery Option *</Label>
              <Select
                value={formData.pickupOption}
                onValueChange={(value) => handleInputChange('pickupOption', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select delivery option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Download (Pay online)</SelectItem>
                  <SelectItem value="pickup">Pickup at Barangay Office (Pay on pickup)</SelectItem>
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
        {/* <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Supporting Documents</h2>

          <div>
            <Label>Upload Supporting Documents (Temporarily Disabled)</Label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 opacity-50">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="text-gray-500">File upload temporarily disabled</span>
                  <p className="pl-1 text-gray-400">This feature will be available soon</p>
                </div>
                <p className="text-xs text-gray-400">PDF, PNG, JPG up to 5MB each</p>
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
        </div> */}

        {/* Declaration */}
        <div className="space-y-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
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
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white px-6 sm:px-8 py-3 text-base w-full sm:w-auto"
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