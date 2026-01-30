/**
 * Hook for registration mutation
 * Manages registration form state and API calls
 */

import { useState, useCallback } from 'react';
import { AuthResult } from '../types/auth';
import { register as registerUser } from '../services/authService';

interface UseRegisterResult {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  register: (username: string, password: string) => Promise<AuthResult>;
}

/**
 * useRegister hook
 * Handles user registration with loading and error states
 */
export function useRegister(): UseRegisterResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = useCallback(
    async (username: string, password: string): Promise<AuthResult> => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await registerUser(username, password);

        if (result.success) {
          setSuccess(true);
          return {
            success: true,
            user: result.data ? { id: result.data.id, username: result.data.username } : undefined,
          };
        } else {
          const errorMsg = result.message || 'Registration failed';
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
    },
    []
  );

  return { isLoading, error, success, register };
}

export default useRegister;
