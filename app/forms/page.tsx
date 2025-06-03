"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  Search,
  Users,
  Home,
  CreditCard,
  Building,
  Eye,
  Calendar,
  AlertCircle,
  Info
} from "lucide-react"

export default function DownloadableFormsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const downloadableForms = [
    {
      id: "barangay-clearance-form",
      title: "Barangay Clearance Application Form",
      description: "Form to apply for barangay clearance certificate",
      category: "certificate",
      icon: FileText,
      fileSize: "245 KB",
      pages: 2,
      requirements: ["Valid ID", "Proof of Residency", "2x2 Photo"],
      downloadUrl: "/forms/barangay-clearance-form.pdf",
      popular: true,
      lastUpdated: "2024-01-15"
    },
    {
      id: "residency-certificate-form",
      title: "Certificate of Residency Application",
      description: "Application form for certificate of residency",
      category: "certificate",
      icon: Home,
      fileSize: "198 KB",
      pages: 1,
      requirements: ["Valid ID", "Utility Bills", "Lease Contract"],
      downloadUrl: "/forms/residency-certificate-form.pdf",
      popular: true,
      lastUpdated: "2024-01-15"
    },
    {
      id: "indigency-certificate-form",
      title: "Certificate of Indigency Application",
      description: "Form for applying for certificate of indigency",
      category: "certificate",
      icon: Users,
      fileSize: "312 KB",
      pages: 3,
      requirements: ["Valid ID", "Income Statement", "Family Composition", "Proof of Residency"],
      downloadUrl: "/forms/indigency-certificate-form.pdf",
      lastUpdated: "2024-01-15"
    },
    {
      id: "business-permit-form",
      title: "Barangay Business Permit Application",
      description: "Application form for barangay business clearance/permit",
      category: "permit",
      icon: Building,
      fileSize: "456 KB",
      pages: 4,
      requirements: ["Valid ID", "Business Registration", "Location Map", "Tax Clearance"],
      downloadUrl: "/forms/business-permit-form.pdf",
      popular: true,
      lastUpdated: "2024-01-15"
    },
    {
      id: "cedula-form",
      title: "Community Tax Certificate (Cedula) Form",
      description: "Application form for community tax certificate",
      category: "certificate",
      icon: CreditCard,
      fileSize: "189 KB",
      pages: 1,
      requirements: ["Valid ID", "Income Declaration"],
      downloadUrl: "/forms/cedula-form.pdf",
      lastUpdated: "2024-01-15"
    },
    {
      id: "first-time-jobseeker-form",
      title: "First Time Job Seeker Certificate Form",
      description: "Application for first-time job seeker certification",
      category: "certificate",
      icon: Users,
      fileSize: "267 KB",
      pages: 2,
      requirements: ["Valid ID", "Birth Certificate", "Sworn Statement"],
      downloadUrl: "/forms/first-time-jobseeker-form.pdf",
      lastUpdated: "2024-01-15"
    },
    {
      id: "solo-parent-form",
      title: "Solo Parent ID Application Form",
      description: "Application form for solo parent identification card",
      category: "certificate",
      icon: Users,
      fileSize: "398 KB",
      pages: 3,
      requirements: ["Valid ID", "Birth Certificate of Child", "Death/Separation Certificate"],
      downloadUrl: "/forms/solo-parent-form.pdf",
      lastUpdated: "2024-01-15"
    },
    {
      id: "complaint-blotter-form",
      title: "Complaint/Blotter Report Form",
      description: "Form for filing complaints and incident reports",
      category: "report",
      icon: FileText,
      fileSize: "234 KB",
      pages: 2,
      requirements: ["Valid ID", "Detailed Statement"],
      downloadUrl: "/forms/complaint-blotter-form.pdf",
      lastUpdated: "2024-01-15"
    }
  ]

  const categories = [
    { id: "all", label: "All Forms", count: downloadableForms.length },
    { id: "certificate", label: "Certificates", count: downloadableForms.filter(form => form.category === "certificate").length },
    { id: "permit", label: "Permits", count: downloadableForms.filter(form => form.category === "permit").length },
    { id: "report", label: "Reports", count: downloadableForms.filter(form => form.category === "report").length }
  ]

  const filteredForms = downloadableForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || form.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = (form: typeof downloadableForms[0]) => {
    // In a real implementation, this would trigger the actual download
    console.log(`Downloading: ${form.title}`)
    // You would typically use: window.open(form.downloadUrl, '_blank')
    alert(`Downloading: ${form.title}\n\nIn a real implementation, this would download the PDF file.`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Downloadable Forms
            </h1>
            <p className="text-lg text-gray-600">
              Download and print official forms from Barangay Alma Villa. 
              Fill them out manually and submit to our office during business hours.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for forms..."
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

        {/* Popular Forms Section */}
        {selectedCategory === "all" && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Downloaded Forms</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {downloadableForms.filter(form => form.popular).map((form) => {
                const Icon = form.icon
                return (
                  <Card key={form.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-[#23479A]/10">
                          <Icon className="h-6 w-6 text-[#23479A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {form.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {form.description}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-gray-500">{form.fileSize}</span>
                            <span className="text-xs text-gray-500">{form.pages} page{form.pages !== 1 ? 's' : ''}</span>
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

        {/* All Forms Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory === "all" ? "All Forms" : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredForms.length} form{filteredForms.length !== 1 ? 's' : ''} available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredForms.map((form) => {
              const Icon = form.icon
              return (
                <Card key={form.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-[#23479A]/10">
                          <Icon className="h-6 w-6 text-[#23479A]" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {form.title}
                            {form.popular && (
                              <Badge variant="outline" className="ml-2 text-xs bg-orange-50 text-orange-700 border-orange-200">
                                Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {form.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* File Details */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-500">Size: <span className="text-gray-900">{form.fileSize}</span></span>
                          <span className="text-gray-500">Pages: <span className="text-gray-900">{form.pages}</span></span>
                        </div>
                        <span className="text-gray-500">
                          Updated: {formatDate(form.lastUpdated)}
                        </span>
                      </div>

                      {/* Requirements */}
                      <div>
                        <span className="text-sm text-gray-500">Required Documents:</span>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {form.requirements.map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDownload(form)}
                          className="flex-1 bg-[#23479A] hover:bg-[#23479A]/90"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button
                          variant="outline"
                          className="px-3"
                          onClick={() => alert("Preview functionality would open the PDF in a new tab")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* No Results */}
          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
              <p className="text-gray-600">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How to Use These Forms</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Download and print the required form</li>
                    <li>• Fill out completely using black ink</li>
                    <li>• Prepare all required documents</li>
                    <li>• Submit to Barangay Office during office hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-amber-100">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Important Reminders</h3>
                  <ul className="text-amber-800 text-sm space-y-1">
                    <li>• Ensure all information is accurate and complete</li>
                    <li>• Bring original documents for verification</li>
                    <li>• Processing fees may apply for certain documents</li>
                    <li>• Forms are updated regularly - download latest version</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="mt-8">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm">
                For assistance with forms or questions about requirements, contact us at{" "}
                <strong>almavilla.gloria@gmail.com</strong> or visit our office during business hours.
              </p>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Monday - Friday: 8:00 AM - 5:00 PM
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Saturday: 8:00 AM - 12:00 PM
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}