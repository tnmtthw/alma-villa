"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  User2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Bell,
  Shield,
  Edit,
  Save,
  X,
} from "lucide-react"
import { useSession } from "next-auth/react"
import useSWR, { mutate } from 'swr'

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) => fetch(...args).then((res) => res.json());

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AdminProfile() {
  const { data: session } = useSession()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false)

  // Form states
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
  })
  const [originalUserData, setOriginalUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
  })
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Loading states
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Password change visibility state
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  // Message states
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const { data: apiData } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  // Load user data when API data is available
  useEffect(() => {
    if (apiData) {
      const newUserData = {
        firstName: apiData.firstName || '',
        lastName: apiData.lastName || '',
        email: apiData.email || '',
        mobileNumber: apiData.mobileNumber || ''
      }
      setUserData(newUserData)
      setOriginalUserData(newUserData)
    }
  }, [apiData])

  // Handle profile data changes
  const handleProfileChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
    setProfileMessage(null)
  }

  // Handle password data changes
  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    setPasswordMessage(null)
  }

  // Enter edit mode
  const handleEditMode = () => {
    setIsEditMode(true)
    setProfileMessage(null)
  }

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false)
    setUserData(originalUserData) // Reset to original data
    setProfileMessage(null)
  }

  // Update profile information
  const handleUpdateProfile = async () => {
    if (!session?.user?.id) {
      setProfileMessage({ type: 'error', text: 'User session not found' })
      return
    }

    setIsSavingProfile(true)
    setProfileMessage(null)

    try {
      const cleanData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobileNumber: userData.mobileNumber
      }

      const response = await fetch(`/api/user/profile?id=${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      })

      if (response.ok) {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' })
        setOriginalUserData(userData) // Update original data
        setIsEditMode(false) // Exit edit mode
        // Refresh the user data
        mutate(`/api/user?id=${session.user.id}`)
      } else {
        const errorData = await response.json()
        setProfileMessage({ type: 'error', text: errorData.error || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setProfileMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Toggle password change form visibility
  const handleTogglePasswordChange = () => {
    setShowPasswordChange(!showPasswordChange)
    if (!showPasswordChange) {
      // Clear password fields when opening
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordMessage(null)
    }
  }

  // Update password
  const handleUpdatePassword = async () => {
    if (!session?.user?.id) {
      setPasswordMessage({ type: 'error', text: 'User session not found' })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }

    setIsUpdatingPassword(true)
    setPasswordMessage(null)

    try {
      const response = await fetch(`/api/auth/change-password?id=${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      })

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' })
        // Clear password fields and hide form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setShowPasswordChange(false)
      } else {
        const errorData = await response.json()
        setPasswordMessage({ type: 'error', text: errorData.error || 'Failed to update password' })
      }
    } catch (error) {
      console.error('Password update error:', error)
      setPasswordMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-gray-500">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="h-5 w-5 text-[#23479A]" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and contact information.
                </CardDescription>
              </div>
              {!isEditMode && (
                <Button
                  variant="outline"
                  onClick={handleEditMode}
                  className="flex items-center gap-2 hover:bg-[#23479A] hover:text-white hover:border-[#23479A] transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {profileMessage && (
              <div className={`p-3 rounded-md ${profileMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                {profileMessage.text}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  placeholder="Enter your first name"
                  value={userData.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  disabled={!isEditMode}
                  className={!isEditMode ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Enter your last name"
                  value={userData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  disabled={!isEditMode}
                  className={!isEditMode ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={userData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditMode}
                    className={!isEditMode ? "bg-gray-50 cursor-not-allowed" : ""}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-[#23479A] hover:text-white hover:border-[#23479A] transition-all duration-200 hover:shadow-md"
                    disabled={!isEditMode}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter your phone number"
                    value={userData.mobileNumber}
                    onChange={(e) => handleProfileChange('mobileNumber', e.target.value)}
                    disabled={!isEditMode}
                    className={!isEditMode ? "bg-gray-50 cursor-not-allowed" : ""}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-[#23479A] hover:text-white hover:border-[#23479A] transition-all duration-200 hover:shadow-md"
                    disabled={!isEditMode}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {isEditMode && (
              <div className="flex items-center gap-3">
                <Button
                  className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                  onClick={handleUpdateProfile}
                  disabled={isSavingProfile}
                >
                  <Save className="h-4 w-4" />
                  {isSavingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#23479A]" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account security and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showPasswordChange ? (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500 mt-1">Change your account password</p>
                </div>
                <Button
                  onClick={handleTogglePasswordChange}
                  className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  <Button
                    variant="outline"
                    onClick={handleTogglePasswordChange}
                    className="flex items-center gap-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
                
                {passwordMessage && (
                  <div className={`p-3 rounded-md ${passwordMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {passwordMessage.text}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                    onClick={handleUpdatePassword}
                    disabled={isUpdatingPassword}
                  >
                    <Lock className="h-4 w-4" />
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTogglePasswordChange}
                    className="flex items-center gap-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#23479A]" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email.
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via SMS.
                </p>
              </div>
              <Switch
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
            <div className="space-y-4">
              <Label>Notification Types</Label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked className="rounded border-gray-200" />
                  <span>New Registrations</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked className="rounded border-gray-200" />
                  <span>System Updates</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked className="rounded border-gray-200" />
                  <span>Security Alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked className="rounded border-gray-200" />
                  <span>Maintenance Notices</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#23479A]" />
              Account Activity
            </CardTitle>
            <CardDescription>
              Recent login activity and sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Windows PC - Chrome</p>
                  <p className="text-sm text-gray-500">Manila, Philippines</p>
                </div>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">iPhone 13 - Safari</p>
                  <p className="text-sm text-gray-500">Manila, Philippines</p>
                </div>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
              <Button variant="outline" className="w-full hover:bg-[#23479A] hover:text-white hover:border-[#23479A] transition-all duration-200 hover:shadow-md">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
} 