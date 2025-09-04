"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search, XCircle, CheckCircle2, Clock, Eye, FileText } from "lucide-react";

type RequestStatus = "pending" | "review" | "processing" | "payment" | "ready" | "completed" | "declined" | "cancelled";

type RequestItem = {
  id: string;
  documentType: string;
  reference: string;
  requestedAt: string; // ISO
  status: RequestStatus;
};

const seedRequests: RequestItem[] = [
  { id: "1", documentType: "Barangay Clearance", reference: "AV-BC-000123", requestedAt: "2025-08-01T09:00:00Z", status: "pending" },
  { id: "2", documentType: "Business Permit", reference: "AV-BP-000089", requestedAt: "2025-07-29T11:30:00Z", status: "review" },
  { id: "3", documentType: "Certificate of Residency", reference: "AV-CR-000234", requestedAt: "2025-07-25T14:10:00Z", status: "processing" },
  { id: "4", documentType: "Certificate of Indigency", reference: "AV-CI-000312", requestedAt: "2025-07-20T08:20:00Z", status: "payment" },
  { id: "5", documentType: "Good Moral Certificate", reference: "AV-GM-000077", requestedAt: "2025-07-18T16:45:00Z", status: "ready" },
  { id: "6", documentType: "Barangay Clearance", reference: "AV-BC-000098", requestedAt: "2025-07-10T10:05:00Z", status: "completed" },
];

const statusMeta: Record<RequestStatus, { label: string; badgeClass: string; dotColor: string }> = {
  pending: { label: "Pending", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", dotColor: "bg-amber-400" },
  review: { label: "Under Review", badgeClass: "bg-blue-50 text-blue-700 border-blue-200", dotColor: "bg-blue-400" },
  processing: { label: "Processing", badgeClass: "bg-purple-50 text-purple-700 border-purple-200", dotColor: "bg-purple-400" },
  payment: { label: "Payment Required", badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200", dotColor: "bg-yellow-400" },
  ready: { label: "Ready for Pickup", badgeClass: "bg-green-50 text-green-700 border-green-200", dotColor: "bg-green-400" },
  completed: { label: "Completed", badgeClass: "bg-gray-50 text-gray-600 border-gray-200", dotColor: "bg-gray-400" },
  declined: { label: "Declined", badgeClass: "bg-red-50 text-red-700 border-red-200", dotColor: "bg-red-400" },
  cancelled: { label: "Cancelled", badgeClass: "bg-red-50 text-red-700 border-red-200", dotColor: "bg-red-400" },
};

export default function TrackRequestsPage() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<RequestStatus | "all">("all");

  const filtered = useMemo(() => {
    return seedRequests.filter((r) => {
      const inSearch = !query || r.documentType.toLowerCase().includes(query.toLowerCase()) || r.reference.toLowerCase().includes(query.toLowerCase());
      const inStatus = activeStatus === "all" || r.status === activeStatus;
      return inSearch && inStatus;
    });
  }, [query, activeStatus]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancel = (id: string) => {
    alert(`Cancel request ${id}`);
  };
  const handleDecline = (id: string) => {
    alert(`Decline request ${id}`);
  };
  const handleReadyDownload = (id: string) => {
    alert(`Download for request ${id}`);
  };

  const statuses: (RequestStatus | "all")[] = [
    "all",
    "pending",
    "review",
    "processing",
    "payment",
    "ready",
    "completed",
    "declined",
    "cancelled",
  ];

  const statusCounts = useMemo(() => {
    const counts: Record<RequestStatus | "all", number> = { 
      all: seedRequests.length,
      pending: 0,
      review: 0,
      processing: 0,
      payment: 0,
      ready: 0,
      completed: 0,
      declined: 0,
      cancelled: 0
    };
    
    statuses.forEach(status => {
      if (status !== "all") {
        counts[status] = seedRequests.filter(r => r.status === status).length;
      }
    });
    return counts;
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Track Requests</h1>
          <p className="text-slate-600">Monitor the status of your document requests and take action when needed.</p>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search Requests
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      value={query} 
                      onChange={(e) => setQuery(e.target.value)} 
                      placeholder="Search by reference number or document type..." 
                      className="pl-10 border-slate-300 focus:border-[#23479A] focus:ring-[#23479A]/20" 
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="lg:w-72">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Filter by Status
                  </label>
                  <div className="relative">
                    <select
                      value={activeStatus}
                      onChange={(e) => setActiveStatus(e.target.value as RequestStatus | "all")}
                      className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 px-4 pr-10 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#23479A]/20 focus:border-[#23479A]"
                    >
                      <option value="all">All Statuses ({statusCounts.all})</option>
                      {statuses
                        .filter((s) => s !== "all")
                        .map((s) => (
                          <option key={s} value={s}>
                            {statusMeta[s as RequestStatus].label} ({statusCounts[s] || 0})
                          </option>
                        ))}
                    </select>
                    <Filter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        {query && (
          <div className="mb-4 text-sm text-slate-600">
            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} {query && `for "${query}"`}
          </div>
        )}

        {/* Requests List - Mobile First Design */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50/50">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Document Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length > 0 ? (
              <>
                {/* Mobile Card View */}
                <div className="block md:hidden">
                  {filtered.map((r) => (
                    <div key={r.id} className="border-b border-slate-100 last:border-b-0 p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#23479A]/10 rounded-lg flex-shrink-0">
                              <FileText className="h-4 w-4 text-[#23479A]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-slate-900 text-sm leading-tight">
                                {r.documentType}
                              </h3>
                              <p className="font-mono text-xs text-slate-600 mt-0.5">
                                {r.reference}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <div className={`w-2 h-2 rounded-full ${statusMeta[r.status].dotColor}`}></div>
                            <Badge className={`${statusMeta[r.status].badgeClass} text-xs px-2 py-1`}>
                              {statusMeta[r.status].label}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Date */}
                        <div className="text-xs text-slate-500">
                          Requested: {formatDate(r.requestedAt)}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          {(r.status === "pending" || r.status === "review" || r.status === "processing") && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs px-3 flex-1 sm:flex-none" 
                              onClick={() => handleCancel(r.id)}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          )}
                          {r.status === "payment" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-xs px-3 flex-1 sm:flex-none" 
                              onClick={() => handleDecline(r.id)}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Decline
                            </Button>
                          )}
                          {r.status === "ready" && (
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 flex-1 sm:flex-none" 
                              onClick={() => handleReadyDownload(r.id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          )}
                          <Link href={`/dashboard/request?id=${r.id}`} className="inline-flex flex-1 sm:flex-none">
                            <Button variant="outline" size="sm" className="hover:bg-slate-50 text-xs px-3 w-full sm:w-auto">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-4 px-6 font-medium text-slate-700 text-sm">Reference</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700 text-sm">Document Type</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700 text-sm">Date Requested</th>
                        <th className="text-left py-4 px-6 font-medium text-slate-700 text-sm">Status</th>
                        <th className="text-right py-4 px-6 font-medium text-slate-700 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-mono text-sm font-medium text-slate-900">
                              {r.reference}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#23479A]/10 rounded-lg">
                                <FileText className="h-4 w-4 text-[#23479A]" />
                              </div>
                              <span className="font-medium text-slate-900">{r.documentType}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-slate-600 text-sm">
                            {formatDate(r.requestedAt)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusMeta[r.status].dotColor}`}></div>
                              <Badge className={`${statusMeta[r.status].badgeClass} font-medium text-xs`}>
                                {statusMeta[r.status].label}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-end gap-2 min-w-[320px]">
                              {(r.status === "pending" || r.status === "review" || r.status === "processing") && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex-1" 
                                  onClick={() => handleCancel(r.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1.5" />
                                  Cancel
                                </Button>
                              )}
                              {r.status === "payment" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300 flex-1" 
                                  onClick={() => handleDecline(r.id)}
                                >
                                  <Clock className="h-4 w-4 mr-1.5" />
                                  Decline
                                </Button>
                              )}
                              {r.status === "ready" && (
                                <Button 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white flex-1" 
                                  onClick={() => handleReadyDownload(r.id)}
                                >
                                  <Download className="h-4 w-4 mr-1.5" />
                                  Download
                                </Button>
                              )}
                              <Link href={`/dashboard/request?id=${r.id}`} className="inline-flex flex-1">
                                <Button variant="outline" size="sm" className="hover:bg-slate-50 w-full">
                                  <Eye className="h-4 w-4 mr-1.5" />
                                  View
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="py-12 md:py-16 px-4 text-center">
                <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />
                </div>
                <h3 className="text-base md:text-lg font-medium text-slate-900 mb-1">No requests found</h3>
                <p className="text-sm md:text-base text-slate-500">
                  {query 
                    ? "Try adjusting your search terms or filters."
                    : "You haven't submitted any requests yet."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}