export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    return NextResponse.json({
      session: session,
      user: session?.user,
      role: session?.user?.role,
      authenticated: !!session?.user
    })
  } catch (error) {
    console.error('Session debug error:', error)
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    )
  }
}
