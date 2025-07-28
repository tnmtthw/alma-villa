import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LOGIN_SECURITY, loginSecurityUtils } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

    const now = new Date();
    
    // Check if account is currently locked
    if (user.lockedUntil && user.lockedUntil > now) {
      const timeLeft = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 1000);
      return NextResponse.json({ 
        isLocked: true,
        timeLeft,
        attemptsLeft: 0,
        loginAttempts: user.loginAttempts || 0,
        role: user.role,
        error: 'Account temporarily locked due to too many failed attempts'
      }, { status: 423 });
    }

          // If lockout has expired, clear it from database
      if (user.lockedUntil && loginSecurityUtils.isLockoutExpired(user.lockedUntil)) {
        await prisma.user.update({
          where: { email },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastFailedLogin: null
          }
        });
        
        console.log(`Lockout check - Expired lockout cleared for: ${email}`);
        
        return NextResponse.json({ 
          isLocked: false,
          timeLeft: 0,
          attemptsLeft: LOGIN_SECURITY.MAX_ATTEMPTS,
          loginAttempts: 0,
          role: user.role
        }, { status: 200 });
      }

      // If not locked, return current attempt count
      const currentAttempts = user.loginAttempts || 0;
      const attemptsLeft = loginSecurityUtils.getAttemptsRemaining(currentAttempts);
    
    return NextResponse.json({ 
      isLocked: false,
      timeLeft: 0,
      attemptsLeft,
      loginAttempts: currentAttempts,
      role: user.role
    }, { status: 200 });

  } catch (error) {
    console.error('Check lockout error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 