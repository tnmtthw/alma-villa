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
  EyeOff,
  Loader2,
  CheckCircle2Icon,
  BadgeCheck
} from "lucide-react"
import { useSession } from "next-auth/react"
import useSWR, { mutate } from 'swr'
import ChangePasswordModal from "./profileComponents/changePasswordModal"

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  email: string;
  mobileNumber?: string;
  phone?: string; // Added for compatibility
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
  address?: string; // Added for compatibility
  street?: string; // Added for street address
}

export default function UserProfile() {
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [isClient, setIsClient] = useState(false)
  const { data: session } = useSession()

  const { data: apiData } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  // Use the same logic as MainNav for consistent data display
  const getUserFullName = () => {
    if (!apiData) return session?.user?.name || "User";

    const fullName = [apiData?.firstName, apiData?.middleName, apiData?.lastName]
      .filter(Boolean) // Remove null/undefined values
      .join(' ');

    return fullName || session?.user?.name || "User";
  }

  const getUserEmail = () => {
    return apiData?.email || session?.user?.email || "No email provided";
  }

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

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Initialize form data with existing API data first, then registration data
  const [formData, setFormData] = useState<Partial<UserData>>({})

  useEffect(() => {
    if (isClient && apiData) {
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

      // Prioritize API data for name and email, fallback to registration data for other fields
      const combinedData = {
        // Use API data first for name and email to match MainNav
        firstName: apiData?.firstName || registrationData?.firstName || "",
        lastName: apiData?.lastName || registrationData?.lastName || "",
        middleName: apiData?.middleName || registrationData?.middleName || "",
        suffix: apiData?.suffix || registrationData?.suffix || "",
        email: apiData?.email || registrationData?.email || "",

        // Enhanced with registration-specific fields (fallback to registration data)
        mobileNumber: apiData?.mobileNumber || registrationData?.mobileNumber || "",
        birthDate: apiData?.birthDate || registrationData?.birthDate || "",
        age: apiData?.age || registrationData?.age || "",
        gender: apiData?.gender || registrationData?.gender || "",
        civilStatus: apiData?.civilStatus || registrationData?.civilStatus || "",
        nationality: apiData?.nationality || registrationData?.nationality || "",
        religion: apiData?.religion || registrationData?.religion || "",
        emergencyContact: apiData?.emergencyContact || registrationData?.emergencyContact || "",
        emergencyNumber: apiData?.emergencyNumber || registrationData?.emergencyNumber || "",

        // Address fields - enhanced from registration
        purok: apiData?.purok || registrationData?.purok || "", // Sitio
        barangay: apiData?.barangay || registrationData?.barangay || "Alma Villa",
        city: apiData?.city || registrationData?.city || "Gloria",
        province: apiData?.province || registrationData?.province || "Oriental Mindoro",
        zipCode: apiData?.zipCode || registrationData?.zipCode || "5209",
        residencyLength: apiData?.residencyLength || registrationData?.residencyLength || "",

        // Keep existing fields for compatibility
        phone: apiData?.mobileNumber || apiData?.phone || registrationData?.mobileNumber || "",
        address: apiData?.street || apiData?.address || registrationData?.street || "",
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
    } else if (field === 'mobileNumber' || field === 'emergencyNumber' || field === 'phone') {
      const formatted = formatMobileNumber(value)
      setFormData(prev => ({
        ...prev,
        [field]: formatted,
        // Keep phone and mobileNumber in sync
        ...(field === 'phone' && { mobileNumber: formatted }),
        ...(field === 'mobileNumber' && { phone: formatted }),
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const openPasswordModal = () => {
    setShowPasswordModal(true)
  }

  const handleSaveProfile = async () => {
    if (!session?.user?.id) {
      alert("User session not found. Please log in again.")
      return
    }

    setIsSavingProfile(true)

    try {
      // Prepare the data for API update
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        suffix: formData.suffix,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        birthDate: formData.birthDate,
        age: formData.age,
        gender: formData.gender,
        civilStatus: formData.civilStatus,
        nationality: formData.nationality,
        religion: formData.religion,
        emergencyContact: formData.emergencyContact,
        emergencyNumber: formData.emergencyNumber,
        purok: formData.purok,
        barangay: formData.barangay,
        city: formData.city,
        province: formData.province,
        zipCode: formData.zipCode,
        residencyLength: formData.residencyLength,
        street: formData.street || formData.address
      }

      // Remove undefined values and sanitize data
      const cleanData = Object.fromEntries(
        Object.entries(updateData)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [
            key,
            typeof value === 'string' ?
              value.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, '') : // Remove control characters
              value
          ])
      )

      console.log('Sending data to API:', cleanData)

      const response = await fetch(`/api/user/profile?id=${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`Failed to update profile: ${response.status} - ${errorData.error || 'Unknown error'}`)
      }

      // Update localStorage with the new data
      if (isClient) {
        localStorage.setItem('residentInfoData', JSON.stringify(formData))
      }

      setIsEditing(false)
      alert("Profile updated successfully!")

      // Refresh the data by revalidating SWR
      await mutate(`/api/user?id=${session.user.id}`)

    } catch (error) {
      console.error('Error updating profile:', error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSavingProfile(false)
    }
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
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <User2 className="h-5 w-5 text-[#23479A]" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Manage your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                <div className="space-y-2 md:col-span-2">
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
                    disabled={isSavingProfile}
                    className="bg-[#23479A] hover:bg-[#23479A]/90 w-full sm:w-auto"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
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
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Mail className="h-5 w-5 text-[#23479A]" />
                Contact & Address Information
              </CardTitle>
              <CardDescription>
                Update your contact details and residential address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                    value={formData.mobileNumber || formData.phone || ""}
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
                      value={formData.purok || formData.address || ""}
                      onChange={(e) => handleInputChange('purok', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                    disabled={isSavingProfile}
                    className="bg-[#23479A] hover:bg-[#23479A]/90 w-full sm:w-auto"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
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
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Lock className="h-5 w-5 text-[#23479A]" />
                  Password & Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500 mt-1">Change your account password</p>
                  </div>
                  <Button
                    onClick={openPasswordModal}
                    className="bg-[#23479A] hover:bg-[#23479A]/90 w-full sm:w-auto"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Account Verification</CardTitle>
                <CardDescription>
                  Your account verification status and uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-green-900">Identity Verified</p>
                      <p className="text-sm text-green-700 truncate">Valid ID uploaded and verified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-green-900">Residence Verified</p>
                      <p className="text-sm text-green-700 truncate">Address confirmation completed</p>
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
    <>
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  {/* Avatar Section */}


                  <div className="relative flex-shrink-0">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-[#23479A] text-white text-lg sm:text-xl">
                        {getUserFullName().split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute -bottom-1 -right-1 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white border-0 border-gray-200 shadow-sm flex items-center justify-center">
                      <BadgeCheck className="h-6 w-6 text-green-500 sm:h-8 sm:w-8" />
                    </div>
                  </div>


                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          {getUserFullName()}
                        </h1>
                        <p className="text-gray-600 mt-1 truncate">{getUserEmail()}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {/* <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {isClient ? "Verified" : "Verified"}
                          </Badge> */}
                          <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Active Member
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => setIsEditing(!isEditing)}
                          variant={isEditing ? "outline" : "default"}
                          className={`w-full sm:w-auto ${isEditing ? "border-gray-300" : "bg-[#23479A] hover:bg-[#23479A]/90"}`}
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation - Mobile Responsive */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
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
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
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
      </div>

      {/* Password Change Modal */}
      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  )
}