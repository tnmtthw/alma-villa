"use client";
import React from 'react'
import QRCode from "react-qr-code";

interface QRVerificationProps {
    documentId: string
}

export default function QRVerification({ documentId }: QRVerificationProps) {
    const value = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${encodeURIComponent(documentId)}`

    return (
        <div className="flex flex-col items-center gap-2">
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={value}
                    viewBox={`0 0 256 256`}
                />
            </div>
            <p className="text-xs text-gray-600 break-all text-center max-w-[220px]">{value}</p>
        </div>
    )
}