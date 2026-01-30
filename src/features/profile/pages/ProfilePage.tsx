/**
 * Profile Page
 * 
 * Displays authenticated user's profile information
 * Wrapped with ProtectedRoute in App.tsx
 */

import { useAuth } from '@features/auth/hooks/useAuth';
import { Container, CircularProgress, Box, Alert } from '@mui/material';
import { ProfileCard } from '../components/ProfileCard';
import { ProfileContent } from '../components/ProfileContent';

/**
 * Page component displaying user profile
 * Shows loading spinner while fetching user data
 * Shows error message if user data is unavailable
 */
export function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">Unable to load profile. Please log in again.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 3, boxShadow: 1 }}>
        <ProfileContent user={user} />
      </Box>
    </Container>
  );
}
