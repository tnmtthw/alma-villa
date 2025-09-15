import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    
    // Get counts for different request statuses
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      processingRequests,
      paymentRequests,
      readyForClaimRequests,
      completedRequests
    ] = await Promise.all([
      // Total document requests (all time)
      prisma.document.count(),
      
      // Pending requests
      prisma.document.count({
        where: {
          status: 'pending'
        }
      }),
      
      // Approved requests (replacing "under_review")
      prisma.document.count({
        where: {
          status: 'approved'
        }
      }),
      
      // Processing requests
      prisma.document.count({
        where: {
          status: 'processing'
        }
      }),
      
      // Payment pending requests
      prisma.document.count({
        where: {
          status: 'payment_pending'
        }
      }),
      
      // Ready for claim requests
      prisma.document.count({
        where: {
          status: {
            in: ['ready_to_claim', 'ready_for_claim']
          }
        }
      }),
      
      // Completed requests
      prisma.document.count({
        where: {
          status: 'completed'
        }
      })
    ])


    // Calculate week-over-week changes
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const [
      totalLastWeek,
      pendingLastWeek,
      approvedLastWeek,
      processingLastWeek,
      paymentLastWeek,
      readyLastWeek,
      completedLastWeek
    ] = await Promise.all([
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
          status: 'approved',
          updatedAt: {
            lt: weekAgo
          }
        }
      }),
      
      prisma.document.count({
        where: {
          status: 'processing',
          updatedAt: {
            lt: weekAgo
          }
        }
      }),
      
      prisma.document.count({
        where: {
          status: 'payment_pending',
          updatedAt: {
            lt: weekAgo
          }
        }
      }),
      
      prisma.document.count({
        where: {
          status: {
            in: ['ready_to_claim', 'ready_for_claim']
          },
          updatedAt: {
            lt: weekAgo
          }
        }
      }),
      
      prisma.document.count({
        where: {
          status: 'completed',
          updatedAt: {
            lt: weekAgo
          }
        }
      })
    ])

    // Calculate changes
    const totalChange = totalRequests - totalLastWeek
    const pendingChange = pendingRequests - pendingLastWeek
    const approvedChange = approvedRequests - approvedLastWeek
    const processingChange = processingRequests - processingLastWeek
    const paymentChange = paymentRequests - paymentLastWeek
    const readyChange = readyForClaimRequests - readyLastWeek
    const completedChange = completedRequests - completedLastWeek

    // Calculate percentage changes
    const totalPercent = totalLastWeek > 0 ? ((totalChange / totalLastWeek) * 100).toFixed(1) : '0'
    const pendingPercent = pendingLastWeek > 0 ? ((pendingChange / pendingLastWeek) * 100).toFixed(1) : '0'
    const approvedPercent = approvedLastWeek > 0 ? ((approvedChange / approvedLastWeek) * 100).toFixed(1) : '0'
    const processingPercent = processingLastWeek > 0 ? ((processingChange / processingLastWeek) * 100).toFixed(1) : '0'
    const paymentPercent = paymentLastWeek > 0 ? ((paymentChange / paymentLastWeek) * 100).toFixed(1) : '0'
    const readyPercent = readyLastWeek > 0 ? ((readyChange / readyLastWeek) * 100).toFixed(1) : '0'
    const completedPercent = completedLastWeek > 0 ? ((completedChange / completedLastWeek) * 100).toFixed(1) : '0'

    const stats = {
      total: {
        count: totalRequests,
        change: totalChange,
        changePercent: totalPercent,
        trend: totalChange >= 0 ? "up" : "down"
      },
      pending: {
        count: pendingRequests,
        change: pendingChange,
        changePercent: pendingPercent,
        trend: pendingChange >= 0 ? "up" : "down"
      },
      approved: {
        count: approvedRequests,
        change: approvedChange,
        changePercent: approvedPercent,
        trend: approvedChange >= 0 ? "up" : "down"
      },
      processing: {
        count: processingRequests,
        change: processingChange,
        changePercent: processingPercent,
        trend: processingChange >= 0 ? "up" : "down"
      },
      payment: {
        count: paymentRequests,
        change: paymentChange,
        changePercent: paymentPercent,
        trend: paymentChange >= 0 ? "up" : "down"
      },
      readyForClaim: {
        count: readyForClaimRequests,
        change: readyChange,
        changePercent: readyPercent,
        trend: readyChange >= 0 ? "up" : "down"
      },
      completed: {
        count: completedRequests,
        change: completedChange,
        changePercent: completedPercent,
        trend: completedChange >= 0 ? "up" : "down"
      }
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Error fetching request stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch request statistics' },
      { status: 500 }
    )
  }
}
