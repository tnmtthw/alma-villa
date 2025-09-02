"use client"
import React, { useMemo, useState } from "react"
import { Calendar, Clock, ArrowRight, Megaphone, AlertTriangle, MapPin } from 'lucide-react'

type NewsItem = {
  id: string
  title: string
  summary: string
  category: "Announcements" | "Health" | "Community" | "Events"
  date: string
  image: string
  href?: string
  time?: string
  location?: string
  priority?: "normal" | "important" | "urgent"
}

const seedNews: NewsItem[] = [
  {
    id: "1",
    title: "Barangay Clean-up Drive This Weekend",
    summary: "Join our community clean-up along key streets and waterways. Gloves and bags provided. Let's work together to keep our barangay clean and beautiful for everyone.",
    category: "Community",
    date: "2025-09-01",
    time: "8:00 AM",
    location: "Barangay Hall",
    image: "/announcements/CleanUpdrive.jpg",
    priority: "important"
  },
  {
    id: "2",
    title: "Scheduled Water Interruption Notice",
    summary: "Temporary water service interruption on Tuesday, 9 AM - 3 PM, for essential line maintenance and system upgrades. Please store water in advance.",
    category: "Announcements",
    date: "2025-08-30",
    time: "9:00 AM - 3:00 PM",
    location: "Areas 1-3",
    image: "/announcements/WaterInterruption.jpg",
    priority: "urgent"
  },
  {
    id: "3",
    title: "Free Health Advisory & Vaccination Drive",
    summary: "Community health program at the covered court. Please bring valid ID and barangay certificate. Medical consultation and free vaccines available for all ages.",
    category: "Health",
    date: "2025-08-28",
    time: "9:00 AM - 5:00 PM",
    location: "Covered Court",
    image: "/announcements/Health.jpg",
    priority: "important"
  },
]

const categories: Array<NewsItem["category"] | "All"> = ["All", "Announcements", "Health", "Community", "Events"]

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Announcements": return "bg-orange-100 text-orange-800"
    case "Health": return "bg-blue-100 text-blue-800"
    case "Community": return "bg-green-100 text-green-800"
    case "Events": return "bg-purple-100 text-purple-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return { text: 'Urgent', class: 'bg-red-100 text-red-800 border-red-200' }
    case 'important':
      return { text: 'Important', class: 'bg-blue-100 text-blue-800 border-blue-200' }
    default:
      return null
  }
}

export default function DashboardNewsPage() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("All")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return seedNews.filter((n) => {
      const inCategory = activeCategory === "All" || n.category === activeCategory
      const inText = !q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
      return inCategory && inText
    })
  }, [query, activeCategory])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="pb-10">
      {/* Hero Head */}
      <section className="relative bg-[#23479A]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/assets/img/herosection.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: '0.15'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Community News</h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mb-6 sm:mb-8">
            Stay updated with the latest happenings, events, and important announcements from Barangay Alma Villa
          </p>
          
          <div className="space-y-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm sm:text-base text-white placeholder-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/70 backdrop-blur-sm"
            />
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`${activeCategory === c ? "bg-white text-[#23479A]" : "bg-white/10 text-white hover:bg-white/20"} border border-white/20 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-sm transition-all duration-200 whitespace-nowrap`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 -mt-4 sm:-mt-8">
        {/* Featured News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className={`${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 overflow-hidden`}
            >
              {/* Image Section */}
              <div className={`relative ${index === 0 ? 'h-48 sm:h-64 lg:h-80' : 'h-40 sm:h-48'} overflow-hidden`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                
                {/* Priority Badge */}
                {item.priority && item.priority !== 'normal' && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(item.priority)?.class}`}>
                      {getPriorityBadge(item.priority)?.text}
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border-transparent ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">{formatDate(item.date)}</span>
                  </div>
                  {item.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">{item.time}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className={`font-bold text-gray-900 group-hover:text-[#23479A] transition-colors mb-2 sm:mb-3 leading-tight ${
                  index === 0 ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl'
                }`}>
                  {item.title}
                </h3>

                {/* Summary */}
                <p className={`text-gray-600 leading-relaxed mb-3 sm:mb-4 ${
                  index === 0 ? 'text-sm sm:text-base line-clamp-4 sm:line-clamp-none' : 'text-xs sm:text-sm line-clamp-3'
                }`}>
                  {item.summary}
                </p>

                {/* Read More Button */}
                <button className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-[#23479A] hover:text-white hover:border-[#23479A] transition-all duration-200">
                  Read More
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No news found</div>
            <p className="text-gray-500 text-sm">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Popular Articles Section */}
        <div className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">Popular Updates Today</h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {[
              'Barangay Hall hours extended for document processing',
              'New COVID-19 safety protocols implemented in public areas', 
              'Scholarship program applications now open for students',
              'Weekly market schedule adjusted for holiday season',
              'Basketball court renovation project starts next week',
            ].map((title, i) => (
              <div key={i} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#23479A] text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mb-8 sm:mb-12">
          <button className="inline-flex items-center px-6 sm:px-8 py-3 bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-lg font-medium transition-colors text-sm sm:text-base">
            View All News & Announcements
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-full bg-red-100 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-red-900 mb-1 text-sm sm:text-base">Emergency Hotlines</h4>
              <div className="text-red-800 text-xs sm:text-sm leading-relaxed">
                <p className="mb-1 sm:mb-0">For emergencies, contact:</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span>Barangay Emergency Response - <strong>0917-123-4567</strong></span>
                  <span className="hidden sm:inline">|</span>
                  <span>Police Station - <strong>117</strong></span>
                  <span className="hidden sm:inline">|</span>
                  <span>Fire Department - <strong>116</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}