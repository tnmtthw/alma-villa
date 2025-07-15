import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Check if account is currently locked
  const now = new Date();
  if (user.lockedUntil && user.lockedUntil > now) {
    const timeLeft = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 1000);
    return NextResponse.json({ 
      error: 'Account temporarily locked due to too many failed attempts', 
      timeLeft,
      isLocked: true 
    }, { status: 423 });
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    // Increment failed login attempts
    const newAttempts = (user.loginAttempts || 0) + 1;
    const updateData: any = {
      loginAttempts: newAttempts,
      lastFailedLogin: now,
    };

    // Lock account for 1 minute after 3 failed attempts
    if (newAttempts >= 3) {
      updateData.lockedUntil = new Date(now.getTime() + 60 * 1000); // 1 minute from now
    }

    await prisma.user.update({
      where: { email },
      data: updateData,
    });

    if (newAttempts >= 3) {
      return NextResponse.json({ 
        error: 'Too many failed attempts. Account locked for 1 minute.', 
        timeLeft: 60,
        isLocked: true 
      }, { status: 423 });
    }

    return NextResponse.json({ 
      error: 'Invalid email or password',
      attemptsLeft: 3 - newAttempts 
    }, { status: 401 });
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: 0,
        lastFailedLogin: null,
        lockedUntil: null,
      },
    });
  }

  return NextResponse.json({ message: 'Login successful', id: user.id, email: user.email, role: user.role,}, { status: 200 });
}
