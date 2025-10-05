import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';

import AccountRejectedEmail from "@/emails/resident-rejected-email";

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || undefined;

    const body = await request.json();
    const { role } = body;

    // Get user data first to access email and current role
    const user = await prisma.user.findUnique({
        where: { id },
        select: { email: true, role: true }
    });

    if (!user || !user.email || !id) {
        return NextResponse.json({ error: 'User not found or email missing' }, { status: 404 });
    }

    const oldRole = user.role;
    const adminUser = 'System Admin'; // You might want to get this from session

    // Update user role
    await prisma.user.update({
        where: { id },
        data: { role },
    });

    // Log role change
    await AuditLogger.logRoleChange(
        id,
        oldRole,
        role,
        adminUser,
        getClientIP(request),
        getUserAgent(request)
    );

    // Send rejection email if role is "Reject"
    if (role === "Rejected") {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        const emailHtml = await render(
            AccountRejectedEmail({ email: user.email })
        );

        const mailOptions = {
            from: process.env.GMAIL_USER!,
            to: user.email,
            subject: 'Account Application Rejected – Alma Villa Barangay Portal',
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true });
}
