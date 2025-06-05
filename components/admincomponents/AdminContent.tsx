"use client"

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
  Filter,
  Download,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const stats = [
  {
    title: "Total Residents",
    value: "1,234",
    change: "+5",
    changePercent: "+4.2%",
    description: "this week",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    trend: "up"
  },
  {
    title: "Pending Requests",
    value: "25",
    change: "+3",
    changePercent: "+13.6%",
    description: "from yesterday",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    trend: "up"
  },
  {
    title: "Completed Today",
    value: "18",
    change: "+8",
    changePercent: "+80%",
    description: "from yesterday",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    trend: "up"
  },
  {
    title: "Monthly Revenue",
    value: "₱15,450",
    change: "+2,100",
    changePercent: "+15.7%",
    description: "this month",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    trend: "up"
  },
]

const recentRequests = [
  {
    id: "REQ-2025-001",
    type: "Barangay Clearance",
    resident: "Maria Santos",
    status: "pending",
    date: "June 5, 2025",
    time: "2 hours ago",
    priority: "normal"
  },
  {
    id: "REQ-2025-002",
    type: "Business Permit",
    resident: "Juan Dela Cruz",
    status: "processing",
    date: "June 5, 2025",
    time: "4 hours ago",
    priority: "urgent"
  },
  {
    id: "REQ-2025-003",
    type: "Certificate of Indigency",
    resident: "Ana Reyes",
    status: "completed",
    date: "June 4, 2025",
    time: "1 day ago",
    priority: "normal"
  },
  {
    id: "REQ-2025-004",
    type: "Cedula",
    resident: "Pedro Garcia",
    status: "pending",
    date: "June 4, 2025",
    time: "1 day ago",
    priority: "normal"
  },
]

const quickActions = [
  {
    title: "Add New Resident",
    description: "Register a new resident",
    icon: Users,
    color: "bg-blue-500",
    href: "/admin/residents/new"
  },
  {
    title: "Process Request",
    description: "Review pending requests",
    icon: FileText,
    color: "bg-green-500",
    href: "/admin/requests"
  },
  {
    title: "Generate Report",
    description: "Create monthly reports",
    icon: Download,
    color: "bg-purple-500",
    href: "/admin/reports"
  },
  {
    title: "Schedule Event",
    description: "Add barangay event",
    icon: Calendar,
    color: "bg-orange-500",
    href: "/admin/events/new"
  },
]

const getStatusConfig = (status: string) => {
  const configs = {
    pending: {
      label: "Pending",
      color: "text-amber-700",
      bgColor: "bg-amber-100",
      dotColor: "bg-amber-500",
      icon: Clock,
    },
    processing: {
      label: "Processing",
      color: "text-blue-700",
      bgColor: "bg-blue-100",
      dotColor: "bg-blue-500",
      icon: Activity,
    },
    completed: {
      label: "Completed",
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      dotColor: "bg-emerald-500",
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
  return configs[status as keyof typeof configs]
}

const getPriorityConfig = (priority: string) => {
  const configs = {
    urgent: {
      label: "Urgent",
      color: "text-red-700",
      bgColor: "bg-red-100",
    },
    normal: {
      label: "Normal",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
  }
  return configs[priority as keyof typeof configs]
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening in Barangay Alma Villa.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.changePercent}
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                  <span className="text-xs text-emerald-600 font-medium">
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            </div>
          )
        })}
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
              <button className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {recentRequests.map((request) => {
                const statusConfig = getStatusConfig(request.status)
                const priorityConfig = getPriorityConfig(request.priority)
                
                return (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{request.type}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                        {request.priority === "urgent" && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityConfig.bgColor} ${priorityConfig.color}`}>
                            {priorityConfig.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{request.resident}</span>
                        <span>•</span>
                        <span>{request.id}</span>
                        <span>•</span>
                        <span>{request.time}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                      View
                    </button>
                  </div>
                )
              })}
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
                  <button
                    key={index}
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
                  </button>
                )
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm text-gray-900 font-medium">23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}