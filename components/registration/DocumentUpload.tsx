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
import { Upload, X, Eye, Trash2 } from "lucide-react"
import { validateImageFile, FILE_SIZE_LIMITS } from "@/lib/fileValidation"

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
      return localStorage.getItem('type') || ""
    }
    return ""
  })

  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [supportingDocs, setSupportingDocs] = useState<File[]>([])
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null)
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null)
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean, image: string, title: string}>({
    isOpen: false,
    image: '',
    title: ''
  })

  // Save selected ID type whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('type', selectedId)
    }
  }, [selectedId])

  // Save images to localStorage and create preview when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && frontImage) {
      // Convert File to base64 for localStorage and preview
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        localStorage.setItem('frontId', result)
        setFrontImagePreview(result)
      }
      reader.readAsDataURL(frontImage)
    } else {
      setFrontImagePreview(null)
    }
  }, [frontImage])

  useEffect(() => {
    if (typeof window !== 'undefined' && backImage) {
      // Convert File to base64 for localStorage and preview
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        localStorage.setItem('backId', result)
        setBackImagePreview(result)
      }
      reader.readAsDataURL(backImage)
    } else {
      setBackImagePreview(null)
    }
  }, [backImage])

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

    const file = files[0]
    
    // Validate file before processing
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      alert(validation.error)
      return
    }

    if (type === "front") {
      setFrontImage(file)
    } else if (type === "back") {
      setBackImage(file)
    } else {
      setSupportingDocs([...supportingDocs, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setSupportingDocs(supportingDocs.filter((_, i) => i !== index))
  }

  const removeImage = (type: "front" | "back") => {
    if (type === "front") {
      setFrontImage(null)
      setFrontImagePreview(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('frontId')
      }
    } else {
      setBackImage(null)
      setBackImagePreview(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('backId')
      }
    }
  }

  const openPreview = (image: string, title: string) => {
    setPreviewModal({
      isOpen: true,
      image,
      title
    })
  }

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      image: '',
      title: ''
    })
  }

  const isFormValid = () => {
    return selectedId !== "" && frontImage !== null && backImage !== null
  }

  // Clear saved data when moving to next step
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
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

  // Preview Modal Component
  const PreviewModal = () => {
    if (!previewModal.isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{previewModal.title}</h3>
            <button
              onClick={closePreview}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <img
              src={previewModal.image}
              alt={previewModal.title}
              className="max-w-full h-auto rounded-lg"
              style={{ maxHeight: '70vh' }}
            />
          </div>
        </div>
      </div>
    )
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
              {!frontImagePreview ? (
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
                    <p className="text-xs text-gray-500">PNG, JPG up to {FILE_SIZE_LIMITS.IMAGE_MAX_SIZE_MB}MB</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 relative border-2 border-gray-300 rounded-[2px] overflow-hidden">
                  <img
                    src={frontImagePreview}
                    alt="Front ID Preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={() => openPreview(frontImagePreview, "Front ID Preview")}
                        size="sm"
                        className="bg-white text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => removeImage("front")}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {frontImage && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-600">{frontImage.name}</p>
                  <div className="flex space-x-2">
                    {frontImagePreview && (
                      <Button
                        type="button"
                        onClick={() => openPreview(frontImagePreview, "Front ID Preview")}
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={() => removeImage("front")}
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Back ID */}
            <div>
              <Label htmlFor="backId">Back of ID</Label>
              {!backImagePreview ? (
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
                    <p className="text-xs text-gray-500">PNG, JPG up to {FILE_SIZE_LIMITS.IMAGE_MAX_SIZE_MB}MB</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 relative border-2 border-gray-300 rounded-[2px] overflow-hidden">
                  <img
                    src={backImagePreview}
                    alt="Back ID Preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={() => openPreview(backImagePreview, "Back ID Preview")}
                        size="sm"
                        className="bg-white text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => removeImage("back")}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {backImage && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-600">{backImage.name}</p>
                  <div className="flex space-x-2">
                    {backImagePreview && (
                      <Button
                        type="button"
                        onClick={() => openPreview(backImagePreview, "Back ID Preview")}
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={() => removeImage("back")}
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
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

      {/* Preview Modal */}
      <PreviewModal />
    </div>
  )
}