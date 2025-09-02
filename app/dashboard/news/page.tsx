"use client"
import React, { useMemo, useState } from "react"

type NewsItem = {
  id: string
  title: string
  summary: string
  category: "Announcements" | "Health" | "Community" | "Events"
  date: string
  image: string
  href?: string
}

const seedNews: NewsItem[] = [
  {
    id: "1",
    title: "Barangay Clean-up Drive This Weekend",
    summary: "Join our community clean-up along key streets and waterways. Gloves and bags provided. Let's work together to keep our barangay clean and beautiful.",
    category: "Community",
    date: "2025-09-01",
    image: "/announcements/CleanUpdrive.jpg",
  },
  {
    id: "2",
    title: "Scheduled Water Interruption Notice",
    summary: "Temporary water service interruption on Tuesday, 9 AM - 3 PM, for essential line maintenance and system upgrades.",
    category: "Announcements",
    date: "2025-08-30",
    image: "/announcements/WaterInterruption.jpg",
  },
  {
    id: "3",
    title: "Free Health Advisory & Vaccination Drive",
    summary: "Community health program at the covered court. Please bring valid ID and barangay certificate. Medical consultation available.",
    category: "Health",
    date: "2025-08-28",
    image: "/announcements/Health.jpg",
  },
]

const categories: Array<NewsItem["category"] | "All"> = ["All", "Announcements", "Health", "Community", "Events"]

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
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Community News</h1>
          <p className="text-white/80 mt-1 text-sm md:text-base">Latest announcements and updates for Barangay Alma Villa.</p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/70"
            />
            <div className="md:col-span-2 flex flex-wrap items-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`${activeCategory === c ? "bg-white text-[#23479A]" : "bg-white/10 text-white"} border border-white/20 rounded-md px-3 py-1.5 text-xs md:text-sm shadow-sm hover:shadow transition`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-4">
        {/* TNW Style Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
          {/* Left Side - Main Feature Article */}
          <div className="relative overflow-hidden rounded-lg bg-gray-900 text-white">
            <img 
              src={filtered[0]?.image || "/announcements/CleanUpdrive.jpg"} 
              alt={filtered[0]?.title || "Main news"} 
              className="absolute inset-0 w-full h-full object-cover opacity-90" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute left-0 right-0 bottom-0 p-6">
              <span className="inline-flex items-center rounded bg-[#23479A] px-3 py-1 text-xs font-medium text-white shadow">
                {filtered[0]?.category || "Community"}
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight">
                {filtered[0]?.title || "Barangay Clean-up Drive This Weekend"}
              </h2>
              <p className="mt-2 text-sm text-white/90 line-clamp-3">
                {filtered[0]?.summary || "Join our community clean-up along key streets and waterways."}
              </p>
            </div>
          </div>

          {/* Right Side - Grid of smaller articles */}
          <div className="grid grid-rows-2 gap-4">
            {/* Top Row - Two small articles */}
            <div className="grid grid-cols-2 gap-4">
              {/* Second Article */}
              <div className="relative overflow-hidden rounded-lg bg-gray-900 text-white">
                <img 
                  src={filtered[1]?.image || "/announcements/WaterInterruption.jpg"} 
                  alt={filtered[1]?.title || "Water interruption"} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute left-0 right-0 bottom-0 p-4">
                  <span className="inline-flex items-center rounded bg-yellow-600 px-2 py-0.5 text-xs font-medium text-white shadow">
                    {filtered[1]?.category || "Announcements"}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold leading-tight line-clamp-2">
                    {filtered[1]?.title || "Scheduled Water Interruption Notice"}
                  </h3>
                </div>
              </div>

              {/* Third Article */}
              <div className="relative overflow-hidden rounded-lg bg-gray-900 text-white">
                <img 
                  src={filtered[2]?.image || "/announcements/Health.jpg"} 
                  alt={filtered[2]?.title || "Health advisory"} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute left-0 right-0 bottom-0 p-4">
                  <span className="inline-flex items-center rounded bg-green-600 px-2 py-0.5 text-xs font-medium text-white shadow">
                    {filtered[2]?.category || "Health"}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold leading-tight line-clamp-2">
                    {filtered[2]?.title || "Free Health Advisory & Vaccination Drive"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Bottom Row - Wide article with call-to-action */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#23479A] to-blue-700 text-white">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative flex items-center justify-center h-full p-6 text-center">
                <div>
                  <h3 className="text-lg font-bold mb-2">Join Our Community Programs</h3>
                  <p className="text-sm text-white/90 mb-4">
                    Stay updated with barangay activities and be part of our growing community
                  </p>
                  <button className="bg-white text-[#23479A] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition">
                    View All Programs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center text-gray-500 text-sm">No news found. Try a different search or category.</div>
        )}

        {/* Popular Articles - Barangay Updates */}
        <div className="mt-12">
          <h3 className="text-xs tracking-widest text-gray-500 text-center uppercase mb-6">Popular Updates Today</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              'Barangay Hall hours extended for document processing',
              'New COVID-19 safety protocols implemented in public areas', 
              'Scholarship program applications now open for students',
              'Weekly market schedule adjusted for holiday season',
              'Basketball court renovation project starts next week',
            ].map((title, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition">
                <span className="flex-shrink-0 w-6 h-6 bg-[#23479A] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-snug">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}