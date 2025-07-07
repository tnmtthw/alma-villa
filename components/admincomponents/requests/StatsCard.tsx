import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 