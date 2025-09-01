"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Megaphone,
  Users,
  AlertTriangle,
  MapPin
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useScrollAnimation } from "@/lib/useScrollAnimation"

const NewsSection = () => {
  const { elementRef: sectionRef, isVisible: sectionVisible } = useScrollAnimation({ threshold: 0.1 });
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: featuredRef, isVisible: featuredVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: recentRef, isVisible: recentVisible } = useScrollAnimation({ threshold: 0.2 });

  const newsItems = [
    {
      id: 1,
      title: "Community Clean-Up Drive This Weekend",
      excerpt: "Join us for a community-wide clean-up drive this Saturday, June 8th. Let's work together to keep our barangay clean and beautiful.",
      category: "Event",
      categoryColor: "bg-green-100 text-green-800",
      date: "2024-06-05",
      time: "8:00 AM",
      image: "/announcements/CleanUpdrive.jpg",
      priority: "normal",
      location: "Barangay Hall"
    },
    {
      id: 2,
      title: "New Health Services Available at Barangay Health Center",
      excerpt: "We're excited to announce expanded health services including free blood pressure monitoring, diabetes screening, and maternal care consultations.",
      category: "Health",
      categoryColor: "bg-blue-100 text-blue-800",
      date: "2024-06-03",
      time: "All Day",
      image: "/announcements/Health.jpg",
      priority: "important",
      location: "Health Center"
    },
    {
      id: 3,
      title: "Water Interruption Notice - June 10-11",
      excerpt: "Scheduled water maintenance will affect Areas 1-3. Please store water in advance. Emergency water supply will be available at the barangay hall.",
      category: "Notice",
      categoryColor: "bg-orange-100 text-orange-800",
      date: "2024-06-10",
      time: "6:00 AM - 6:00 PM",
      image: "/announcements/WaterInterruption.jpg",
      priority: "urgent",
      location: "Areas 1-3"
    },
    {
      id: 4,
      title: "Senior Citizens Monthly Assembly",
      excerpt: "All senior citizens are invited to our monthly assembly featuring health talks, recreational activities, and distribution of benefits.",
      category: "Event",
      categoryColor: "bg-purple-100 text-purple-800",
      date: "2024-06-15",
      time: "2:00 PM",
      image: "/announcements/Health.jpg",
      priority: "normal",
      location: "Community Center"
    },
    {
      id: 5,
      title: "New Online Document Request System Launch",
      excerpt: "Submit your document requests online! No more long queues. Access our new digital platform for faster, more convenient service.",
      category: "Announcement",
      categoryColor: "bg-indigo-100 text-indigo-800",
      date: "2024-06-01",
      time: "All Day",
      image: "/announcements/CleanUpdrive.jpg",
      priority: "important",
      location: "Online"
    },
    {
      id: 6,
      title: "Youth Skills Development Program Registration",
      excerpt: "Calling all youth ages 15-25! Register now for our free skills development program covering computer literacy, entrepreneurship, and leadership.",
      category: "Program",
      categoryColor: "bg-cyan-100 text-cyan-800",
      date: "2024-06-20",
      time: "9:00 AM - 5:00 PM",
      image: "/announcements/Health.jpg",
      priority: "normal",
      location: "Youth Center"
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'important':
        return <Megaphone className="h-4 w-4 text-blue-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const featuredNews = newsItems.slice(0, 3)
  const recentNews = newsItems.slice(3, 6)

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-800 ease-out ${
            headerVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Latest News & Announcements
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest happenings, events, and important announcements 
            from Barangay Alma Villa
          </p>
        </div>

        {/* Featured News Grid */}
        <div 
          ref={featuredRef}
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 transition-all duration-1000 ease-out delay-300 ${
            featuredVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
        >
          {featuredNews.map((news, index) => (
            <div
              key={news.id}
              className={`transition-all duration-700 ease-out ${
                featuredVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <Card 
                className={`bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <div className="relative">
                  {/* Image */}
                  <div className={`relative ${index === 0 ? 'h-64' : 'h-48'} overflow-hidden rounded-t-lg`}>
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>

                  {/* Priority Badge */}
                  {news.priority !== 'normal' && (
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant="outline" 
                        className={`${
                          news.priority === 'urgent' 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        } font-medium`}
                      >
                        {news.priority === 'urgent' ? 'Urgent' : 'Important'}
                      </Badge>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className={`${news.categoryColor} border-transparent font-medium`}>
                      {news.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Date and Time */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(news.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {news.time}
                      </div>
                      {news.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {news.location}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold text-gray-900 group-hover:text-[#23479A] transition-colors ${
                      index === 0 ? 'text-xl' : 'text-lg'
                    }`}>
                      {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p className={`text-gray-600 leading-relaxed ${
                      index === 0 ? 'text-base' : 'text-sm'
                    }`}>
                      {news.excerpt}
                    </p>

                    {/* Read More Button */}
                    <Button 
                      variant="outline" 
                      className="group-hover:bg-[#23479A] group-hover:text-white group-hover:border-[#23479A] transition-colors"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Recent News List */}
        <div 
          ref={recentRef}
          className={`mb-8 transition-all duration-1000 ease-out delay-500 ${
            recentVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-8 opacity-0'
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Updates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNews.map((news, index) => (
              <div
                key={news.id}
                className={`transition-all duration-700 ease-out ${
                  recentVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className={`${news.categoryColor} border-transparent text-xs`}>
                          {news.category}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {formatDate(news.date)}
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#23479A] transition-colors line-clamp-2">
                        {news.title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {news.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {news.time}
                        </div>
                        {news.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {news.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* View All News Button */}
        <div 
          className={`text-center transition-all duration-800 ease-out delay-700 ${
            sectionVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
        >
          <Link href="/news">
            <Button 
              className="bg-[#23479A] hover:bg-[#23479A]/90 px-8 py-3 text-white"
            >
              View All News & Announcements
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Emergency Notice Bar */}
        <div 
          className={`mt-12 transition-all duration-800 ease-out delay-800 ${
            sectionVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-6 opacity-0'
          }`}
        >
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900">Emergency Hotlines</h4>
                  <p className="text-red-800 text-sm">
                    For emergencies, contact: Barangay Emergency Response - <strong>0917-123-4567</strong> | 
                    Police Station - <strong>117</strong> | Fire Department - <strong>116</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default NewsSection