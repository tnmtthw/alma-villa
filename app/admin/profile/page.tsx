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

  // Form states
  const [userData, setUserData] = useState<UserData>({
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

  // Message states
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const { data: apiData } = useSWR(`/api/user?id=${session?.user.id}`, fetcher)

  // Load user data when API data is available
  useEffect(() => {
    if (apiData) {
      setUserData({
        firstName: apiData.firstName || '',
        lastName: apiData.lastName || '',
        email: apiData.email || '',
        mobileNumber: apiData.mobileNumber || ''
      })
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
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
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
            <CardTitle className="flex items-center gap-2">
              <User2 className="h-5 w-5 text-[#23479A]" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <User2 className="h-12 w-12 text-gray-400" />
              </div>
              <Button variant="outline">Change Photo</Button>
            </div> */}

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
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Enter your last name"
                  value={userData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
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
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-[#23479A] hover:text-white hover:border-[#23479A] transition-all duration-200 hover:shadow-md"
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
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-[#23479A] hover:text-white hover:border-[#23479A] transition-all duration-200 hover:shadow-md"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleUpdateProfile}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
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
            <Button
              className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </CardContent>
        </Card>

        <Card>
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
        </Card>
      </div>
    </div>
  )
} 