// Re-export all contracts for easier importing
export * from './register';
export * from './login';

/**
 * Common API Response Structure
 * All endpoints return this structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * API Error Codes (Shared across endpoints)
 */
export enum ApiErrorCode {
  MISSING_FIELDS = 'MISSING_FIELDS',
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  MISSING_CREDENTIALS = 'MISSING_CREDENTIALS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

/**
 * HTTP Status Code Reference
 * 
 * 200 OK - Request successful
 * 201 Created - Resource created successfully (registration)
 * 400 Bad Request - Invalid input, validation failure
 * 401 Unauthorized - Authentication failed
 * 409 Conflict - Resource conflict (username exists)
 * 500 Internal Server Error - Server error
 */

/**
 * API Base URL Configuration
 * Development: http://localhost:3000 (via Vite proxy at /api)
 * Production: Environment variable VITE_API_URL
 */
export const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

/**
 * Auth Endpoints
 */
export const AUTH_ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login'
} as const;
