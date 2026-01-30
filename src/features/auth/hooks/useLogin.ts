/**
 * Hook for login mutation
 * Manages login form state and API calls
 */

import { useState, useCallback } from 'react';
import { AuthResult } from '../types/auth';
import { login as loginUser } from '../services/authService';

interface UseLoginResult {
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<AuthResult>;
}

/**
 * useLogin hook
 * Handles user authentication with loading and error states
 * Returns generic error message for security (no user enumeration)
 */
export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(username, password);

      if (result.success) {
        return {
          success: true,
          user: result.data ? { id: result.data.id, username: result.data.username } : undefined,
        };
      } else {
        // Always show generic error for login (security)
        const errorMsg = 'Invalid username or password';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, login };
}

export default useLogin;
