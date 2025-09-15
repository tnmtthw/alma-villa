"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function Toast({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 rounded-xl shadow-2xl border-2 min-w-[400px] max-w-[500px] backdrop-blur-sm animate-in slide-in-from-top-2 duration-300",
        toast.variant === "destructive"
          ? "bg-red-50/95 border-red-300 text-red-900 shadow-red-100/50"
          : "bg-green-50/95 border-green-300 text-green-900 shadow-green-100/50"
      )}
    >
      <div className="flex-1">
        <h4 className="font-bold text-lg">{toast.title}</h4>
        {toast.description && (
          <p className="text-sm mt-2 opacity-90 leading-relaxed">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          "ml-6 p-2 rounded-full transition-colors",
          toast.variant === "destructive"
            ? "hover:bg-red-200/50 text-red-700"
            : "hover:bg-green-200/50 text-green-700"
        )}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
