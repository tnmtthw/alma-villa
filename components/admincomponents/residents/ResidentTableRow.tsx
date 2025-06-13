// app/components/admincomponents/residents/ResidentTableRow.tsx
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  User2,
  Phone,
  MapPin,
  Mail,
  Shield,
  Calendar,
} from "lucide-react"
import { Resident } from "./types"
import ResidentActionsDropdown from "./ResidentActionsDropdown"
import ConfirmationModals from "./ConfirmationModals"

interface ResidentTableRowProps {
  resident: Resident
  isSelected: boolean
  onSelect: (id: string, checked: boolean) => void
  onView: (resident: Resident) => void
  onEdit: (resident: Resident) => void
  onUpdate: (resident: Resident) => void
  onArchive: (resident: Resident) => void
  onDelete: (resident: Resident) => void
}

export default function ResidentTableRow({
  resident,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onUpdate,
  onArchive,
  onDelete
}: ResidentTableRowProps) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    type: "deactivate" | "activate" | "role-admin" | "role-resident" | "archive" | "delete"
  }>({
    isOpen: false,
    type: "deactivate"
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // For demo purposes, assuming residents are active
  const isActive = true

  const handleToggleStatus = (resident: Resident, status: "Active" | "Inactive") => {
    setConfirmModal({
      isOpen: true,
      type: status === "Active" ? "activate" : "deactivate"
    })
  }

  const handleSetRole = (resident: Resident, role: "Admin" | "Resident") => {
    setConfirmModal({
      isOpen: true,
      type: role === "Admin" ? "role-admin" : "role-resident"
    })
  }

  const handleArchive = (resident: Resident) => {
    setConfirmModal({
      isOpen: true,
      type: "archive"
    })
  }

  const handleDeleteConfirm = (resident: Resident) => {
    setConfirmModal({
      isOpen: true,
      type: "delete"
    })
  }

  const handleConfirmAction = () => {
    switch (confirmModal.type) {
      case "deactivate":
      case "activate":
        // Update resident status
        onUpdate({ ...resident, status: confirmModal.type === "activate" ? "Active" : "Inactive" } as any)
        break
      case "role-admin":
        onUpdate({ ...resident, role: "Admin" })
        break
      case "role-resident":
        onUpdate({ ...resident, role: "Resident" })
        break
      case "archive":
        onArchive(resident)
        break
      case "delete":
        onDelete(resident)
        break
    }
    setConfirmModal({ isOpen: false, type: "deactivate" })
  }

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
        <td className="w-12 px-6 py-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(resident.id, checked as boolean)}
            className="border-gray-300"
          />
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Avatar with captured photo or initials */}
            <div className="relative">
              {resident.capturedPhoto ? (
                <img
                  src={resident.capturedPhoto}
                  alt={`${resident.firstName} ${resident.lastName}`}
                  className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`h-10 w-10 rounded-full bg-[#23479A] text-white font-medium flex items-center justify-center text-sm ${
                  resident.capturedPhoto ? 'hidden' : 'flex'
                }`}
              >
                {getInitials(resident.firstName, resident.lastName)}
              </div>
              
              {/* Status indicator */}
              <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                isActive ? 'bg-green-500' : 'bg-gray-400'
              }`} title={isActive ? 'Active' : 'Inactive'} />
            </div>
            
            <div>
              <p className="font-semibold text-gray-900">
                {resident.firstName} {resident.middleName} {resident.lastName}
                {resident.suffix && ` ${resident.suffix}`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500 font-mono">
                  ID: {resident.id.slice(0, 8)}...
                </p>
                {resident.role === "Admin" && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm capitalize">
                {resident.age} years • {resident.gender}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Born {formatDate(resident.birthDate)}
              </span>
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {resident.civilStatus} • {resident.religion}
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-mono">{resident.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                {resident.email}
              </span>
            </div>
            {resident.emergencyContact && (
              <div className="text-sm text-gray-500">
                Emergency: {resident.emergencyContact}
              </div>
            )}
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600 max-w-[250px]">
              <div className="line-clamp-2">
                {resident.houseNumber} {resident.street}, {resident.purok}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {resident.barangay}, {resident.city}
              </div>
              <div className="text-xs text-gray-500">
                {resident.province} {resident.zipCode}
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Badge 
              variant="default"
              className={`${
                isActive 
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              }`}
            >
              <div className={`h-2 w-2 rounded-full mr-2 ${
                isActive ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ResidentActionsDropdown
              resident={resident}
              isActive={isActive}
              onView={onView}
              onEdit={onEdit}
              onToggleStatus={handleToggleStatus}
              onSetRole={handleSetRole}
              onArchive={handleArchive}
              onDelete={handleDeleteConfirm}
            />
          </div>
        </td>
      </tr>

      {/* Confirmation Modal */}
      <ConfirmationModals
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: "deactivate" })}
        onConfirm={handleConfirmAction}
        type={confirmModal.type}
        resident={resident}
      />
    </>
  )
}