import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Download, Eye, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface ImageViewerProps {
  file: {
    name: string
    url: string
  }
  onClose: () => void
}

const ImageViewer: React.FC<ImageViewerProps> = ({ file, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className={`bg-white ${isFullscreen ? 'w-screen h-screen max-w-none m-0 rounded-none' : 'max-w-4xl'}`}>
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {file.name}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="text-gray-500 hover:text-gray-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="text-gray-500 hover:text-gray-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRotate}
              className="text-gray-500 hover:text-gray-700"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(file.url, '_blank')}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const link = document.createElement('a')
                link.href = file.url
                link.download = file.name
                link.click()
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isFullscreen ? (
                <X className="h-4 w-4" />
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0-4l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </Button>
          </div>
        </DialogHeader>

        <div 
          className={`mt-4 ${isFullscreen ? 'flex-1 overflow-auto' : ''}`}
          style={{ 
            minHeight: isFullscreen ? 'calc(100vh - 150px)' : '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div 
            className="relative overflow-auto"
            style={{
              maxHeight: isFullscreen ? 'calc(100vh - 150px)' : '600px',
              maxWidth: '100%'
            }}
          >
            <img
              src={file.url}
              alt={file.name}
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageViewer 