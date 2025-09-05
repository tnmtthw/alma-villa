export type RequestStatus = "processing" | "approved" | "request_for_payment" | "ready_to_claim" | "ready_for_pickup" | "completed" | "rejected"

export interface RequestItem {
  id: string
  documentType: string
  reference: string
  requestedAt: string // ISO date string
  status: RequestStatus
}

export interface StatusConfig {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ElementType
  description: string
}
