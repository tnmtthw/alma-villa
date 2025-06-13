import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { email, role } = body;

    await prisma.user.update({
        where: { id },
        data: { email, role },
    });

    return NextResponse.json(200);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        if (id) {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            return NextResponse.json(user);
        }

        const users = await prisma.user.findMany({
            orderBy: {
                id: 'asc',
            },
            // select: {
            //  rest
            // },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json(200);
    }
}