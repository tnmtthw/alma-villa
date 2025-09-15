import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    
    // Fetch pending requests count
    const pendingRequests = await prisma.document.count({
      where: {
        status: 'pending'
      }
    })

    // Fetch upcoming events count (events that are scheduled for today or future)
    const today = new Date()
    const todayString = today.toISOString().split('T')[0] // Format as YYYY-MM-DD
    
    const upcomingEvents = await prisma.event.count({
      where: {
        date: {
          gte: todayString
        }
      }
    })

    const counts = {
      pendingRequests,
      upcomingEvents
    }

    
    return NextResponse.json({ 
      success: true, 
      counts 
    })
  } catch (error) {
    console.error('Error fetching navigation counts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch navigation counts',
        counts: {
          pendingRequests: 0,
          upcomingEvents: 0
        }
      },
      { status: 500 }
    )
  }
}
