import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';

import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Login successful', id: user.id, email: user.email, role: user.role,}, { status: 200 });
}
