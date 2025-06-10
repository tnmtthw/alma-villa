"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

interface CredentialsProps {
  onBackAction: () => void
  onCompleteAction: () => void
}

interface CredentialsFormData {
  username: string;
  password: string;
}

function generateRandomUsername(): string {
  const firstNames = ["juan", "maria", "jose", "ana", "pedro", "lisa"];
  const lastNames = ["delacruz", "reyes", "santos", "garcia", "torres", "lopez"];
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomNumber = Math.floor(Math.random() * 1000); // Optional: adds uniqueness

  return `${randomFirst}.${randomLast}${randomNumber}`;
}

const sampleData: CredentialsFormData = {
  username: generateRandomUsername(),
  password: "Test@123456"
};

// Helper function to convert base64 to Blob
function base64ToBlob(base64Data: string): Blob {
  const parts = base64Data.split(',');
  const contentType = parts[0].split(':')[1].split(';')[0];
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

// Helper function to upload a single image
async function uploadImage(base64Data: string, imageName: string, folder: string): Promise<string> {
  const blob = base64ToBlob(base64Data);
  const file = new File([blob], `${imageName}.jpg`, { type: blob.type });

  const timestamp = new Date().getTime();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `AlmaVilla/${folder}/${timestamp}-${safeName}`;

  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('filename', filename);

  const uploadRes = await fetch(`/api/upload?filename=${filename}`, {
    method: 'POST',
    body: uploadFormData,
  });

  if (!uploadRes.ok) {
    const uploadError = await uploadRes.text();
    console.error(`Upload failed for ${imageName}:`, uploadError);
    throw new Error(`Upload failed for ${imageName}: ${uploadRes.status} - ${uploadError}`);
  }

  const result = await uploadRes.json();
  return result.url;
}

export default function Credentials({ onBackAction: onBack, onCompleteAction: onComplete }: CredentialsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(() => {
    // Try to load saved terms acceptance from sessionStorage
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('agreeToTerms') === 'true'
    }
    return false
  })

  const [formData, setFormData] = useState<CredentialsFormData>(() => {
    // Try to load saved credentials from sessionStorage
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('credentialsData')
      return savedData ? JSON.parse(savedData) : {
        username: "",
        password: ""
      }
    }
    return {
      username: "",
      password: ""
    }
  })

  // Save form data whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('credentialsData', JSON.stringify(formData))
    }
  }, [formData])

  // Save terms acceptance whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('agreeToTerms', agreeToTerms.toString())
    }
  }, [agreeToTerms])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const savedResidentInfo = localStorage.getItem('residentInfoData');
      const type = localStorage.getItem('type');
      const frontId = localStorage.getItem('frontId');
      const backId = localStorage.getItem('backId');
      const capturedPhoto = localStorage.getItem('capturedPhoto');
      const residentInfo = savedResidentInfo ? JSON.parse(savedResidentInfo) : null;

      if (!residentInfo || !capturedPhoto) {
        alert("Missing resident info or photo. Please complete previous steps.");
        return;
      }

      // Upload all images in parallel
      const uploadPromises = [];

      // Always upload captured photo
      uploadPromises.push(
        uploadImage(capturedPhoto, "captured_photo", "verifiedPhoto")
      );

      // Upload front ID if available
      if (frontId) {
        uploadPromises.push(
          uploadImage(frontId, "front_id", "idDocuments")
        );
      }

      // Upload back ID if available
      if (backId) {
        uploadPromises.push(
          uploadImage(backId, "back_id", "idDocuments")
        );
      }

      console.log("Uploading images...");
      const uploadResults = await Promise.all(uploadPromises);

      // Map results back to their respective URLs
      const capturedPhotoUrl = uploadResults[0];
      const frontIdUrl = frontId ? uploadResults[1] : null;
      const backIdUrl = backId ? uploadResults[frontId ? 2 : 1] : null;

      console.log("Images uploaded successfully:", {
        capturedPhoto: capturedPhotoUrl,
        frontId: frontIdUrl,
        backId: backIdUrl
      });

      // Prepare signup data
      const signupData = {
        username: formData.username,
        password: formData.password,
        type: type,
        capturedPhoto: capturedPhotoUrl,
        frontId: frontIdUrl,
        backId: backIdUrl,
        ...residentInfo,
      };

      // Submit user signup
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupData)
      });

      if (!signupRes.ok) {
        const errorText = await signupRes.text();
        console.error("Signup error response:", errorText);

        let errorMessage = "Unknown error";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          errorMessage = errorText;
        }

        alert("Signup failed: " + errorMessage);
        return;
      }

      const signupResult = await signupRes.json();
      console.log("Signup successful:", signupResult);

      // Clear temporary storage
      localStorage.removeItem('residentInfoData');
      localStorage.removeItem('capturedPhoto');
      localStorage.removeItem('frontId');
      localStorage.removeItem('backId');
      localStorage.removeItem('type');
      sessionStorage.removeItem('credentialsData');
      sessionStorage.removeItem('agreeToTerms');

      onComplete();
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillWithSampleData = () => {
    setFormData(sampleData)
    setAgreeToTerms(true)
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2px] shadow-lg p-4 sm:p-6 max-w-[1100px] mx-auto">
      <div className="border-b border-gray-200/50 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Account Setup</h2>
        <p className="text-sm text-gray-500 mt-1">Create your login credentials and accept the terms of service.</p>
        <Button
          type="button"
          onClick={fillWithSampleData}
          variant="outline"
          className="mt-2 text-sm border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          Fill with Sample Data
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Credentials */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Login Credentials</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="mt-1 h-12 text-base"
                required
                value={formData.username}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="pr-12 h-12 text-base"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="outline"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 p-0 border-0"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              required
              className="mt-1 flex-shrink-0"
              disabled={isSubmitting}
            />
            <div className="min-w-0">
              <Label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-[#23479A] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>
                {" "}and{" "}
                <a
                  href="/privacy"
                  className="text-[#23479A] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Mobile Optimized */}
        <div className="pt-6 border-t border-gray-200/50">
          {/* Mobile: Stack buttons vertically */}
          <div className="flex flex-col space-y-3 sm:hidden">
            <Button
              type="submit"
              className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px] h-12 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </Button>
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px] h-12 text-base"
              disabled={isSubmitting}
            >
              Previous Step
            </Button>
          </div>

          {/* Desktop: Side by side */}
          <div className="hidden sm:flex sm:justify-between sm:space-x-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="border-[#23479A] text-[#23479A] hover:bg-[#23479A]/10 rounded-[2px] h-12"
              disabled={isSubmitting}
            >
              Previous Step
            </Button>
            <Button
              type="submit"
              className="bg-[#23479A] hover:bg-[#23479A]/90 text-white rounded-[2px] h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </Button>
          </div>
        </div>

        {/* Extra spacing for mobile to prevent overlap with browser UI */}
        <div className="h-8 sm:hidden" />
      </form>
    </div>
  )
}