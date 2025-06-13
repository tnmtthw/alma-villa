// app/components/admincomponents/residents/ResidentsStats.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, TrendingUp, User2, Shield } from "lucide-react"
import { ResidentStats } from "./types"

interface ResidentsStatsProps {
  stats: ResidentStats
}

export default function ResidentsStats({ stats }: ResidentsStatsProps) {
  const statCards = [
    {
      title: "Total Residents",
      value: stats.total,
      icon: Users,
      gradient: "from-[#23479A] to-[#1e3a8a]",
      iconColor: "text-blue-200",
      textColor: "text-blue-100"
    },
    {
      title: "Active",
      value: stats.active,
      icon: UserCheck,
      gradient: "from-emerald-500 to-emerald-600",
      iconColor: "text-emerald-200",
      textColor: "text-emerald-100"
    },
    {
      title: "Inactive",
      value: stats.inactive,
      icon: UserX,
      gradient: "from-orange-500 to-orange-600",
      iconColor: "text-orange-200",
      textColor: "text-orange-100"
    },
    {
      title: "New This Month",
      value: stats.newThisMonth,
      icon: TrendingUp,
      gradient: "from-purple-500 to-purple-600",
      iconColor: "text-purple-200",
      textColor: "text-purple-100"
    },
    {
      title: "Male",
      value: stats.maleCount,
      icon: User2,
      gradient: "from-blue-500 to-blue-600",
      iconColor: "text-blue-200",
      textColor: "text-blue-100"
    },
    {
      title: "Female",
      value: stats.femaleCount,
      icon: User2,
      gradient: "from-pink-500 to-pink-600",
      iconColor: "text-pink-200",
      textColor: "text-pink-100"
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card 
            key={stat.title}
            className={`bg-gradient-to-br ${stat.gradient} text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-200`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className={`${stat.textColor} text-sm font-medium`}>
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-white/10">
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}