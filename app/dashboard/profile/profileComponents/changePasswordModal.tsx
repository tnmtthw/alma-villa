"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Lock,
  Check,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { useSession } from "next-auth/react"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordErrors {
  current: string
  new: string
  confirm: string
}

interface ShowPasswords {
  current: boolean
  new: boolean
  confirm: boolean
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { data: session } = useSession()
  
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false
  })
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    current: "",
    new: "",
    confirm: ""
  })
  
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error for the field being changed
    setPasswordErrors(prev => ({
      ...prev,
      [field]: ""
    }))
  }

  const togglePasswordVisibility = (field: keyof ShowPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
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
    const errors: PasswordErrors = { current: "", new: "", confirm: "" }
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
    } else if (passwordData.currentPassword && passwordData.newPassword === passwordData.currentPassword) {
      errors.new = "New password must be different from current password"
      isValid = false
    }

    if (!passwordData.confirmPassword) {
      errors.confirm = "Please confirm your new password"
      isValid = false
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirm = "Passwords do not match"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswords()) return

    if (!session?.user?.id) {
      alert("User session not found. Please log in again.")
      return
    }

    setIsChangingPassword(true)

    try {
      // Call the API to change password
      const response = await fetch(`/api/user/profile?id=${session.user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          password: passwordData.newPassword
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(`Failed to change password: ${response.status} - ${errorData.error || 'Unknown error'}`)
      }

      // Reset form and close modal
      resetForm()
      onClose()

      alert("Password changed successfully!")

    } catch (error) {
      console.error('Error changing password:', error)
      const errorMessage = error instanceof Error ? error.message : "Failed to change password. Please try again."
      
      // Check if it's an authentication error (wrong current password)
      if (errorMessage.includes('current password') || errorMessage.includes('invalid') || errorMessage.includes('unauthorized')) {
        setPasswordErrors(prev => ({
          ...prev,
          current: "Current password is incorrect"
        }))
      } else {
        setPasswordErrors(prev => ({
          ...prev,
          new: "Failed to change password. Please try again."
        }))
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  const resetForm = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setPasswordErrors({ current: "", new: "", confirm: "" })
    setShowPasswords({ current: false, new: false, confirm: false })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-lg">
        <DialogHeader className="bg-white">
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <Lock className="h-5 w-5 text-[#23479A]" />
            Change Password
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose a new secure password for your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleChangePassword} className="space-y-4 mt-4 bg-white">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-gray-700">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className={`bg-white border-gray-300 ${passwordErrors.current ? "border-red-300 focus:border-red-500" : "focus:border-[#23479A]"}`}
                placeholder="Enter your current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-50"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {passwordErrors.current && (
              <p className="text-sm text-red-600">{passwordErrors.current}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className={`bg-white border-gray-300 ${passwordErrors.new ? "border-red-300 focus:border-red-500" : "focus:border-[#23479A]"}`}
                placeholder="Enter your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-50"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {passwordErrors.new && (
              <p className="text-sm text-red-600">{passwordErrors.new}</p>
            )}

            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="space-y-2 bg-white p-3 border border-gray-100 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Password strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.level === 'weak' ? 'text-red-500' :
                    passwordStrength.level === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                    {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                  </span>
                </div>
                <Progress
                  value={(passwordStrength.score / 5) * 100}
                  className={`h-2 bg-gray-200 ${passwordStrength.level === 'weak' ? '[&>div]:bg-red-500' :
                    passwordStrength.level === 'medium' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                    }`}
                />
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {Object.entries(passwordStrength.checks).map(([key, value]) => (
                    <div key={key} className={`flex items-center gap-1 ${value ? 'text-green-600' : 'text-gray-400'}`}>
                      {value ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      <span className="text-xs">
                        {key === 'length' && '8+ characters'}
                        {key === 'uppercase' && 'Uppercase letter'}
                        {key === 'lowercase' && 'Lowercase letter'}
                        {key === 'number' && 'Number'}
                        {key === 'special' && 'Special character'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className={`bg-white border-gray-300 ${passwordErrors.confirm ? "border-red-300 focus:border-red-500" : "focus:border-[#23479A]"}`}
                placeholder="Confirm your new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-50"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {passwordErrors.confirm && (
              <p className="text-sm text-red-600">{passwordErrors.confirm}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isChangingPassword}
              className="w-full sm:w-auto bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="bg-[#23479A] hover:bg-[#23479A]/90 w-full sm:w-auto text-white"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
