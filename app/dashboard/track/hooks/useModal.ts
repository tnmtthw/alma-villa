"use client"

import { useState } from "react"
import { ModalType } from "../components/Modal"

interface ModalState {
  isOpen: boolean
  type: ModalType | null
  message: string
  requestId?: string
  onConfirm?: () => void
}

/**
 * Custom hook for managing modal state and actions
 * Provides a clean interface for handling different modal types
 */
export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    message: '',
    requestId: undefined,
    onConfirm: undefined
  })

  const openModal = (type: ModalType, message: string, requestId?: string, onConfirm?: () => void) => {
    setModalState({
      isOpen: true,
      type,
      message,
      requestId,
      onConfirm
    })
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      message: '',
      requestId: undefined,
      onConfirm: undefined
    })
  }

  const handleConfirm = () => {
    if (modalState.onConfirm) {
      modalState.onConfirm()
    }
  }

  return {
    modalState,
    openModal,
    closeModal,
    handleConfirm
  }
}
