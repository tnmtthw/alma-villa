import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching dashboard stats...')
    
    // Get counts for different statistics
    const [
      totalResidents,
      totalRequests,
      totalPending,
      totalCompleted
    ] = await Promise.all([
      // Total verified residents (using correct role value)
      prisma.user.count({
        where: {
          role: 'Verified'
        }
      }),
      
      // Total document requests (all time)
      prisma.document.count(),
      
      // Total pending document requests
      prisma.document.count({
        where: {
          status: 'pending'
        }
      }),
      
      // Total completed requests
      prisma.document.count({
        where: {
          status: {
            in: ['completed', 'ready_to_claim', 'ready_for_claim']
          }
        }
      })
    ])

    console.log('Raw counts:', { totalResidents, totalRequests, totalPending, totalCompleted })

    // Calculate week-over-week changes
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const [
      residentsLastWeek,
      requestsLastWeek,
      pendingLastWeek,
      completedLastWeek
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: 'Verified',
          createdAt: {
            lt: weekAgo
          }
        }
      }),
      
      prisma.document.count({
        where: {
          createdAt: {
            lt: weekAgo
          }
        }
      }),
      
      prisma.document.count({
        where: {
          status: 'pending',
          createdAt: {
            lt: weekAgo
          }
        }
      }),
      
      prisma.document.count({
        where: {
          status: {
            in: ['completed', 'ready_to_claim', 'ready_for_claim']
          },
          updatedAt: {
            lt: weekAgo
          }
        }
      })
    ])

    // Calculate changes
    const residentsChange = totalResidents - residentsLastWeek
    const requestsChange = totalRequests - requestsLastWeek
    const pendingChange = totalPending - pendingLastWeek
    const completedChange = totalCompleted - completedLastWeek

    // Calculate percentage changes
    const residentsPercent = residentsLastWeek > 0 ? ((residentsChange / residentsLastWeek) * 100).toFixed(1) : '0'
    const requestsPercent = requestsLastWeek > 0 ? ((requestsChange / requestsLastWeek) * 100).toFixed(1) : '0'
    const pendingPercent = pendingLastWeek > 0 ? ((pendingChange / pendingLastWeek) * 100).toFixed(1) : '0'
    const completedPercent = completedLastWeek > 0 ? ((completedChange / completedLastWeek) * 100).toFixed(1) : '0'

    const stats = [
      {
        title: "Total Residents",
        value: totalResidents.toString(),
        change: `+${residentsChange}`,
        changePercent: `+${residentsPercent}%`,
        description: "verified users",
        icon: "Users",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        trend: residentsChange >= 0 ? "up" : "down"
      },
      {
        title: "Total Requests",
        value: totalRequests.toString(),
        change: requestsChange >= 0 ? `+${requestsChange}` : requestsChange.toString(),
        changePercent: requestsChange >= 0 ? `+${requestsPercent}%` : `${requestsPercent}%`,
        description: "all time",
        icon: "FileText",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        trend: requestsChange >= 0 ? "up" : "down"
      },
      {
        title: "Total Pending",
        value: totalPending.toString(),
        change: pendingChange >= 0 ? `+${pendingChange}` : pendingChange.toString(),
        changePercent: pendingChange >= 0 ? `+${pendingPercent}%` : `${pendingPercent}%`,
        description: "awaiting review",
        icon: "Clock",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        trend: pendingChange >= 0 ? "up" : "down"
      },
      {
        title: "Total Completed",
        value: totalCompleted.toString(),
        change: completedChange >= 0 ? `+${completedChange}` : completedChange.toString(),
        changePercent: completedChange >= 0 ? `+${completedPercent}%` : `${completedPercent}%`,
        description: "processed successfully",
        icon: "CheckCircle",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        trend: completedChange >= 0 ? "up" : "down"
      }
    ]

    console.log('Final stats:', stats)
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
