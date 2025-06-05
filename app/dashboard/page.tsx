
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, History, MessageSquare, Bell, Plus, ChevronRight, TrendingUp, Clock, CheckCircle, ArrowUpRight, Activity, Calendar, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DocumentStatusTracker from "@/components/DocumentStatusTracker"

const stats = [
  {
    title: "Pending Requests",
    value: "2",
    change: "+1 from last week",
    description: "Active requests awaiting approval",
    icon: MessageSquare,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    trend: "up"
  },
  {
    title: "Completed Forms",
    value: "5",
    change: "+2 this month",
    description: "Successfully processed",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    trend: "up"
  },
  {
    title: "Total Requests",
    value: "12",
    change: "All time",
    description: "Historical submissions",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    trend: "neutral"
  },
  {
    title: "New Updates",
    value: "3",
    change: "This week",
    description: "Notifications & announcements",
    icon: Bell,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    trend: "up"
  },
]

const recentActivities = [
  {
    title: "Barangay Clearance",
    description: "Application approved and ready for pickup",
    icon: CheckCircle,
    time: "2 hours ago",
    status: "completed",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    statusColor: "bg-emerald-100 text-emerald-800"
  },
  {
    title: "Business Permit",
    description: "Under review by barangay office",
    icon: Clock,
    time: "1 day ago",
    status: "pending",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    statusColor: "bg-amber-100 text-amber-800"
  },
  {
    title: "Community Notice",
    description: "New sanitation guidelines posted",
    icon: Bell,
    time: "2 days ago",
    status: "info",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    statusColor: "bg-blue-100 text-blue-800"
  },
]

const quickActions = [
  {
    title: "Request Document",
    description: "Barangay clearance, certificates",
    icon: FileText,
    href: "dashboard/request",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    textColor: "text-white"
  },
  {
    title: "Download Forms",
    description: "Printable application forms",
    icon: FileText,
    href: "/forms",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    textColor: "text-white"
  },
  {
    title: "View History",
    description: "Track your submissions",
    icon: History,
    href: "/history",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    textColor: "text-white"
  },
  {
    title: "Community News",
    description: "Latest announcements",
    icon: Bell,
    href: "/news",
    color: "bg-gradient-to-br from-amber-500 to-amber-600",
    textColor: "text-white"
  },
]

const upcomingEvents = [
  {
    title: "Barangay Assembly",
    date: "Jun 15, 2025",
    time: "9:00 AM",
    location: "Community Center",
    type: "Meeting"
  },
  {
    title: "Clean-up Drive",
    date: "Jun 20, 2025",
    time: "6:00 AM",
    location: "Main Street",
    type: "Community"
  },
  {
    title: "Health Program",
    date: "Jun 25, 2025",
    time: "8:00 AM",
    location: "Barangay Hall",
    type: "Health"
  },
]

export default function DashboardPage() {
  const userName = "Juan" // This should come from your auth state

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background - Mobile Optimized */}
      <div className="relative bg-[#23479A] pt-16">
        {/* Background Pattern */}
        <div 
          className="absolute inset-x-0 bottom-0 hidden sm:block"
          style={{
            backgroundImage: 'url(/assets/img/herosection.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'repeat-x',
            opacity: '0.15'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px] sm:h-[420px] flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 relative z-10 py-8">
          {/* Mobile-optimized repeated background silhouette */}
          <div
            className="absolute inset-x-0 bottom-0 w-full h-full pointer-events-none select-none hidden sm:block"
            style={{
              backgroundImage: "url(/assets/img/herosection.png)",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "bottom",
              backgroundSize: "contain",
              opacity: 0.8,
              zIndex: 0,
            }}
          />
          <div className="text-center md:text-left w-full md:w-1/2 z-10 px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-white/80 text-sm sm:text-base lg:text-lg mb-6 sm:mb-0">
              Here's what's happening with your residence account.
            </p>
            <Link href="/dashboard/request">
              <Button 
                className="mt-4 sm:mt-8 bg-white text-[#23479A] hover:bg-white/90 flex items-center gap-2 mx-auto md:mx-0 w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4" />
                Create New Request
              </Button>
            </Link>
          </div>
          <div className="relative w-full md:w-1/2 flex justify-center z-10">
            <img
              src="/assets/img/dashboardhero.png"
              alt="Dashboard Hero"
              width={400}
              height={400}
              className="object-contain max-w-[180px] sm:max-w-[220px] md:max-w-[320px] lg:max-w-[400px] w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-8 sm:pb-16 -mt-16 sm:-mt-20 relative z-20">
        {/* Enhanced Stats Grid with Mobile-First Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className={`bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${stat.borderColor} border-l-4`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</span>
                      {stat.trend === "up" && (
                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} ring-2 ring-white shadow-sm flex-shrink-0`}>
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6 px-4 sm:px-6">
                  <p className="text-xs text-gray-500 mb-1">{stat.change}</p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Document Status Tracker - NEW COMPONENT */}
        <div className="mb-6 sm:mb-8">
          <DocumentStatusTracker />
        </div>

        {/* Mobile-Optimized Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Recent Activity - Mobile Stack */}
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-[#23479A]" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600">Your latest interactions and updates</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="text-gray-500 hover:text-[#23479A] border-gray-200 hover:border-[#23479A]/20 hover:bg-[#23479A]/5 w-full sm:w-auto">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="group flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200 hover:shadow-md border border-gray-100">
                      <div className={`p-2 sm:p-3 rounded-xl ${activity.bgColor} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
                          <Badge variant="secondary" className={`text-xs ${activity.statusColor} border-0 w-fit`}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-tight">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1 sm:hidden">{activity.time}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Mobile Stack */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#23479A]" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 rounded-lg border border-gray-100 hover:border-[#23479A]/20 hover:bg-[#23479A]/5 transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 flex-1">{event.title}</h4>
                      <Badge variant="outline" className="text-xs w-fit">{event.type}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        {event.date} at {event.time}
                      </p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mobile-Optimized Quick Stats Card */}
            <Card className="bg-gradient-to-br from-[#23479A] to-[#23479A]/80 text-white border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4 sm:space-y-4 sm:block">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm opacity-90">Community</p>
                      <p className="text-lg sm:text-2xl font-bold">1,247</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm opacity-90">Rating</p>
                      <p className="text-lg sm:text-2xl font-bold">4.8/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile-Optimized Quick Actions Grid */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm sm:text-base text-gray-600">Access frequently used services</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <Card className="group bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className={`inline-flex p-3 sm:p-4 rounded-2xl ${action.color} mb-3 sm:mb-4 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.textColor}`} />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#23479A] transition-colors leading-tight">
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile-Optimized Bottom CTA Section */}
        <Card className="bg-gradient-to-r from-[#23479A] via-[#23479A] to-[#23479A]/90 text-white border-0 shadow-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center justify-between gap-4 sm:gap-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Need Help with Something?</h3>
                <p className="text-blue-100 text-base sm:text-lg">Our team is here to assist you with any questions or concerns.</p>
              </div>
              <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3 sm:gap-3">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="bg-white text-[#23479A] hover:bg-gray-100 font-semibold px-6 sm:px-8 w-full sm:w-auto"
                >
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10 font-semibold px-6 sm:px-8 w-full sm:w-auto"
                >
                  View Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}