"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bell,
  Building2,
  Lock,
  Mail,
  Shield,
  User2,
  Palette,
  Database,
  BellRing,
  FileSpreadsheet,
  Settings2,
  Save,
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Activity,
  HardDrive,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react"

export default function ModernAdminSettings() {
  // State for various settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [systemNotifications, setSystemNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Show success message
    }, 1000)
  }

  const tabItems = [
    { value: "general", label: "General", icon: Building2 },
    { value: "notifications", label: "Notifications", icon: BellRing },
    { value: "security", label: "Security", icon: Lock },
    { value: "system", label: "System", icon: Database },
  ]

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
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your admin preferences and system configurations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-[#23479A]/20 text-[#23479A] hover:bg-[#23479A]/5">
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          <Button 
            size="sm" 
            className="bg-[#23479A] hover:bg-[#23479A]/90 shadow-lg"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#23479A] to-[#23479A]/80 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">System Status</p>
                <p className="text-xl font-bold">Active</p>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Last Backup</p>
                <p className="text-xl font-bold">2 hrs ago</p>
              </div>
              <Database className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Storage Used</p>
                <p className="text-xl font-bold">2.4 GB</p>
              </div>
              <HardDrive className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Notifications</p>
                <p className="text-xl font-bold">12 New</p>
              </div>
              <Bell className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-2">
          <TabsList className="bg-transparent w-full justify-start gap-2">
            {tabItems.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-[#23479A] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Building2 className="h-5 w-5 text-[#23479A]" />
                Barangay Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your barangay's basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Barangay Name</Label>
                  <Input 
                    placeholder="Enter barangay name" 
                    defaultValue="Alma Villa"
                    className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Municipality/City</Label>
                  <Input 
                    placeholder="Enter municipality/city" 
                    defaultValue="Gloria, Oriental Mindoro"
                    className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Contact Number</Label>
                  <Input 
                    placeholder="Enter contact number" 
                    defaultValue="09123456789"
                    className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    defaultValue="almavilla.gloria@gmail.com"
                    className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <User2 className="h-5 w-5 text-[#23479A]" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your admin profile and account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Admin Name</Label>
                  <Input 
                    placeholder="Enter your name" 
                    defaultValue="Juan Dela Cruz"
                    className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Position</Label>
                  <Input 
                    placeholder="Enter your position" 
                    defaultValue="Barangay Administrator"
                    className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Bio</Label>
                <Input 
                  placeholder="Enter a short bio" 
                  defaultValue="Dedicated to serving the community of Alma Villa"
                  className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Palette className="h-5 w-5 text-[#23479A]" />
                Appearance & Interface
              </CardTitle>
              <CardDescription className="text-gray-600">
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-900">Dark Mode</Label>
                  <p className="text-sm text-gray-500">
                    Enable dark mode for better visibility in low light conditions
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="border-gray-200 focus:border-[#23479A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fil">Filipino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Timezone</Label>
                  <Select defaultValue="pht">
                    <SelectTrigger className="border-gray-200 focus:border-[#23479A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pht">Philippine Time (PHT)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <BellRing className="h-5 w-5 text-[#23479A]" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-900">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-green-500" />
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-900">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-purple-500" />
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-900">System Notifications</Label>
                      <p className="text-sm text-gray-500">Receive in-app notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={systemNotifications}
                    onCheckedChange={setSystemNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Bell className="h-5 w-5 text-[#23479A]" />
                Notification Types & Frequency
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure notification types and minimum intervals
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">New Registrations</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="15" 
                      defaultValue="15"
                      className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                    />
                    <Select defaultValue="minutes">
                      <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">System Updates</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="60" 
                      defaultValue="60"
                      className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                    />
                    <Select defaultValue="minutes">
                      <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Lock className="h-5 w-5 text-[#23479A]" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900">Change Password</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Update your password to keep your account secure
                </p>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                    <div className="relative">
                      <Input 
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password" 
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
                <Button className="bg-[#23479A] hover:bg-[#23479A]/90 text-white">
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
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
                <Button className="bg-[#23479A] hover:bg-[#23479A]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
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
                  <Button variant="outline" size="sm" className="border-[#23479A]/20 text-[#23479A] hover:bg-[#23479A]/5">
                    <Edit className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
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
                  <Button variant="outline" size="sm" className="border-[#23479A]/20 text-[#23479A] hover:bg-[#23479A]/5">
                    <Edit className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
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
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Database className="h-5 w-5 text-[#23479A]" />
                Data Management & Backup
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure system backup and data retention settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-emerald-500" />
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-900">Automatic Backup</Label>
                    <p className="text-sm text-gray-500">Enable scheduled system backups</p>
                  </div>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Backup Frequency</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="12" 
                      defaultValue="12"
                      className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                    />
                    <Select defaultValue="hours">
                      <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Backup Location</Label>
                  <Select defaultValue="local">
                    <SelectTrigger className="border-gray-200 focus:border-[#23479A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="external">External Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">Last Backup</p>
                    <p className="text-sm text-blue-600">March 15, 2024 at 2:30 AM</p>
                  </div>
                </div>
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-100">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <FileSpreadsheet className="h-5 w-5 text-[#23479A]" />
                Export Settings & Data Management
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure default export formats and data handling
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Default Export Format</Label>
                  <Select defaultValue="xlsx">
                    <SelectTrigger className="border-gray-200 focus:border-[#23479A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      <SelectItem value="json">JSON (.json)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger className="border-gray-200 focus:border-[#23479A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Include Fields in Export</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'personal', label: 'Personal Info', checked: true },
                    { id: 'contact', label: 'Contact Details', checked: true },
                    { id: 'registration', label: 'Registration Date', checked: true },
                    { id: 'status', label: 'Status', checked: true },
                    { id: 'documents', label: 'Documents', checked: false },
                    { id: 'history', label: 'History', checked: false },
                    { id: 'notes', label: 'Notes', checked: false },
                    { id: 'metadata', label: 'Metadata', checked: false },
                  ].map((field) => (
                    <label key={field.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={field.checked}
                        className="rounded border-gray-300 text-[#23479A] focus:ring-[#23479A]/20" 
                      />
                      <span className="text-sm text-gray-700">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <Settings2 className="h-5 w-5 text-[#23479A]" />
                System Maintenance & Cleanup
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage system maintenance tasks and data cleanup
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Data Retention Period</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number" 
                      placeholder="12" 
                      defaultValue="12"
                      className="border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
                    />
                    <Select defaultValue="months">
                      <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Old Data
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">System Cache</Label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Current cache size</span>
                      <Badge variant="outline">234 MB</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-orange-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="text-center">
                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">System Health</h4>
                    <p className="text-2xl font-bold text-green-700">98%</p>
                    <p className="text-xs text-green-600">Excellent</p>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="text-center">
                    <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Database Size</h4>
                    <p className="text-2xl font-bold text-blue-700">2.4 GB</p>
                    <p className="text-xs text-blue-600">Optimized</p>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-purple-900">Uptime</h4>
                    <p className="text-2xl font-bold text-purple-700">99.9%</p>
                    <p className="text-xs text-purple-600">30 days</p>
                  </div>
                </Card>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Scheduled Maintenance</p>
                    <p className="text-sm text-yellow-700">Next maintenance window: March 20, 2024 at 2:00 AM</p>
                  </div>
                </div>
                <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}