// app/components/admincomponents/residents/ResidentsFilters.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, SlidersHorizontal, UserCheck, UserX, Trash2, X } from "lucide-react"
import { ResidentFilters as FilterTypes } from "./types"

interface ResidentsFiltersProps {
  filters: FilterTypes
  onFiltersChange: (filters: FilterTypes) => void
  selectedCount: number
  onBulkActivate: () => void
  onBulkDeactivate: () => void
  onBulkDelete: () => void
  onClearFilters: () => void
}

export default function ResidentsFilters({
  filters,
  onFiltersChange,
  selectedCount,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  onClearFilters
}: ResidentsFiltersProps) {
  const handleFilterChange = (key: keyof FilterTypes, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== "" && value !== "All")

  return (
    <Card className="border-0 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, ID, email, or phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#23479A] focus:ring-[#23479A]/20"
            />
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              
              {/* Status Filter */}
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Gender Filter */}
            <Select 
              value={filters.gender} 
              onValueChange={(value) => handleFilterChange("gender", value)}
            >
              <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Gender</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Role Filter */}
            <Select 
              value={filters.role} 
              onValueChange={(value) => handleFilterChange("role", value)}
            >
              <SelectTrigger className="w-32 border-gray-200 focus:border-[#23479A]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Resident">Resident</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-[#23479A]/10 to-blue-50 rounded-lg border border-[#23479A]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#23479A] text-white flex items-center justify-center text-sm font-medium">
                  {selectedCount}
                </div>
                <span className="text-sm font-medium text-[#23479A]">
                  {selectedCount} resident{selectedCount > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={onBulkActivate}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button
                  size="sm"
                  onClick={onBulkDeactivate}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  onClick={onBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}