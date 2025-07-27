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

    return NextResponse.json({ message: 'User created successfully, email notification sent', userId: user.id }, { status: 201 });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle Prisma unique constraint errors specifically
    if (error.code === 'P2002') {
      // Check if the error is related to email field
      if (error.meta?.target?.includes('email')) {
        return NextResponse.json(
          { 
            error: 'Email already exists',
            message: 'This email address is already registered. Please use a different email or try logging in.',
            code: 'EMAIL_EXISTS'
          },
          { status: 409 } // 409 Conflict status code
        );
      }
      
      // Handle other unique constraint violations
      return NextResponse.json(
        { 
          error: 'Duplicate data',
          message: 'Some information you provided already exists in our system.',
          code: 'DUPLICATE_DATA'
        },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.code === 'P2000') {
      return NextResponse.json(
        { 
          error: 'Invalid data',
          message: 'Please check your information and try again.',
          code: 'INVALID_DATA'
        },
        { status: 400 }
      );
    }

    // Handle email sending errors
    if (error.message && (error.message.includes('SMTP') || error.message.includes('nodemailer'))) {
      return NextResponse.json(
        { 
          error: 'Email sending failed',
          message: 'Account was created but we could not send the confirmation email. Please contact support.',
          code: 'EMAIL_SEND_FAILED'
        },
        { status: 207 } // 207 Multi-Status (partial success)
      );
    }
    
    // Generic server error
    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: 'Something went wrong. Please try again later.',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}