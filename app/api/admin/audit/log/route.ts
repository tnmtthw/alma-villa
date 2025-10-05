import { NextResponse } from 'next/server'
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit'

export async function POST(req: Request) {
  try {
    const { action, details, userId } = await req.json()

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 })
    }

    await AuditLogger.log({
      userId,
      action,
      details,
      ipAddress: getClientIP(req),
      userAgent: getUserAgent(req),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging audit event:', error)
    return NextResponse.json(
      { error: 'Failed to log audit event' },
      { status: 500 }
    )
  }
}
