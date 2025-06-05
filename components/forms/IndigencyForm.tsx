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

interface FamilyMember {
  name: string
  age: string
  relationship: string
  occupation: string
  monthlyIncome: string
}

interface FormData {
  // Personal Information
  fullName: string
  address: string
  contactNumber: string
  email: string
  birthDate: string
  age: string
  gender: string
  civilStatus: string
  
  // Family Composition
  familyMembers: FamilyMember[]
  totalHouseholdMembers: string
  totalMonthlyIncome: string
  
  // Housing Information
  housingType: string
  monthlyRent: string
  utilities: string[]
  
  // Employment Information
  employmentStatus: string
  occupation: string
  employer: string
  monthlyIncome: string
  
  // Assistance Information
  currentlyReceivingAssistance: boolean
  assistanceReceived: string[]
  reasonForIndigency: string
  
  // Purpose and supporting info
  purpose: string
  urgentRequest: boolean
  attachments: File[]
}

const sampleData: FormData = {
  fullName: "Rosa Maria Garcia",
  address: "234 Narra Street, Purok 1, Barangay Alma Villa",
  contactNumber: "09176543210",
  email: "rosa.garcia@email.com",
  birthDate: "1975-05-10",
  age: "48",
  gender: "female",
  civilStatus: "widowed",
  familyMembers: [
    {
      name: "Miguel Garcia",
      age: "16",
      relationship: "son",
      occupation: "Student",
      monthlyIncome: "0"
    },
    {
      name: "Elena Garcia",
      age: "14",
      relationship: "daughter",
      occupation: "Student",
      monthlyIncome: "0"
    }
  ],
  totalHouseholdMembers: "3",
  totalMonthlyIncome: "3500",
  housingType: "rented",
  monthlyRent: "2000",
  utilities: ["electricity", "water"],
  employmentStatus: "part-time",
  occupation: "Laundrywoman",
  employer: "Various households",
  monthlyIncome: "3500",
  currentlyReceivingAssistance: true,
  assistanceReceived: ["4Ps"],
  reasonForIndigency: "Lost husband who was the main breadwinner. Currently struggling to support two children with irregular part-time work.",
  purpose: "To apply for medical assistance for my son's operation",
  urgentRequest: true,
  attachments: []
}

// PDF Generation Function
const generateIndigencyCertificatePDF = (data: FormData) => {
  const content = `
REPUBLIC OF THE PHILIPPINES
Province of Oriental Mindoro
Municipality of Gloria
BARANGAY ALMA VILLA

CERTIFICATE OF INDIGENCY

TO WHOM IT MAY CONCERN:

This is to certify that ${data.fullName}, ${data.age} years old, ${data.civilStatus}, is a bonafide resident of ${data.address}, Barangay Alma Villa, Gloria, Oriental Mindoro.

This is to certify further that the above-named person belongs to the indigent family in this barangay with the following family composition:

FAMILY COMPOSITION:
${data.familyMembers.map((member, index) => 
  `${index + 1}. ${member.name} - Age: ${member.age} - Relationship: ${member.relationship} - Occupation: ${member.occupation} - Monthly Income: ₱${member.monthlyIncome || '0'}`
).join('\n')}

Total Household Members: ${data.totalHouseholdMembers}
Total Monthly Household Income: ₱${data.totalMonthlyIncome}

HOUSING INFORMATION:
Housing Type: ${data.housingType}
${data.monthlyRent ? `Monthly Rent: ₱${data.monthlyRent}` : ''}

EMPLOYMENT INFORMATION:
Employment Status: ${data.employmentStatus}
Occupation: ${data.occupation}
Monthly Income: ₱${data.monthlyIncome}

${data.reasonForIndigency ? `Reason for Indigency: ${data.reasonForIndigency}` : ''}

This certification is issued upon the request of the interested party for ${data.purpose}.

Given this ${new Date().getDate()}th day of ${new Date().toLocaleString('default', { month: 'long' })}, ${new Date().getFullYear()}.

                                    _____________________
                                    BARANGAY CAPTAIN
                                    Barangay Alma Villa

Document Fee: FREE
Processing Time: 2-3 days
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
    address: "",
    contactNumber: "",
    email: "",
    birthDate: "",
    age: "",
    gender: "",
    civilStatus: "",
    familyMembers: [{ name: "", age: "", relationship: "", occupation: "", monthlyIncome: "" }],
    totalHouseholdMembers: "",
    totalMonthlyIncome: "",
    housingType: "",
    monthlyRent: "",
    utilities: [],
    employmentStatus: "",
    occupation: "",
    employer: "",
    monthlyIncome: "",
    currentlyReceivingAssistance: false,
    assistanceReceived: [],
    reasonForIndigency: "",
    purpose: "",
    urgentRequest: false,
    attachments: []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const assistanceOptions = [
    "4Ps (Pantawid Pamilyang Pilipino Program)",
    "Social Pension for Indigent Senior Citizens",
    "DSWD Assistance",
    "PCSO Medical Assistance",
    "DOH Medical Assistance",
    "Educational Assistance",
    "Livelihood Programs"
  ]

  const utilityOptions = [
    "electricity",
    "water",
    "internet",
    "cable"
  ]

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFamilyMemberChange = (index: number, field: keyof FamilyMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }))
  }

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: "", age: "", relationship: "", occupation: "", monthlyIncome: "" }]
    }))
  }

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }))
  }

  const handleAssistanceChange = (assistance: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assistanceReceived: checked 
        ? [...prev.assistanceReceived, assistance]
        : prev.assistanceReceived.filter(a => a !== assistance)
    }))
  }

  const handleUtilityChange = (utility: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      utilities: checked 
        ? [...prev.utilities, utility]
        : prev.utilities.filter(u => u !== utility)
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
          Please provide accurate information about your family's financial situation.
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
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="birthDate">Date of Birth *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  required
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
              <div>
                <Label>Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Family Composition Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium border-b pb-2">Family Composition</h3>
              <Button
                type="button"
                onClick={addFamilyMember}
                variant="outline"
                className="text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
              >
                Add Family Member
              </Button>
            </div>
            
            {formData.familyMembers.map((member, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Family Member #{index + 1}</h4>
                  {formData.familyMembers.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeFamilyMember(index)}
                      variant="outline"
                      className="text-sm text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <Label>Age *</Label>
                    <Input
                      type="number"
                      value={member.age}
                      onChange={(e) => handleFamilyMemberChange(index, 'age', e.target.value)}
                      required
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <Label>Relationship *</Label>
                    <Input
                      value={member.relationship}
                      onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)}
                      required
                      placeholder="e.g., Son, Daughter, Spouse"
                    />
                  </div>
                  <div>
                    <Label>Occupation *</Label>
                    <Input
                      value={member.occupation}
                      onChange={(e) => handleFamilyMemberChange(index, 'occupation', e.target.value)}
                      required
                      placeholder="Occupation or Student"
                    />
                  </div>
                  <div>
                    <Label>Monthly Income</Label>
                    <Input
                      type="number"
                      value={member.monthlyIncome}
                      onChange={(e) => handleFamilyMemberChange(index, 'monthlyIncome', e.target.value)}
                      placeholder="₱0.00"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalHouseholdMembers">Total Household Members *</Label>
                <Input
                  id="totalHouseholdMembers"
                  type="number"
                  value={formData.totalHouseholdMembers}
                  onChange={(e) => handleInputChange("totalHouseholdMembers", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="totalMonthlyIncome">Total Monthly Household Income *</Label>
                <Input
                  id="totalMonthlyIncome"
                  type="number"
                  value={formData.totalMonthlyIncome}
                  onChange={(e) => handleInputChange("totalMonthlyIncome", e.target.value)}
                  required
                  placeholder="₱0.00"
                />
              </div>
            </div>
          </div>

          {/* Housing Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Housing Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Housing Type *</Label>
                <Select
                  value={formData.housingType}
                  onValueChange={(value) => handleInputChange("housingType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select housing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="shared">Shared with relatives</SelectItem>
                    <SelectItem value="informal">Informal settler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monthlyRent">Monthly Rent (if applicable)</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                  placeholder="₱0.00"
                />
              </div>
            </div>

            <div>
              <Label>Available Utilities (Check all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {utilityOptions.map((utility) => (
                  <div key={utility} className="flex items-center space-x-2">
                    <Checkbox
                      id={utility}
                      checked={formData.utilities.includes(utility)}
                      onCheckedChange={(checked) => handleUtilityChange(utility, checked as boolean)}
                    />
                    <Label htmlFor={utility} className="text-sm capitalize">
                      {utility}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Employment Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Employment Status *</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) => handleInputChange("employmentStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="disabled">Disabled/Unable to work</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="Current occupation or job"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employer">Employer/Company</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => handleInputChange("employer", e.target.value)}
                  placeholder="Current employer or business"
                />
              </div>
              <div>
                <Label htmlFor="monthlyIncome">Your Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                  placeholder="₱0.00"
                />
              </div>
            </div>
          </div>

          {/* Government Assistance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Government Assistance</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="currentlyReceivingAssistance"
                checked={formData.currentlyReceivingAssistance}
                onCheckedChange={(checked: boolean) => handleInputChange("currentlyReceivingAssistance", checked)}
              />
              <Label htmlFor="currentlyReceivingAssistance">
                Currently receiving government assistance or benefits
              </Label>
            </div>

            {formData.currentlyReceivingAssistance && (
              <div>
                <Label>Select all assistance/benefits you are currently receiving:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {assistanceOptions.map((assistance) => (
                    <div key={assistance} className="flex items-center space-x-2">
                      <Checkbox
                        id={assistance}
                        checked={formData.assistanceReceived.includes(assistance)}
                        onCheckedChange={(checked) => handleAssistanceChange(assistance, checked as boolean)}
                      />
                      <Label htmlFor={assistance} className="text-sm">
                        {assistance}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reason for Indigency Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Indigency Information</h3>
            
            <div>
              <Label htmlFor="reasonForIndigency">Reason for Financial Hardship *</Label>
              <Textarea
                id="reasonForIndigency"
                value={formData.reasonForIndigency}
                onChange={(e) => handleInputChange("reasonForIndigency", e.target.value)}
                required
                placeholder="Please explain the circumstances that led to your current financial situation (e.g., loss of job, illness, death of breadwinner, etc.)"
                rows={4}
              />
            </div>

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