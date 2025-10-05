import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const totalCount = await prisma.auditLog.count()
    const recentLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json({
      totalCount,
      recentLogs,
      hasLogs: totalCount > 0
    })
  } catch (error) {
    console.error('Debug audit count error:', error)
    return NextResponse.json(
      { error: 'Failed to get audit count' },
      { status: 500 }
    )
  }
}
