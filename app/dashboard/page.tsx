import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, History, MessageSquare, Bell, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const stats = [
  {
    title: "Pending Requests",
    value: "2",
    description: "Active requests awaiting approval",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Recent Forms",
    value: "5",
    description: "Forms submitted this month",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Request History",
    value: "12",
    description: "Total requests made",
    icon: History,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Notifications",
    value: "3",
    description: "Unread notifications",
    icon: Bell,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
]

const recentActivities = [
  {
    title: "Form Submission",
    description: "You submitted a maintenance request form",
    icon: FileText,
    time: "2 hours ago",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Announcement",
    description: "New community guidelines have been posted",
    icon: Bell,
    time: "1 day ago",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
]

export default function DashboardPage() {
  const userName = "Juan" // This should come from your auth state

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Background - Added pt-16 to account for navbar */}
      <div className="relative bg-[#23479A] pt-16">
        {/* Background Pattern */}
        <div 
          className="absolute inset-x-0 bottom-0"
          style={{
            backgroundImage: 'url(/assets/img/herosection.png)',
            backgroundSize: '',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'repeat-x',
            opacity: '0.15'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[420px] flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 relative z-10 py-8 sm:py-0">
          {/* Responsive repeated background silhouette */}
          <div
            className="absolute inset-x-0 bottom-0 w-full h-full pointer-events-none select-none"
            style={{
              backgroundImage: "url(/assets/img/herosection.png)",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "bottom",
              backgroundSize: "contain",
              opacity: 0.8,
              zIndex: 0,
            }}
          />
          <div className="text-center md:text-left w-full md:w-1/2 z-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Here's what's happening with your residence account.
            </p>
            <Link href="/dashboard/request">
              <Button 
                className="mt-8 bg-white text-[#23479A] hover:bg-white/90 flex items-center gap-2 mx-auto md:mx-0"
              >
                <Plus className="h-4 w-4" />
                Create New Request
              </Button>
            </Link>
          </div>
          <div className="relative w-full md:w-1/2 flex justify-center mt-8 md:mt-0 z-10">
            <Image
              src="/assets/img/dashboardhero.png"
              alt="Dashboard Hero"
              width={400}
              height={400}
              className="object-contain max-w-[220px] sm:max-w-[320px] md:max-w-[400px] w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Content - Added more padding bottom */}
      <div className="max-w-7xl mx-auto px-8 pt-8 pb-16">
        {/* Stats Grid */}
        <div className="relative z-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-sm text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity Section - Added margin bottom */}
        <div className="mb-12">
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions and updates</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-gray-500 hover:text-gray-900 border-0 bg-transparent">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                      <div className={`p-2 rounded-full ${activity.bgColor}`}>
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {activity.time}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}