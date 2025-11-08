import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { AuditLogger, getClientIP, getUserAgent } from '@/lib/audit';
import { auth } from '@/auth';

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

        // Get the current session to identify who is approving the payment
        const session = await auth();
        const adminName = session?.user?.name || 'Admin';

        body = await request.json();
        console.log('Received request body:', body);
        
        // Extract only the fields that exist in the Document model
        const { status, proofOfPayment, paymentReference, paymentDate, paymentReceived } = body;
        const updateData: any = {};
        
        if (status !== undefined) updateData.status = status;
        if (proofOfPayment !== undefined) updateData.proofOfPayment = proofOfPayment;
        if (paymentReference !== undefined) updateData.paymentReference = paymentReference;
        if (paymentDate !== undefined) updateData.paymentDate = paymentDate;
        
        // When approving payment (status = 'ready_to_claim'), save who approved it
        if (status === 'ready_to_claim') {
            updateData.paymentReceived = adminName;
        } else if (paymentReceived !== undefined) {
            // Allow explicit paymentReceived to be set for other cases
            updateData.paymentReceived = paymentReceived;
        }
     
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
            const adminUser = adminName;
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