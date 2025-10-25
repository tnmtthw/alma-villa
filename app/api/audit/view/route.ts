import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent audit logs
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: 'PDF_DOWNLOAD'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log('Found audit logs:', auditLogs.length);

    return NextResponse.json({ 
      success: true, 
      count: auditLogs.length,
      logs: auditLogs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
