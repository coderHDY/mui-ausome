/**
 * Logout Service
 * 
 * Handles logout API calls to POST /api/auth/logout
 */

import {
  LOGOUT_ENDPOINT,
  isLogoutSuccess,
  LOGOUT_ERROR_MESSAGES,
  createLogoutRequest,
  type LogoutResponse,
} from '@specs/002-profile-page/contracts';

/**
 * Call logout API endpoint
 * 
 * @returns Promise<boolean> - true if logout successful, false otherwise
 * @throws Error - Throws error message on failure
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(LOGOUT_ENDPOINT, createLogoutRequest());

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LogoutResponse = await response.json();

    if (isLogoutSuccess(data)) {
      return true;
    }

    // Handle error response
    const errorMessage = LOGOUT_ERROR_MESSAGES[data.error] || data.message;
    throw new Error(errorMessage);
  } catch (error) {
    // Re-throw with proper error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Logout failed: Unknown error');
  }
}
