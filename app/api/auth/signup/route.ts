import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

import { prisma } from '@/lib/prisma';
import SignupConfirmationEmail from "@/emails/signup-confirmation-email";

export async function POST(req: Request) {
  try {
    const { password, email, ...rest } = await req.json()
    const hashedPassword = await hash(password, 12)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const emailHtml = await render(
      SignupConfirmationEmail({ email })
    );

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Account Has Been Created – Awaiting Admin Approval',
      html: emailHtml,
    };


    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        ...rest
      },
    })

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'User created succesfully, email notification sent', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}