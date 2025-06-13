// app/components/admincomponents/residents/ResidentActionsDropdown.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Archive,
  Trash2,
  User,
  Crown,
} from "lucide-react"
import { Resident } from "./types"

interface ResidentActionsDropdownProps {
  resident: Resident
  isActive?: boolean
  onView: (resident: Resident) => void
  onEdit: (resident: Resident) => void
  onToggleStatus: (resident: Resident, status: "Active" | "Inactive") => void
  onSetRole: (resident: Resident, role: "Admin" | "Resident") => void
  onArchive: (resident: Resident) => void
  onDelete: (resident: Resident) => void
}

export default function ResidentActionsDropdown({
  resident,
  isActive = true,
  onView,
  onEdit,
  onToggleStatus,
  onSetRole,
  onArchive,
  onDelete
}: ResidentActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-[#23479A] focus:ring-offset-1"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
        {/* View Action */}
        <DropdownMenuItem
          onClick={() => onView(resident)}
          className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
        >
          <Eye className="h-4 w-4 mr-3 text-blue-500" />
          <span className="text-gray-700">View Details</span>
        </DropdownMenuItem>
        
        {/* Edit Action */}
        <DropdownMenuItem
          onClick={() => onEdit(resident)}
          className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
        >
          <Edit className="h-4 w-4 mr-3 text-green-500" />
          <span className="text-gray-700">Edit Information</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-100" />
        
        {/* Status Toggle */}
        <DropdownMenuItem
          onClick={() => onToggleStatus(resident, isActive ? "Inactive" : "Active")}
          className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
        >
          {isActive ? (
            <>
              <UserX className="h-4 w-4 mr-3 text-orange-500" />
              <span className="text-gray-700">Deactivate Account</span>
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 mr-3 text-green-500" />
              <span className="text-gray-700">Activate Account</span>
            </>
          )}
        </DropdownMenuItem>
        
        {/* Role Management Sub-menu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50">
            <Shield className="h-4 w-4 mr-3 text-purple-500" />
            <span className="text-gray-700">Set Role</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem
              onClick={() => onSetRole(resident, "Resident")}
              className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
              disabled={resident.role === "Resident"}
            >
              <User className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-gray-700">Regular Resident</span>
              {resident.role === "Resident" && (
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => onSetRole(resident, "Admin")}
              className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
              disabled={resident.role === "Admin"}
            >
              <Crown className="h-4 w-4 mr-3 text-yellow-500" />
              <span className="text-gray-700">Administrator</span>
              {resident.role === "Admin" && (
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator className="bg-gray-100" />
        
        {/* Archive Action */}
        <DropdownMenuItem
          onClick={() => onArchive(resident)}
          className="hover:bg-yellow-50 cursor-pointer focus:bg-yellow-50"
        >
          <Archive className="h-4 w-4 mr-3 text-yellow-600" />
          <span className="text-gray-700">Archive Resident</span>
        </DropdownMenuItem>
        
        {/* Delete Action */}
        <DropdownMenuItem
          onClick={() => onDelete(resident)}
          className="hover:bg-red-50 cursor-pointer focus:bg-red-50 text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-3 text-red-500" />
          <span className="text-red-600">Delete Permanently</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}