/**
 * Mock utilities for testing authentication features
 * Provides mock implementations of authService with various scenarios
 */

import { AuthResponse } from '../types/auth';

/**
 * Mock successful registration response
 */
export const mockSuccessfulRegistration = (username = 'testuser'): AuthResponse => ({
  success: true,
  message: 'Registration successful. You can now login.',
  data: {
    id: 'test-user-id-123',
    username,
  },
});

/**
 * Mock successful login response
 */
export const mockSuccessfulLogin = (username = 'testuser'): AuthResponse => ({
  success: true,
  message: 'Login successful',
  data: {
    id: 'test-user-id-123',
    username,
  },
});

/**
 * Mock error response - username already exists
 */
export const mockUsernameExistsError = (): AuthResponse => ({
  success: false,
  message: 'Username already taken. Try another or login',
  error: 'USERNAME_EXISTS',
});

/**
 * Mock error response - invalid credentials
 */
export const mockInvalidCredentialsError = (): AuthResponse => ({
  success: false,
  message: 'Invalid username or password',
  error: 'INVALID_CREDENTIALS',
});

/**
 * Mock error response - invalid username format
 */
export const mockInvalidUsernameError = (): AuthResponse => ({
  success: false,
  message: 'Username must be 3-20 characters, letters/numbers/_ only',
  error: 'INVALID_USERNAME',
});

/**
 * Mock error response - invalid password format
 */
export const mockInvalidPasswordError = (): AuthResponse => ({
  success: false,
  message: 'Password must be 6-50 characters',
  error: 'INVALID_PASSWORD',
});

/**
 * Mock error response - missing fields
 */
export const mockMissingFieldsError = (): AuthResponse => ({
  success: false,
  message: 'Username and password are required',
  error: 'MISSING_FIELDS',
});

/**
 * Mock error response - server error
 */
export const mockServerError = (): AuthResponse => ({
  success: false,
  message: 'Server error. Please try again later',
  error: 'INTERNAL_ERROR',
});

/**
 * Mock error response - network error
 */
export const mockNetworkError = (): AuthResponse => ({
  success: false,
  message: 'Connection error. Please check your internet and retry',
  error: 'NETWORK_ERROR',
});

/**
 * Create a mock authService for testing
 * Usage: const mockService = createMockAuthService()
 */
export function createMockAuthService() {
  return {
    register: async () => mockSuccessfulRegistration(),
    login: async () => mockSuccessfulLogin(),
    checkAuth: async () => ({
      authenticated: true,
      user: { id: 'test-id', username: 'testuser' },
    }),
  };
}
