import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import { validateImageFile, FILE_SIZE_LIMITS } from '@/lib/fileValidation'

interface ImageUploadProps {
  onImageUpload?: (file: File) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setError(null)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Call callback if provided
    if (onImageUpload) {
      onImageUpload(file)
    }
  }

  const handleImageSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    }
    input.click()
  }

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onClick={handleImageSelect}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            const file = e.dataTransfer.files[0]
            if (file) {
              handleFileSelect(file)
            }
          }}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            hover:border-blue-500 hover:bg-blue-50 border-gray-300"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <p>Drag & drop an image here, or click to select</p>
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, WebP (max {FILE_SIZE_LIMITS.IMAGE_MAX_SIZE_MB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-full object-contain"
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={() => setPreview(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}

export default ImageUpload 