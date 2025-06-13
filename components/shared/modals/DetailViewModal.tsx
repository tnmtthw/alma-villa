// components/shared/modals/DetailViewModal.tsx
"use client"

import { useState } from 'react'
import { BaseModal } from './BaseModal'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Briefcase,
  Clock,
  Shield,
  FileText,
  AlertCircle,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Archive,
  Trash2
} from 'lucide-react'

interface DetailSection {
  title: string
  icon?: React.ReactNode
  fields: DetailField[]
}

interface DetailField {
  label: string
  value: any
  type?: 'text' | 'badge' | 'date' | 'email' | 'phone' | 'address' | 'avatar' | 'status' | 'document' | 'image'
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
  onClick?: () => void
}

interface DetailViewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  data: any
  sections: DetailSection[]
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive' | 'outline' | 'secondary'
    icon?: React.ReactNode
  }>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showAvatar?: boolean
  avatarSrc?: string
  avatarFallback?: string
  headerBadge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

export function DetailViewModal({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  sections,
  actions,
  size = 'lg',
  showAvatar = false,
  avatarSrc,
  avatarFallback,
  headerBadge
}: DetailViewModalProps) {
  
  const renderFieldValue = (field: DetailField) => {
    const { value, type = 'text', badgeVariant = 'default', onClick } = field

    if (!value && value !== 0 && value !== false) {
      return <span className="text-gray-400 italic">Not provided</span>
    }

    switch (type) {
      case 'badge':
        return (
          <Badge variant={badgeVariant} className="capitalize">
            {value}
          </Badge>
        )
      
      case 'date':
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      
      case 'email':
        return (
          <a 
            href={`mailto:${value}`} 
            className="text-[#23479A] hover:underline flex items-center gap-1"
          >
            <Mail className="h-3 w-3" />
            {value}
          </a>
        )
      
      case 'phone':
        return (
          <a 
            href={`tel:${value}`} 
            className="text-[#23479A] hover:underline flex items-center gap-1"
          >
            <Phone className="h-3 w-3" />
            {value}
          </a>
        )
      
      case 'address':
        return (
          <div className="flex items-start gap-1">
            <MapPin className="h-3 w-3 mt-1 flex-shrink-0 text-gray-400" />
            <span>{value}</span>
          </div>
        )
      
      case 'avatar':
        return (
          <Avatar className="h-12 w-12">
            <AvatarImage src={value} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )
      
      case 'status':
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200'
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
            case 'suspended': return 'bg-red-100 text-red-800 border-red-200'
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
            case 'approved': return 'bg-green-100 text-green-800 border-green-200'
            case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
          }
        }
        return (
          <Badge className={`${getStatusColor(value)} capitalize`}>
            {value.replace('_', ' ')}
          </Badge>
        )
      
      case 'document':
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(value.url, '_blank')}
              className="h-8"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <div className="flex flex-col">
              <div className="text-xs text-gray-500">
                Status: <span className={`font-medium ${value.status === 'approved' ? 'text-green-600' : value.status === 'rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                  {value.status}
                </span>
              </div>
              {value.notes && (
                <div className="text-xs text-red-600 mt-1">{value.notes}</div>
              )}
            </div>
          </div>
        )
      
      case 'image':
        return (
          <div className="flex items-center gap-2">
            <img 
              src={value} 
              alt="Document" 
              className="h-16 w-16 object-cover rounded border"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(value, '_blank')}
              className="h-8"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Full
            </Button>
          </div>
        )
      
      default:
        if (onClick) {
          return (
            <button 
              onClick={onClick}
              className="text-[#23479A] hover:underline text-left"
            >
              {value}
            </button>
          )
        }
        return <span>{value}</span>
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size={size}
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Custom Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showAvatar && (
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback className="text-lg bg-[#23479A] text-white">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {headerBadge && (
              <Badge variant={headerBadge.variant} className="capitalize">
                {headerBadge.text}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </div>

        <Separator />

        {/* Sections */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center gap-2 mb-4">
                {section.icon && (
                  <div className="text-[#23479A]">
                    {section.icon}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className={`space-y-1 ${field.className || ''}`}>
                    <dt className="text-sm font-medium text-gray-500">
                      {field.label}
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {renderFieldValue(field)}
                    </dd>
                  </div>
                ))}
              </div>
              
              {sectionIndex < sections.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4">
              {/* Secondary Actions (left side) */}
              <div className="flex flex-wrap gap-2">
                {actions.filter(action => action.variant === 'outline' || action.variant === 'secondary').map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    onClick={action.onClick}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      action.variant === 'secondary' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
              
              {/* Primary Actions (right side) */}
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {actions.filter(action => action.variant === 'destructive').map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.onClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
                {actions.filter(action => !action.variant || action.variant === 'default').map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.onClick}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-[#23479A] text-white hover:bg-[#1e3a82] transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  )
}

// Rejection Reason Modal Component
interface RejectionReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  applicantName: string
}

export function RejectionReasonModal({
  isOpen,
  onClose,
  onConfirm,
  applicantName
}: RejectionReasonModalProps) {
  const [reason, setReason] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const predefinedReasons = [
    'Incomplete documentation',
    'Invalid or expired ID',
    'Poor image quality - documents not readable',
    'Information mismatch between documents',
    'Insufficient proof of residency',
    'Failed identity verification',
    'Application contains false information',
    'Missing required documents',
    'Other (specify below)'
  ]

  const handleSubmit = () => {
    const finalReason = selectedReason === 'Other (specify below)' ? reason : selectedReason
    if (finalReason.trim()) {
      onConfirm(finalReason.trim())
      setReason('')
      setSelectedReason('')
    }
  }

  const handleClose = () => {
    setReason('')
    setSelectedReason('')
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Application"
      size="md"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">
              You are about to reject the application for {applicantName}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Please provide a clear reason that will be communicated to the applicant.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select reason for rejection:
            </label>
            <div className="space-y-2">
              {predefinedReasons.map((predefinedReason) => (
                <label key={predefinedReason} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rejectionReason"
                    value={predefinedReason}
                    checked={selectedReason === predefinedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-0.5 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{predefinedReason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other (specify below)' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specify reason:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
          )}

          {selectedReason && selectedReason !== 'Other (specify below)' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional notes (optional):
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add any additional details or instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject Application
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}

// Specific modal for Pending Registration Review
interface PendingRegistrationReviewProps {
  isOpen: boolean
  onClose: () => void
  resident: any // Replace with your PendingResident type
  onApprove: (resident: any) => void
  onReject: (resident: any, reason: string) => void
}

export function PendingRegistrationReviewModal({
  isOpen,
  onClose,
  resident,
  onApprove,
  onReject
}: PendingRegistrationReviewProps) {
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)

  if (!resident) return null

  const handleReject = () => {
    setIsRejectionModalOpen(true)
  }

  const handleConfirmReject = (reason: string) => {
    onReject(resident, reason)
    setIsRejectionModalOpen(false)
  }

  const sections: DetailSection[] = [
    {
      title: "Personal Information",
      icon: <User className="h-5 w-5" />,
      fields: [
        { label: "Full Name", value: `${resident.firstName} ${resident.middleName} ${resident.lastName} ${resident.suffix}`.trim() },
        { label: "Date of Birth", value: resident.birthDate, type: 'date' },
        { label: "Age", value: `${resident.age} years old` },
        { label: "Gender", value: resident.gender, type: 'badge' },
        { label: "Civil Status", value: resident.civilStatus, type: 'badge' },
        { label: "Nationality", value: resident.nationality },
        { label: "Religion", value: resident.religion },
      ]
    },
    {
      title: "Contact Information",
      icon: <Phone className="h-5 w-5" />,
      fields: [
        { label: "Email Address", value: resident.email, type: 'email' },
        { label: "Mobile Number", value: resident.mobileNumber, type: 'phone' },
        { label: "Emergency Contact", value: resident.emergencyContact },
        { label: "Emergency Number", value: resident.emergencyNumber, type: 'phone' },
      ]
    },
    {
      title: "Address Information",
      icon: <MapPin className="h-5 w-5" />,
      fields: [
        { 
          label: "Complete Address", 
          value: `${resident.houseNumber} ${resident.street}, ${resident.purok}, ${resident.barangay}, ${resident.city}, ${resident.province} ${resident.zipCode}`,
          type: 'address',
          className: 'md:col-span-2'
        },
        { label: "Length of Residency", value: `${resident.residencyLength} years` },
      ]
    },
    {
      title: "Documents Submitted",
      icon: <FileText className="h-5 w-5" />,
      fields: [
        { label: "ID Type", value: resident.type },
        { label: "Front ID", value: resident.documents?.frontId || { url: resident.frontId, status: 'submitted' }, type: 'document' },
        { label: "Back ID", value: resident.documents?.backId || { url: resident.backId, status: 'submitted' }, type: 'document' },
        { label: "Captured Photo", value: resident.documents?.capturedPhoto || { url: resident.capturedPhoto, status: 'submitted' }, type: 'document' },
      ]
    },
    {
      title: "Application Details",
      icon: <Clock className="h-5 w-5" />,
      fields: [
        { label: "Application ID", value: `REG-${resident.id.slice(0, 8)}` },
        { label: "Date Submitted", value: resident.dateSubmitted, type: 'date' },
        { label: "Current Status", value: resident.status, type: 'status' },
        { label: "Review Notes", value: resident.reviewNotes || 'No notes yet' },
      ]
    }
  ]

  const actions = [
    {
      label: "Reject Application",
      onClick: handleReject,
      variant: 'destructive' as const,
      icon: <XCircle className="h-4 w-4" />
    },
    {
      label: "Approve Application",
      onClick: () => onApprove(resident),
      variant: 'default' as const,
      icon: <CheckCircle className="h-4 w-4" />
    }
  ]

  return (
    <>
      <DetailViewModal
        isOpen={isOpen}
        onClose={onClose}
        title={`${resident.firstName} ${resident.lastName}`}
        subtitle="Registration Application Review"
        data={resident}
        sections={sections}
        actions={actions}
        size="xl"
        showAvatar={true}
        avatarSrc={resident.capturedPhoto}
        avatarFallback={`${resident.firstName[0]}${resident.lastName[0]}`}
        headerBadge={{
          text: resident.status === 'pending' ? 'Pending Review' : 'Under Review',
          variant: 'outline'
        }}
      />
      
      <RejectionReasonModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={handleConfirmReject}
        applicantName={`${resident.firstName} ${resident.lastName}`}
      />
    </>
  )
}

// Verified Resident View Modal
interface ResidentViewModalProps {
  isOpen: boolean
  onClose: () => void
  resident: any // Replace with your Resident type
  onEdit?: (resident: any) => void
  onArchive?: (resident: any) => void
  onDelete?: (resident: any) => void
  onUpdateRole?: (resident: any, newRole: string) => void
}

export function ResidentViewModal({
  isOpen,
  onClose,
  resident,
  onEdit,
  onArchive,
  onDelete,
  onUpdateRole
}: ResidentViewModalProps) {
  if (!resident) return null

  const sections: DetailSection[] = [
    {
      title: "Personal Information",
      icon: <User className="h-5 w-5" />,
      fields: [
        { label: "Full Name", value: `${resident.firstName} ${resident.middleName} ${resident.lastName} ${resident.suffix}`.trim() },
        { label: "Date of Birth", value: resident.birthDate, type: 'date' },
        { label: "Age", value: `${resident.age} years old` },
        { label: "Gender", value: resident.gender, type: 'badge' },
        { label: "Civil Status", value: resident.civilStatus, type: 'badge' },
        { label: "Nationality", value: resident.nationality },
        { label: "Religion", value: resident.religion },
      ]
    },
    {
      title: "Contact Information",
      icon: <Phone className="h-5 w-5" />,
      fields: [
        { label: "Email Address", value: resident.email, type: 'email' },
        { label: "Mobile Number", value: resident.mobileNumber, type: 'phone' },
        { label: "Emergency Contact", value: resident.emergencyContact },
        { label: "Emergency Number", value: resident.emergencyNumber, type: 'phone' },
      ]
    },
    {
      title: "Address Information",
      icon: <MapPin className="h-5 w-5" />,
      fields: [
        { 
          label: "Complete Address", 
          value: `${resident.houseNumber} ${resident.street}, ${resident.purok}, ${resident.barangay}, ${resident.city}, ${resident.province} ${resident.zipCode}`,
          type: 'address',
          className: 'md:col-span-2'
        },
        { label: "Length of Residency", value: `${resident.residencyLength} years` },
      ]
    },
    {
      title: "Account Information",
      icon: <Shield className="h-5 w-5" />,
      fields: [
        { label: "Resident ID", value: resident.id },
        { label: "Role", value: resident.role, type: 'badge', badgeVariant: resident.role === 'Admin' ? 'destructive' : 'default' },
        { label: "Account Status", value: "Active", type: 'status' },
        { label: "Date Registered", value: resident.createdAt, type: 'date' },
      ]
    },
    {
      title: "Verification Documents",
      icon: <FileText className="h-5 w-5" />,
      fields: [
        { label: "ID Type", value: resident.type },
        { label: "Front ID", value: { url: resident.frontId, status: 'verified' }, type: 'document' },
        { label: "Back ID", value: { url: resident.backId, status: 'verified' }, type: 'document' },
        { label: "Profile Photo", value: resident.capturedPhoto, type: 'image' },
      ]
    }
  ]

  const actions = []
  
  // Secondary actions (left side)
  if (onEdit) {
    actions.push({
      label: "Edit Information",
      onClick: () => onEdit(resident),
      variant: 'outline' as const,
      icon: <User className="h-4 w-4" />
    })
  }

  if (onUpdateRole) {
    const newRole = resident.role === 'Admin' ? 'Resident' : 'Admin'
    actions.push({
      label: `Make ${newRole}`,
      onClick: () => onUpdateRole(resident, newRole),
      variant: 'secondary' as const,
      icon: <Shield className="h-4 w-4" />
    })
  }

  // Destructive actions (right side, but styled as outline)
  if (onArchive) {
    actions.push({
      label: "Archive Account",
      onClick: () => {
        if (confirm(`Are you sure you want to archive ${resident.firstName} ${resident.lastName}? This account will be moved to archived residents.`)) {
          onArchive(resident)
        }
      },
      variant: 'destructive' as const,
      icon: <Archive className="h-4 w-4" />
    })
  }

  if (onDelete) {
    actions.push({
      label: "Delete Account",
      onClick: () => {
        if (confirm(`Are you sure you want to permanently delete ${resident.firstName} ${resident.lastName}? This action cannot be undone.`)) {
          onDelete(resident)
        }
      },
      variant: 'destructive' as const,
      icon: <Trash2 className="h-4 w-4" />
    })
  }

  const getStatusBadge = () => {
    if (resident.role === 'Admin') {
      return { text: 'Administrator', variant: 'destructive' as const }
    }
    return { text: 'Verified Resident', variant: 'default' as const }
  }

  return (
    <DetailViewModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${resident.firstName} ${resident.lastName}`}
      subtitle={`Resident since ${new Date(resident.createdAt).toLocaleDateString()}`}
      data={resident}
      sections={sections}
      actions={actions}
      size="xl"
      showAvatar={true}
      avatarSrc={resident.capturedPhoto}
      avatarFallback={`${resident.firstName[0]}${resident.lastName[0]}`}
      headerBadge={getStatusBadge()}
    />
  )
}