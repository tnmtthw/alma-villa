'use client';

import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useSession } from 'next-auth/react';

interface ClaimIndigencyButtonProps {
    request: {
        id: string;
        fullName: string
        requestDate: string;
        status: string
    };
}


const ClaimIndigencyButton: React.FC<ClaimIndigencyButtonProps> = ({ request }) => {
    const { data: session } = useSession();
    const date = new Date(request.requestDate);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate(); // e.g., 10

    const formData = {
        fullName: request.fullName,
        month: month,
        day: day,
    };

    const fillPDF = async () => {
        const existingPdfBytes = await fetch('/indigency.pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        Object.entries(formData).forEach(([key, value]) => {
            try {
                const field = form.getTextField(key);
                field.setText(String(value));
            } catch (e) {
                console.warn(`Field "${key}" not found in PDF.`);
            }
        });

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
            const verifyUrl = `${baseUrl}/verify/${encodeURIComponent(request.id)}`
            const { default: QRCode } = await import('qrcode')
            const dataUrl = await QRCode.toDataURL(verifyUrl, { width: 256, margin: 0 })
            const pngBytes = await fetch(dataUrl).then(r => r.arrayBuffer())
            const qrImage = await pdfDoc.embedPng(pngBytes)
            const firstPage = pdfDoc.getPages()[0]
            const { width: pageWidth, height: pageHeight } = firstPage.getSize()
            const qrRenderWidth = 45
            const qrRenderHeight = 45
            firstPage.drawImage(qrImage, {
                x: 64,
                y: 30,
                width: qrRenderWidth,
                height: qrRenderHeight,
            })
        } catch (e) {
            console.warn('Failed to embed QR code into PDF:', e)
        }

        // 🔒 Make PDF non-editable
        form.flatten();

        const pdfBytes = await pdfDoc.save();
        const arrayBuffer = pdfBytes.slice().buffer as ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const fileName = `CERTIFICATE_INDIGENCY_${request.id}.pdf`;
        link.download = fileName;
        link.click();

        // Log PDF download in audit
        try {
            await fetch('/api/audit/log-pdf-download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentId: request.id,
                    documentType: 'Certificate of Indigency',
                    fileName: fileName
                })
            });
        } catch (error) {
            console.warn('Failed to log PDF download:', error);
        }

        await fetch(`/api/document/set-status?id=${request.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });
    };

    return (
        <Button
            size="sm"
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white"
            onClick={fillPDF}
        >
            <Download className="h-3 w-3 mr-1" />
            {request.status === "ready_to_claim" ? "Claim" : "Download"}
        </Button>
    );
};

export default ClaimIndigencyButton;
