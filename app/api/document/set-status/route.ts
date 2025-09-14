import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { ...rest } = body;

    await prisma.document.update({
        where: { id },
        data: { ...rest },
    });


    return NextResponse.json(200);
}