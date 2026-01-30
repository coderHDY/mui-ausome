/**
 * ProfileCard Component
 * 
 * Card layout wrapper for profile information
 */

import { Card, CardHeader, CardContent } from '@mui/material';
import { UserInfo } from './UserInfo';
import type { User } from '../types/profile';

interface ProfileCardProps {
  user: User;
}

/**
 * Material-UI Card layout for profile display
 */
export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader title="My Profile" />
      <CardContent>
        <UserInfo user={user} />
      </CardContent>
    </Card>
  );
}
