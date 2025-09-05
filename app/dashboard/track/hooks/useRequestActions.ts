"use client"

import { ModalType } from "../components/Modal"

/**
 * Custom hook for handling document request actions
 * Provides a clean interface for all request-related operations
 */
export function useRequestActions(openModal: (type: ModalType, message: string, requestId?: string, onConfirm?: () => void) => void) {
  
  const handleCancel = (id: string) => {
    openModal('cancel', 'Do you want to cancel the document request?', id, () => {
      openModal('success', 'Document request cancelled successfully', id)
    })
  }

  const handleDecline = (id: string) => {
    // For now, using alert - can be replaced with proper API call
    alert(`Decline request ${id}`)
  }

  const handleReceived = (id: string) => {
    openModal('success', 'Status updated successfully', id)
  }

  const handleReadyDownload = (id: string) => {
    openModal('loading', 'Document is now downloading...', id)
    
    // Simulate download process
    setTimeout(() => {
      openModal('success', 'Document downloaded successfully', id)
    }, 2000)
  }

  const handleClaim = (id: string) => {
    openModal('success', 'Status updated successfully', id)
  }

  const handleUpdateStatus = (id: string) => {
    openModal('update', 'Please click the "Document Received" button if you have already received the document or already picked it up at the barangay.', id, () => {
      openModal('success', 'Document marked as received successfully', id)
    })
  }

  return {
    handleCancel,
    handleDecline,
    handleReceived,
    handleReadyDownload,
    handleClaim,
    handleUpdateStatus
  }
}
