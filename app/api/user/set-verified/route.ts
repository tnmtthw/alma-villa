import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

import { prisma } from '@/lib/prisma';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';
import AccountVerifiedEmail from "@/emails/resident-verified-email";

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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

    // Log user verification
    const adminUser = 'System Admin'; // You might want to get this from session
    await AuditLogger.logUserVerification(
        id,
        email,
        adminUser,
        getClientIP(request),
        getUserAgent(request)
    );

    return NextResponse.json({ message: 'User verified succesfully, email notification sent' }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}