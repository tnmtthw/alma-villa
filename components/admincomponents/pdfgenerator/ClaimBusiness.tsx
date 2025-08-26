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
    const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "August"
    const day = date.getDate(); // e.g., 10

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

        // 🔒 Make PDF non-editable
        form.flatten();

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `BUSINESS_PERMIT_${request.id}.pdf`;
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

export default ClaimBusinessButton;
