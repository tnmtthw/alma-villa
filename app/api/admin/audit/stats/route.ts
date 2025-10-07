export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Build date filter
    let dateFilter = {}
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }
    }

    // Get total counts
    const [
      totalLogs,
      todayLogs,
      weekLogs,
      monthLogs,
      actionStats,
      userStats,
    ] = await Promise.all([
      // Total logs
      prisma.auditLog.count({
        where: dateFilter,
      }),
      // Today's logs
      prisma.auditLog.count({
        where: {
          ...dateFilter,
          createdAt: { gte: today },
        },
      }),
      // This week's logs
      prisma.auditLog.count({
        where: {
          ...dateFilter,
          createdAt: { gte: weekAgo },
        },
      }),
      // This month's logs
      prisma.auditLog.count({
        where: {
          ...dateFilter,
          createdAt: { gte: monthAgo },
        },
      }),
      // Action statistics
      prisma.auditLog.groupBy({
        by: ['action'],
        where: dateFilter,
        _count: {
          action: true,
        },
        orderBy: {
          _count: {
            action: 'desc',
          },
        },
      }),
      // User activity statistics
      prisma.auditLog.groupBy({
        by: ['userId'],
        where: {
          ...dateFilter,
          userId: { not: null },
        },
        _count: {
          userId: true,
        },
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 10,
      }),
    ])

    // Get user details for top users
    const userIds = userStats.map(stat => stat.userId).filter((id): id is string => id !== null)
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    const userActivityStats = userStats.map(stat => {
      const user = users.find(u => u.id === stat.userId)
      return {
        userId: stat.userId,
        count: stat._count.userId,
        user: user || null,
      }
    })

    return NextResponse.json({
      success: true,
      stats: {
        total: totalLogs,
        today: todayLogs,
        thisWeek: weekLogs,
        thisMonth: monthLogs,
        actionBreakdown: actionStats.map(stat => ({
          action: stat.action,
          count: stat._count.action,
        })),
        topUsers: userActivityStats,
      },
    })
  } catch (error) {
    console.error('Error fetching audit log statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit log statistics' },
      { status: 500 }
    )
  }
}
