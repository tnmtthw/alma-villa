import { prisma } from '@/lib/prisma'

export interface AuditLogData {
  userId?: string
  action: string
  details?: string
  ipAddress?: string
  userAgent?: string
}

export class AuditLogger {
  /**
   * Record an audit log entry
   */
  static async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          details: data.details,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      })
    } catch (error) {
      console.error('Failed to create audit log:', error)
      // Don't throw error to avoid breaking the main operation
    }
  }

  /**
   * Log user registration
   */
  static async logUserRegistration(userId: string, userEmail: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'USER_REGISTRATION',
      details: `User registered with email: ${userEmail}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log user login
   */
  static async logUserLogin(userId: string, userEmail: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'USER_LOGIN',
      details: `User logged in with email: ${userEmail}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log user logout
   */
  static async logUserLogout(userId: string, userEmail: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'USER_LOGOUT',
      details: `User logged out: ${userEmail}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log failed login attempt
   */
  static async logFailedLogin(email: string, reason: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      action: 'FAILED_LOGIN',
      details: `Failed login attempt for email: ${email}. Reason: ${reason}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log document request submission
   */
  static async logDocumentSubmission(userId: string, documentId: string, documentType: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'DOCUMENT_SUBMISSION',
      details: `Document request submitted: ${documentType} (ID: ${documentId})`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log document approval
   */
  static async logDocumentApproval(userId: string, documentId: string, documentType: string, approvedBy: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'DOCUMENT_APPROVAL',
      details: `Document approved: ${documentType} (ID: ${documentId}) by ${approvedBy}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log document rejection
   */
  static async logDocumentRejection(userId: string, documentId: string, documentType: string, rejectedBy: string, reason: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'DOCUMENT_REJECTION',
      details: `Document rejected: ${documentType} (ID: ${documentId}) by ${rejectedBy}. Reason: ${reason}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log document generation
   */
  static async logDocumentGeneration(userId: string, documentId: string, documentType: string, generatedBy: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'DOCUMENT_GENERATION',
      details: `Document generated: ${documentType} (ID: ${documentId}) by ${generatedBy}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log user role change
   */
  static async logRoleChange(userId: string, oldRole: string, newRole: string, changedBy: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'ROLE_CHANGE',
      details: `User role changed from ${oldRole} to ${newRole} by ${changedBy}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log user verification
   */
  static async logUserVerification(userId: string, userEmail: string, verifiedBy: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'USER_VERIFICATION',
      details: `User verified: ${userEmail} by ${verifiedBy}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log password reset
   */
  static async logPasswordReset(userId: string, userEmail: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'PASSWORD_RESET',
      details: `Password reset requested for: ${userEmail}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log system access
   */
  static async logSystemAccess(userId: string, module: string, action: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'SYSTEM_ACCESS',
      details: `Accessed ${module}: ${action}`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log data export
   */
  static async logDataExport(userId: string, exportType: string, recordCount: number, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'DATA_EXPORT',
      details: `Exported ${exportType}: ${recordCount} records`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log data import
   */
  static async logDataImport(userId: string, importType: string, recordCount: number, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'DATA_IMPORT',
      details: `Imported ${importType}: ${recordCount} records`,
      ipAddress,
      userAgent,
    })
  }

  /**
   * Log document status change
   */
  static async logDocumentStatusChange(userId: string, documentId: string, documentType: string, oldStatus: string, newStatus: string, changedBy: string, reason?: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'DOCUMENT_STATUS_CHANGE',
      details: `Document status changed from "${oldStatus}" to "${newStatus}" for ${documentType} (ID: ${documentId}) by ${changedBy}${reason ? `. Reason: ${reason}` : ''}`,
      ipAddress,
      userAgent,
    })
  }
}

/**
 * Helper function to get client IP address from request
 */
export function getClientIP(req: Request): string | undefined {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIP = req.headers.get('x-real-ip')
  const clientIP = req.headers.get('x-client-ip')
  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  
  // Check various headers in order of preference
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (clientIP) {
    return clientIP
  }
  
  // For local development, try to get more meaningful info
  const userAgent = req.headers.get('user-agent') || ''
  if (userAgent.includes('localhost') || userAgent.includes('127.0.0.1')) {
    return 'localhost'
  }
  
  return undefined
}

/**
 * Helper function to get user agent from request
 */
export function getUserAgent(req: Request): string | undefined {
  return req.headers.get('user-agent') || undefined
}
