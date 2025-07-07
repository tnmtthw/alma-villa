# Events Management System

## Overview
This admin events management system allows administrators to create, edit, and manage announcements and events that appear on the homepage.

## Components

### 1. Events Page (`/admin/events`)
- **Location**: `app/admin/events/page.tsx`
- **Purpose**: Main management interface for all events and announcements
- **Features**:
  - View all events with filtering and search
  - Create new events/announcements
  - Edit existing events
  - Publish/unpublish events
  - Delete events
  - Statistics dashboard

### 2. Create Event Modal
- **Location**: `components/admincomponents/events/CreateEventModal.tsx`
- **Purpose**: Modal form for creating and editing events
- **Features**:
  - Form validation
  - Live preview
  - Category and priority selection
  - Draft/publish options

## Event Data Structure

```typescript
interface Event {
  id: number
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
  views: number
  createdAt: string
  updatedAt: string
}
```

## Categories
- **Event**: Community events, meetings, assemblies
- **Announcement**: General announcements, news
- **Notice**: Important notices, warnings
- **Health**: Health-related announcements
- **Program**: Government programs, services
- **Emergency**: Urgent announcements

## Priority Levels
- **Normal**: Standard priority
- **Important**: Higher visibility, highlighted
- **Urgent**: Immediate attention, prominent display

## Connecting to Homepage

### Current Setup
The homepage currently uses hardcoded data in `components/NewsSection.tsx`. 

### To Make Dynamic (Future Enhancement)
1. Create an API endpoint for events:
   ```typescript
   // app/api/events/route.ts
   export async function GET() {
     // Return published events from database
   }
   ```

2. Update NewsSection to fetch from API:
   ```typescript
   // In components/NewsSection.tsx
   const { data: newsItems } = useSWR('/api/events?status=published', fetcher)
   ```

3. Create database schema:
   ```sql
   CREATE TABLE events (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     excerpt TEXT NOT NULL,
     content TEXT,
     category VARCHAR(50) NOT NULL,
     priority VARCHAR(20) DEFAULT 'normal',
     status VARCHAR(20) DEFAULT 'draft',
     date DATE NOT NULL,
     time VARCHAR(50) NOT NULL,
     location VARCHAR(255) NOT NULL,
     views INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

## Usage Instructions

### For Administrators
1. **Access**: Navigate to `/admin/events` in the admin panel
2. **Create Event**: Click "Create Event" button
3. **Fill Form**: Enter event details, set category and priority
4. **Preview**: Check the preview section to see how it appears
5. **Save**: Choose "Save as Draft" or "Publish Now"
6. **Edit**: Click the dropdown menu on any event and select "Edit"
7. **Manage**: Use filters to find specific events by status, category, or priority

### Event Workflow
1. **Draft**: Create and save as draft for review
2. **Published**: Make visible on homepage
3. **Archived**: Remove from homepage but keep for records

## Future Enhancements
- [ ] Connect to database/API
- [ ] Image upload for events
- [ ] Email notifications for new events
- [ ] Event calendar view
- [ ] Bulk operations
- [ ] Event templates
- [ ] RSVP/attendance tracking
- [ ] Social media integration 