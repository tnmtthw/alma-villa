import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload?: () => void
}

const ImageUpload: React.FC<ImageUploadProps> = () => {
  const [preview, setPreview] = useState<string | null>(null)

  // For demo purposes, use a sample image when clicking or dropping
  const handleImageSelect = () => {
    setPreview('https://picsum.photos/800/600')
  }

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onClick={handleImageSelect}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleImageSelect()
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
              Supported formats: JPG, JPEG, PNG (max 5MB)
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
    </div>
  )
}

export default ImageUpload 