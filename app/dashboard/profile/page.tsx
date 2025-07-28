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
  User2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Settings,
  ChevronDown,
  Key,
  Check
} from "lucide-react"
import { useSession } from "next-auth/react"
import useSWR from 'swr'

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

export default function UserProfile() {
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const { data: session } = useSession()

  const { data } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  // Set active tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && ["personal", "contact", "security", "settings"].includes(tabParam)) {
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
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    newsletter: true
  })

  const [formData, setFormData] = useState({
    firstName: data?.firstName,
    lastName: data?.lastName,
    email: data?.email,
    phone: data?.mobileNumber,
    address: data?.street,
    barangay: data?.barangay,
    city: data?.city,
    province: data?.province,
    zipCode: data?.zipCode,
    birthDate: data?.birthDate,
    gender: data?.Male,
    civilStatus: data?.civilStatus,
    occupation: "Software Developer",
    bio: "Resident of Barangay Alma Villa, actively participating in community events and local governance initiatives."
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear errors when user starts typing
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Here you would call your password change API
      // const response = await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // })

      // Reset form and close modal on success
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setPasswordErrors({ current: "", new: "", confirm: "" })
      setShowChangePassword(false)

      // Show success message (you could use a toast notification)
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

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User2 },
    { id: "contact", label: "Contact & Address", icon: Mail },
    { id: "security", label: "Security", icon: Lock },
    { id: "settings", label: "Preferences", icon: Settings }
  ]

  // Custom Switch Component
  const CustomSwitch = ({ checked, onCheckedChange, id }: { checked: boolean; onCheckedChange: (checked: boolean) => void; id: string }) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-[#23479A]' : 'bg-gray-200'
        }`}>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
          }`} />
      </div>
    </label>
  )

  // Custom Select Component
  const CustomSelect = ({ value, onChange, options, disabled, placeholder }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    disabled: boolean;
    placeholder?: string;
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#23479A] focus:border-transparent appearance-none ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'
          }`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  )

  // Custom Textarea Component
  const CustomTextarea = ({ value, onChange, disabled, placeholder, rows = 3 }: {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    placeholder?: string;
    rows?: number;
  }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#23479A] focus:border-transparent resize-none ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'
        }`}
    />
  )

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
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <CustomSelect
                    value={formData.gender}
                    onChange={(value) => handleInputChange('gender', value)}
                    disabled={!isEditing}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" }
                    ]}
                    placeholder="Select gender"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="civilStatus">Civil Status</Label>
                  <CustomSelect
                    value={formData.civilStatus}
                    onChange={(value) => handleInputChange('civilStatus', value)}
                    disabled={!isEditing}
                    options={[
                      { value: "Single", label: "Single" },
                      { value: "Married", label: "Married" },
                      { value: "Widowed", label: "Widowed" },
                      { value: "Separated", label: "Separated" }
                    ]}
                    placeholder="Select status"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <CustomTextarea
                  value={formData.bio}
                  onChange={(value) => handleInputChange('bio', value)}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
              {isEditing && (
                <div className="flex justify-end">
                  <Button className="bg-[#23479A] hover:bg-[#23479A]/90">
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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Residential Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="barangay">Barangay</Label>
                      <Input
                        id="barangay"
                        value={formData.barangay}
                        onChange={(e) => handleInputChange('barangay', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City/Municipality</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      <Input
                        id="province"
                        value={formData.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end">
                  <Button className="bg-[#23479A] hover:bg-[#23479A]/90">
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

      case "settings":
        return (
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#23479A]" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <CustomSwitch
                    id="email-notif"
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                  </div>
                  <CustomSwitch
                    id="sms-notif"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                  </div>
                  <CustomSwitch
                    id="push-notif"
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Newsletter</h3>
                    <p className="text-sm text-gray-500">Receive monthly community updates</p>
                  </div>
                  <CustomSwitch
                    id="newsletter-notif"
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) => handleNotificationChange('newsletter', checked)}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-end">
                  <Button className="bg-[#23479A] hover:bg-[#23479A]/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
                      {formData.firstName[0]}{formData.lastName[0]}
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
                        {formData.firstName} {formData.lastName}
                      </h1>
                      <p className="text-gray-600 mt-1">{formData.email}</p>
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

        {/* Custom Tab Navigation */}
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