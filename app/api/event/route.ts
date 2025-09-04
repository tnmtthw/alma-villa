import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { ...rest } = await req.json()

  const event = await prisma.event.create({
    data: {
      ...rest
    },
  })

  return NextResponse.json({ success: true, event })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
      if (id) {
          const event = await prisma.event.findUnique({
              where: { id },
          });

          if (!document) {
              return NextResponse.json({ message: 'Event request not found' }, { status: 404 });
          }

          return NextResponse.json({ success: true, document });
      }

      const events = await prisma.event.findMany({
          orderBy: {
              createdAt: 'desc',
          },
      });

      return NextResponse.json({ 
        success: true, 
        events,
        pagination: {
          total: events.length,
          limit: events.length,
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing event ID" },
        { status: 400 }
      )
    }

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete event" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || undefined;

  const body = await request.json();
  const { ...rest } = body;

  await prisma.event.update({
      where: { id },
      data: { ...rest },
  });

  return NextResponse.json(200);
}
