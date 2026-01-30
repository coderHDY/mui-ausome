/**
 * Error display component for authentication forms
 * Shows validation errors and submission errors
 */

import React from 'react';
import { Alert, Box, Stack } from '@mui/material';

interface AuthErrorProps {
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * AuthError component
 * Displays submission errors and field-level validation errors
 */
export const AuthError: React.FC<AuthErrorProps> = ({ error, fieldErrors = {} }) => {
  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  if (!error && !hasFieldErrors) {
    return null;
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: hasFieldErrors ? 1 : 0 }}>
          {error}
        </Alert>
      )}

      {hasFieldErrors && (
        <Stack spacing={0.5}>
          {Object.entries(fieldErrors).map(([field, message]) => (
            <Alert key={field} severity="warning" sx={{ py: 0.5 }}>
              {message}
            </Alert>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default AuthError;
