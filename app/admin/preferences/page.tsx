"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Palette,
  Moon,
  Sun,
  Globe,
  Layout,
  Eye,
} from "lucide-react"

export default function AdminPreferences() {
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(true)

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Preferences</h1>
        <p className="text-gray-500">
          Customize your admin dashboard experience.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-[#23479A]" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the dashboard looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <Label>Dark Mode</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Switch between light and dark themes.
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  <Label>Compact Mode</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Reduce spacing and size of elements.
                </p>
              </div>
              <Switch
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#23479A]" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Set your preferred language and regional settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Language</Label>
              <select className="w-full border rounded-md px-3 py-2 border-gray-200">
                <option>English (US)</option>
                <option>Filipino</option>
                <option>Cebuano</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <select className="w-full border rounded-md px-3 py-2 border-gray-200">
                <option>Philippine Time (GMT+8)</option>
                <option>UTC</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <select className="w-full border rounded-md px-3 py-2 border-gray-200">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#23479A]" />
              Display Settings
            </CardTitle>
            <CardDescription>
              Configure how information is displayed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default View</Label>
              <select className="w-full border rounded-md px-3 py-2 border-gray-200">
                <option>Card View</option>
                <option>List View</option>
                <option>Table View</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Notifications</Label>
                <p className="text-sm text-gray-500">
                  Display notification badges and alerts.
                </p>
              </div>
              <Switch
                checked={showNotifications}
                onCheckedChange={setShowNotifications}
              />
            </div>
            <div className="space-y-2">
              <Label>Items Per Page</Label>
              <select className="w-full border rounded-md px-3 py-2 border-gray-200">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 