"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  HelpCircle,
  Book,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  ExternalLink,
} from "lucide-react"

export default function HelpSupport() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-gray-500">
          Find help resources and contact support.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#23479A]" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Quick answers to common questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">How do I add a new resident?</h3>
                <p className="text-sm text-gray-500">
                  Go to the Residents page and click the "Add Resident" button. Fill in the required information and submit the form.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">How can I verify resident documents?</h3>
                <p className="text-sm text-gray-500">
                  Navigate to the pending registrations tab, review the submitted documents, and use the verify/reject buttons accordingly.
                </p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">How do I generate reports?</h3>
                <p className="text-sm text-gray-500">
                  Use the Export feature in the Residents page to generate reports in various formats (Excel, CSV, PDF).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-[#23479A]" />
              Documentation
            </CardTitle>
            <CardDescription>
              Detailed guides and documentation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <a href="#" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#23479A]" />
                  <div>
                    <p className="font-medium">User Guide</p>
                    <p className="text-sm text-gray-500">Complete system documentation</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#23479A]" />
                  <div>
                    <p className="font-medium">Admin Manual</p>
                    <p className="text-sm text-gray-500">Administrative procedures</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[#23479A]" />
                  <div>
                    <p className="font-medium">Video Tutorials</p>
                    <p className="text-sm text-gray-500">Step-by-step video guides</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#23479A]" />
              Contact Support
            </CardTitle>
            <CardDescription>
              Get in touch with our support team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Phone className="h-5 w-5 text-[#23479A]" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-500">+63 (2) 8123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-[#23479A]" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-500">support@almavilla.gov.ph</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Send us a message</h3>
              <div className="space-y-2">
                <Input placeholder="Subject" />
                <textarea 
                  className="w-full h-32 px-3 py-2 border rounded-md border-gray-200 resize-none"
                  placeholder="Describe your issue..."
                />
              </div>
              <Button className="w-full bg-[#23479A] hover:bg-[#23479A]/90 text-white">
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 