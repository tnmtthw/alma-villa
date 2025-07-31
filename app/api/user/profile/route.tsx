import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs'

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { password, ...rest } = body;
    const hashedPassword = await hash(password, 12)

    await prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword,
            ...rest
        },
    });

    return NextResponse.json(200);
}