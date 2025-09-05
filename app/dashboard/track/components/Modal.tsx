"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"

export type ModalType = 'success' | 'loading' | 'cancel' | 'update'

export interface ModalProps {
  isOpen: boolean
  type: ModalType | null
  message: string
  onClose: () => void
  onConfirm?: () => void
}

/**
 * Reusable Modal component for different action confirmations
 * @param isOpen - Controls modal visibility
 * @param type - Modal type determines styling and behavior
 * @param message - Message to display in modal
 * @param onClose - Function to close modal
 * @param onConfirm - Function to execute on confirmation
 */
export default function Modal({ isOpen, type, message, onClose, onConfirm }: ModalProps) {
  if (!isOpen || !type) return null

  const renderModalContent = () => {
    switch (type) {
      case 'loading':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Downloading...</h3>
            <p className="text-sm text-gray-500 mb-4">{message}</p>
          </>
        )

      case 'cancel':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Document Request</h3>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onClose} variant="outline" className="px-6">
                Back
              </Button>
              <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-6">
                Confirm Cancel
              </Button>
            </div>
          </>
        )

      case 'update':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Update Document Status</h3>
            <p className="text-sm text-gray-500 mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onClose} variant="outline" className="px-6">
                Back
              </Button>
              <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700 text-white px-6">
                Document Received
              </Button>
            </div>
          </>
        )

      case 'success':
        return (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
            <p className="text-sm text-gray-500 mb-4">{message}</p>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              OK
            </Button>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          {renderModalContent()}
        </div>
      </div>
    </div>
  )
}
