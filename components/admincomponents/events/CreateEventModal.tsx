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
  AlertTriangle, 
  Save, 
  X,
  Eye,
  EyeOff 
} from "lucide-react"

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
    content: "",
    category: "Event",
    categoryColor: "bg-green-100 text-green-800",
    date: "",
    time: "",
    location: "",
    priority: "normal",
    status: "draft"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && event) {
        setFormData(event)
      } else {
        // Reset to default values for create mode
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          category: "Event",
          categoryColor: "bg-green-100 text-green-800",
          date: "",
          time: "",
          location: "",
          priority: "normal",
          status: "draft"
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, event])

  const handleInputChange = (field: keyof Event, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Update category color when category changes
      if (field === "category") {
        const categoryOption = categoryOptions.find(opt => opt.value === value)
        if (categoryOption) {
          updated.categoryColor = categoryOption.color
        }
      }
      
      return updated
    })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.time.trim()) {
      newErrors.time = "Time is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!validateForm()) return

    setIsSaving(true)

    try {
      const eventToSave: Event = {
        ...formData,
        status,
        updatedAt: new Date().toISOString()
      }

      if (mode === "create") {
        eventToSave.id = Date.now() // Simple ID generation for demo
        eventToSave.createdAt = new Date().toISOString()
        eventToSave.views = 0
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      onSave(eventToSave)
      onClose()
    } catch (error) {
      console.error("Error saving event:", error)
      // Handle error (you could show a toast notification)
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#23479A]" />
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Create a new event or announcement for the homepage"
              : "Edit the event details and content"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title..."
              className={errors.title ? "border-red-300 focus:border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Category and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value as Event["priority"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="space-y-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Short Description *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange("excerpt", e.target.value)}
              placeholder="Brief description that appears on the homepage..."
              rows={3}
              className={errors.excerpt ? "border-red-300 focus:border-red-500" : ""}
            />
            {errors.excerpt && (
              <p className="text-sm text-red-600">{errors.excerpt}</p>
            )}
            <p className="text-xs text-gray-500">
              Keep it concise - this appears on the homepage cards
            </p>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Event Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`pl-10 ${errors.date ? "border-red-300 focus:border-red-500" : ""}`}
                />
              </div>
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Event Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder="e.g., 9:00 AM or All Day"
                  className={`pl-10 ${errors.time ? "border-red-300 focus:border-red-500" : ""}`}
                />
              </div>
              {errors.time && (
                <p className="text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Barangay Hall, Community Center, Online"
                className={`pl-10 ${errors.location ? "border-red-300 focus:border-red-500" : ""}`}
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Full Content (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="content">Full Content (Optional)</Label>
            <Textarea
              id="content"
              value={formData.content || ""}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Detailed information about the event (optional)..."
              rows={5}
            />
            <p className="text-xs text-gray-500">
              Additional details that can be shown in expanded view
            </p>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`${getCategoryColor(formData.category)} border-transparent text-xs`}>
                    {formData.category}
                  </Badge>
                  {formData.priority !== "normal" && (
                    <Badge variant="outline" className={`${
                      formData.priority === "urgent" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-blue-100 text-blue-800"
                    } border-transparent text-xs`}>
                      {formData.priority}
                    </Badge>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-2">
                {formData.title || "Event Title"}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {formData.excerpt || "Event description will appear here..."}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <span>📅 {formData.date || "Date"}</span>
                <span>🕒 {formData.time || "Time"}</span>
                <span>📍 {formData.location || "Location"}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="bg-[#23479A] hover:bg-[#23479A]/90"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Publish Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 