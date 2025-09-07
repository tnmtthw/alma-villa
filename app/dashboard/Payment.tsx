"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PaymentProps {
    request: {
        id: string;
        fullName: string;
        age: string;
        birthDate: string;
        civilStatus: string;
        placeOfBirth: string;
        citizenship: string;
        purok: string;
        type: string;
        requestDate: string;
        purpose: string;
        fee?: string;
    };
}

const PaymentPage: React.FC<PaymentProps> = ({ request }) => {
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState<{ image?: string }>({});

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const filename = `AlmaVilla/proofofpayment/${file.name}`;

            const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to upload image");
            const data = await res.json();

            setFormData(prev => ({ ...prev, image: data.url }));
            setPreviewImage(data.url);
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleProceedToPayment = async () => {
        try {
            if (!formData.image) {
                alert("Please upload proof of payment first.");
                return;
            }
            await Promise.all([
                fetch(`/api/document/set-status?id=${request.id}`, {
                    method: "PATCH",
                    body: JSON.stringify({ status: "ready_to_claim" }),
                    headers: { "Content-Type": "application/json" },
                }),
            ]);

            alert("Payment confirmed and status updated!");
        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong while processing payment.");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Payment</Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Payment Details</DialogTitle>
                    <DialogDescription>
                        Review the request information before proceeding.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <p>
                        <strong>Name:</strong> {request.fullName}
                    </p>
                    <p>
                        <strong>Type:</strong> {request.type}
                    </p>
                    {request.fee && (
                        <p>
                            <strong>Fee:</strong> {request.fee}
                        </p>
                    )}

                    {/* File Upload Input */}
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                    />

                    {uploading && <p>Uploading...</p>}
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Proof of Payment"
                            className="mt-2 w-40 rounded"
                        />
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleProceedToPayment} disabled={uploading}>
                        {uploading ? "Processing..." : "Proceed to Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentPage;