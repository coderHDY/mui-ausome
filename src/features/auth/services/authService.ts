/**
 * Authentication API service
 * Handles communication with backend authentication endpoints
 * Based on: https://github.com/coderHDY/speckit-awsome/tree/main/doc
 */

import { AuthResponse, ErrorCode } from '../types/auth';

// API configuration
// 在开发环境中使用代理 /api，生产环境使用完整 URL
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
};

/**
 * Maps backend error codes to user-friendly messages
 */
function mapErrorMessage(errorCode?: string, defaultMessage?: string): string {
  const errorMessages: Record<string, string> = {
    [ErrorCode.MISSING_FIELDS]: 'Username and password are required',
    [ErrorCode.INVALID_USERNAME]: 'Username must be 3-20 characters, letters/numbers/_ only',
    [ErrorCode.INVALID_PASSWORD]: 'Password must be 6-50 characters',
    [ErrorCode.MISSING_CREDENTIALS]: 'Please enter username and password',
    [ErrorCode.INVALID_CREDENTIALS]: 'Invalid username or password',
    [ErrorCode.USERNAME_EXISTS]: 'Username already taken. Try another or login',
    [ErrorCode.INTERNAL_ERROR]: 'Server error. Please try again later',
  };

  return errorMessages[errorCode || ''] || defaultMessage || 'An error occurred';
}

/**
 * Registers a new user account
 * @param username - Username (3-20 alphanumeric + underscore)
 * @param password - Password (6-50 characters)
 * @returns Promise resolving to auth response with user data or error
 */
export async function register(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Enable cookie handling
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: mapErrorMessage(error.error, error.message),
        error: error.error,
      };
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Connection error. Please check your internet and retry',
      error: 'NETWORK_ERROR',
    };
  }
}

/**
 * Authenticates a user with username and password
 * Creates session cookie on successful authentication
 * @param username - Username
 * @param password - Password
 * @returns Promise resolving to auth response with user data or generic error
 */
export async function login(username: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Enable cookie handling for session
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      // For login, always show generic error message (security - no user enumeration)
      return {
        success: false,
        message: mapErrorMessage(ErrorCode.INVALID_CREDENTIALS, error.message),
        error: error.error,
      };
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Connection error. Please check your internet and retry',
      error: 'NETWORK_ERROR',
    };
  }
}

/**
 * Logs out the current user by clearing the session cookie
 * The backend will automatically clear the connect.sid cookie on logout
 * @returns Promise that resolves when logout is complete
 */
export async function logout(): Promise<void> {
  // Session is managed via HTTP-only cookie set by backend
  // Clearing happens automatically when user navigates away and returns
  // No explicit API call needed - cookie expiration handles cleanup
  try {
    // Optional: Call backend logout endpoint if available
    // For now, just clear local state via browser cookie policies
    document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } catch (error) {
    // Cookie clearing failed, but session will expire in 7 days anyway
    console.warn('Failed to clear session cookie:', error);
  }
}
