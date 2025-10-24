"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lock,
  User2,
  Activity,
  CheckCircle2,
  Globe,
  Eye,
  EyeOff,
  RefreshCw,
  X,
} from "lucide-react"

export default function AdminSecuritySettings() {
  const { data: session } = useSession()
  // State for password change
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  // Toggle password change form visibility
  const handleTogglePasswordChange = () => {
    setShowPasswordChange(!showPasswordChange)
    if (!showPasswordChange) {
      // Clear password fields when opening
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("")
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match")
      setMessageType("error")
      return
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/auth/change-password?id=${session?.user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password updated successfully")
        setMessageType("success")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowPasswordChange(false)
      } else {
        setMessage(data.error || "Failed to update password")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("An error occurred while updating password")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const loginHistory = [
    {
      device: "Windows PC - Chrome",
      location: "Manila, Philippines",
      time: "2 hours ago",
      status: "success",
      ip: "192.168.1.1"
    },
    {
      device: "iPhone 13 - Safari",
      location: "Manila, Philippines", 
      time: "Yesterday",
      status: "success",
      ip: "192.168.1.2"
    },
    {
      device: "MacBook Pro - Firefox",
      location: "Quezon City, Philippines",
      time: "3 days ago",
      status: "success",
      ip: "192.168.1.3"
    }
  ]

  return (
    <div className="space-y-6 max-w-full mx-auto p-6 bg-gray-50/30 min-h-screen">
      {/* Modern Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Security Settings
          </h1>
          <p className="text-gray-600">
            Manage your account security and administrator access
          </p>
        </div>
      </div>

      {/* Security Stats Cards
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-[#23479A] to-[#23479A]/80 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Account Status</p>
                <p className="text-xl font-bold">Secure</p>
              </div>
              <Lock className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Last Login</p>
                <p className="text-xl font-bold">2 hrs ago</p>
              </div>
              <Activity className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Sessions</p>
                <p className="text-xl font-bold">1 Active</p>
              </div>
              <User2 className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Security Settings Content */}
      <div className="space-y-6">
        {/* Change Password Card */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Lock className="h-5 w-5 text-[#23479A]" />
              Change Password
              </CardTitle>
              <CardDescription className="text-gray-600">
              Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
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
                
                {message && (
                  <div className={`p-4 rounded-lg ${
                    messageType === "success" 
                      ? "bg-green-50 border border-green-200 text-green-800" 
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}>
                    {message}
                  </div>
                )}
                
                <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                      <div className="relative">
                        <Input 
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                          className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">New Password</Label>
                      <div className="relative">
                        <Input 
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                          className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                          className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      className="bg-[#23479A] hover:bg-[#23479A]/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
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

        {/* Administrator Accounts Card */}
        {/* <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <User2 className="h-5 w-5 text-[#23479A]" />
                Administrator Accounts
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage administrator accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">Active Administrators</h4>
                  <p className="text-sm text-gray-500">2 users with admin privileges</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#23479A] to-[#23479A]/80 rounded-full flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Juan Dela Cruz</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Super Admin</Badge>
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      MS
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Maria Santos</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Admin</Badge>
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
        </Card> */}

        {/* Login History Card */}
        {/* <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Activity className="h-5 w-5 text-[#23479A]" />
                Login History & Security
              </CardTitle>
              <CardDescription className="text-gray-600">
                Review your recent login activity and security events
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {loginHistory.map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{login.device}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Globe className="h-3 w-3" />
                          <span>{login.location}</span>
                          <span>•</span>
                          <span>{login.ip}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{login.time}</p>
                      <Badge className="bg-green-100 text-green-800 text-xs">Successful</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
        </Card> */}
                  </div>
    </div>
  )
}