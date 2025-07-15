import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all users with limited information for security
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        loginAttempts: true,
        lastFailedLogin: true,
        lockedUntil: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Add computed fields for easier testing
    const usersWithStatus = users.map(user => {
      const now = new Date();
      const isLocked = user.lockedUntil && user.lockedUntil > now;
      const timeLeft = isLocked 
        ? Math.ceil((user.lockedUntil!.getTime() - now.getTime()) / 1000)
        : 0;

      return {
        ...user,
        isCurrentlyLocked: isLocked,
        lockoutTimeLeft: timeLeft,
        attemptsRemaining: Math.max(0, 3 - (user.loginAttempts || 0))
      };
    });

    return NextResponse.json({
      success: true,
      count: users.length,
      users: usersWithStatus
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch users',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}

// POST endpoint to reset a user's login attempts (for testing)
export async function POST(req: Request) {
  try {
    const { email, action } = await req.json();

    if (!email) {
      return NextResponse.json({ 
        success: false,
        error: 'Email is required' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true, email: true, loginAttempts: true, lockedUntil: true }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    if (action === 'reset') {
      // Reset login attempts and unlock account
      await prisma.user.update({
        where: { email },
        data: {
          loginAttempts: 0,
          lastFailedLogin: null,
          lockedUntil: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Login attempts reset for ${email}`,
        user: {
          email: user.email,
          previousAttempts: user.loginAttempts,
          wasLocked: !!user.lockedUntil
        }
      });
    }

    return NextResponse.json({ 
      success: false,
      error: 'Invalid action. Use "reset"' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error resetting user:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to reset user',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
} 