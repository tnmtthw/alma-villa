import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
      if (id) {
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

