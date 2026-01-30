/**
 * Logout API Contract
 * 
 * Based on: https://github.com/coderHDY/speckit-awsome/blob/main/doc/logout.md
 * Endpoint: POST /auth/logout
 */

/**
 * Logout request - empty body, session validated via HTTP-only cookie
 */
export interface LogoutRequest {
  // Body is empty - session is in HTTP-only cookie sent automatically
}

/**
 * Logout success response
 */
export interface LogoutSuccessResponse {
  success: true;
  message: '登出成功';
}

/**
 * Logout error response
 */
export interface LogoutErrorResponse {
  success: false;
  message: string;  // e.g., "服务器内部错误"
  error: 'SESSION_DESTROY_ERROR' | 'INTERNAL_ERROR';
}

/**
 * Logout response union type
 */
export type LogoutResponse = LogoutSuccessResponse | LogoutErrorResponse;

/**
 * Logout error codes
 */
export enum LogoutErrorCode {
  SESSION_DESTROY_ERROR = 'SESSION_DESTROY_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * Logout error message mapping
 */
export const LOGOUT_ERROR_MESSAGES: Record<LogoutErrorCode, string> = {
  [LogoutErrorCode.SESSION_DESTROY_ERROR]: 'Failed to end session. Please try again.',
  [LogoutErrorCode.INTERNAL_ERROR]: 'Server error. Please try again later.',
};

/**
 * Generic error responses
 */
export interface NetworkError {
  success: false;
  message: string;
  error: 'NETWORK_ERROR' | 'TIMEOUT_ERROR';
}

/**
 * Logout mutation context
 */
export interface UseLogoutResult {
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

/**
 * API Configuration
 * Development: Uses Vite proxy at /api
 * Production: Uses VITE_API_URL environment variable
 */
export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const LOGOUT_ENDPOINT = `${API_BASE_URL}/api/auth/logout`;

/**
 * Logout request builder
 */
export function createLogoutRequest(): RequestInit {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Send HTTP-only cookie
    body: JSON.stringify({} as LogoutRequest),
  };
}

/**
 * Type guard: Check if response is successful logout
 */
export function isLogoutSuccess(response: LogoutResponse): response is LogoutSuccessResponse {
  return response.success === true;
}

/**
 * Type guard: Check if response is logout error
 */
export function isLogoutError(response: LogoutResponse): response is LogoutErrorResponse {
  return response.success === false;
}
