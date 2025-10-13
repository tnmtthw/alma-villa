'use client';

import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ClaimClearanceButtonProps {
    request: {
        id: string;
        fullName: string
        age: string
        birthDate: string
        civilStatus: string
        placeOfBirth: string
        citizenship: string
        purok: string
        type: string;
        requestDate: string;
        purpose: string;
        fee?: string;
        // Add other fields you need
    };
}


const ClaimClearanceButton: React.FC<ClaimClearanceButtonProps> = ({ request }) => {
    const date = new Date(request.requestDate);
    const month = date.toLocaleString("en-US", { month: "short" });
    const monthLong = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const birthDate = new Date(request.birthDate);
    const formattedBirthDate = birthDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).replace(/([A-Za-z]+)\s/, "$1. ");

    const formData = {
        fullName: request.fullName,
        age: request.age,
        birthDate: formattedBirthDate,
        civilStatus: request.civilStatus,
        placeOfBirth: request.placeOfBirth,
        citizenship: request.citizenship,
        address: request.purok,
        "month": month,
        "day": day,
        "Residence Certificate": request.id,
        "Issued at": "Barangay Alma Villa, Gloria, Oriental Mindoro",
        issued: monthLong + " " + day + ", 2025",
        Purpose: request.purpose
    };

    const fillPDF = async () => {
        const existingPdfBytes = await fetch('/clearance.pdf').then(res => res.arrayBuffer());
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

        // Embed QR in top-right
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
            const verifyUrl = `${baseUrl}/verify/${encodeURIComponent(request.id)}`
            // @ts-ignore types provided via ambient module until package installed
            const { default: QRCode } = await import('qrcode')
            const dataUrl = await QRCode.toDataURL(verifyUrl, { width: 256, margin: 0 })
            const pngBytes = await fetch(dataUrl).then(r => r.arrayBuffer())
            const qrImage = await pdfDoc.embedPng(pngBytes)
            const firstPage = pdfDoc.getPages()[0]
            const { width: pageWidth, height: pageHeight } = firstPage.getSize()
            const qrRenderWidth = 45
            const qrRenderHeight = 45
            const margin = 16
            firstPage.drawImage(qrImage, {
                x: margin,
                y: margin,
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
        link.download = `BRGY_CLEARANCE_${request.id}.pdf`;
        link.click();
    };

    return (
        <Button
            size="sm"
            className="bg-[#23479A] hover:bg-[#23479A]/90 text-white"
            onClick={fillPDF}
        >
            <Download className="h-3 w-3 mr-1" />
            Claim
        </Button>
    );
};

export default ClaimClearanceButton;
