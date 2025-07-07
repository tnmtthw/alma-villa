# Admin Requests Management System

## Overview
The Admin Requests Management system provides a comprehensive interface for administrators to manage all document requests submitted by residents through the online portal.

## Features

### 🏠 **Main Page**: `/app/admin/requests/page.tsx`
- Simple page component that renders the RequestsManagement component
- Follows the same pattern as other admin pages

### 🔧 **Core Component**: `/components/admincomponents/RequestsManagement.tsx`
Comprehensive requests management with the following features:

#### **Dashboard & Statistics**
- Real-time statistics cards showing:
  - Total requests
  - Pending reviews
  - Under review
  - Processing
  - Payment pending
  - Ready for claim
  - Completed
  - Rejected
  - Urgent requests

#### **Advanced Filtering & Search**
- Search by name, email, document type, or request ID
- Filter by status (pending, under review, processing, etc.)
- Filter by document type (Barangay Clearance, Certificate of Residency, etc.)
- Filter by priority (urgent vs normal)
- Sort by date (newest/oldest first)

#### **Request Management Table**
- Comprehensive view of all document requests
- Shows user information, document details, current status
- Color-coded status badges with icons
- Urgent request indicators

#### **Detailed Request Actions**
1. **View Details Modal**
   - Complete request information
   - User details and contact information
   - Form data submitted by user
   - Uploaded attachments
   - Payment information (if applicable)
   - Admin notes and history

2. **Status Update Modal**
   - Change request status
   - Add admin notes
   - Provide rejection reasons
   - Track status change history

3. **Payment Review Modal**
   - Review payment proofs uploaded by users
   - Verify payment references
   - Approve or reject payments
   - Handle payment verification workflow

## Document Request Workflow

### Status Flow:
1. **Pending** → User submits request
2. **Under Review** → Admin reviews request details
3. **Payment Pending** → If payment required, user submits payment
4. **Processing** → Document is being prepared
5. **Ready for Claim** → Document ready for pickup/download
6. **Completed** → Document claimed by user
7. **Rejected** → Request denied with reason

### Payment Handling:
- Users can upload payment proofs (GCash, Bank Transfer screenshots)
- Admins can review and verify payments
- Payment reference tracking
- Approval/rejection workflow

## Data Structure

### DocumentRequest Interface:
```typescript
interface DocumentRequest {
  id: string                    // Unique request ID
  userId: string               // User who made the request
  userFullName: string         // User's full name
  userEmail: string            // User's email
  userPhone: string            // User's phone
  documentType: string         // Type of document requested
  purpose: string              // Purpose of the request
  status: string               // Current status
  requestDate: string          // When request was made
  estimatedCompletion: string  // Expected completion date
  lastUpdated: string          // Last status update
  fee: string                  // Document fee
  paymentReference?: string    // Payment reference number
  paymentProof?: string        // Payment proof file
  rejectionReason?: string     // Reason if rejected
  adminNotes?: string          // Internal admin notes
  urgentRequest: boolean       // Priority flag
  formData: any               // Form data submitted
  attachments: string[]        // Uploaded files
}
```

## Mock Data
Currently uses mock data for demonstration. In production, this should be connected to:
- Database API for fetching requests
- File storage for attachments and payment proofs
- Email notification system
- PDF generation service

## Navigation Integration
- Already integrated in admin navigation (`components/admincomponents/AdminNav.tsx`)
- Shows badge with pending request count
- Accessible via sidebar menu

## Future Enhancements
1. **Real-time Updates**: WebSocket integration for live status updates
2. **Email Notifications**: Automated emails for status changes
3. **PDF Generation**: Automatic document generation
4. **Advanced Analytics**: Request volume, completion rates, etc.
5. **Bulk Operations**: Mass approve/reject multiple requests
6. **Template Management**: Customizable document templates
7. **API Integration**: Connect to actual database and file storage

## Usage
1. Navigate to `/admin/requests` from the admin panel
2. Use filters and search to find specific requests
3. Click on any request to view details or update status
4. Review payments when users submit payment proofs
5. Track request progress through the workflow

The system provides a complete solution for managing the document request workflow from submission to completion, with comprehensive tracking and management capabilities. 