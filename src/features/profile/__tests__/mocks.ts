/**
 * Test Mocks for Profile Feature
 * 
 * Provides mock responses and utilities for testing
 */

// Note: vitest imports will be added when tests are created
// import { vi } from 'vitest';
import type { LogoutSuccessResponse, LogoutErrorResponse } from '@specs/002-profile-page/contracts';

/**
 * Mock successful logout response
 */
export const mockSuccessLogoutResponse: LogoutSuccessResponse = {
  success: true,
  message: '登出成功',
};

/**
 * Mock error logout response - session error
 */
export const mockSessionErrorResponse: LogoutErrorResponse = {
  success: false,
  message: 'Failed to end session. Please try again.',
  error: 'SESSION_DESTROY_ERROR',
};

/**
 * Mock error logout response - server error
 */
export const mockServerErrorResponse: LogoutErrorResponse = {
  success: false,
  message: 'Server error. Please try again later.',
  error: 'INTERNAL_ERROR',
};

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 'user-123',
  username: 'testuser',
};
