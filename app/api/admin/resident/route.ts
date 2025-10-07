import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import ResidentWelcomeEmail from '@/emails/resident-welcome-email'

export async function POST(req: Request) {
  const { lastName, email, firstName, ...rest } = await req.json()
  const hashedPassword = await hash(lastName, 12)

  const user = await prisma.user.create({
    data: {
      lastName: lastName,
      password: hashedPassword,
      email,
      firstName,
      ...rest
    },
  })

  try {
    if (email) {
      const gmailUser = process.env.GMAIL_USER
      const gmailPass = process.env.GMAIL_PASSWORD
      if (gmailUser && gmailPass) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass },
        })

        const emailHtml = await render(
          ResidentWelcomeEmail({ email, firstName })
        )

        await transporter.sendMail({
          from: gmailUser,
          to: email,
          subject: 'Welcome to Alma Villa — Your Login Instructions',
          html: emailHtml,
        })
      }
    }
  } catch (e) {
    // Do not block resident creation if email fails
    console.error('Failed sending welcome email:', e)
  }

  return NextResponse.json({ success: true, user })
}
