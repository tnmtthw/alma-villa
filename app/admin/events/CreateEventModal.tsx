"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  Save,
  Eye,
  Image as ImageIcon
} from "lucide-react"

interface Event {
  id?: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  date: string
  time: string
  location: string
  priority: "normal" | "important" | "urgent"
  status: "published" | "draft" | "archived"
  image?: string
  createdAt?: string
  updatedAt?: string
}

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  event?: Event | null
  mode: "create" | "edit"
}

const categoryOptions = [
  { value: "Event", label: "Event", color: "bg-green-100 text-green-800" },
  { value: "Announcement", label: "Announcement", color: "bg-indigo-100 text-indigo-800" },
  { value: "Notice", label: "Notice", color: "bg-orange-100 text-orange-800" },
  { value: "Health", label: "Health", color: "bg-blue-100 text-blue-800" },
  { value: "Program", label: "Program", color: "bg-cyan-100 text-cyan-800" },
  { value: "Emergency", label: "Emergency", color: "bg-red-100 text-red-800" },
]

const priorityOptions = [
  { value: "normal", label: "Normal", description: "Standard priority" },
  { value: "important", label: "Important", description: "Higher visibility" },
  { value: "urgent", label: "Urgent", description: "Immediate attention required" },
]

export default function CreateEventModal({
  isOpen,
  onClose,
  onSave,
  event,
  mode
}: CreateEventModalProps) {
  const [formData, setFormData] = useState<Event>({
    title: "",
    excerpt: "",
    category: "Event",
    categoryColor: "bg-green-100 text-green-800",
    date: "",
    time: "",
    location: "",
    priority: "normal",
    status: "draft",
    image: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && event) {
        setFormData(event)
        setPreviewImage(event.image || null)
      } else {
        setFormData({
          title: "",
          excerpt: "",
          category: "Event",
          categoryColor: "bg-green-100 text-green-800",
          date: "",
          time: "",
          location: "",
          priority: "normal",
          status: "draft",
          image: ""
        })
        setPreviewImage(null)
      }
      setErrors({})
    }
  }, [isOpen, mode, event])

  const handleInputChange = (field: keyof Event, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      if (field === "category") {
        const categoryOption = categoryOptions.find(opt => opt.value === value)
        if (categoryOption) {
          updated.categoryColor = categoryOption.color
        }
      }
      return updated
    })
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      // Define filename separately
      const filename = `AlmaVilla/events/${file.name}`

      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to upload image")
      const data = await res.json()

      setFormData(prev => ({ ...prev, image: data.url }))
      setPreviewImage(data.url)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.time.trim()) newErrors.time = "Time is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!validateForm()) return
    setIsSaving(true)
    try {
      const eventToSave: Event = { ...formData, status }
      let savedEvent: Event

      if (mode === "create") {
        const res = await fetch("/api/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventToSave),
        })
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Failed to create event: ${errorText}`)
        }
        const response = await res.json()
        savedEvent = response.event
      } else {
        const res = await fetch(`/api/event?id=${event?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventToSave),
        })
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Failed to update event: ${errorText}`)
        }
        const response = await res.json()
        savedEvent = response.event
      }
      onSave(savedEvent)
      onClose()
    } catch (error) {
      console.error("Error saving event:", error)
      alert(`Error saving event: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const categoryOption = categoryOptions.find(opt => opt.value === category)
    return categoryOption?.color || "bg-gray-100 text-gray-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <Calendar className="h-6 w-6 text-[#23479A]" />
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {mode === "create"
              ? "Create a new event or announcement for the homepage"
              : "Edit the event details and content"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title..."
              className={`text-sm h-11 ${errors.title ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-[#23479A]"}`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Event Image */}
          <div className="space-y-3">
            <Label htmlFor="image" className="text-sm font-medium text-gray-700">Event Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
              className="text-sm h-11 border-gray-300 focus:border-[#23479A]"
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
            {previewImage && (
              <div className="mt-3">
                <img src={previewImage} alt="Preview" className="h-32 w-full rounded-lg object-cover border border-gray-200" />
              </div>
            )}
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="text-sm h-11 border-gray-300 focus:border-[#23479A]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${option.color} border-transparent text-xs`}>
                          {option.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value as Event["priority"])}
              >
                <SelectTrigger className="text-sm h-11 border-gray-300 focus:border-[#23479A]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-3">
            <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">Short Description *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              placeholder="Brief description that appears on the homepage..."
              rows={4}
              className={`text-sm resize-none ${errors.excerpt ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-[#23479A]"}`}
            />
            {errors.excerpt && (
              <p className="text-xs text-red-600 mt-1">{errors.excerpt}</p>
            )}
            <p className="text-xs text-gray-500">
              Keep it concise - this appears on the homepage cards
            </p>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">Event Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`pl-10 text-sm h-11 ${errors.date ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-[#23479A]"}`}
                />
              </div>
              {errors.date && (
                <p className="text-xs text-red-600 mt-1">{errors.date}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">Event Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder="e.g., 9:00 AM or All Day"
                  className={`pl-10 text-sm h-11 ${errors.time ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-[#23479A]"}`}
                />
              </div>
              {errors.time && (
                <p className="text-xs text-red-600 mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Barangay Hall, Community Center, Online"
                className={`pl-10 text-sm h-11 ${errors.location ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-[#23479A]"}`}
              />
            </div>
            {errors.location && (
              <p className="text-xs text-red-600 mt-1">{errors.location}</p>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Preview</Label>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`${getCategoryColor(formData.category)} border-transparent text-xs px-2 py-1`}>
                    {formData.category}
                  </Badge>
                  {formData.priority !== "normal" && (
                    <Badge variant="outline" className={`${formData.priority === "urgent"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                      } border-transparent text-xs px-2 py-1`}>
                      {formData.priority}
                    </Badge>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-3">
                {formData.title || "Event Title"}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {formData.excerpt || "Event description will appear here..."}
              </p>
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formData.date || "Date"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formData.time || "Time"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {formData.location || "Location"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className="w-full sm:w-auto h-11">
            Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={isSaving} className="w-full sm:w-auto h-11">
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSave("published")} disabled={isSaving} className="bg-[#23479A] hover:bg-[#23479A]/90 w-full sm:w-auto h-11">
            {isSaving ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
