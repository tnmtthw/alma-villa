import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

import { prisma } from '@/lib/prisma';
import AccountVerifiedEmail from "@/emails/resident-verified-email";

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { role, email } = body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
  
      const emailHtml = await render(
        AccountVerifiedEmail({ email })
      );
  
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your Alma Villa Account is Verified – You Can Now Log In',
        html: emailHtml,
      };

    await prisma.user.update({
        where: { id },
        data: { role },
    });

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'User verified succesfully, email notification sent' }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}