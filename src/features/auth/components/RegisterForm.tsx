/**
 * Registration form component
 * Extends AuthForm with registration-specific logic
 */

import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { AuthForm } from './AuthForm';
import { useRegister } from '../hooks/useRegister';
import { useAuth } from '../hooks/useAuth';
import { validateAuthForm } from '../services/validators';

interface RegisterFormProps {
  onSuccess?: () => void;
}

/**
 * RegisterForm component
 * Handles user registration with validation and error handling
 * Features:
 * - Real-time field validation
 * - Generic and field-specific error messages
 * - Success confirmation
 * - Navigation to login page
 */
export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { register, isLoading, error: submitError } = useRegister();
  const { setUser } = useAuth();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (username: string, password: string) => {
      // Final validation before submission
      const validation = validateAuthForm(username, password);
      if (!validation.valid) {
        setFieldErrors(validation.errors);
        return;
      }

      const result = await register(username, password);

      if (result.success && result.user) {
        // Store user data in localStorage and state
        setUser(result.user);
        setSuccess(true);
        setFieldErrors({});

        // Clear form and redirect after a brief delay
        setTimeout(() => {
          onSuccess?.();
          navigate('/auth/login', {
            state: { message: 'Registration successful! Please login with your credentials.' },
          });
        }, 1500);
      }
    },
    [register, navigate, onSuccess, setUser]
  );

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 2, textAlign: 'center' }}>
          Registration successful! Redirecting to login...
        </Alert>
      )}

      <AuthForm
        title="Create Account"
        submitButtonText="Sign Up"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={submitError || undefined}
        fieldErrors={fieldErrors}
        showFieldValidation={Object.keys(fieldErrors).length > 0}
      >
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <span style={{ marginRight: '0.5rem' }}>Already have an account?</span>
          <Link to="/auth/login" style={{ textDecoration: 'none' }}>
            <strong>Login</strong>
          </Link>
        </Box>
      </AuthForm>
    </Box>
  );
};

export default RegisterForm;
