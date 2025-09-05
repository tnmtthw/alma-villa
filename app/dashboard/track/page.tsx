"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search } from "lucide-react";

// Import components
import Modal from "./components/Modal";
import RequestCard from "./components/RequestCard";
import RequestTableRow from "./components/RequestTableRow";
import { getStatusConfig } from "./components/StatusBadge";

// Import hooks
import { useModal } from "./hooks/useModal";
import { useRequestActions } from "./hooks/useRequestActions";

// Import types and constants
import { RequestStatus, RequestItem } from "./types";
import { seedRequests } from "./constants/sampleData";

/**
 * TrackRequestsPage - Main component for tracking document requests
 * Provides filtering, searching, and action management for document requests
 */

export default function TrackRequestsPage() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<RequestStatus | "all">("all");
  
  // Custom hooks
  const { modalState, openModal, closeModal, handleConfirm } = useModal();
  const {
    handleCancel,
    handleDecline,
    handleReceived,
    handleReadyDownload,
    handleClaim,
    handleUpdateStatus
  } = useRequestActions(openModal);

  const filtered = useMemo(() => {
    return seedRequests.filter((r) => {
      const inSearch = !query || r.documentType.toLowerCase().includes(query.toLowerCase()) || r.reference.toLowerCase().includes(query.toLowerCase());
      const inStatus = activeStatus === "all" || r.status === activeStatus;
      return inSearch && inStatus;
    });
  }, [query, activeStatus]);

  /**
   * Format ISO date string to readable format
   */
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

  const statuses: (RequestStatus | "all")[] = [
    "all",
    "processing",
    "approved",
    "request_for_payment",
    "ready_to_claim",
    "ready_for_pickup",
    "completed",
    "rejected",
  ];

  const statusCounts = useMemo(() => {
    const counts: Record<RequestStatus | "all", number> = { 
      all: seedRequests.length,
      processing: 0,
      approved: 0,
      request_for_payment: 0,
      ready_to_claim: 0,
      ready_for_pickup: 0,
      completed: 0,
      rejected: 0
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
                            {getStatusConfig(s as RequestStatus).label} ({statusCounts[s] || 0})
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
                  {filtered.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onCancel={handleCancel}
                      onDecline={handleDecline}
                      onDownload={handleReadyDownload}
                      onUpdateStatus={handleUpdateStatus}
                      onClaim={handleClaim}
                      formatDate={formatDate}
                    />
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
                        <th className="text-center py-4 px-6 font-medium text-slate-700 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((request) => (
                        <RequestTableRow
                          key={request.id}
                          request={request}
                          onCancel={handleCancel}
                          onDecline={handleDecline}
                          onDownload={handleReadyDownload}
                          onUpdateStatus={handleUpdateStatus}
                          onClaim={handleClaim}
                          formatDate={formatDate}
                        />
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

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        type={modalState.type}
        message={modalState.message}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </main>
  );
}