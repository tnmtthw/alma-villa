import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    console.log('Test Audit: Starting...');
    
    const session = await auth();
    console.log('Test Audit: Session:', session?.user?.id);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get client information
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);
    console.log('Test Audit: Client info:', { ipAddress, userAgent });

    // Test the audit logging
    console.log('Test Audit: Calling AuditLogger.logPDFDownload...');
    await AuditLogger.logPDFDownload(
      session.user.id,
      'test-document-id',
      'Test Document',
      'test-file.pdf',
      ipAddress,
      userAgent
    );
    console.log('Test Audit: Successfully logged');

    return NextResponse.json({ 
      success: true, 
      message: 'Test audit log created successfully',
      userId: session.user.id,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error('Test Audit: Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
