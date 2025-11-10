import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { LOGIN_SECURITY, loginSecurityUtils } from '@/lib/utils';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return same error message to prevent email enumeration
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({
        error: 'Account inactive'
      }, { status: 403 });
    }

    const now = new Date();
    
    // Check if account is currently locked
    if (user.lockedUntil && user.lockedUntil > now) {
      const timeLeft = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 1000);
      console.log(`Login attempt blocked - Account locked: ${email}, Time left: ${timeLeft}s`);
      
      return NextResponse.json({ 
        error: 'Account temporarily locked due to too many failed attempts', 
        timeLeft,
        isLocked: true 
      }, { status: 423 });
    }

          // If lockout period has expired, clear the lockout
      if (user.lockedUntil && loginSecurityUtils.isLockoutExpired(user.lockedUntil)) {
        await prisma.user.update({
          where: { email },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastFailedLogin: null,
          },
        });
        console.log(`Lockout expired and cleared for: ${email}`);
      }

    const isPasswordValid = await compare(password, user.password);

          if (!isPasswordValid) {
        // Increment failed login attempts
        const newAttempts = (user.loginAttempts || 0) + 1;
        const attemptsLeft = loginSecurityUtils.getAttemptsRemaining(newAttempts);
        
        const updateData: any = {
          loginAttempts: newAttempts,
          lastFailedLogin: now,
        };

        // Lock account after maximum attempts reached
        if (loginSecurityUtils.shouldLockAccount(newAttempts)) {
          updateData.lockedUntil = loginSecurityUtils.getLockoutEndTime(now);
          
          console.log(`Account locked after ${LOGIN_SECURITY.MAX_ATTEMPTS} failed attempts: ${email}`);
          
          await prisma.user.update({
            where: { email },
            data: updateData,
          });

          return NextResponse.json({ 
            error: `Too many failed attempts. Account locked for ${LOGIN_SECURITY.LOCKOUT_DURATION_MINUTES} minute(s).`, 
            timeLeft: LOGIN_SECURITY.LOCKOUT_DURATION_MS / 1000,
            isLocked: true 
          }, { status: 423 });
        }

        // Update attempts count
        await prisma.user.update({
          where: { email },
          data: updateData,
        });

        console.log(`Failed login attempt ${newAttempts}/${LOGIN_SECURITY.MAX_ATTEMPTS} for: ${email}`);

        return NextResponse.json({ 
          error: 'Invalid email or password',
          attemptsLeft
        }, { status: 401 });
      }

    // Successful login - Reset all security counters and update lastLogin
    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: 0,
        lastFailedLogin: null,
        lockedUntil: null,
        lastLogin: now,
      },
    });
    console.log(`Login successful - Security counters reset and lastLogin updated for: ${email}`);

    // Log successful login
    await AuditLogger.logUserLogin(
      user.id,
      email,
      getClientIP(req),
      getUserAgent(req)
    );

    console.log(`Successful login: ${email}`);
    return NextResponse.json({ 
      message: 'Login successful', 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: `${user.firstName} ${user.lastName}`.trim() || user.email,
      isActive: user.isActive
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
