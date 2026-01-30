/**
 * Profile Feature Type Definitions
 * 
 * Defines interfaces for user data and logout state management
 */

/**
 * Authenticated user information
 */
export interface User {
  id: string;
  username: string;
}

/**
 * Logout operation state
 */
export interface LogoutState {
  isLoading: boolean;
  error: string | null;
}
