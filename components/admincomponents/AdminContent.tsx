"use client"

import React, { useState, useEffect } from "react"

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  changePercent: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  trend: string;
  placeholder?: string;
}
import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  Bell,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Plus,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// Icon mapping for dynamic icon assignment
const iconMap = {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  FileText,
  Bell,
  Activity
}

const quickActions = [
  {
    title: "Add New Resident",
    description: "Register a new resident",
    icon: Users,
    color: "bg-blue-500",
    href: "/admin/residents"
  },
  {
    title: "Process Request",
    description: "Review pending requests",
    icon: FileText,
    color: "bg-green-500",
    href: "/admin/requests"
  },
  {
    title: "Schedule Event",
    description: "Add barangay event",
    icon: Calendar,
    color: "bg-orange-500",
    href: "/admin/events"
  },
]

const getStatusConfig = (status: string) => {
  const normalizedStatus = status?.toLowerCase()
  const configs = {
    pending: {
      label: "Pending",
      color: "text-amber-700",
      bgColor: "bg-amber-100",
      dotColor: "bg-amber-500",
      icon: Clock,
    },
    approved: {
      label: "Approved",
      color: "text-purple-700",
      bgColor: "bg-purple-100",
      dotColor: "bg-purple-500",
      icon: CheckCircle,
    },
    processing: {
      label: "Processing",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      dotColor: "bg-blue-500",
      icon: Activity,
    },
    payment_pending: {
      label: "Payment Pending",
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
      dotColor: "bg-yellow-500",
      icon: TrendingUp,
    },
    payment_sent: {
      label: "Payment Sent",
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
      dotColor: "bg-yellow-500",
      icon: TrendingUp,
    },
    ready_to_claim: {
      label: "Ready to Claim",
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      dotColor: "bg-emerald-500",
      icon: CheckCircle,
    },
    ready_for_claim: {
      label: "Ready for Claim",
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      dotColor: "bg-emerald-500",
      icon: CheckCircle,
    },
    completed: {
      label: "Completed",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      dotColor: "bg-gray-500",
      icon: CheckCircle,
    },
    rejected: {
      label: "Rejected",
      color: "text-red-700",
      bgColor: "bg-red-100",
      dotColor: "bg-red-500",
      icon: AlertCircle,
    },
  }
  return configs[normalizedStatus as keyof typeof configs]
}


export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchDashboardData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000) // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  const getDefaultStats = (): DashboardStat[] => [
    {
      title: "Total Residents",
      value: "0",
      change: "+0",
      changePercent: "+0%",
      description: "this week",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      trend: "up",
      placeholder: "Resident data will be shown here"
    },
    {
      title: "Total Requests",
      value: "0",
      change: "+0",
      changePercent: "+0%",
      description: "all time",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      trend: "up",
      placeholder: "Total request data will be shown here"
    },
    {
      title: "Total Pending",
      value: "0",
      change: "+0",
      changePercent: "+0%",
      description: "awaiting review",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      trend: "up",
      placeholder: "Pending request data will be shown here"
    },
    {
      title: "Total Completed",
      value: "0",
      change: "+0",
      changePercent: "+0%",
      description: "processed successfully",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      trend: "up",
      placeholder: "Completed request data will be shown here"
    }
  ]

  const fetchDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      // Set default stats first only on initial load
      if (!isManualRefresh) {
        setStats(getDefaultStats())
      }
      
      // Fetch stats and recent requests in parallel
      const [statsResponse, requestsResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats'),
        fetch('/api/admin/dashboard/recent-requests?limit=4')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success && statsData.stats.length > 0) {
          // Map icon names to actual components
          const mappedStats = statsData.stats.map((stat: any) => ({
            ...stat,
            icon: iconMap[stat.icon as keyof typeof iconMap] || FileText
          }))
          setStats(mappedStats)
        }
      }

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        if (requestsData.success) {
          setRecentRequests(requestsData.requests)
        }
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Keep default stats on error only on initial load
      if (!isManualRefresh) {
        setStats(getDefaultStats())
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    fetchDashboardData(true)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-gray-600">Welcome back! Here's what's happening in Barangay Alma Villa.</p>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Activity className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-200 w-12 h-12"></div>
                <div className="h-5 w-14 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-10 bg-gray-200 rounded mb-1"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stats.map((stat: any) => {
            const Icon = stat.icon
            const trendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
            const trendColor = stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
            
            return (
              <div key={stat.title} className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${refreshing ? 'opacity-70' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} ring-1 ring-white/20`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {stat.value !== "0" && (
                    <div className={`flex items-center gap-1 ${trendColor} text-xs font-semibold bg-gray-50 px-2 py-1 rounded-full`}>
                      {React.createElement(trendIcon, { className: "h-3 w-3" })}
                      {stat.changePercent}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold text-gray-900 leading-none">{stat.value}</h3>
                    {stat.value !== "0" && (
                      <span className={`text-sm ${trendColor} font-medium pb-1`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {stat.title}
                    </p>
                    {stat.value === "0" ? (
                      <p className="text-xs text-gray-400 italic">
                        {stat.placeholder}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 capitalize">
                        {stat.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
                <p className="text-sm text-gray-600">Latest document requests from residents</p>
              </div>
              <a href="/admin/requests" className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View All
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
            <div className="p-6 space-y-3">
              {loading ? (
                // Loading skeleton for requests
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-48 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : recentRequests.length > 0 ? (
                recentRequests.map((request: any) => {
                  const statusConfig = getStatusConfig(request.status)
                  
                  return (
                    <div
                      key={request.id}
                      className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${statusConfig?.dotColor || 'bg-gray-400'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{request.type}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig?.bgColor || 'bg-gray-100'} ${statusConfig?.color || 'text-gray-700'}`}>
                            {statusConfig?.label || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>{request.resident}</span>
                          <span>•</span>
                          <span>{request.id}</span>
                          <span>•</span>
                          <span>{request.time}</span>
                        </div>
                      </div>
                      <a href="/admin/requests" className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                        View
                      </a>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600">Frequently used admin tasks</p>
            </div>
            <div className="p-6 space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <a
                    key={index}
                    href={action.href}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`p-2 rounded-lg text-white ${action.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </a>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}