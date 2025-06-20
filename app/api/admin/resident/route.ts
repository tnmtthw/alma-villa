import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { lastName, ...rest } = await req.json()
  const hashedPassword = await hash(lastName, 12)

  const user = await prisma.user.create({
    data: {
      lastName: lastName,
      password: hashedPassword,
      ...rest
    },
  })

  return NextResponse.json({ success: true, user })
}
