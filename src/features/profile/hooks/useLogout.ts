/**
 * useLogout Hook
 * 
 * Manages logout state and mutation
 */

import { useCallback, useState } from 'react';
import { logout } from '../services/logoutService';
import type { LogoutState } from '../types/profile';

/**
 * Hook for logout mutation with loading and error state
 * 
 * @returns Object with isLoading, error, and logout function
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    logout: performLogout,
  };
}
