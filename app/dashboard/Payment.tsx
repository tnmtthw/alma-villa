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
import { useToast } from "@/components/ui/toast";

interface PaymentProps {
    request: {
        id: string;
        fullName: string;
        businessName?: string;
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
    const { addToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [formData, setFormData] = useState<{ image?: string }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            // Show success toast
            addToast({
                title: "Image Uploaded Successfully!",
                description: "Your payment proof has been uploaded and is ready to submit.",
                variant: "default"
            });
        } catch (error) {
            console.error("Upload error:", error);
            addToast({
                title: "Upload Failed",
                description: error instanceof Error ? error.message : "Failed to upload payment proof. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const handleProceedToPayment = async () => {
        try {
            if (!formData.image) {
                addToast({
                    title: "Missing Payment Proof",
                    description: "Please upload proof of payment first.",
                    variant: "destructive"
                });
                return;
            }

            const response = await fetch(`/api/document/set-status?id=${request.id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: "payment_sent", proofOfPayment: formData.image }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error('Failed to update payment status');
            }

            const result = await response.json();

            if (result.success) {
                addToast({
                    title: "Payment Confirmed Successfully!",
                    description: "Your payment proof has been submitted and your request status has been updated.",
                    variant: "default"
                });

                // Auto-close modal after 3 seconds
                setTimeout(() => {
                    setIsModalOpen(false);
                }, 3000);
            } else {
                throw new Error(result.error || 'Payment confirmation failed');
            }
        } catch (error) {
            console.error("Payment error:", error);
            addToast({
                title: "Payment Confirmation Failed",
                description: error instanceof Error ? error.message : "Something went wrong while processing payment. Please try again.",
                variant: "destructive"
            });
        }
    };

    const getFeeByType = (type: string) => {
        switch (type) {
            case "Barangay Clearance":
                return "50";
            case "Certificate of Residency":
                return "₱30";
            case "Certificate of Indigency":
                return "₱30";
            case "Business Permit":
                return "₱200";
            case "Certificate of Good Moral Character":
                return "₱120";
            default:
                return "₱0";
        }
    };

    const fee = getFeeByType(request.type);

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    onClick={() => setIsModalOpen(true)}>
                    Payment
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Payment Details</DialogTitle>
                    <DialogDescription>
                        Review the request information before proceeding.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    {request.type === "Barangay Clearance" && (
                        <img src="/qrcode/QR_Clearance.jpg" />
                    )}

                    {request.type === "Certificate of Residency" && (
                        <img src="/qrcode/QR_Residency.jpg" />
                    )}

                    {request.type === "Certificate of Indigency" && (
                        <img src="/qrcode/QR_Indigency.jpg" />
                    )}

                    {request.type === "Business Permit" && (
                        <img src="/qrcode/QR_Business.jpg" />
                    )}
                    {request.type === "Certificate of Good Moral Character" && (
                        <img src="/qrcode/QR_Goodmoral.jpg" />
                    )}
                    <p>
                        <strong>Name:</strong> {request.fullName || request.businessName}
                    </p>
                    <p>
                        <strong>Type:</strong> {request.type}
                    </p>
                    <p>
                        <strong>Fee:</strong> {fee}
                    </p>

                    {/* File Upload Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Proof of payment
                        </label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                        />
                    </div>

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