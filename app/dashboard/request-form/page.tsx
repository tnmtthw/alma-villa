"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// Import all form components
import BarangayClearanceForm from "@/components/forms/BarangayClearanceForm"
// import BusinessPermitForm from "@/components/forms/BusinessPermitForm"
import CedulaForm from "@/components/forms/CedulaForm"
import JobSeekerForm from "@/components/forms/JobSeekerForm"
import SoloParentForm from "@/components/forms/SoloParentForm"
import ResidencyForm from "@/components/forms/ResidencyForm"
import IndigencyForm from "@/components/forms/IndigencyForm"
import BlotterForm from "@/components/forms/BlotterForm"

// Document type configuration
const documentTypes = {
  "barangay-clearance": {
    title: "Barangay Clearance",
    description: "Certificate of good moral character and residence",
    fee: "₱50",
    processingTime: "1-2 days",
    component: BarangayClearanceForm
  },
  "certificate-of-residency": {
    title: "Certificate of Residency", 
    description: "Official document proving your residence in the barangay",
    fee: "₱30",
    processingTime: "1 day",
    component: ResidencyForm
  },
  "certificate-of-indigency": {
    title: "Certificate of Indigency",
    description: "Document certifying low-income status for assistance programs", 
    fee: "Free",
    processingTime: "2-3 days",
    component: IndigencyForm
  },
//   "business-permit": {
//     title: "Barangay Business Permit",
//     description: "Permit to operate a business within the barangay",
//     fee: "₱200", 
//     processingTime: "3-5 days",
//     component: BusinessPermitForm
//   },
  "cedula": {
    title: "Community Tax Certificate (Cedula)",
    description: "Official tax certificate for legal transactions",
    fee: "₱30",
    processingTime: "Same day", 
    component: CedulaForm
  },
  "first-time-job-seeker": {
    title: "First Time Job Seeker Certificate",
    description: "Certificate for first-time job seekers to claim tax exemption",
    fee: "Free",
    processingTime: "1 day",
    component: JobSeekerForm
  },
  "solo-parent": {
    title: "Solo Parent Certificate", 
    description: "Certificate for single parents to avail benefits and discounts",
    fee: "Free",
    processingTime: "2-3 days",
    component: SoloParentForm
  },
  "complaint-blotter": {
    title: "Complaint/Blotter Report",
    description: "Official report for incidents and complaints",
    fee: "Free",
    processingTime: "Same day",
    component: BlotterForm
  }
} as const

type DocumentType = keyof typeof documentTypes

export default function RequestFormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23479A] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form...</p>
          </div>
        </div>
      }
    >
      <RequestFormContent />
    </Suspense>
  )
}

function RequestFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const documentType = searchParams.get("type") as DocumentType
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if document type is valid
    if (!documentType || !documentTypes[documentType]) {
      router.push("/dashboard/request")
      return
    }
    setIsLoading(false)
  }, [documentType, router])

  const handleBack = () => {
    router.push("/dashboard/request")
  }

  const handleFormSubmit = (formData: any) => {
    // Handle form submission - generate PDF and save to database
    console.log("Form submitted:", { documentType, formData })
    
    // Here you would typically:
    // 1. Save to database
    // 2. Generate PDF
    // 3. Send notifications
    // 4. Redirect to success page
    
    alert("Request submitted successfully!")
    router.push("/dashboard/request")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23479A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!documentType || !documentTypes[documentType]) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Not Found</h1>
          <p className="text-gray-600 mb-6">The requested document type is not available.</p>
          <Button onClick={handleBack} className="bg-[#23479A] hover:bg-[#23479A]/90">
            Back to Documents
          </Button>
        </div>
      </div>
    )
  }

  const document = documentTypes[documentType]
  const FormComponent = document.component

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Button>
          
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#23479A]">{document.title}</CardTitle>
              <CardDescription className="text-lg">{document.description}</CardDescription>
              <div className="flex items-center gap-6 text-sm mt-4 pt-4 border-t">
                <span><strong>Fee:</strong> {document.fee}</span>
                <span><strong>Processing Time:</strong> {document.processingTime}</span>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Form Component */}
        <FormComponent onBackAction={handleBack} onSubmit={handleFormSubmit} />
      </div>
    </div>
  )
}