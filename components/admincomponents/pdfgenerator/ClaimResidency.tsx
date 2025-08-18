'use client';

import React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ClaimResidencyProps {
    request: {
        id: string;
        fullName: string
        age: string
        purok: string
        type: string;
        requestDate: string;
        fee?: string;
    };
}


const ClaimResidency: React.FC<ClaimResidencyProps> = ({ request }) => {
    const date = new Date(request.requestDate);
    const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "August"
    const day = date.getDate(); // e.g., 10

    const formData = {
        fullName: request.fullName,
        age: request.age,
        purok: request.purok,
        month: month,
        day: day,
    };

    const fillPDF = async () => {
        const existingPdfBytes = await fetch('/residency.pdf').then(res => res.arrayBuffer());
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
        link.download = `CERTIFICATE_RESIDENCY_${request.id}.pdf`;
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

export default ClaimResidency;
