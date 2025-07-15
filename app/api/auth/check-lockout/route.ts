import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check if account is currently locked
  const now = new Date();
  if (user.lockedUntil && user.lockedUntil > now) {
    const timeLeft = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 1000);
    return NextResponse.json({ 
      isLocked: true,
      timeLeft,
      error: 'Account temporarily locked due to too many failed attempts'
    }, { status: 423 });
  }

  // If lockout has expired, clear it from database
  if (user.lockedUntil && user.lockedUntil <= now) {
    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null
      }
    });
    
    return NextResponse.json({ 
      isLocked: false,
      attemptsLeft: 3,
      loginAttempts: 0
    }, { status: 200 });
  }

  // If not locked, return current attempt count
  const attemptsLeft = 3 - (user.loginAttempts || 0);
  return NextResponse.json({ 
    isLocked: false,
    attemptsLeft: Math.max(0, attemptsLeft),
    loginAttempts: user.loginAttempts || 0
  }, { status: 200 });
} 