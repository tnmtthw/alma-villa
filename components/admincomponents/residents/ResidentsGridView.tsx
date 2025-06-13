// components/admincomponents/residents/ResidentsGridView.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Archive, 
  Trash2, 
  Shield,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Resident } from "./types"

interface ResidentsGridViewProps {
  residents: Resident[]
  selectedResidents: string[]
  onSelectResident: (id: string, checked: boolean) => void
  onSelectAll: () => void
  onView: (resident: Resident) => void
  onEdit: (resident: Resident) => void
  onUpdate: (resident: Resident) => void
  onArchive: (resident: Resident) => void
  onDelete: (resident: Resident) => void
}

export default function ResidentsGridView({
  residents,
  selectedResidents,
  onSelectResident,
  onSelectAll,
  onView,
  onEdit,
  onUpdate,
  onArchive,
  onDelete
}: ResidentsGridViewProps) {
  
  const handleRoleToggle = (resident: Resident) => {
    const newRole = resident.role === "Admin" ? "Resident" : "Admin"
    onUpdate({ ...resident, role: newRole })
  }

  if (residents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No residents found</h3>
        <p className="text-gray-500">No residents match your current filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Select All Header */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          checked={selectedResidents.length === residents.length && residents.length > 0}
          onCheckedChange={onSelectAll}
          className="border-gray-300"
        />
        <span className="text-sm font-medium text-gray-700">
          {selectedResidents.length > 0 
            ? `${selectedResidents.length} of ${residents.length} selected`
            : `Select all ${residents.length} residents`
          }
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {residents.map((resident) => (
          <Card 
            key={resident.id} 
            className={`hover:shadow-lg transition-all duration-200 ${
              selectedResidents.includes(resident.id) 
                ? "ring-2 ring-[#23479A] border-[#23479A]" 
                : "border-gray-200"
            }`}
          >
            <CardContent className="p-6">
              {/* Header with Checkbox and Actions */}
              <div className="flex items-start justify-between mb-4">
                <Checkbox
                  checked={selectedResidents.includes(resident.id)}
                  onCheckedChange={(checked) => onSelectResident(resident.id, checked as boolean)}
                  className="border-gray-300"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(resident)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(resident)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Info
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleToggle(resident)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Make {resident.role === "Admin" ? "Resident" : "Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onArchive(resident)}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(resident)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Avatar and Name */}
              <div className="text-center mb-4">
                <div className="relative inline-block">
                  {resident.capturedPhoto ? (
                    <img
                      src={resident.capturedPhoto}
                      alt={`${resident.firstName} ${resident.lastName}`}
                      className="h-16 w-16 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-[#23479A] text-white font-medium flex items-center justify-center mx-auto text-lg">
                      {resident.firstName[0]}{resident.lastName[0]}
                    </div>
                  )}
                  {/* Role Badge */}
                  <Badge 
                    className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 text-xs ${
                      resident.role === "Admin" 
                        ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-green-100 text-green-800 border-green-200"
                    }`}
                  >
                    {resident.role}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mt-3">
                  {resident.firstName} {resident.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {resident.age} years • {resident.gender}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{resident.email}</span>
                </div>
                {resident.mobileNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{resident.mobileNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">
                    {resident.street}, {resident.purok}
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Civil Status:</span>
                  <span className="capitalize">{resident.civilStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Residency:</span>
                  <span>{resident.residencyLength} years</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <span>{new Date(resident.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(resident)}
                  className="flex-1 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(resident)}
                  className="flex-1 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}       