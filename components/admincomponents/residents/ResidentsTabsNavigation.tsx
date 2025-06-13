// app/components/admincomponents/residents/ResidentsTabsNavigation.tsx
"use client"

import { Badge } from "@/components/ui/badge"

interface TabsNavigationProps {
  activeTab: "residents" | "pending" | "rejected"
  onTabChange: (tab: "residents" | "pending" | "rejected") => void
  counts: {
    residents: number
    pending: number
    rejected: number
  }
}

export default function ResidentsTabsNavigation({
  activeTab,
  onTabChange,
  counts
}: TabsNavigationProps) {
  const tabs = [
    {
      id: "residents" as const,
      label: "Verified Residents",
      count: counts.residents,
      badgeColor: "bg-green-100 text-green-700"
    },
    {
      id: "pending" as const,
      label: "Pending Registration",
      count: counts.pending,
      badgeColor: "bg-yellow-100 text-yellow-700"
    },
    {
      id: "rejected" as const,
      label: "Rejected Residents",
      count: counts.rejected,
      badgeColor: "bg-red-100 text-red-700"
    }
  ]

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === tab.id
                ? "border-[#23479A] text-[#23479A]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <Badge 
                variant="outline" 
                className={`ml-2 text-xs font-medium ${tab.badgeColor} border-0`}
              >
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}