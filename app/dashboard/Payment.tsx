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
import { validateImageFile, FILE_SIZE_LIMITS } from "@/lib/fileValidation";
import { Download } from "lucide-react";

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
        // Validate file before upload
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            addToast({
                title: "Invalid File",
                description: validation.error,
                variant: "destructive"
            });
            return;
        }

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

    const downloadQRCode = async (qrImagePath: string, documentType: string) => {
        try {
            const response = await fetch(qrImagePath);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `QR_Code_${documentType.replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            addToast({
                title: "QR Code Downloaded",
                description: `QR code for ${documentType} has been downloaded successfully.`,
                variant: "default"
            });
        } catch (error) {
            console.error("Download error:", error);
            addToast({
                title: "Download Failed",
                description: "Failed to download QR code. Please try again.",
                variant: "destructive"
            });
        }
    };

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

                <div className="space-y-4">
                    {/* QR Code Display with Download Button */}
                    <div className="text-center space-y-3">
                        {request.type === "Barangay Clearance" && (
                            <img src="/qrcode/QR_Clearance.jpg" alt="QR Code for Barangay Clearance" className="mx-auto max-w-xs" />
                        )}

                        {request.type === "Certificate of Residency" && (
                            <img src="/qrcode/QR_Residency.jpg" alt="QR Code for Certificate of Residency" className="mx-auto max-w-xs" />
                        )}

                        {request.type === "Certificate of Indigency" && (
                            <img src="/qrcode/QR_Indigency.jpg" alt="QR Code for Certificate of Indigency" className="mx-auto max-w-xs" />
                        )}

                        {request.type === "Business Permit" && (
                            <img src="/qrcode/QR_Business.jpg" alt="QR Code for Business Permit" className="mx-auto max-w-xs" />
                        )}

                        {request.type === "Certificate of Good Moral Character" && (
                            <img src="/qrcode/QR_Goodmoral.jpg" alt="QR Code for Certificate of Good Moral Character" className="mx-auto max-w-xs" />
                        )}
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-2">
                        <p>
                            <strong>Name:</strong> {request.fullName || request.businessName}
                        </p>
                        <p>
                            <strong>Type:</strong> {request.type}
                        </p>
                        <p>
                            <strong>Fee:</strong> {fee}
                        </p>
                    </div>

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
                        <p className="text-xs text-gray-500 mt-1">
                            Supported formats: JPG, PNG, WebP (max {FILE_SIZE_LIMITS.IMAGE_MAX_SIZE_MB}MB)
                        </p>
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

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (request.type === "Barangay Clearance") {
                                downloadQRCode("/qrcode/QR_Clearance.jpg", "Barangay Clearance");
                            } else if (request.type === "Certificate of Residency") {
                                downloadQRCode("/qrcode/QR_Residency.jpg", "Certificate of Residency");
                            } else if (request.type === "Certificate of Indigency") {
                                downloadQRCode("/qrcode/QR_Indigency.jpg", "Certificate of Indigency");
                            } else if (request.type === "Business Permit") {
                                downloadQRCode("/qrcode/QR_Business.jpg", "Business Permit");
                            } else if (request.type === "Certificate of Good Moral Character") {
                                downloadQRCode("/qrcode/QR_Goodmoral.jpg", "Certificate of Good Moral Character");
                            }
                        }}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download QR Code
                    </Button>
                    <Button onClick={handleProceedToPayment} disabled={uploading}>
                        {uploading ? "Processing..." : "Proceed to Payment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentPage;