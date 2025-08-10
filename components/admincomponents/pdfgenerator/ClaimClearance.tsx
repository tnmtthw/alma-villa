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
        houseNumber: string
        street: string
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
    const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "August"
    const day = date.getDate(); // e.g., 10

    const formData = {
        fullName: request.fullName,
        age: request.age,
        birthDate: request.birthDate,
        "birthPlace": "Philippines",
        civilStatus: request.civilStatus,
        address: request.houseNumber + " " + request.street + " " + request.purok,
        "month": month,
        "day": day,
        "Residence Certificate": request.id,
        "Issued at": request.fullName,
        issued: "",
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

        // 🔒 Make PDF non-editable
        form.flatten();

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
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
