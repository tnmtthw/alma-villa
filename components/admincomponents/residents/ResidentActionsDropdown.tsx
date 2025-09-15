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
  Shield,
  User,
  Crown,
} from "lucide-react"
import { Resident } from "./types"

interface ResidentActionsDropdownProps {
  resident: Resident
  onView: (resident: Resident) => void
  onSetRole: (resident: Resident, role: "Admin" | "Verified") => void
}

export default function ResidentActionsDropdown({
  resident,
  onView,
  onSetRole
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

        <DropdownMenuSeparator className="bg-gray-100" />

        {/* Role Management Sub-menu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50">
            <Shield className="h-4 w-4 mr-3 text-purple-500" />
            <span className="text-gray-700">Set Role</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48 bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem
              onClick={() => onSetRole(resident, "Verified")}
              className="hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
              disabled={resident.role === "Verified"}
            >
              <User className="h-4 w-4 mr-3 text-gray-500" />
              <span className="text-gray-700">Regular Resident</span>
              {resident.role === "Verified" && (
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}