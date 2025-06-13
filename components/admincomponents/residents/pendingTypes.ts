// app/components/admincomponents/residents/pendingTypes.ts

export interface PendingResident {
    id: string
    lastName: string
    firstName: string
    middleName: string
    suffix: string
    birthDate: string
    age: string
    gender: "male" | "female"
    civilStatus: "single" | "married" | "widowed" | "divorced" | "separated"
    nationality: string
    religion: string
    email: string
    mobileNumber: string
    emergencyContact: string
    emergencyNumber: string
    houseNumber: string
    street: string
    purok: string
    barangay: string
    city: string
    province: string
    zipCode: string
    residencyLength: string
    type: string
    frontId: string
    backId: string
    capturedPhoto: string
    dateSubmitted: string
    status: "pending" | "under_review" | "approved" | "rejected"
    reviewNotes?: string
    reviewedBy?: string
    reviewedAt?: string
    documents: {
      frontId: {
        url: string
        status: "submitted" | "pending" | "approved" | "rejected"
        notes?: string
      }
      backId: {
        url: string
        status: "submitted" | "pending" | "approved" | "rejected"
        notes?: string
      }
      capturedPhoto: {
        url: string
        status: "submitted" | "pending" | "approved" | "rejected"
        notes?: string
      }
    }
  }
  
  export interface PendingRegistrationStats {
    total: number
    pending: number
    underReview: number
    approved: number
    rejected: number
    newToday: number
  }
  
  export interface DocumentReview {
    type: "frontId" | "backId" | "capturedPhoto"
    status: "approved" | "rejected"
    notes?: string
  }