'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, Search, Shield, AlertTriangle, User, FileText, Settings } from 'lucide-react'

interface AuditLog {
  id: string
  userId: string | null
  action: string
  details: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user: {
    id: string
    email: string | null
    firstName: string | null
    lastName: string | null
  } | null
}

interface AuditStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  actionBreakdown: Array<{
    action: string
    count: number
  }>
  topUsers: Array<{
    userId: string | null
    count: number
    user: {
      id: string
      email: string | null
      firstName: string | null
      lastName: string | null
    } | null
  }>
}

export default function AuditLogPage() {
  const [allAuditLogs, setAllAuditLogs] = useState<AuditLog[]>([])
  const [filteredAuditLogs, setFilteredAuditLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    action: 'all',
    userId: '',
    startDate: '',
    endDate: '',
    search: '',
  })
  const [searchInput, setSearchInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchInput.trim()) {
      setIsSearching(true)
    }

    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }))
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    fetchAllAuditLogs()
    fetchStats()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [allAuditLogs, filters])

  const fetchAllAuditLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/audit?limit=1000')
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      const data = await response.json()
      console.log('All audit logs loaded:', data.auditLogs?.length || 0)
      setAllAuditLogs(data.auditLogs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allAuditLogs]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(log => {
        const userName = log.user ? `${log.user.firstName || ''} ${log.user.lastName || ''}`.toLowerCase() : ''
        const userEmail = log.user?.email?.toLowerCase() || ''
        const action = log.action.toLowerCase()
        const details = log.details?.toLowerCase() || ''
        const ipAddress = log.ipAddress?.toLowerCase() || ''

        return userName.includes(searchTerm) ||
          userEmail.includes(searchTerm) ||
          action.includes(searchTerm) ||
          details.includes(searchTerm) ||
          ipAddress.includes(searchTerm)
      })
    }

    if (filters.action && filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action)
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      filtered = filtered.filter(log => new Date(log.createdAt) >= startDate)
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(log => new Date(log.createdAt) <= endDate)
    }

    const itemsPerPage = 50
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedLogs = filtered.slice(startIndex, endIndex)

    setFilteredAuditLogs(paginatedLogs)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))

    console.log(`Filtered ${filtered.length} logs, showing ${paginatedLogs.length} on page ${page}`)
  }

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/admin/audit/stats?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? '' : value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      action: 'all',
      userId: '',
      startDate: '',
      endDate: '',
      search: '',
    })
    setSearchInput('')
    setPage(1)
  }

  const exportAuditLogs = () => {
    const headers = [
      'ID', 'User', 'Action', 'Details', 'IP Address', 'User Agent', 'Created At'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredAuditLogs.map(log => [
        log.id,
        `"${log.user?.email || 'System'}"`,
        `"${log.action}"`,
        `"${log.details || ''}"`,
        `"${log.ipAddress || ''}"`,
        `"${log.userAgent || ''}"`,
        log.createdAt
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'USER_LOGIN': return 'bg-green-100 text-green-800'
      case 'USER_LOGOUT': return 'bg-gray-100 text-gray-800'
      case 'USER_REGISTRATION': return 'bg-blue-100 text-blue-800'
      case 'DOCUMENT_APPROVAL': return 'bg-green-100 text-green-800'
      case 'DOCUMENT_REJECTION': return 'bg-red-100 text-red-800'
      case 'DOCUMENT_SUBMISSION': return 'bg-yellow-100 text-yellow-800'
      case 'DOCUMENT_STATUS_CHANGE': return 'bg-blue-100 text-blue-800'
      case 'ROLE_CHANGE': return 'bg-purple-100 text-purple-800'
      case 'USER_VERIFICATION': return 'bg-green-100 text-green-800'
      case 'PASSWORD_RESET': return 'bg-orange-100 text-orange-800'
      case 'SYSTEM_ACCESS': return 'bg-gray-100 text-gray-800'
      case 'DATA_EXPORT': return 'bg-indigo-100 text-indigo-800'
      case 'DATA_IMPORT': return 'bg-cyan-100 text-cyan-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'USER_LOGIN': return <User className="h-4 w-4" />
      case 'USER_LOGOUT': return <User className="h-4 w-4" />
      case 'USER_REGISTRATION': return <User className="h-4 w-4" />
      case 'DOCUMENT_APPROVAL': return <FileText className="h-4 w-4" />
      case 'DOCUMENT_REJECTION': return <AlertTriangle className="h-4 w-4" />
      case 'DOCUMENT_SUBMISSION': return <FileText className="h-4 w-4" />
      case 'DOCUMENT_STATUS_CHANGE': return <FileText className="h-4 w-4" />
      case 'ROLE_CHANGE': return <Settings className="h-4 w-4" />
      case 'USER_VERIFICATION': return <Shield className="h-4 w-4" />
      case 'PASSWORD_RESET': return <Settings className="h-4 w-4" />
      case 'SYSTEM_ACCESS': return <Shield className="h-4 w-4" />
      case 'DATA_EXPORT': return <Download className="h-4 w-4" />
      case 'DATA_IMPORT': return <FileText className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  if (loading && allAuditLogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchAllAuditLogs}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail & Security Logging</h1>
          <p className="text-gray-600 mt-2">Monitor system usage and review activity logs</p>
        </div>
        <Button onClick={exportAuditLogs} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">Today's activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Logs</label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isSearching ? 'text-blue-500' : 'text-gray-400'}`} />
                <Input
                  placeholder="Search by user, action, or details..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isSearching ? 'Searching...' : 'Search will update automatically as you type'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Action Type</label>
                <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="USER_LOGIN">🔐 User Login</SelectItem>
                    <SelectItem value="USER_LOGOUT">🔐 User Logout</SelectItem>
                    <SelectItem value="USER_REGISTRATION">🔐 User Registration</SelectItem>
                    <SelectItem value="PASSWORD_RESET">🔐 Password Reset</SelectItem>
                    <SelectItem value="USER_VERIFICATION">👤 User Verification</SelectItem>
                    <SelectItem value="ROLE_CHANGE">👤 Role Change</SelectItem>
                    <SelectItem value="DOCUMENT_SUBMISSION">📄 Document Submission</SelectItem>
                    <SelectItem value="DOCUMENT_APPROVAL">📄 Document Approval</SelectItem>
                    <SelectItem value="DOCUMENT_REJECTION">📄 Document Rejection</SelectItem>
                    <SelectItem value="DOCUMENT_STATUS_CHANGE">📄 Document Status Change</SelectItem>
                    <SelectItem value="SYSTEM_ACCESS">⚙️ System Access</SelectItem>
                    <SelectItem value="DATA_EXPORT">📊 Data Export</SelectItem>
                    <SelectItem value="DATA_IMPORT">📊 Data Import</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Start Date</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">End Date</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                Clear All Filters
              </Button>
            </div>

            {(filters.action !== 'all' || filters.search || filters.startDate || filters.endDate) && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {filters.action !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Action: {filters.action.replace('_', ' ')}
                  </Badge>
                )}
                {filters.search && (
                  <Badge variant="secondary" className="text-xs">
                    Search: "{filters.search}"
                  </Badge>
                )}
                {filters.startDate && (
                  <Badge variant="secondary" className="text-xs">
                    From: {filters.startDate}
                  </Badge>
                )}
                {filters.endDate && (
                  <Badge variant="secondary" className="text-xs">
                    To: {filters.endDate}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {stats && stats.actionBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Action Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.actionBreakdown.map((action) => (
                <div key={action.action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getActionIcon(action.action)}
                    <span className="font-medium">{action.action.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="secondary">{action.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAuditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Audit Logs Found</h3>
              <p className="text-gray-500 mb-4">
                {filters.action !== 'all' || filters.search || filters.startDate || filters.endDate
                  ? 'No logs match your current filters. Try adjusting your search criteria.'
                  : 'No audit logs have been recorded yet. System activities will appear here once users start using the system.'
                }
              </p>
              {(filters.action !== 'all' || filters.search || filters.startDate || filters.endDate) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Action</th>
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Details</th>
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <Badge className={getActionColor(log.action)}>
                            {log.action.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-2">
                        {log.user ? (
                          <div>
                            <div className="font-medium">{log.user.firstName} {log.user.lastName}</div>
                            <div className="text-xs text-gray-500">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">System</span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="max-w-xs truncate" title={log.details || ''}>
                          {log.details || 'No details'}
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="font-mono text-xs">{log.ipAddress || 'N/A'}</span>
                      </td>
                      <td className="p-2">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
