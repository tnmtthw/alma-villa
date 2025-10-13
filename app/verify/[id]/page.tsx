import React from 'react'

async function getDocument(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const url = `${baseUrl}/api/document?id=${encodeURIComponent(id)}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) return null
  const data = await res.json()
  return data?.document || null
}

interface VerifyPageProps {
  params: { id: string }
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const document = await getDocument(params.id)

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold mb-2">Document not found</h1>
          <p className="text-gray-600">The document you are trying to verify does not exist.</p>
        </div>
      </div>
    )
  }

  const fullName = document.user?.firstName && document.user?.lastName
    ? `${document.user.firstName} ${document.user.lastName}`.trim()
    : document.fullName || 'Unknown'

  const requestDate = document.createdAt
    ? new Date(document.createdAt).toLocaleString()
    : 'N/A'

  const lastUpdated = document.updatedAt
    ? new Date(document.updatedAt).toLocaleString()
    : 'N/A'

  const documentType = document.type || 'N/A'

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-xl bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Document Verified</h1>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Verified</span>
        </div>
        <div className="mt-4 border-t pt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name</span>
            <span className="font-medium">{fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Document Type</span>
            <span className="font-medium">{documentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ID</span>
            <span className="font-medium">{document.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Request Date</span>
            <span className="font-medium">{requestDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date of Update</span>
            <span className="font-medium">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


