'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

enum ResetStatus {
    VALIDATING = 'validating',
    READY = 'ready',
    SUCCESS = 'success',
    ERROR = 'error'
}

interface FormData {
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    password?: string;
    confirmPassword?: string;
}

export default function ResetPasswordCard({ resetToken }: { resetToken: string }) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState<ResetStatus>(ResetStatus.VALIDATING);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');

    // Password validation function
    const validatePassword = (password: string): string | undefined => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (password.length > 20) return "Password must not exceed 20 characters";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/\d/.test(password)) return "Password must contain at least one number";
        if (!/[@$!%*?&#]/.test(password)) return "Password must contain at least one special character";
        return undefined;
    };

    // Form validation function
    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        
        const passwordError = validatePassword(formData.password);
        if (passwordError) errors.password = passwordError;
        
        if (!formData.confirmPassword) {
            errors.confirmPassword = "Confirm Password is required";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords must match";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Validate token on component mount
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch(`/api/auth/validate-token?resetToken=${resetToken}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    setStatus(ResetStatus.READY);
                } else {
                    const error = await response.json();
                    setErrorMessage(error.message || 'This reset link is invalid or has expired');
                    setStatus(ResetStatus.ERROR);
                }
            } catch (error) {
                setErrorMessage('Could not validate reset token. Please try again.');
                setStatus(ResetStatus.ERROR);
            }
        };

        validateToken();
    }, [resetToken]);

    // Handle the password reset submission
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            // Call API to reset password
            const response = await fetch(`/api/auth/reset-password?resetToken=${resetToken}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: formData.password
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to reset password');
            }

            // Show success message
            setSuccessMessage("Password updated successfully");
            
            // Move to success status after a brief delay
            setTimeout(() => {
                setStatus(ResetStatus.SUCCESS);
            }, 1500);

        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state
    if (status === ResetStatus.VALIDATING) {
        return (
            <div className="min-h-screen bg-[#23479A] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                    <div className="text-center">
                        <div className="mb-6">
                            <img src="/assets/img/Logo.png" alt="Alma Villa" className="h-16 mx-auto" />
                        </div>
                        
                        <div className="mb-6">
                            <Loader2 className="h-12 w-12 text-[#23479A] animate-spin mx-auto" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Validating Reset Link</h2>
                        <p className="text-gray-600 text-sm">
                            Please wait while we validate your password reset link...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (status === ResetStatus.ERROR) {
        return (
            <div className="min-h-screen bg-[#23479A] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                    <div className="text-center">
                        <div className="mb-6">
                            <img src="/assets/img/Logo.png" alt="Alma Villa" className="h-16 mx-auto" />
                        </div>

                        <div className="mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid Reset Link</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            {errorMessage}
                        </p>

                        <Link
                            href="/forgot-password"
                            className="w-full bg-[#23479A] text-white py-3 px-4 rounded-md hover:bg-[#1e3d8a] transition-colors font-medium inline-block text-center"
                        >
                            Request New Reset Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Show success state
    if (status === ResetStatus.SUCCESS) {
        return (
            <div className="min-h-screen bg-[#23479A] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                    <div className="text-center">
                        <div className="mb-6">
                            <img src="/assets/img/Logo.png" alt="Alma Villa" className="h-16 mx-auto" />
                        </div>

                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Password Reset Complete</h2>
                        <p className="text-gray-600 text-sm mb-8">
                            Your password has been successfully reset. You can now sign in with your new password.
                        </p>

                        <button
                            onClick={() => router.push('/login')}
                            className="w-full bg-[#23479A] text-white py-3 px-4 rounded-md hover:bg-[#1e3d8a] transition-colors font-medium"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show reset password form (READY state)
    return (
        <div className="min-h-screen bg-[#23479A] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <img src="/assets/img/Logo.png" alt="Alma Villa" className="h-16 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                    <p className="text-gray-600 text-sm">Enter your new password below</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-green-800 text-sm">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                            <span className="text-red-800 text-sm">{errorMessage}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* New Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className={`w-full pl-10 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#23479A] focus:border-[#23479A] ${
                                    formErrors.password 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300 bg-gray-50'
                                }`}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                disabled={isSubmitting}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                className={`w-full pl-10 pr-12 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#23479A] focus:border-[#23479A] ${
                                    formErrors.confirmPassword 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300 bg-gray-50'
                                }`}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                disabled={isSubmitting}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {formErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <p className="text-sm font-medium text-blue-900 mb-2">Password requirements:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li className="flex items-center">
                                <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                                At least 8 characters
                            </li>
                            <li className="flex items-center">
                                <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                                One uppercase letter (A-Z)
                            </li>
                            <li className="flex items-center">
                                <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                                One lowercase letter (a-z)
                            </li>
                            <li className="flex items-center">
                                <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                                One number (0-9)
                            </li>
                            <li className="flex items-center">
                                <div className="w-1 h-1 bg-blue-600 rounded-full mr-2"></div>
                                One special character (@$!%*?&#)
                            </li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={isSubmitting}
                        className="w-full bg-[#23479A] text-white py-3 px-4 rounded-md hover:bg-[#1e3d8a] focus:outline-none focus:ring-2 focus:ring-[#23479A] focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Updating Password...
                            </div>
                        ) : (
                            'Reset Password'
                        )}
                    </button>

                    {/* Cancel Link */}
                    <div className="text-center">
                        <Link
                            href="/login"
                            className="text-[#23479A] hover:text-[#1e3d8a] text-sm transition-colors"
                        >
                            Cancel and return to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}