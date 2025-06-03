"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, History, MessageSquare, Bell } from "lucide-react"

const stats = [
  {
    title: "Pending Requests",
    value: "2",
    description: "Active requests awaiting approval",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    title: "Recent Forms",
    value: "5",
    description: "Forms submitted this month",
    icon: FileText,
    color: "text-green-600",
  },
  {
    title: "Request History",
    value: "12",
    description: "Total requests made",
    icon: History,
    color: "text-purple-600",
  },
  {
    title: "Notifications",
    value: "3",
    description: "Unread notifications",
    icon: Bell,
    color: "text-yellow-600",
  },
]

export default function DashboardPage() {
  const userName = "Juan" // This should come from your auth state

  return (
    <>
      {/* Hero Section with Background */}
      <section className="relative bg-[#23479A] pb-28">
        {/* Background Pattern */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[250px]"
          style={{
            backgroundImage: 'url(/assets/img/herosection.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'repeat-x',
            opacity: '0.15'
          }}
        />
        
        {/* Welcome Content */}
        <div className="max-w-7xl mx-auto px-8 pt-8">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-white/80">
              Here's what's happening with your residence account.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid - Positioned to overlap the hero section */}
      <section className="relative -mt-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="bg-white hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50/100">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Form Submission</p>
                  <p className="text-xs text-muted-foreground">
                    You submitted a maintenance request form
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50/100">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Announcement</p>
                  <p className="text-xs text-muted-foreground">
                    New community guidelines have been posted
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
} 