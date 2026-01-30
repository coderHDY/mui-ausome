/**
 * ProfileContent Component
 * 
 * Composition of user info and logout button
 */

import { Box, Divider } from '@mui/material';
import { UserInfo } from './UserInfo';
import { LogoutButton } from './LogoutButton';
import type { User } from '../types/profile';

interface ProfileContentProps {
  user: User;
}

/**
 * Renders user info and logout button with spacing
 */
export function ProfileContent({ user }: ProfileContentProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <UserInfo user={user} />
      <Divider />
      <LogoutButton />
    </Box>
  );
}
