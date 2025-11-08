export interface DocumentRequest {
  id: string
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  documentType: string
  purpose: string
  status: "pending" | "processing" | "approved" | "payment_sent" | "payment_rejected" | "ready_to_claim" | "completed" | "rejected"
  requestDate: string
  estimatedCompletion: string
  lastUpdated: string
  fee?: string
  paymentReference?: string
  proofOfPayment?: string
  rejectionReason?: string
  adminNotes?: string
  urgentRequest: boolean
  formData: any
  attachments: string[]
  pickupOption?: string
}

export interface RequestStats {
  total: number
  pending: number
  approved: number
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