"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, FileText, User, GraduationCap, Briefcase, Target } from "lucide-react"

interface JobSeekerFormProps {
  onBackAction: () => void
}

interface FormData {
  // Personal Information
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
  
  // Educational Background
  educationLevel: string
  courseDegree: string
  school: string
  graduationYear: string
  
  // Employment Information
  employmentStatus: string
  lastEmployer: string
  lastPosition: string
  dateOfSeparation: string
  reasonForSeparation: string
  
  // Job Preferences
  preferredPosition: string
  preferredSalary: string
  preferredWorkLocation: string
  availableStartDate: string
  
  // Skills and Qualifications
  skills: string[]
  certifications: string
  workExperience: string
  
  // Purpose
  purpose: string
}

const sampleData: FormData = {
  lastName: "Dela Cruz",
  firstName: "Juan",
  middleName: "Santos",
  suffix: "",
  birthDate: "1990-01-15",
  age: "33",
  gender: "male",
  civilStatus: "single",
  address: "123 Maharlika Street, Purok 1, Alma Villa, Gloria, Oriental Mindoro",
  contactNumber: "09123456789",
  emailAddress: "juan.delacruz@email.com",
  educationLevel: "college",
  courseDegree: "Bachelor of Science in Business Administration",
  school: "University of the Philippines",
  graduationYear: "2012",
  employmentStatus: "unemployed",
  lastEmployer: "ABC Company Inc.",
  lastPosition: "Sales Associate",
  dateOfSeparation: "2023-12-31",
  reasonForSeparation: "End of contract",
  preferredPosition: "Administrative Assistant",
  preferredSalary: "18000",
  preferredWorkLocation: "Gloria, Oriental Mindoro",
  availableStartDate: "2025-07-01",
  skills: ["Computer Skills", "Customer Service", "Sales"],
  certifications: "TESDA Computer Systems Servicing NC II",
  workExperience: "3 years experience in sales and customer service",
  purpose: "To obtain employment certification for job application"
}

export default function JobSeekerForm({ onBackAction }: JobSeekerFormProps) {
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
    educationLevel: "",
    courseDegree: "",
    school: "",
    graduationYear: "",
    employmentStatus: "",
    lastEmployer: "",
    lastPosition: "",
    dateOfSeparation: "",
    reasonForSeparation: "",
    preferredPosition: "",
    preferredSalary: "",
    preferredWorkLocation: "",
    availableStartDate: "",
    skills: [],
    certifications: "",
    workExperience: "",
    purpose: ""
  })

  const [supportingDocs, setSupportingDocs] = useState<File[]>([])

  const skillOptions = [
    "Computer Skills",
    "Customer Service",
    "Sales",
    "Communication",
    "Leadership",
    "Problem Solving",
    "Data Entry",
    "Microsoft Office",
    "Social Media Management",
    "Accounting",
    "Marketing",
    "Teaching",
    "Manual Labor",
    "Driving",
    "Cooking"
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
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
    // Handle form submission
    console.log("Job Seeker Form submitted:", formData)
    alert("Job seeker certification application submitted successfully!")
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
                <Briefcase className="h-6 w-6 text-[#23479A]" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#23479A]">Job Seeker Certification Application</CardTitle>
                <CardDescription>Complete the form to apply for job seeker certification</CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Badge variant="outline" className="text-green-700 border-green-300">
              Free
            </Badge>
            <Badge variant="outline">
              Processing: 1 day
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
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#23479A]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  placeholder="Enter middle name"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <Input
                  id="suffix"
                  placeholder="Jr., Sr., III, etc."
                  value={formData.suffix}
                  onChange={(e) => handleInputChange('suffix', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Date of Birth *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  required
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
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

              <div className="space-y-2">
                <Label>Civil Status *</Label>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter complete address"
                  required
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  placeholder="Enter contact number"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Educational Background */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[#23479A]" />
              Educational Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Highest Educational Attainment *</Label>
                <Select
                  value={formData.educationLevel}
                  onValueChange={(value) => handleInputChange('educationLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary</SelectItem>
                    <SelectItem value="highschool">High School</SelectItem>
                    <SelectItem value="vocational">Vocational/Technical</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="masteral">Masteral</SelectItem>
                    <SelectItem value="doctoral">Doctoral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseDegree">Course/Degree</Label>
                <Input
                  id="courseDegree"
                  placeholder="Enter course or degree"
                  value={formData.courseDegree}
                  onChange={(e) => handleInputChange('courseDegree', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School/Institution *</Label>
                <Input
                  id="school"
                  placeholder="Enter school name"
                  required
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear">Year Graduated</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  placeholder="Enter graduation year"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Employment Status *</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) => handleInputChange('employmentStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="underemployed">Underemployed</SelectItem>
                    <SelectItem value="employed">Currently Employed</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastEmployer">Last Employer (if applicable)</Label>
                <Input
                  id="lastEmployer"
                  placeholder="Enter last employer"
                  value={formData.lastEmployer}
                  onChange={(e) => handleInputChange('lastEmployer', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastPosition">Last Position Held</Label>
                <Input
                  id="lastPosition"
                  placeholder="Enter last position"
                  value={formData.lastPosition}
                  onChange={(e) => handleInputChange('lastPosition', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfSeparation">Date of Separation</Label>
                <Input
                  id="dateOfSeparation"
                  type="date"
                  value={formData.dateOfSeparation}
                  onChange={(e) => handleInputChange('dateOfSeparation', e.target.value)}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="reasonForSeparation">Reason for Separation</Label>
                <Input
                  id="reasonForSeparation"
                  placeholder="Enter reason for separation"
                  value={formData.reasonForSeparation}
                  onChange={(e) => handleInputChange('reasonForSeparation', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#23479A]" />
              Job Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredPosition">Preferred Position/Job *</Label>
                <Input
                  id="preferredPosition"
                  placeholder="Enter preferred position"
                  required
                  value={formData.preferredPosition}
                  onChange={(e) => handleInputChange('preferredPosition', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredSalary">Preferred Salary Range (PHP)</Label>
                <Input
                  id="preferredSalary"
                  type="number"
                  placeholder="Enter preferred salary"
                  value={formData.preferredSalary}
                  onChange={(e) => handleInputChange('preferredSalary', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredWorkLocation">Preferred Work Location</Label>
                <Input
                  id="preferredWorkLocation"
                  placeholder="Enter preferred work location"
                  value={formData.preferredWorkLocation}
                  onChange={(e) => handleInputChange('preferredWorkLocation', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableStartDate">Available Start Date</Label>
                <Input
                  id="availableStartDate"
                  type="date"
                  value={formData.availableStartDate}
                  onChange={(e) => handleInputChange('availableStartDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills and Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Skills and Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Skills (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skillOptions.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={formData.skills.includes(skill)}
                      onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                    />
                    <Label htmlFor={skill} className="text-sm font-normal">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications/Training</Label>
              <Textarea
                id="certifications"
                placeholder="List your certifications, training, or licenses"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workExperience">Work Experience Summary</Label>
              <Textarea
                id="workExperience"
                placeholder="Briefly describe your work experience"
                value={formData.workExperience}
                onChange={(e) => handleInputChange('workExperience', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle>Purpose of Application</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                placeholder="State the purpose for this job seeker certification"
                required
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Supporting Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
            <CardDescription>
              Upload your resume, certificates, or other relevant documents (Optional)
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

              {supportingDocs.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  <div className="space-y-2">
                    {supportingDocs.map((file, index) => (
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
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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