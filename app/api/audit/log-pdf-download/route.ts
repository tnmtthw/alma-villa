import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, documentType, fileName } = await request.json();

    if (!documentId || !documentType || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get client information
    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    // Log the PDF download
    await AuditLogger.logPDFDownload(
      session.user.id,
      documentId,
      documentType,
      fileName,
      ipAddress,
      userAgent
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging PDF download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
