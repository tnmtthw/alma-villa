"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User2,
  Mail,
  Phone,
  Lock,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Key,
  Check,
  Shield,
  Eye,
  EyeOff
} from "lucide-react"
import { useSession } from "next-auth/react"
import useSWR from 'swr'

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  email: string;
  mobileNumber?: string;
  birthDate: string;
  age: string;
  gender: string;
  civilStatus: string;
  nationality: string;
  religion: string;
  emergencyContact: string;
  emergencyNumber: string;
  purok: string; // Sitio
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  residencyLength: string;
}

export default function UserProfile() {
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const { data: session } = useSession()
  const [isClient, setIsClient] = useState(false)

  const { data: apiData } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Set active tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && ["personal", "contact", "security"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Initialize form data with data from localStorage first, then API data
  const [formData, setFormData] = useState<Partial<UserData>>({})

  useEffect(() => {
    if (isClient) {
      // First, try to get data from localStorage (registration data)
      const savedRegistrationData = localStorage.getItem('residentInfoData')
      let registrationData = null
      
      if (savedRegistrationData) {
        try {
          registrationData = JSON.parse(savedRegistrationData)
        } catch (error) {
          console.error('Error parsing registration data:', error)
        }
      }

      // Merge API data with registration data, prioritizing registration data
      const combinedData = {
        firstName: registrationData?.firstName || apiData?.firstName || "",
        lastName: registrationData?.lastName || apiData?.lastName || "",
        middleName: registrationData?.middleName || apiData?.middleName || "",
        suffix: registrationData?.suffix || apiData?.suffix || "",
        email: registrationData?.email || apiData?.email || "",
        mobileNumber: registrationData?.mobileNumber || apiData?.mobileNumber || "",
        birthDate: registrationData?.birthDate || apiData?.birthDate || "",
        age: registrationData?.age || apiData?.age || "",
        gender: registrationData?.gender || apiData?.gender || "",
        civilStatus: registrationData?.civilStatus || apiData?.civilStatus || "",
        nationality: registrationData?.nationality || apiData?.nationality || "",
        religion: registrationData?.religion || apiData?.religion || "",
        emergencyContact: registrationData?.emergencyContact || apiData?.emergencyContact || "",
        emergencyNumber: registrationData?.emergencyNumber || apiData?.emergencyNumber || "",
        purok: registrationData?.purok || apiData?.purok || "", // Sitio
        barangay: registrationData?.barangay || apiData?.barangay || "Alma Villa",
        city: registrationData?.city || apiData?.city || "Gloria",
        province: registrationData?.province || apiData?.province || "Oriental Mindoro",
        zipCode: registrationData?.zipCode || apiData?.zipCode || "5209",
        residencyLength: registrationData?.residencyLength || apiData?.residencyLength || ""
      }

      setFormData(combinedData)
    }
  }, [isClient, apiData])

  // Calculate age automatically when birthDate changes
  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return ""
    
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age.toString()
  }

  // Format mobile number with +63 and numbers only
  const formatMobileNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '')
    
    if (digits.startsWith('63')) {
      const withoutCountryCode = digits.slice(2)
      const limited = withoutCountryCode.slice(0, 10)
      return `+63${limited}`
    }
    
    if (digits.startsWith('0')) {
      const withoutZero = digits.slice(1)
      const limited = withoutZero.slice(0, 10)
      return `+63${limited}`
    }
    
    const limited = digits.slice(0, 10)
    return limited ? `+63${limited}` : ""
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'birthDate') {
      const age = calculateAge(value)
      setFormData(prev => ({
        ...prev,
        [field]: value,
        age: age
      }))
    } else if (field === 'mobileNumber' || field === 'emergencyNumber') {
      const formatted = formatMobileNumber(value)
      setFormData(prev => ({
        ...prev,
        [field]: formatted
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))

    setPasswordErrors(prev => ({
      ...prev,
      [field]: ""
    }))
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }

    strength = Object.values(checks).filter(Boolean).length

    return {
      score: strength,
      checks,
      level: strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong'
    }
  }

  const validatePasswords = () => {
    const errors = { current: "", new: "", confirm: "" }
    let isValid = true

    if (!passwordData.currentPassword) {
      errors.current = "Current password is required"
      isValid = false
    }

    if (!passwordData.newPassword) {
      errors.new = "New password is required"
      isValid = false
    } else if (passwordData.newPassword.length < 8) {
      errors.new = "Password must be at least 8 characters long"
      isValid = false
    }

    if (!passwordData.confirmPassword) {
      errors.confirm = "Please confirm your new password"
      isValid = false
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirm = "Passwords do not match"
      isValid = false
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.new = "New password must be different from current password"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswords()) return

    setIsChangingPassword(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setPasswordErrors({ current: "", new: "", confirm: "" })
      setShowChangePassword(false)

      alert("Password changed successfully!")

    } catch (error) {
      setPasswordErrors(prev => ({
        ...prev,
        current: "Failed to change password. Please try again."
      }))
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSaveProfile = () => {
    // Save the updated profile data
    console.log('Saving profile data:', formData)
    
    // Here you would typically make an API call to save the data
    // Example: await updateUserProfile(formData)
    
    // Update localStorage with the new data
    if (isClient) {
      localStorage.setItem('residentInfoData', JSON.stringify(formData))
    }
    
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User2 },
    { id: "contact", label: "Contact & Address", icon: Mail },
    { id: "security", label: "Security", icon: Lock }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="h-5 w-5 text-[#23479A]" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Manage your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ""}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ""}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName || ""}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Input
                    id="suffix"
                    value={formData.suffix || ""}
                    onChange={(e) => handleInputChange('suffix', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate || ""}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    max="2025-12-31"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    disabled={true}
                    className="bg-gray-50"
                    placeholder="Calculated from birth date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender || ""}
                    onValueChange={(value) => handleInputChange('gender', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="civilStatus">Civil Status</Label>
                  <Select
                    value={formData.civilStatus || ""}
                    onValueChange={(value) => handleInputChange('civilStatus', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
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
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality || ""}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Input
                    id="religion"
                    value={formData.religion || ""}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residencyLength">Length of Residency (years)</Label>
                  <Input
                    id="residencyLength"
                    type="number"
                    value={formData.residencyLength || ""}
                    onChange={(e) => handleInputChange('residencyLength', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-[#23479A] hover:bg-[#23479A]/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "contact":
        return (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#23479A]" />
                Contact & Address Information
              </CardTitle>
              <CardDescription>
                Update your contact details and residential address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    value={formData.mobileNumber || ""}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="+639123456789"
                    maxLength={13}
                  />
                  <p className="text-xs text-gray-500">Format: +63 followed by 10 digits</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Person</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact || ""}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyNumber">Emergency Contact Number</Label>
                    <Input
                      id="emergencyNumber"
                      value={formData.emergencyNumber || ""}
                      onChange={(e) => handleInputChange('emergencyNumber', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                      placeholder="+639123456789"
                      maxLength={13}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Residential Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purok">Sitio</Label>
                    <Input
                      id="purok"
                      value={formData.purok || ""}
                      onChange={(e) => handleInputChange('purok', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="barangay">Barangay</Label>
                      <Input
                        id="barangay"
                        value={formData.barangay || "Alma Villa"}
                        disabled={true}
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">Default barangay name</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Municipality</Label>
                      <Input
                        id="city"
                        value={formData.city || "Gloria"}
                        disabled={true}
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">Default municipality name</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        value={formData.province || "Oriental Mindoro"}
                        disabled={true}
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">Default province name</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode || "5209"}
                        disabled={true}
                        className="bg-gray-100"
                      />
                      <p className="text-xs text-gray-500">Default ZIP code</p>
                    </div>
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-[#23479A] hover:bg-[#23479A]/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "security":
        return (
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#23479A]" />
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Password</h3>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowChangePassword(true)}
                      className="hover:bg-[#23479A]/5 hover:border-[#23479A]"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Account Verification</CardTitle>
                <CardDescription>
                  Your account verification status and uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Identity Verified</p>
                      <p className="text-sm text-green-700">Valid ID uploaded and verified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Residence Verified</p>
                      <p className="text-sm text-green-700">Address confirmation completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar Section */}
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-[#23479A] text-white text-xl">
                      {(formData.firstName || "U")[0]}{(formData.lastName || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border-2 border-gray-200 shadow-sm hover:bg-gray-50"
                    variant="outline"
                  >
                    <Camera className="h-3 w-3 text-gray-600" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {formData.firstName || "User"} {formData.middleName ? `${formData.middleName} ` : ""}{formData.lastName || ""} {formData.suffix || ""}
                      </h1>
                      <p className="text-gray-600 mt-1">{formData.email || "No email provided"}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified Resident
                        </Badge>
                        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                          <Shield className="h-3 w-3 mr-1" />
                          Active Member
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      className={isEditing ? "border-gray-300" : "bg-[#23479A] hover:bg-[#23479A]/90"}
                    >
                      {isEditing ? (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id
                      ? 'border-[#23479A] text-[#23479A]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-[#23479A]/10 p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-[#23479A]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowChangePassword(false)
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  setPasswordErrors({ current: "", new: "", confirm: "" })
                }}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePassword} className="p-6 space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password"
                    className={`pr-10 ${passwordErrors.current ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-[#23479A] focus:ring-[#23479A]/20'}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {passwordErrors.current && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordErrors.current}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter your new password"
                    className={`pr-10 ${passwordErrors.new ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-[#23479A] focus:ring-[#23479A]/20'}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {passwordErrors.new && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordErrors.new}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="space-y-2">
                    {(() => {
                      const strength = getPasswordStrength(passwordData.newPassword)
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${strength.level === 'weak' ? 'bg-red-500 w-1/3' :
                                  strength.level === 'medium' ? 'bg-yellow-500 w-2/3' :
                                    'bg-green-500 w-full'
                                  }`}
                              />
                            </div>
                            <span className={`text-xs font-medium ${strength.level === 'weak' ? 'text-red-600' :
                              strength.level === 'medium' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                              {strength.level === 'weak' ? 'Weak' :
                                strength.level === 'medium' ? 'Medium' : 'Strong'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center gap-1 ${strength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                              <Check className="h-3 w-3" />
                              8+ characters
                            </div>
                            <div className={`flex items-center gap-1 ${strength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                              <Check className="h-3 w-3" />
                              Uppercase letter
                            </div>
                            <div className={`flex items-center gap-1 ${strength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                              <Check className="h-3 w-3" />
                              Lowercase letter
                            </div>
                            <div className={`flex items-center gap-1 ${strength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                              <Check className="h-3 w-3" />
                              Number
                            </div>
                            <div className={`flex items-center gap-1 ${strength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                              <Check className="h-3 w-3" />
                              Special character
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your new password"
                    className={`pr-10 ${passwordErrors.confirm ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-[#23479A] focus:ring-[#23479A]/20'}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {passwordErrors.confirm && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordErrors.confirm}
                  </p>
                )}

                {/* Password Match Indicator */}
                {passwordData.confirmPassword && passwordData.newPassword && (
                  <div className={`text-sm flex items-center gap-1 ${passwordData.newPassword === passwordData.confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        Passwords do not match
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowChangePassword(false)
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    setPasswordErrors({ current: "", new: "", confirm: "" })
                  }}
                  disabled={isChangingPassword}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#23479A] hover:bg-[#23479A]/90"
                  disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}