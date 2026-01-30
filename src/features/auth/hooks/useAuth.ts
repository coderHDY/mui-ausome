/**
 * Hook for managing authentication state and session
 */

import { useState, useEffect } from 'react';
import { User } from '../types/auth';

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const USER_STORAGE_KEY = 'auth_user';

/**
 * useAuth hook
 * Manages authentication state by reading from localStorage
 * Session validity is verified via HTTP-only cookie (connect.sid) sent by browser
 * Backend will reject requests without valid cookie
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage (set after successful login/register)
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Invalid JSON, clear storage
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const updateUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    setUser: updateUser,
  };
}

export default useAuth;
