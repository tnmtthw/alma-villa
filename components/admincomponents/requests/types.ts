export interface DocumentRequest {
  id: string
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  documentType: string
  purpose: string
  status: "pending" | "under_review" | "processing" | "payment_pending" | "ready_for_claim" | "completed" | "rejected"
  requestDate: string
  estimatedCompletion: string
  lastUpdated: string
  fee: string
  paymentReference?: string
  paymentProof?: string
  rejectionReason?: string
  adminNotes?: string
  urgentRequest: boolean
  formData: any
  attachments: string[]
}

export interface RequestStats {
  total: number
  pending: number
  underReview: number
  processing: number
  paymentPending: number
  readyForClaim: number
  completed: number
  rejected: number
  urgent: number
}

export interface StatusConfig {
  label: string
  color: string
  icon: any
} 