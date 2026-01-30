/**
 * Registration page
 * Displays registration form in a card layout
 */

import React from 'react';
import { Container, Card, Box } from '@mui/material';
import { RegisterForm } from '../components/RegisterForm';

/**
 * RegisterPage component
 * Self-contained page for user registration
 * Features responsive design and Material-UI theming
 */
export const RegisterPage: React.FC = () => {
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
          <RegisterForm />
        </Card>
      </Container>
    </Box>
  );
};

export default RegisterPage;
