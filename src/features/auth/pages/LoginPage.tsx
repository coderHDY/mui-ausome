/**
 * Login page
 * Displays login form in a card layout
 */

import React from 'react';
import { Container, Card, Box } from '@mui/material';
import { LoginForm } from '../components/LoginForm';

/**
 * LoginPage component
 * Self-contained page for user authentication
 * Features responsive design and Material-UI theming
 */
export const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <LoginForm />
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
