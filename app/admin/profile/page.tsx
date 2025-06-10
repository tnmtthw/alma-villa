"use client"

import { useState } from "react"
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

export default function AdminProfile() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

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
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <User2 className="h-12 w-12 text-gray-400" />
              </div>
              <Button variant="outline">Change Photo</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Enter your last name" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-2">
                  <Input type="email" placeholder="Enter your email" />
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
                  <Input placeholder="Enter your phone number" />
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
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="Enter your address" />
            </div>
            <Button className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Save Changes
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
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <Button className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
              Update Password
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