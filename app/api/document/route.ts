import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';

export async function POST(req: Request) {
  const body = await req.json()
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 })
  }

  // Whitelist allowed fields according to Prisma Document model
  const data = {
    userId,
    fullName: body.fullName ?? null,
    suffix: body.suffix ?? null,
    birthDate: body.birthDate ?? null,
    placeOfBirth: body.placeOfBirth ?? undefined,
    age: body.age ?? null,
    civilStatus: body.civilStatus ?? undefined,
    purok: body.purok ?? null,
    residencyLength: body.residencyLength ?? null,
    purpose: body.purpose ?? undefined,
    additionalInfo: body.additionalInfo ?? undefined,
    type: body.type ?? undefined,
    businessName: body.businessName ?? undefined,
    businessLocation: body.businessLocation ?? undefined,
    operatorName: body.operatorName ?? undefined,
    operatorAddress: body.operatorAddress ?? undefined,
    citizenship: body.citizenship ?? undefined,
    proofOfPayment: body.proofOfPayment ?? undefined,
    pickupOption: body.pickupOption ?? "online",
  }

  const document = await prisma.document.create({
    data,
  })

  // Log document submission
  if (userId && data.type) {
    await AuditLogger.logDocumentSubmission(
      userId,
      document.id,
      data.type as string,
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
          // Validate UUID format before querying Prisma to avoid P2023
          const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id)
          if (!isUuid) {
              return NextResponse.json({ success: false, error: 'Invalid document id format' }, { status: 400 })
          }
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

