'use client';

import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"


interface ClaimBusinessButtonProps {
    request: {
        id: string;
        businessName: string
        businessLocation: string
        operatorName: string
        operatorAddress: string;
        updatedAt: string;
        requestDate: string;
        fee?: string;
    };
}


const ClaimBusinessButton: React.FC<ClaimBusinessButtonProps> = ({ request }) => {
    const date = new Date(request.requestDate);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();

    const updatedDate = new Date(request.updatedAt);
    const updatedAt = updatedDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour12: true,
    });

    const formData = {
        businessName: request.businessName,
        businessLocation: request.businessLocation,
        operatorName: request.operatorName,
        operatorAddress: request.operatorAddress,
        updatedAt,
        requestDate: request.requestDate,
        month: month,
        day: day,
    };

    const verifyUrl = `${(process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))}/verify/${encodeURIComponent(request.id)}`


    const fillPDF = async () => {
        const existingPdfBytes = await fetch('/businesspermit.pdf').then(res => res.arrayBuffer());
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
            const { default: QRCode } = await import('qrcode')
            const dataUrl = await QRCode.toDataURL(verifyUrl, { width: 256, margin: 0 })
            const pngBytes = await fetch(dataUrl).then(r => r.arrayBuffer())
            const qrImage = await pdfDoc.embedPng(pngBytes)
            const pages = pdfDoc.getPages()
            const firstPage = pages[0]
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
        link.download = `BUSINESS_PERMIT_${request.id}.pdf`;
        link.click();

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
        </Button>
    );
};

export default ClaimBusinessButton;
