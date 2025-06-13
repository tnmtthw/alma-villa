// app/components/admincomponents/residents/ResidentsGrid.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User2,
  Briefcase,
  Phone,
  MapPin,
  Mail,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  Calendar,
  UserCheck,
  UserX,
} from "lucide-react"
import { Resident } from "./types"

interface ResidentsGridProps {
  residents: Resident[]
  selectedResidents: string[]
  onSelect: (id: string, checked: boolean) => void
  onView: (resident: Resident) => void
  onEdit: (resident: Resident) => void
  onDelete: (id: string) => void
  onStatusChange?: (id: string, status: "Active" | "Inactive") => void
}

export default function ResidentsGrid({
  residents,
  selectedResidents,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}: ResidentsGridProps) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {residents.map((resident) => {
        const isSelected = selectedResidents.includes(resident.id)
        const isActive = true // For demo purposes, assuming all residents are active
        
        return (
          <Card 
            key={resident.id} 
            className={`group hover:shadow-lg transition-all duration-200 border-l-4 ${
              isSelected 
                ? 'border-l-[#23479A] bg-blue-50/30 shadow-md' 
                : 'border-l-[#23479A] hover:border-l-[#23479A]/80'
            }`}
          >
            <CardContent className="p-4">
              {/* Header with checkbox and avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelect(resident.id, checked as boolean)}
                    className="mt-1"
                  />
                  
                  <div className="flex flex-col items-center gap-2">
                    {/* Avatar */}
                    <div className="relative">
                      {resident.capturedPhoto ? (
                        <img
                          src={resident.capturedPhoto}
                          alt={`${resident.firstName} ${resident.lastName}`}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`h-16 w-16 rounded-full bg-gradient-to-br from-[#23479A] to-[#23479A]/80 text-white font-semibold flex items-center justify-center text-lg ${
                          resident.capturedPhoto ? 'hidden' : 'flex'
                        }`}
                      >
                        {getInitials(resident.firstName, resident.lastName)}
                      </div>
                    </div>
                    
                    {/* Name and Role */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {resident.firstName} {resident.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        {resident.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Status and Role Badges */}
                <div className="flex flex-col gap-1 items-end">
                  <Badge 
                    variant="default" 
                    className={`text-xs ${
                      isActive 
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                  
                  {resident.role === "Admin" && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User2 className="h-3 w-3" />
                  <span className="capitalize">{resident.age} years • {resident.gender}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Born {formatDate(resident.birthDate)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span className="font-mono">{resident.mobileNumber}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{resident.email}</span>
                </div>
                
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {resident.street}, {resident.purok}, {resident.barangay}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 capitalize">
                  {resident.civilStatus} • {resident.religion}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(resident)}
                  className="text-[#23479A] hover:bg-[#23479A]/10 text-xs px-2 py-1 h-7"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem
                      onClick={() => onEdit(resident)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    
                    {onStatusChange && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(resident.id, isActive ? "Inactive" : "Active")}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        {isActive ? (
                          <>
                            <UserX className="mr-2 h-3 w-3" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-3 w-3" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem
                      className="text-red-600 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onDelete(resident.id)}
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}