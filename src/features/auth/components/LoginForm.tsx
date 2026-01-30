/**
 * Login form component
 * Extends AuthForm with login-specific logic
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { AuthForm } from './AuthForm';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

/**
 * LoginForm component
 * Handles user authentication with generic error messages for security
 * Features:
 * - Generic error messages (no user enumeration)
 * - Redirect to saved location after login
 * - Navigation to registration page
 */
export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, redirectTo }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error } = useLogin();
  const { setUser } = useAuth();
  const [message, setMessage] = useState('');

  // Get redirect URL from props or query params
  const finalRedirectTo = redirectTo || searchParams.get('redirect') || '/';

  useEffect(() => {
    // Check if there's a success message from registration
    const state = (location as any).state;
    if (state?.message) {
      setMessage(state.message);
      setTimeout(() => setMessage(''), 5000);
    }
  }, []);

  const handleSubmit = async (username: string, password: string) => {
    // Basic validation: ensure fields are not empty
    if (!username || !password) {
      // Server will handle full validation
      return;
    }

    const result = await login(username, password);

    if (result.success && result.user) {
      // Store user data in localStorage and state
      setUser(result.user);
      onSuccess?.();
      // Redirect to original location or dashboard
      navigate(finalRedirectTo);
    }
  };

  return (
    <Box>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <AuthForm
        title="Sign In"
        submitButtonText="Login"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error || undefined}
        showFieldValidation={false}
      >
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <span style={{ marginRight: '0.5rem' }}>Don't have an account?</span>
          <Link to="/auth/register" style={{ textDecoration: 'none' }}>
            <strong>Sign up</strong>
          </Link>
        </Box>
      </AuthForm>
    </Box>
  );
};

export default LoginForm;
