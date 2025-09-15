import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get detailed counts for debugging
    const [
      allUsers,
      usersByRole,
      allDocuments,
      documentsByStatus
    ] = await Promise.all([
      // All users count
      prisma.user.count(),
      
      // Users grouped by role
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      }),
      
      // All documents count
      prisma.document.count(),
      
      // Documents grouped by status
      prisma.document.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      })
    ])

    return NextResponse.json({ 
      success: true, 
      debug: {
        allUsers,
        usersByRole,
        allDocuments,
        documentsByStatus
      }
    })
  } catch (error) {
    console.error('Error fetching debug data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch debug data' },
      { status: 500 }
    )
  }
}
