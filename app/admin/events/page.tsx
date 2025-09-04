"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import CreateEventModal from "@/app/admin/events/CreateEventModal"
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
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
import useSWR, { mutate } from "swr"

interface Event {
  id?: string
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

const fetcher = (...args: [input: RequestInfo | URL, init?: RequestInit]) =>
  fetch(...args).then((res) => res.json())

export default function EventsPage() {
  const { data: eventData } = useSWR(`/api/event`, fetcher)
  const events: Event[] = eventData?.events || []

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter
    const matchesCategory =
      categoryFilter === "all" || event.category === categoryFilter
    const matchesPriority =
      priorityFilter === "all" || event.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "important":
        return <Megaphone className="h-4 w-4 text-blue-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Published
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Draft
          </Badge>
        )
      case "archived":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Archived
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleEditEvent = (eventId?: string) => {
    if (!eventId) return
    const eventToEdit = events.find((event) => event.id === eventId)
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
    // TODO: Call API to save event, then revalidate SWR
    console.log("Saving event:", eventData)
  }

  const handleDeleteEvent = async (eventId?: string) => {
    if (!eventId) return

    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`/api/event?id=${eventId}`, {
          method: "DELETE",
        })

        if (!res.ok) throw new Error("Failed to delete event")

        // Revalidate SWR cache so UI updates
        mutate("/api/event")
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Failed to delete event")
      }
    }
  }

  const handleToggleStatus = async (eventId?: string, currentStatus?: string) => {
    if (!eventId) return
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published"
      const res = await fetch(`/api/event?id=${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to toggle status")
      mutate("/api/event")
    } catch (error) {
      console.error("Error toggling status:", error)
      alert("Failed to toggle status")
    }
  }



  const stats = {
    total: events.length,
    published: events.filter((e) => e.status === "published").length,
    draft: events.filter((e) => e.status === "draft").length,
    urgent: events.filter((e) => e.priority === "urgent").length,
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Events & Announcements
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Manage homepage announcements, events, and notices
          </p>
        </div>
        <Button
          onClick={handleCreateEvent}
          className="bg-[#23479A] hover:bg-[#23479A]/90 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Published
                </p>
                <p className="text-lg md:text-2xl font-bold text-green-600">
                  {stats.published}
                </p>
              </div>
              <Eye className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Drafts
                </p>
                <p className="text-lg md:text-2xl font-bold text-gray-600">
                  {stats.draft}
                </p>
              </div>
              <Edit className="h-6 w-6 md:h-8 md:w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Urgent
                </p>
                <p className="text-lg md:text-2xl font-bold text-red-600">
                  {stats.urgent}
                </p>
              </div>
              <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events and announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
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
                <SelectTrigger className="w-full">
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

              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger className="w-full">
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
      <div className="space-y-3 md:space-y-4">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-3 md:gap-4 flex-1">
                  {/* Priority Icon */}
                  <div className="mt-1 flex-shrink-0">
                    {getPriorityIcon(event.priority)}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(event.status)}
                          <Badge
                            variant="outline"
                            className={`${event.categoryColor} border-transparent text-xs`}
                          >
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {event.excerpt}
                    </p>

                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{event.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end lg:justify-start">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(event.id, event.status)}>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all" ||
                priorityFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first event or announcement"}
            </p>
            {!searchTerm &&
              statusFilter === "all" &&
              categoryFilter === "all" &&
              priorityFilter === "all" && (
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
