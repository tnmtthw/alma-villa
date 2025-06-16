// app/components/admincomponents/residents/ConfirmationModals.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  UserX,
  UserCheck,
  Shield,
  Archive,
  Trash2,
  AlertTriangle,
  Crown,
  User,
} from "lucide-react"
import { Resident } from "./types"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  type: "deactivate" | "activate" | "role-admin" | "role-resident" | "archive" | "delete"
  resident: Resident | null
}

export default function ConfirmationModals({
  isOpen,
  onClose,
  onConfirm,
  type,
  resident
}: ConfirmationModalProps) {
  if (!resident) return null

  const getModalConfig = () => {
    switch (type) {
      case "deactivate":
        return {
          title: "Deactivate Resident Account",
          description: `Are you sure you want to deactivate ${resident.firstName} ${resident.lastName}'s account? They will no longer be able to access the system until reactivated.`,
          icon: <UserX className="h-6 w-6 text-orange-500" />,
          confirmText: "Deactivate",
          confirmClass: "bg-orange-600 hover:bg-orange-700 text-white",
        }

      case "activate":
        return {
          title: "Activate Resident Account",
          description: `Are you sure you want to activate ${resident.firstName} ${resident.lastName}'s account? They will regain access to the system.`,
          icon: <UserCheck className="h-6 w-6 text-green-500" />,
          confirmText: "Activate",
          confirmClass: "bg-green-600 hover:bg-green-700 text-white",
        }

      case "role-admin":
        return {
          title: "Set Administrator Role",
          description: `Are you sure you want to give ${resident.firstName} ${resident.lastName} administrator privileges? This will grant them full access to the admin panel and all system functions.`,
          icon: <Crown className="h-6 w-6 text-yellow-500" />,
          confirmText: "Make Admin",
          confirmClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
        }

      case "role-resident":
        return {
          title: "Set Regular Resident Role",
          description: `Are you sure you want to change ${resident.firstName} ${resident.lastName} to a regular resident? This will remove their administrator privileges.`,
          icon: <User className="h-6 w-6 text-gray-500" />,
          confirmText: "Set as Resident",
          confirmClass: "bg-gray-600 hover:bg-gray-700 text-white",
        }

      case "archive":
        return {
          title: "Archive Resident",
          description: `Are you sure you want to archive ${resident.firstName} ${resident.lastName}? Archived residents will be moved to a separate section and marked as inactive, but their data will be preserved.`,
          icon: <Archive className="h-6 w-6 text-yellow-600" />,
          confirmText: "Archive",
          confirmClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
        }

      case "delete":
        return {
          title: "Delete Resident Permanently",
          description: `Are you sure you want to permanently delete ${resident.firstName} ${resident.lastName}? This action cannot be undone and will remove all their data from the system.`,
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          confirmText: "Delete Permanently",
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
        }

      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to perform this action?",
          icon: <AlertTriangle className="h-6 w-6 text-gray-500" />,
          confirmText: "Confirm",
          confirmClass: "bg-gray-600 hover:bg-gray-700 text-white",
        }
    }
  }

  const config = getModalConfig()

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-gray-900">
            {config.icon}
            {config.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 leading-relaxed">
            {config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={config.confirmClass}
          >
            {config.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}