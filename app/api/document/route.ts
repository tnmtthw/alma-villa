import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';

export async function POST(req: Request) {
  const { userId, type, ...rest } = await req.json()

  const document = await prisma.document.create({
    data: {
      ...rest
    },
  })

  // Log document submission
  if (userId && type) {
    await AuditLogger.logDocumentSubmission(
      userId,
      document.id,
      type,
      getClientIP(req),
      getUserAgent(req)
    );
  }

  return NextResponse.json({ success: true, document })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
      if (id) {
          const document = await prisma.document.findUnique({
              where: { id },
              include: {
                  user: {
                      select: {
                          email: true,
                          mobileNumber: true,
                          firstName: true,
                          lastName: true
                      }
                  }
              }
          });

          if (!document) {
              return NextResponse.json({ message: 'Document request not found' }, { status: 404 });
          }

          return NextResponse.json({ success: true, document });
      }

      const documents = await prisma.document.findMany({
          orderBy: {
              createdAt: 'desc',
          },
          include: {
              user: {
                  select: {
                      email: true,
                      mobileNumber: true,
                  }
              }
          }
      });

      return NextResponse.json({ 
        success: true, 
        documents,
        pagination: {
          total: documents.length,
          limit: documents.length,
          offset: 0,
          hasMore: false
        }
      });
  } catch (error) {
      console.error(error);
      return NextResponse.json({ 
        success: false, 
        error: 'Internal server error' 
      }, { status: 500 });
  }
}

