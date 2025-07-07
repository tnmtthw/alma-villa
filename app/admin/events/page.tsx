"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import CreateEventModal from "@/components/admincomponents/events/CreateEventModal"
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin,
  Eye,
  Edit,
  Trash2,
  Settings,
  Users,
  AlertTriangle,
  Megaphone,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Event {
  id?: number
  title: string
  excerpt: string
  content?: string
  category: string
  categoryColor: string
  date: string
  time: string
  location: string
  priority: "normal" | "important" | "urgent"
  status: "published" | "draft" | "archived"
  views?: number
  createdAt?: string
  updatedAt?: string
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Community Clean-Up Drive This Weekend",
    excerpt: "Join us for a community-wide clean-up drive this Saturday, June 8th. Let's work together to keep our barangay clean and beautiful.",
    category: "Event",
    categoryColor: "bg-green-100 text-green-800",
    date: "2024-06-08",
    time: "8:00 AM",
    location: "Barangay Hall",
    priority: "normal",
    status: "published",
    views: 245,
    createdAt: "2024-06-05",
    updatedAt: "2024-06-05"
  },
  {
    id: 2,
    title: "New Health Services Available at Barangay Health Center",
    excerpt: "We're excited to announce expanded health services including free blood pressure monitoring, diabetes screening, and maternal care consultations.",
    category: "Health",
    categoryColor: "bg-blue-100 text-blue-800",
    date: "2024-06-03",
    time: "All Day",
    location: "Health Center",
    priority: "important",
    status: "published",
    views: 189,
    createdAt: "2024-06-03",
    updatedAt: "2024-06-03"
  },
  {
    id: 3,
    title: "Water Interruption Notice - June 10-11",
    excerpt: "Scheduled water maintenance will affect Areas 1-3. Please store water in advance. Emergency water supply will be available at the barangay hall.",
    category: "Notice",
    categoryColor: "bg-orange-100 text-orange-800",
    date: "2024-06-10",
    time: "6:00 AM - 6:00 PM",
    location: "Areas 1-3",
    priority: "urgent",
    status: "published",
    views: 356,
    createdAt: "2024-06-08",
    updatedAt: "2024-06-08"
  },
  {
    id: 4,
    title: "Senior Citizens Monthly Assembly",
    excerpt: "All senior citizens are invited to our monthly assembly featuring health talks, recreational activities, and distribution of benefits.",
    category: "Event",
    categoryColor: "bg-purple-100 text-purple-800",
    date: "2024-06-15",
    time: "2:00 PM",
    location: "Community Center",
    priority: "normal",
    status: "draft",
    views: 0,
    createdAt: "2024-06-12",
    updatedAt: "2024-06-12"
  },
  {
    id: 5,
    title: "New Online Document Request System Launch",
    excerpt: "Submit your document requests online! No more long queues. Access our new digital platform for faster, more convenient service.",
    category: "Announcement",
    categoryColor: "bg-indigo-100 text-indigo-800",
    date: "2024-06-01",
    time: "All Day",
    location: "Online",
    priority: "important",
    status: "published",
    views: 567,
    createdAt: "2024-06-01",
    updatedAt: "2024-06-01"
  }
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || event.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Published</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>
      case 'archived':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Archived</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleEditEvent = (eventId?: number) => {
    if (!eventId) return
    const eventToEdit = events.find(event => event.id === eventId)
    if (eventToEdit) {
      setEditingEvent(eventToEdit)
      setModalMode("edit")
      setIsCreateModalOpen(true)
    }
  }

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setModalMode("create")
    setIsCreateModalOpen(true)
  }

  const handleSaveEvent = (eventData: Event) => {
    if (modalMode === "create") {
      // Add new event
      setEvents(prev => [eventData, ...prev])
    } else {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === eventData.id ? eventData : event
      ))
    }
  }

  const handleDeleteEvent = (eventId?: number) => {
    if (!eventId) return
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(event => event.id !== eventId))
    }
  }

  const handleToggleStatus = (eventId?: number) => {
    if (!eventId) return
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: event.status === "published" ? "draft" : "published" }
        : event
    ))
  }

  const stats = {
    total: events.length,
    published: events.filter(e => e.status === "published").length,
    draft: events.filter(e => e.status === "draft").length,
    urgent: events.filter(e => e.priority === "urgent").length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events & Announcements</h1>
          <p className="text-gray-600 mt-1">Manage homepage announcements, events, and notices</p>
        </div>
        <Button 
          onClick={handleCreateEvent}
          className="bg-[#23479A] hover:bg-[#23479A]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events and announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                  <SelectItem value="Notice">Notice</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Program">Program</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Priority Icon */}
                  <div className="mt-1">
                    {getPriorityIcon(event.priority)}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                        {getStatusBadge(event.status)}
                        <Badge variant="outline" className={`${event.categoryColor} border-transparent`}>
                          {event.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">{event.excerpt}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {event.views || 0} views
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleStatus(event.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {event.status === "published" ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first event or announcement"
              }
            </p>
            {!searchTerm && statusFilter === "all" && categoryFilter === "all" && priorityFilter === "all" && (
              <Button 
                onClick={handleCreateEvent}
                className="bg-[#23479A] hover:bg-[#23479A]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Create/Edit Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingEvent(null)
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
        mode={modalMode}
      />
    </div>
  )
} 