// components/admincomponents/residents/ResidentsHeader.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  Download, 
  UserPlus, 
  Grid3X3, 
  List,
  FileSpreadsheet,
  Users,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ResidentsHeaderProps {
  viewMode: "table" | "grid"
  setViewMode: (mode: "table" | "grid") => void
  onImport: (type: "individual" | "mass") => void
  onExport: () => void
  onAddResident: () => void
  totalResidents: number
}

export default function ResidentsHeader({
  viewMode,
  setViewMode,
  onImport,
  onExport,
  onAddResident,
  totalResidents
}: ResidentsHeaderProps) {
  const [showImportOptions, setShowImportOptions] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border">
      {/* Left Section - Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Residents Management</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage and view all {totalResidents} registered residents
        </p>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("table")}
            className={cn(
              "h-8 w-8 p-0 rounded-md transition-all",
              viewMode === "table" 
                ? "bg-white shadow-sm text-[#23479A]" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-8 w-8 p-0 rounded-md transition-all",
              viewMode === "grid" 
                ? "bg-white shadow-sm text-[#23479A]" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Import Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowImportOptions(!showImportOptions)}
            className="border-gray-300 hover:border-[#23479A] hover:text-[#23479A] transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          {showImportOptions && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2">
                <button
                  onClick={() => {
                    onImport("individual")
                    setShowImportOptions(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors text-left"
                >
                  <UserPlus className="h-5 w-5 text-[#23479A]" />
                  <div>
                    <div className="font-medium text-gray-900">Individual Import</div>
                    <div className="text-sm text-gray-500">Add single resident manually</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    onImport("mass")
                    setShowImportOptions(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors text-left"
                >
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Mass Import</div>
                    <div className="text-sm text-gray-500">Upload CSV/Excel file</div>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Overlay to close dropdown */}
          {showImportOptions && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowImportOptions(false)}
            />
          )}
        </div>

        {/* Export Button */}
        <Button
          variant="outline"
          onClick={onExport}
          className="border-gray-300 hover:border-[#23479A] hover:text-[#23479A] transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        {/* Add Resident Button */}
        <Button
          onClick={onAddResident}
          className="bg-[#23479A] hover:bg-[#1e3a82] text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Resident
        </Button>
      </div>
    </div>
  )
}