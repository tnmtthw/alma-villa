"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Users,
  Home,
  Building,
  Search,
  Clock,
  ArrowRight,
  Info
} from "lucide-react"

export default function DocumentRequestPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const documentTypes = [
    {
      id: "barangay-clearance",
      title: "Barangay Clearance",
      description: "Certificate of good moral character and residence",
      category: "certificate",
      icon: FileText,
      fee: "₱50",
      processingTime: "1-2 days",
      requirements: ["Valid ID", "Proof of Residency"],
      popular: true
    },
    {
      id: "certificate-of-residency",
      title: "Certificate of Residency",
      description: "Official document proving your residence in the barangay",
      category: "certificate",
      icon: Home,
      fee: "₱30",
      processingTime: "1 day",
      requirements: ["Valid ID", "Utility Bills"],
      popular: true
    },
    {
      id: "certificate-of-indigency",
      title: "Certificate of Indigency",
      description: "Document certifying low-income status for assistance programs",
      category: "certificate",
      icon: Users,
      fee: "Free",
      processingTime: "2-3 days",
      requirements: ["Valid ID", "Income Statement", "Family Composition"]
    },
    {
      id: "business-permit",
      title: "Barangay Business Permit",
      description: "Permit to operate a business within the barangay",
      category: "permit",
      icon: Building,
      fee: "₱200",
      processingTime: "3-5 days",
      requirements: ["Valid ID", "Business Registration", "Location Map"]
    },

    {
      id: "good-moral-character",
      title: "Certificate of Good Moral Character",
      description: "Certificate verifying good moral character and integrity",
      category: "certificate",
      icon: FileText,
      fee: "₱50",
      processingTime: "1-2 days",
      requirements: ["Valid ID", "Birth Certificate"],
      popular: true
    }
  ]

  const categories = [
    { id: "all", label: "All Documents", count: documentTypes.length },
    { id: "certificate", label: "Certificates", count: documentTypes.filter(doc => doc.category === "certificate").length },
    { id: "permit", label: "Permits", count: documentTypes.filter(doc => doc.category === "permit").length }
  ]

  const filteredDocuments = documentTypes.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDocumentSelect = (documentId: string) => {
    // Navigate to the specific document form
    router.push(`/dashboard/request-form?type=${documentId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Request Documents
            </h1>
            <p className="text-lg text-gray-600">
              Select the type of document you need from Barangay Alma Villa. 
              All requests are processed securely and efficiently with automated PDF generation.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`whitespace-nowrap ${
                        selectedCategory === category.id 
                          ? "bg-[#23479A] hover:bg-[#23479A]/90" 
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {category.label}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Documents Section */}
        {selectedCategory === "all" && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Requested Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documentTypes.filter(doc => doc.popular).map((doc) => {
                const Icon = doc.icon
                return (
                  <Card key={doc.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-[#23479A]/10">
                          <Icon className="h-6 w-6 text-[#23479A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#23479A] transition-colors">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {doc.description}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-sm font-medium text-[#23479A]">{doc.fee}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {doc.processingTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* All Documents Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory === "all" ? "All Documents" : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocuments.map((doc) => {
              const Icon = doc.icon
              return (
                <Card key={doc.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-[#23479A]/10">
                          <Icon className="h-6 w-6 text-[#23479A]" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-[#23479A] transition-colors">
                            {doc.title}
                            {doc.popular && (
                              <Badge variant="outline" className="ml-2 text-xs bg-orange-50 text-orange-700 border-orange-200">
                                Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {doc.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Fee and Processing Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Fee</span>
                            <p className="font-semibold text-[#23479A]">{doc.fee}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Processing Time</span>
                            <p className="text-sm text-gray-900 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {doc.processingTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <span className="text-sm text-gray-500">Requirements</span>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {doc.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => handleDocumentSelect(doc.id)}
                        className="w-full bg-[#23479A] hover:bg-[#23479A]/90 group-hover:scale-[1.02] transition-transform"
                      >
                        Fill Out Form
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* No Results */}
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                  <p className="text-blue-800 text-sm">
                    If you can't find the document you're looking for or need assistance with requirements, 
                    please contact the Barangay Office at <strong>almavilla.gloria@gmail.com</strong> or 
                    visit us during office hours. All forms automatically generate PDF documents for admin processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}