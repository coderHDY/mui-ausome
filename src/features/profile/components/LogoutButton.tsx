/**
 * LogoutButton Component
 * 
 * Button for logging out with error handling
 */

import { Button, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuth } from '@features/auth/hooks/useAuth';

/**
 * Logout button with error display
 * Calls API, clears session, and redirects to login
 */
export function LogoutButton() {
  const { isLoading, error, logout } = useLogout();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Clear user from state
      setUser(null);
      // Redirect to login
      navigate('/auth/login');
    } catch (err) {
      // Error is already captured in useLogout state
      // Display via error Alert below
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleLogout}
        disabled={isLoading}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    </Box>
  );
}
