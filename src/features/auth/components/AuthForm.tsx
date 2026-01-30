/**
 * Base authentication form component
 * Reusable form for registration and login with common fields
 */

import React from 'react';
import {
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';

interface AuthFormProps {
  title?: string;
  submitButtonText?: string;
  onSubmit: (username: string, password: string) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  showFieldValidation?: boolean;
  children?: React.ReactNode;
}

/**
 * AuthForm component
 * Base form with username and password fields
 * Can be extended by RegisterForm and LoginForm
 */
export const AuthForm = React.forwardRef<HTMLFormElement, AuthFormProps>(
  (
    {
      title = 'Authentication',
      submitButtonText = 'Submit',
      onSubmit,
      isLoading = false,
      error,
      fieldErrors = {},
      showFieldValidation = false,
      children,
    },
    ref
  ) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await onSubmit(username, password);
    };

    const usernameError = fieldErrors.username || '';
    const passwordError = fieldErrors.password || '';

    return (
      <Box
        component="form"
        ref={ref}
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: '400px',
          mx: 'auto',
          p: 2,
        }}
      >
        {title && (
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: 0 }}>
            {title}
          </h2>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => {
              // Validation will be handled by parent component
            }}
            disabled={isLoading}
            fullWidth
            error={!!usernameError && showFieldValidation}
            helperText={showFieldValidation ? usernameError : ''}
            autoComplete="username"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              // Validation will be handled by parent component
            }}
            disabled={isLoading}
            fullWidth
            error={!!passwordError && showFieldValidation}
            helperText={showFieldValidation ? passwordError : ''}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ py: 1.5, position: 'relative' }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', ml: -1.2 }} />
                <span style={{ opacity: 0 }}>{submitButtonText}</span>
              </>
            ) : (
              submitButtonText
            )}
          </Button>

          {children}
        </Stack>
      </Box>
    );
  }
);

AuthForm.displayName = 'AuthForm';

export default AuthForm;
