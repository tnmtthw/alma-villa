import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
    let id: string | null = null;
    let body: any = null;
    
    try {
        const { searchParams } = new URL(request.url);
        id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Document ID is required' },
                { status: 400 }
            );
        }

        body = await request.json();
        console.log('Received request body:', body);
        
        // Extract only the fields that exist in the Document model
        const { status, proofOfPayment, ...otherFields } = body;
        const updateData: any = {};
        
        // Only add fields that exist in the database schema
        if (status !== undefined) updateData.status = status;
        if (proofOfPayment !== undefined) updateData.proofOfPayment = proofOfPayment;
        
        console.log('Filtered update data:', updateData);

        const updatedDocument = await prisma.document.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        // Log document status change
        if (status && updatedDocument.user) {
            const adminUser = 'System Admin'; // You might want to get this from session
            if (status === 'ready_to_claim') {
                await AuditLogger.logDocumentApproval(
                    updatedDocument.user.id,
                    id,
                    updatedDocument.type || 'Unknown',
                    adminUser,
                    getClientIP(request),
                    getUserAgent(request)
                );
            } else if (status === 'rejected') {
                await AuditLogger.logDocumentRejection(
                    updatedDocument.user.id,
                    id,
                    updatedDocument.type || 'Unknown',
                    adminUser,
                    'Status changed to rejected',
                    getClientIP(request),
                    getUserAgent(request)
                );
            }
        }

        return NextResponse.json(
            { success: true, document: updatedDocument },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating document status:', error);
        console.error('Request ID:', id);
        console.error('Request body:', body);
        return NextResponse.json(
            { success: false, error: `Failed to update document status: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}