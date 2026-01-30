/**
 * Authentication-related TypeScript type definitions
 */

/**
 * Authenticated user data
 */
export interface User {
  id: string;
  username: string;
}

/**
 * Result of authentication operations (login/register)
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  errorCode?: string;
}

/**
 * Validation error for a specific field
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * API response for authentication endpoints
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    username: string;
  };
  error?: string;
}

/**
 * Error codes from backend API
 */
export enum ErrorCode {
  MISSING_FIELDS = 'MISSING_FIELDS',
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  MISSING_CREDENTIALS = 'MISSING_CREDENTIALS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
