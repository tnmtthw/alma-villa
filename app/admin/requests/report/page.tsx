'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, FileText, TrendingUp, Users, Clock } from 'lucide-react'

interface Document {
    id: string
    userId: string
    fullName: string
    suffix: string
    birthDate: string
    placeOfBirth: string | null
    age: string
    civilStatus: string
    purok: string
    residencyLength: string
    purpose: string
    additionalInfo: string
    type: string
    status: string
    createdAt: string
    updatedAt: string
    businessName: string
    businessLocation: string
    operatorName: string
    operatorAddress: string
    citizenship: string
    proofOfPayment: string
    user: {
        email: string
        mobileNumber: string
    }
}

interface ApiResponse {
    success: boolean
    documents: Document[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
}

interface ReportStats {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
    byStatus: Record<string, number>
    byType: Record<string, number>
    byPurpose: Record<string, number>
}

export default function ReportPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [dateRange, setDateRange] = useState('all')
    const [stats, setStats] = useState<ReportStats>({
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        byStatus: {},
        byType: {},
        byPurpose: {}
    })

    useEffect(() => {
        fetchDocuments()
    }, [dateRange])

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/document')
            if (!response.ok) {
                throw new Error('Failed to fetch documents')
            }
            const data: ApiResponse = await response.json()
            setDocuments(data.documents)
            calculateStats(data.documents)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (docs: Document[]) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        let filteredDocs = docs

        // Apply date range filter
        if (dateRange === 'today') {
            filteredDocs = docs.filter(doc => {
                const docDate = new Date(doc.createdAt)
                return docDate >= today
            })
        } else if (dateRange === 'week') {
            filteredDocs = docs.filter(doc => {
                const docDate = new Date(doc.createdAt)
                return docDate >= weekAgo
            })
        } else if (dateRange === 'month') {
            filteredDocs = docs.filter(doc => {
                const docDate = new Date(doc.createdAt)
                return docDate >= monthAgo
            })
        }

        const todayCount = docs.filter(doc => {
            const docDate = new Date(doc.createdAt)
            return docDate >= today
        }).length

        const weekCount = docs.filter(doc => {
            const docDate = new Date(doc.createdAt)
            return docDate >= weekAgo
        }).length

        const monthCount = docs.filter(doc => {
            const docDate = new Date(doc.createdAt)
            return docDate >= monthAgo
        }).length

        const byStatus: Record<string, number> = {}
        const byType: Record<string, number> = {}
        const byPurpose: Record<string, number> = {}

        filteredDocs.forEach(doc => {
            byStatus[doc.status] = (byStatus[doc.status] || 0) + 1
            byType[doc.type] = (byType[doc.type] || 0) + 1
            byPurpose[doc.purpose] = (byPurpose[doc.purpose] || 0) + 1
        })

        setStats({
            total: filteredDocs.length,
            today: todayCount,
            thisWeek: weekCount,
            thisMonth: monthCount,
            byStatus,
            byType,
            byPurpose
        })
    }

    const exportToCSV = () => {
        const headers = [
            'ID', 'Full Name', 'Email', 'Mobile Number', 'Type', 'Status',
            'Purpose', 'Created Date', 'Updated Date', 'Purok', 'Age', 'Civil Status'
        ]

        const csvContent = [
            headers.join(','),
            ...documents.map(doc => [
                doc.id,
                `"${doc.fullName} ${doc.suffix}"`,
                `"${doc.user.email}"`,
                `"${doc.user.mobileNumber}"`,
                `"${doc.type}"`,
                `"${doc.status}"`,
                `"${doc.purpose}"`,
                doc.createdAt,
                doc.updatedAt,
                `"${doc.purok}"`,
                doc.age,
                `"${doc.civilStatus}"`
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `document-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready_to_claim': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'rejected': return 'bg-red-100 text-red-800'
            case 'approved': return 'bg-blue-100 text-blue-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading report data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <Button onClick={fetchDocuments}>Retry</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Document Requests Report</h1>
                    <p className="text-gray-600 mt-2">Comprehensive analytics and statistics for document requests</p>
                </div>
                <div className="flex gap-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={exportToCSV} className="flex items-center gap-2 w-40">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {dateRange === 'all' ? 'All time' : `Last ${dateRange}`}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.today}</div>
                        <p className="text-xs text-muted-foreground">
                            New requests today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisWeek}</div>
                        <p className="text-xs text-muted-foreground">
                            Last 7 days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisMonth}</div>
                        <p className="text-xs text-muted-foreground">
                            Last 30 days
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.byStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(status)}>
                                            {status.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                    </div>
                                    <span className="font-semibold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Document Type Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Document Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.byType).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{type}</span>
                                    <span className="font-semibold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Purpose Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Purpose Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(stats.byPurpose).map(([purpose, count]) => (
                                <div key={purpose} className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate">{purpose}</span>
                                    <span className="font-semibold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Name</th>
                                    <th className="text-left p-2">Type</th>
                                    <th className="text-left p-2">Status</th>
                                    <th className="text-left p-2">Purpose</th>
                                    <th className="text-left p-2">Created</th>
                                    <th className="text-left p-2">Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.slice(0, 10).map((doc) => (
                                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">
                                            <div>
                                                <div className="font-medium">{doc.fullName} {doc.suffix}</div>
                                                <div className="text-xs text-gray-500">{doc.purok}</div>
                                            </div>
                                        </td>
                                        <td className="p-2">{doc.type}</td>
                                        <td className="p-2">
                                            <Badge className={getStatusColor(doc.status)}>
                                                {doc.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="p-2">{doc.purpose}</td>
                                        <td className="p-2">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-2">
                                            <div className="text-xs">
                                                <div>{doc.user.email}</div>
                                                <div>{doc.user.mobileNumber}</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
