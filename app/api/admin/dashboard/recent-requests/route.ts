import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Fetch recent document requests with user information
    const recentRequests = await prisma.document.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Format the data for the frontend
    const formattedRequests = recentRequests.map((request, index) => {
      const userName = request.user 
        ? `${request.user.firstName} ${request.user.lastName}`.trim()
        : 'Unknown User'

      // Generate request ID based on date and index
      const date = new Date(request.createdAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const requestId = `REQ-${year}-${month}${day}-${String(request.id).padStart(3, '0')}`

      // Calculate time ago
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      let timeAgo = ''
      if (diffDays > 0) {
        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      } else if (diffHours > 0) {
        timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        timeAgo = `${Math.max(1, diffMinutes)} minute${diffMinutes > 1 ? 's' : ''} ago`
      }

      // Format date
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      // Determine priority (for demo purposes, mark some as urgent)
      const priority = Math.random() > 0.8 ? 'urgent' : 'normal'

      return {
        id: requestId,
        documentId: request.id,
        type: request.type || 'Unknown Document',
        resident: userName,
        status: request.status || 'pending',
        date: formattedDate,
        time: timeAgo,
        priority: priority,
        createdAt: request.createdAt
      }
    })

    return NextResponse.json({ 
      success: true, 
      requests: formattedRequests,
      total: formattedRequests.length
    })
  } catch (error) {
    console.error('Error fetching recent requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recent requests' },
      { status: 500 }
    )
  }
}
