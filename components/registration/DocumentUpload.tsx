"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, X } from "lucide-react"

interface DocumentUploadProps {
  onNextAction: () => void
  onBackAction: () => void
}

const createSampleFile = (name: string): File => {
  // Create a sample image file
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#333'
    ctx.font = '24px Arial'
    ctx.fillText('Sample ' + name, 50, 50)
  }
  return new File([canvas.toDataURL()], name + '.png', { type: 'image/png' })
}

export default function DocumentUpload({ onNextAction, onBackAction }: DocumentUploadProps) {
  const [selectedId, setSelectedId] = useState(() => {
    // Try to load saved ID selection from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedIdType') || ""
    }
    return ""
  })

  // Save selected ID type whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedIdType', selectedId)
  }, [selectedId])

  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])

  const validIds = [
    "PhilSys ID/National ID",
    "Driver's License",
    "Passport",
    "Voter's ID",
    "SSS ID",
    "GSIS ID",
    "TIN ID",
    "Senior Citizen ID",
    "PWD ID"
  ]

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back" | "supporting"
  ) => {
    const files = e.target.files
    if (!files) return

    if (type === "front") {
      setFrontImage(files[0])
    } else if (type === "back") {
      setBackImage(files[0])
    } else {
      setSupportingDocs([...supportingDocs, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setSupportingDocs(supportingDocs.filter((_, i) => i !== index))
  }

  const isFormValid = () => {
    return selectedId !== "" && frontImage !== null && backImage !== null
  }

  // Clear saved data when moving to next step
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.removeItem('selectedIdType')
    onNextAction()
  }

  const fillWithSampleData = () => {
    setSelectedId("PhilSys ID/National ID")
    const frontFile = createSampleFile('ID Front')
    const backFile = createSampleFile('ID Back')
    const supportingFile = createSampleFile('Supporting Doc')
    
    setFrontImage(frontFile)
    setBackImage(backFile)
    setSupportingDocs([supportingFile])
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2px] shadow-lg p-6 max-w-[1100px] mx-auto">
      <div className="border-b border-gray-200/50 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Document Upload</h2>
        <p className="text-sm text-gray-500 mt-1">Please upload clear and valid identification documents.</p>
        <Button
          type="button"
          onClick={fillWithSampleData}
          variant="outline"
          className="mt-2 text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
        >
          Fill with Sample Data
        </Button>
      </div>
      
      <form className="space-y-6">
        {/* ID Selection */}
        <div className="space-y-4">
          <Label htmlFor="idType">Select Valid Government ID</Label>
          <Select 
            value={selectedId}
            onValueChange={setSelectedId}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select ID Type" />
            </SelectTrigger>
            <SelectContent>
              {validIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ID Upload */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front ID */}
            <div>
              <Label htmlFor="frontId">Front of ID</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-[2px]">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="frontId"
                      className="relative cursor-pointer rounded-md font-medium text-[#23479A] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#23479A]/20"
                    >
                      <span>Upload front of ID</span>
                      <input
                        id="frontId"
                        name="frontId"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFileUpload(e, "front")}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
              {frontImage && (
                <p className="mt-2 text-sm text-gray-600">{frontImage.name}</p>
              )}
            </div>

            {/* Back ID */}
            <div>
              <Label htmlFor="backId">Back of ID</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-[2px]">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <label
                      htmlFor="backId"
                      className="relative cursor-pointer rounded-md font-medium text-[#23479A] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#23479A]/20"
                    >
                      <span>Upload back of ID</span>
                      <input
                        id="backId"
                        name="backId"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFileUpload(e, "back")}
                        required
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
              {backImage && (
                <p className="mt-2 text-sm text-gray-600">{backImage.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="space-y-4">
          <Label htmlFor="supporting">Supporting Documents</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-[2px]">
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <label
                  htmlFor="supporting"
                  className="relative cursor-pointer rounded-md font-medium text-[#23479A] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#23479A]/20"
                >
                  <span>Upload supporting documents</span>
                  <input
                    id="supporting"
                    name="supporting"
                    type="file"
                    multiple
                    accept=".pdf,image/*"
                    className="sr-only"
                    onChange={(e) => handleFileUpload(e, "supporting")}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Supporting Documents List */}
          {supportingDocs.length > 0 && (
            <div className="mt-4 space-y-2">
              {supportingDocs.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-[2px]"
                >
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <Button
                    type="button"
                    onClick={() => removeFile(index)}
                    variant="outline"
                    className="h-8 w-8 p-0 border-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-4 pt-6 border-t">
          <Button
            type="button"
            onClick={onBackAction}
            variant="outline"
            className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px]"
          >
            Previous Step
          </Button>
          <Button
            type="submit"
            onClick={handleNext}
            disabled={!isFormValid()}
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </Button>
        </div>
      </form>
    </div>
  )
}