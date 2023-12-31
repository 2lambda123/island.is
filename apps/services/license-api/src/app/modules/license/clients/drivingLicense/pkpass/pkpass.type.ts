export interface PkPassServiceTokenResponse {
  status?: number
  message?: string
  data?: {
    ACCESS_TOKEN: string
    GENERATED_ON: {
      date: string
      timezone_type: number
      timezone: string
    }
    EXPIRED_ON: string
  }
}

export interface PkPassServiceDriversLicenseResponse {
  message: string
  data?: {
    pass_url: string
    pass_qrcode: string
  }
  status: number
}

/**
 * Driving licenses are verified against SmartSolution API
 * https://app.gitbook.com/@smartsolutions/s/smart-solutions-drivers-license/verify-drivers-license
 */

export type PkPassServiceVerifyDriversLicenseStatusCode =
  /** License OK */
  | 1
  /** License expired */
  | 2
  /** No license info found */
  | 3
  /** Request contains some field errors */
  | 4
  /** Unknown error */
  | 99

/** Data for a response with errors */
export interface PkPassServiceErrorResponse {
  message?: string
  status?: PkPassServiceVerifyDriversLicenseStatusCode
  data?: unknown
}

/** Data for a successful response */
export interface PkPassServiceVerifyDriversLicenseResponse {
  message: string
  data?: {
    kennitala?: string
  }
  status: PkPassServiceVerifyDriversLicenseStatusCode
}

/** Wrapper for error passed along to clients */
export interface PkPassVerifyError {
  /**
   * HTTP status code from the service.
   * Needed while `status` was always the same, use `serviceError.status` for
   * error reported by API.
   */
  statusCode: number
  serviceError?: PkPassServiceErrorResponse
}

/** Wrapper for data passed along to clients */
export interface PkPassVerifyResult {
  valid: boolean
  error?: PkPassVerifyError
  nationalId?: string
}
