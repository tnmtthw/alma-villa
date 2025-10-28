// File validation utilities
export const FILE_SIZE_LIMITS = {
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  IMAGE_MAX_SIZE_MB: 10, // 10MB for display
} as const

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
] as const

export interface FileValidationResult {
  isValid: boolean
  error?: string
}

export function validateImageFile(file: File): FileValidationResult {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `Invalid file type. Please upload a JPG, PNG, or WebP image.`
    }
  }

  // Check file size
  if (file.size > FILE_SIZE_LIMITS.IMAGE_MAX_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Please upload an image smaller than ${FILE_SIZE_LIMITS.IMAGE_MAX_SIZE_MB}MB.`
    }
  }

  return { isValid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
