"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, X, Plus, Minus } from "lucide-react"

interface SoloParentFormProps {
  onBackAction: () => void
}

interface Child {
  name: string
  birthDate: string
  age: string
  relationship: string
}

interface FormData {
  // Parent Information
  lastName: string
  firstName: string
  middleName: string
  suffix: string
  birthDate: string
  age: string
  gender: string
  civilStatus: string
  
  // Contact Information
  address: string
  contactNumber: string
  emailAddress: string
  
  // Employment Information
  employmentStatus: string
  employer: string
  position: string
  monthlyIncome: string
  
  // Solo Parent Status
  soloParentReason: string
  dateOfSeparation: string
  otherParentStatus: string
  supportFromOtherParent: boolean
  
  // Children Information
  children: Child[]
  
  // Benefits and Assistance
  currentlyReceivingBenefits: boolean
  benefitsReceived: string[]
  
  // Purpose
  purpose: string
}

const sampleData: FormData = {
  lastName: "Santos",
  firstName: "Maria",
  middleName: "Dela Cruz",
  suffix: "",
  birthDate: "1985-03-20",
  age: "38",
  gender: "female",
  civilStatus: "separated",
  address: "456 Rizal Street, Purok 2, Alma Villa, Gloria, Oriental Mindoro",
  contactNumber: "09187654321",
  emailAddress: "maria.santos@email.com",
  employmentStatus: "employed",
  employer: "Local Government Unit",
  position: "Administrative Aide",
  monthlyIncome: "15000",
  soloParentReason: "separation",
  dateOfSeparation: "2020-06-15",
  otherParentStatus: "absent",
  supportFromOtherParent: false,
  children: [
    {
      name: "Ana Santos",
      birthDate: "2010-08-12",
      age: "14",
      relationship: "daughter"
    },
    {
      name: "Jose Santos",
      birthDate: "2012-11-05",
      age: "12",
      relationship: "son"
    }
  ],
  currentlyReceivingBenefits: true,
  benefitsReceived: ["4Ps", "Educational Assistance"],
  purpose: "To apply for solo parent benefits and services"
}

export default function SoloParentForm({ onBackAction }: SoloParentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "",
    birthDate: "",
    age: "",
    gender: "",
    civilStatus: "",
    address: "",
    contactNumber: "",
    emailAddress: "",
    employmentStatus: "",
    employer: "",
    position: "",
    monthlyIncome: "",
    soloParentReason: "",
    dateOfSeparation: "",
    otherParentStatus: "",
    supportFromOtherParent: false,
    children: [{ name: "", birthDate: "", age: "", relationship: "" }],
    currentlyReceivingBenefits: false,
    benefitsReceived: [],
    purpose: ""
  })

  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const benefitOptions = [
    "4Ps (Pantawid Pamilyang Pilipino Program)",
    "Educational Assistance",
    "Healthcare Benefits",
    "Livelihood Programs",
    "Housing Assistance",
    "Legal Aid Services"
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChildChange = (index: number, field: keyof Child, value: string) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }))
  }

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: "", birthDate: "", age: "", relationship: "" }]
    }))
  }

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }))
  }

  const handleBenefitChange = (benefit: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      benefitsReceived: checked 
        ? [...prev.benefitsReceived, benefit]
        : prev.benefitsReceived.filter(b => b !== benefit)
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setSupportingDocs([...supportingDocs, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setSupportingDocs(supportingDocs.filter((_, i) => i !== index))
  }

  const fillWithSampleData = () => {
    setFormData(sampleData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Handle form submission
    console.log("Solo Parent Form submitted:", formData)
    alert("Solo parent certification application submitted successfully!")
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Solo Parent Certification Application</h1>
        <p className="text-sm text-gray-600">Complete the form to apply for solo parent certification</p>
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
        {/* Parent Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Parent Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                className="mt-1"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                className="mt-1"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                placeholder="Enter middle name"
                className="mt-1"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
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
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                className="mt-1"
                required
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
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
              <Label>Civil Status</Label>
              <Select
                value={formData.civilStatus}
                onValueChange={(value) => handleInputChange('civilStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="annulled">Annulled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="address">Complete Address</Label>
              <Input
                id="address"
                placeholder="Enter complete address"
                className="mt-1"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="Enter contact number"
                className="mt-1"
                required
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="Enter email address"
                className="mt-1"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Employment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Employment Status</Label>
              <Select
                value={formData.employmentStatus}
                onValueChange={(value) => handleInputChange('employmentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="ofw">OFW</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employer">Employer/Company</Label>
              <Input
                id="employer"
                placeholder="Enter employer name"
                className="mt-1"
                value={formData.employer}
                onChange={(e) => handleInputChange('employer', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="position">Position/Job Title</Label>
              <Input
                id="position"
                placeholder="Enter position"
                className="mt-1"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (PHP)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                placeholder="Enter monthly income"
                className="mt-1"
                value={formData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Solo Parent Status */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Solo Parent Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Reason for Solo Parent Status</Label>
              <Select
                value={formData.soloParentReason}
                onValueChange={(value) => handleInputChange('soloParentReason', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unmarried">Unmarried Mother/Father</SelectItem>
                  <SelectItem value="widowed">Death of Spouse</SelectItem>
                  <SelectItem value="separated">Legal Separation</SelectItem>
                  <SelectItem value="divorced">Divorce (if applicable)</SelectItem>
                  <SelectItem value="annulled">Annulment</SelectItem>
                  <SelectItem value="abandoned">Abandonment by Spouse</SelectItem>
                  <SelectItem value="detained">Spouse Detained/Imprisoned</SelectItem>
                  <SelectItem value="mental">Spouse Mentally Incapacitated</SelectItem>
                  <SelectItem value="ofw">Spouse Working Abroad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateOfSeparation">Date of Separation/Incident</Label>
              <Input
                id="dateOfSeparation"
                type="date"
                className="mt-1"
                value={formData.dateOfSeparation}
                onChange={(e) => handleInputChange('dateOfSeparation', e.target.value)}
              />
            </div>

            <div>
              <Label>Status of Other Parent</Label>
              <Select
                value={formData.otherParentStatus}
                onValueChange={(value) => handleInputChange('otherParentStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="absent">Absent/Unknown</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                  <SelectItem value="detained">Detained/Imprisoned</SelectItem>
                  <SelectItem value="abroad">Working Abroad</SelectItem>
                  <SelectItem value="incapacitated">Mentally Incapacitated</SelectItem>
                  <SelectItem value="separated">Legally Separated</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="supportFromOtherParent"
                checked={formData.supportFromOtherParent}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, supportFromOtherParent: checked as boolean }))
                }
              />
              <Label htmlFor="supportFromOtherParent">
                Receiving support from other parent
              </Label>
            </div>
          </div>
        </div>

        {/* Children Information */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Children Information</h2>
            <Button
              type="button"
              onClick={addChild}
              variant="outline"
              className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </div>
          
          {formData.children.map((child, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Child #{index + 1}</h3>
                {formData.children.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeChild(index)}
                    variant="outline"
                    className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`child-name-${index}`}>Full Name</Label>
                  <Input
                    id={`child-name-${index}`}
                    placeholder="Enter child's full name"
                    className="mt-1"
                    required
                    value={child.name}
                    onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`child-birthDate-${index}`}>Date of Birth</Label>
                  <Input
                    id={`child-birthDate-${index}`}
                    type="date"
                    className="mt-1"
                    required
                    value={child.birthDate}
                    onChange={(e) => handleChildChange(index, 'birthDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`child-age-${index}`}>Age</Label>
                  <Input
                    id={`child-age-${index}`}
                    type="number"
                    placeholder="Enter age"
                    className="mt-1"
                    required
                    value={child.age}
                    onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`child-relationship-${index}`}>Relationship</Label>
                  <Select
                    value={child.relationship}
                    onValueChange={(value) => handleChildChange(index, 'relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="son">Son</SelectItem>
                      <SelectItem value="daughter">Daughter</SelectItem>
                      <SelectItem value="stepson">Stepson</SelectItem>
                      <SelectItem value="stepdaughter">Stepdaughter</SelectItem>
                      <SelectItem value="adopted">Adopted Child</SelectItem>
                      <SelectItem value="foster">Foster Child</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits and Assistance */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Benefits and Assistance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="currentlyReceivingBenefits"
                checked={formData.currentlyReceivingBenefits}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, currentlyReceivingBenefits: checked as boolean }))
                }
              />
              <Label htmlFor="currentlyReceivingBenefits">
                Currently receiving government benefits or assistance
              </Label>
            </div>

            {formData.currentlyReceivingBenefits && (
              <div>
                <Label>Select all benefits you are currently receiving:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {benefitOptions.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.benefitsReceived.includes(benefit)}
                        onCheckedChange={(checked) => handleBenefitChange(benefit, checked as boolean)}
                      />
                      <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Purpose</h2>
          
          <div>
            <Label htmlFor="purpose">Purpose of Application</Label>
            <Textarea
              id="purpose"
              placeholder="State the purpose for this solo parent certification"
              className="mt-1"
              required
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
            />
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Supporting Documents</h2>
          
          <div>
            <Label>Upload Supporting Documents</Label>
            <p className="text-sm text-gray-600 mb-2">
              Required: Birth certificates of children, Death certificate (if widowed), 
              Legal separation documents (if applicable), etc.
            </p>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <label
                    htmlFor="supportingDocs"
                    className="relative cursor-pointer rounded-md font-medium text-[#23479A] hover:text-[#23479A]/80"
                  >
                    <span>Upload files</span>
                    <input
                      id="supportingDocs"
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

            {supportingDocs.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                {supportingDocs.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
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
            )}
          </div>
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
    </div>
  )
}