import { RequestItem } from "../types"

/**
 * Sample document request data for development and testing
 * In production, this would be replaced with API calls
 */
export const seedRequests: RequestItem[] = [
  { 
    id: "1", 
    documentType: "Barangay Clearance", 
    reference: "AV-BC-000123", 
    requestedAt: "2025-08-01T09:00:00Z", 
    status: "processing" 
  },
  { 
    id: "2", 
    documentType: "Business Permit", 
    reference: "AV-BP-000089", 
    requestedAt: "2025-07-29T11:30:00Z", 
    status: "approved" 
  },
  { 
    id: "3", 
    documentType: "Certificate of Residency", 
    reference: "AV-CR-000234", 
    requestedAt: "2025-07-25T14:10:00Z", 
    status: "processing" 
  },
  { 
    id: "4", 
    documentType: "Certificate of Indigency", 
    reference: "AV-CI-000312", 
    requestedAt: "2025-07-20T08:20:00Z", 
    status: "request_for_payment" 
  },
  { 
    id: "5", 
    documentType: "Good Moral Certificate", 
    reference: "AV-GM-000077", 
    requestedAt: "2025-07-18T16:45:00Z", 
    status: "ready_to_claim" 
  },
  { 
    id: "6", 
    documentType: "Barangay Clearance", 
    reference: "AV-BC-000098", 
    requestedAt: "2025-07-10T10:05:00Z", 
    status: "ready_for_pickup" 
  },
  { 
    id: "7", 
    documentType: "Business Permit", 
    reference: "AV-BP-000099", 
    requestedAt: "2025-07-05T10:05:00Z", 
    status: "completed" 
  },
  { 
    id: "8", 
    documentType: "Certificate of Residency", 
    reference: "AV-CR-000100", 
    requestedAt: "2025-07-01T10:05:00Z", 
    status: "rejected" 
  },
]
