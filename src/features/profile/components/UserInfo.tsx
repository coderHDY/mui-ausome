/**
 * UserInfo Component
 * 
 * Pure display component for user information
 */

import { Typography, Box } from '@mui/material';
import type { User } from '../types/profile';

interface UserInfoProps {
  user: User;
}

/**
 * Display user ID and username
 * Pure component - no state or API calls
 */
export function UserInfo({ user }: UserInfoProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          Username:
        </Typography>
        <Typography variant="body1">{user.username}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          ID:
        </Typography>
        <Typography variant="body1">{user.id}</Typography>
      </Box>
    </Box>
  );
}
