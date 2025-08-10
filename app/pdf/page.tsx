'use client';

import React from 'react';
import { PDFDocument } from 'pdf-lib';

const Page = () => {
    const formData = {
        Fullname: "Fortune Tamares",
        Age: "25",
        "Date of Birth": "2000-01-01",
        "Birth Place": "Gloria, Oriental Mindoro",
        "Civil Status": "Single",
        "A resident of": "Barangay Alma Villa",
        "Issued this": "5",
        "day of": "August",
        "Residence Certificate": "1234567",
        "Issued at": "Gloria",
        "Issued": "2025-08-05",
    };

    const fillPDF = async () => {
        // Load existing PDF template
        const existingPdfBytes = await fetch('/clearance.pdf').then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Get the form in the PDF
        const form = pdfDoc.getForm();

        // Fill fields
        Object.entries(formData).forEach(([key, value]) => {
            const field = form.getTextField(key);
            if (field) field.setText(value);
        });

        // Keep fields editable or flatten to make them non-editable
        // form.flatten();

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'BRGY_CLEARANCE_FILLED.pdf';
        link.click();
    };

    return (
        <div>
            <h1>Auto Generate Barangay Clearance</h1>
            <button onClick={fillPDF}>Generate PDF</button>
        </div>
    );
};

export default Page;
