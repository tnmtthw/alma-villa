import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    if (userId) {
      const documents = await prisma.document.findMany({
        where: { 
          userId: userId 
        },
        include: {
          user: {
            select: {
              email: true,
              mobileNumber: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
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
    }

    return NextResponse.json({ 
      success: false, 
      error: 'User ID is required' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error fetching user documents:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

