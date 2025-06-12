import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

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