import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { password, ...rest } = await req.json()
  const hashedPassword = await hash(password, 12)

  const user = await prisma.user.create({
    data: {
      password: hashedPassword,
      ...rest
    },
  })

  return NextResponse.json(user)
}