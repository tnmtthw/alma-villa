import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const body = await request.json();
        
        // Remove password from body if it exists (password updates should use change-password endpoint)
        const { password, ...profileData } = body;

        // Validate that we have some data to update
        if (Object.keys(profileData).length === 0) {
            return NextResponse.json({ error: 'No data provided for update' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id },
            data: profileData,
        });

        // Return updated user data (excluding sensitive fields)
        const { password: _, ...safeUserData } = updatedUser;
        
        return NextResponse.json({ 
            message: 'Profile updated successfully',
            user: safeUserData 
        }, { status: 200 });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}