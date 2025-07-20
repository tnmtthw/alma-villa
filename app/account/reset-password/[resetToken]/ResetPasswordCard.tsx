'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const inputStyles = "font-nunito bg-white bg-opacity-95 text-black px-4 w-full h-11 rounded-lg placeholder:text-gray-500 text-sm font-medium focus:ring-2 focus:ring-yellow-primary focus:outline-none transition-all tracking-wide";

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
            <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
                <div className="w-full max-w-md mx-auto px-8 pt-6">
                    <div className="bg-brown-primary rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
                            </div>

                            <div className="inline-block p-4 mb-4">
                                <div className="w-10 h-10 border-4 border-yellow-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Validating Reset Link</h2>

                            <p className="text-white/80 text-sm">
                                Please wait while we validate your password reset link...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show error state
    if (status === ResetStatus.ERROR) {
        return (
            <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
                <div className="w-full max-w-md mx-auto px-8 pt-6">
                    <div className="bg-brown-primary rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
                            </div>

                            <div className="inline-block p-4 bg-red-500/20 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Invalid Reset Link</h2>

                            <p className="text-white/80 text-sm mb-6">
                                {errorMessage}
                            </p>

                            <Link
                                href="/account/forgot-password"
                                className="bg-yellow-primary font-bold text-brown-primary px-6 py-3 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm font-nunito inline-block"
                            >
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show success state
    if (status === ResetStatus.SUCCESS) {
        return (
            <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
                <div className="w-full max-w-md mx-auto px-8 pt-6">
                    <div className="bg-brown-primary rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
                            </div>

                            <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Password Reset Complete</h2>

                            <p className="text-white/80 text-sm mb-8">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>

                            <button
                                onClick={() => router.push('/account/sign-in')}
                                className="bg-yellow-primary font-bold text-brown-primary w-full h-11 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm font-nunito"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show reset password form (READY state)
    return (
        <div className="bg-[url('/img/bg-main.png')] min-h-screen bg-cover bg-center flex items-center justify-center py-12">
            <div className="w-full max-w-md mx-auto px-8 pt-6">
                <div className="bg-brown-primary rounded-3xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-center mb-6">
                            <img src="/img/logo.png" alt="B'Dazzle Cafe" className="h-12 w-auto" />
                        </div>

                        <h2 className="text-2xl font-bold text-white text-center mb-6">Reset Your Password</h2>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                                {successMessage}
                            </div>
                        )}

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="group">
                                <label htmlFor="password" className="text-xs block mb-1 font-medium text-white">New Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className={inputStyles}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ?
                                            <EyeOff size={16} className="text-gray-600" /> :
                                            <Eye size={16} className="text-gray-600" />
                                        }
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <div className="text-red-300 text-xs mt-1">{formErrors.password}</div>
                                )}
                            </div>

                            <div className="group">
                                <label htmlFor="confirmPassword" className="text-xs block mb-1 font-medium text-white">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className={inputStyles}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        {showConfirmPassword ?
                                            <EyeOff size={16} className="text-gray-600" /> :
                                            <Eye size={16} className="text-gray-600" />
                                        }
                                    </button>
                                </div>
                                {formErrors.confirmPassword && (
                                    <div className="text-red-300 text-xs mt-1">{formErrors.confirmPassword}</div>
                                )}
                            </div>

                            <div className="bg-white/10 p-3 rounded-lg text-sm text-white/80">
                                <p className="mb-2 font-medium text-white">Password requirements:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>At least 8 characters</li>
                                    <li>At least one uppercase letter (A-Z)</li>
                                    <li>At least one lowercase letter (a-z)</li>
                                    <li>At least one number (0-9)</li>
                                    <li>At least one special character (@$!%*?&#)</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-yellow-primary font-bold text-brown-primary w-full h-11 rounded-lg hover:bg-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-all text-sm mt-2 font-nunito disabled:opacity-50"
                            >
                                {isSubmitting ? "Updating..." : "Reset Password"}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/account/sign-in"
                                    className="text-white/70 hover:text-white text-sm transition-colors font-nunito"
                                >
                                    Cancel and return to sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="text-center mt-6 text-white/60 text-sm">
                    <p>
                        Need help? <Link href="/contact" className="text-yellow-primary hover:text-yellow-300">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
