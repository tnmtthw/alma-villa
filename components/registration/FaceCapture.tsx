"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Camera, RefreshCcw } from "lucide-react"
import Webcam from "react-webcam"

interface FaceCaptureProps {
  onNext: () => void
  onBack: () => void
}

const createSamplePhoto = (): string => {
  // Create a sample photo using canvas
  const canvas = document.createElement('canvas')
  canvas.width = 720
  canvas.height = 720
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Draw a simple face placeholder
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#333'
    // Head
    ctx.beginPath()
    ctx.arc(360, 300, 200, 0, Math.PI * 2)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(280, 250, 30, 0, Math.PI * 2)
    ctx.arc(440, 250, 30, 0, Math.PI * 2)
    ctx.fill()
    // Smile
    ctx.beginPath()
    ctx.arc(360, 350, 100, 0, Math.PI)
    ctx.stroke()
  }
  return canvas.toDataURL('image/jpeg')
}

export default function FaceCapture({ onNext, onBack }: FaceCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [photo, setPhoto] = useState<string | null>(() => {
    // Try to load saved photo from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('capturedPhoto')
    }
    return null
  })
  const [cameraError, setCameraError] = useState(false)

  // Save photo whenever it changes
  useEffect(() => {
    if (photo) {
      localStorage.setItem('capturedPhoto', photo)
    }
  }, [photo])

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setPhoto(imageSrc)
    }
  }, [webcamRef])

  const retake = () => {
    setPhoto(null)
    localStorage.removeItem('capturedPhoto')
  }

  // Clear saved photo when moving to next step
  const handleNext = () => {
    onNext()
  }

  const handleCameraError = () => {
    setCameraError(true)
  }

  const fillWithSampleData = () => {
    setPhoto(createSamplePhoto())
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2px] shadow-lg p-6 max-w-[1100px] mx-auto">
      <div className="border-b border-gray-200/50 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Face Verification</h2>
        <p className="text-sm text-gray-500 mt-1">Please follow the guidelines to capture a clear photo of your face.</p>
        <Button
          type="button"
          onClick={fillWithSampleData}
          variant="outline"
          className="mt-2 text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10"
        >
          Fill with Sample Photo
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Live Photo Capture</Label>
          <div className="flex flex-col items-center space-y-4">
            {!photo ? (
              <>
                {!cameraError ? (
                  <div className="relative w-[320px] h-[320px] bg-gray-100 rounded-[2px] overflow-hidden">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      onUserMediaError={handleCameraError}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-[320px] h-[320px] bg-gray-100 rounded-[2px] flex items-center justify-center">
                    <div className="text-center p-4">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Camera access is required for face verification.
                        Please allow camera access and refresh the page.
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  onClick={capture}
                  disabled={cameraError}
                  className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px]"
                >
                  Capture Photo
                </Button>
              </>
            ) : (
              <>
                <div className="relative w-[320px] h-[320px] bg-gray-100 rounded-[2px] overflow-hidden">
                  <img
                    src={photo}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  onClick={retake}
                  variant="outline"
                  className="flex items-center gap-2 border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Retake Photo
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Guidelines</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Ensure your face is well-lit and clearly visible</li>
            <li>Remove any face coverings (except for religious purposes)</li>
            <li>Look directly at the camera</li>
            <li>Maintain a neutral expression</li>
            <li>Your face should fill about 70-80% of the frame</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-4 pt-6 border-t">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px]"
          >
            Previous Step
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!photo}
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px]"
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
} 