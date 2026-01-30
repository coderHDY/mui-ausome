# Quick Start Guide: User Profile Page with Logout

**Purpose**: Step-by-step development guide for implementing profile feature  
**Audience**: Frontend developers implementing this feature  
**Duration**: ~4-6 hours (including tests)

---

## Pre-Implementation Checklist

- [ ] Feature branch `002-profile-page` is active
- [ ] Latest spec, plan, research reviewed
- [ ] Backend logout.md API documented and accessible
- [ ] Vite development server running (`npm run dev`)
- [ ] 001-user-auth feature already implemented and working
- [ ] Can successfully login/register in the application

---

## Architecture Overview

```
Profile Feature
├── Components
│   ├── ProfileCard        (layout + user display)
│   ├── UserInfo           (pure display)
│   ├── LogoutButton       (logout action)
│   └── ProfilePage        (route-level container)
├── Services
│   └── logoutService      (API communication)
├── Hooks
│   └── useLogout          (mutation state)
└── Types
    └── profile.ts         (TypeScript interfaces)
```

**Data Flow**:
```
ProfilePage
├─ useAuth()
├─ useLogout()
└─ render:
   ├─ ProfileCard
   │  └─ UserInfo (from useAuth)
   └─ LogoutButton (from useLogout)
```

---

## Step 1: Setup (30 minutes)

### 1.1 Create Directory Structure

```bash
# From repository root
mkdir -p src/features/profile/{components,pages,services,types,hooks,__tests__}
touch src/features/profile/index.ts
```

### 1.2 Create Type Definitions

**File**: `src/features/profile/types/profile.ts`

```typescript
/**
 * Profile feature types
 */
export interface User {
  id: string;
  username: string;
}

export interface LogoutState {
  isLoading: boolean;
  error: string | null;
}
```

### 1.3 Create Index Exports

**File**: `src/features/profile/index.ts`

```typescript
/**
 * Profile feature public API
 */
export { ProfilePage } from './pages/ProfilePage';
export { useLogout } from './hooks/useLogout';
export type { User, LogoutState } from './types/profile';
```

---

## Step 2: Implement Logout Service (45 minutes)

### 2.1 Create Logout Service

**File**: `src/features/profile/services/logoutService.ts`

```typescript
import {
  LOGOUT_ENDPOINT,
  createLogoutRequest,
  LogoutResponse,
  isLogoutSuccess,
  LOGOUT_ERROR_MESSAGES,
} from '@specs/002-profile-page/contracts';

/**
 * Call logout API endpoint
 * @throws Error on network failure or server error
 * @returns true if logout successful
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(LOGOUT_ENDPOINT, createLogoutRequest());

    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.status}`);
    }

    const data: LogoutResponse = await response.json();

    if (isLogoutSuccess(data)) {
      return true;
    } else {
      const errorMsg = LOGOUT_ERROR_MESSAGES[data.error] || data.message;
      throw new Error(errorMsg);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during logout');
  }
}
```

### 2.2 Test Logout Service

Create `src/features/profile/__tests__/logoutService.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logout } from '../services/logoutService';

describe('logoutService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully logout when API returns success', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: '登出成功' }),
    });

    const result = await logout();
    expect(result).toBe(true);
  });

  it('should throw error when API fails', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(logout()).rejects.toThrow();
  });
});
```

---

## Step 3: Implement Logout Hook (45 minutes)

### 3.1 Create useLogout Hook

**File**: `src/features/profile/hooks/useLogout.ts`

```typescript
import { useState, useCallback } from 'react';
import { logout as callLogoutAPI } from '../services/logoutService';
import { LogoutState } from '../types/profile';

/**
 * useLogout hook
 * Manages logout API call and error state
 */
export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await callLogoutAPI();
      return true; // Success - caller should redirect
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMsg);
      return false; // Failure - error displayed
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, logout };
}

export default useLogout;
```

### 3.2 Add to Hook Exports

**File**: `src/features/profile/hooks/index.ts`

```typescript
export { useLogout } from './useLogout';
```

---

## Step 4: Implement Components (90 minutes)

### 4.1 UserInfo Component (Pure Display)

**File**: `src/features/profile/components/UserInfo.tsx`

```typescript
import React from 'react';
import { Box, Typography } from '@mui/material';
import { User } from '../types/profile';

interface UserInfoProps {
  user: User;
}

/**
 * Pure presentational component displaying user information
 */
export const UserInfo: React.FC<UserInfoProps> = ({ user }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" color="textSecondary" gutterBottom>
      User Information
    </Typography>
    <Box sx={{ pl: 2 }}>
      <Typography>
        <strong>Username:</strong> {user.username}
      </Typography>
      <Typography>
        <strong>ID:</strong> {user.id}
      </Typography>
    </Box>
  </Box>
);

export default UserInfo;
```

### 4.2 LogoutButton Component

**File**: `src/features/profile/components/LogoutButton.tsx`

```typescript
import React from 'react';
import { Button, Alert, Box } from '@mui/material';
import { useLogout } from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';

/**
 * LogoutButton component
 * Handles logout action with error recovery
 */
export const LogoutButton: React.FC = () => {
  const { logout, isLoading, error } = useLogout();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      // Clear user state
      setUser(null);
      // Redirect to login
      navigate('/auth/login');
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    </Box>
  );
};

export default LogoutButton;
```

### 4.3 ProfileCard Component

**File**: `src/features/profile/components/ProfileCard.tsx`

```typescript
import React from 'react';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';
import { User } from '../types/profile';
import { UserInfo } from './UserInfo';
import { LogoutButton } from './LogoutButton';

interface ProfileCardProps {
  user: User;
}

/**
 * ProfileCard component
 * Layout container for profile information and logout
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => (
  <Card>
    <CardHeader title="My Profile" />
    <Divider />
    <CardContent>
      <UserInfo user={user} />
      <LogoutButton />
    </CardContent>
  </Card>
);

export default ProfileCard;
```

### 4.4 Components Index

**File**: `src/features/profile/components/index.ts`

```typescript
export { ProfileCard } from './ProfileCard';
export { UserInfo } from './UserInfo';
export { LogoutButton } from './LogoutButton';
```

---

## Step 5: Implement Page Component (45 minutes)

### 5.1 ProfilePage Component

**File**: `src/features/profile/pages/ProfilePage.tsx`

```typescript
import React from 'react';
import { Container, Box, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '@features/auth/hooks/useAuth';
import { ProfileCard } from '../components/ProfileCard';

/**
 * ProfilePage component
 * Protected page showing user profile and logout
 */
export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">No user data found. Please log in again.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <ProfileCard user={user} />
      </Box>
    </Container>
  );
};

export default ProfilePage;
```

### 5.2 Pages Index

**File**: `src/features/profile/pages/index.ts`

```typescript
export { ProfilePage } from './ProfilePage';
```

---

## Step 6: Integrate with App Router (30 minutes)

### 6.1 Add Route to App.tsx

Find the routing section and add:

```typescript
import { ProfilePage } from '@features/profile/pages/ProfilePage';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';

// In your route definitions:
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

---

## Step 7: Update Sidebar Navigation (30 minutes)

### 7.1 Modify NavigationMenu

Open `src/shared/components/NavigationMenu.tsx` and add profile link at bottom:

```typescript
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@features/auth/hooks/useAuth';

// In NavigationMenu component:
const { isAuthenticated } = useAuth();

// In menu items, add at the end:
{isAuthenticated && (
  <MenuItem component={RouterLink} to="/profile">
    My Profile
  </MenuItem>
)}
```

---

## Step 8: Testing (90 minutes)

### 8.1 Component Tests

Create `src/features/profile/__tests__/ProfileCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { ProfileCard } from '../components/ProfileCard';

describe('ProfileCard', () => {
  it('should display user information', () => {
    const user = { id: '1', username: 'testuser' };
    render(<ProfileCard user={user} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
```

### 8.2 Manual Testing Checklist

- [ ] Navigate to `/profile` → See user information
- [ ] Click "Logout" button → API called, user redirected to login
- [ ] Try logout with network offline → Error message shows, retry works
- [ ] "My Profile" link visible in sidebar when authenticated
- [ ] "My Profile" link not visible when not authenticated
- [ ] After logout, cannot access `/profile` (redirected to login)

---

## Common Issues & Solutions

### Issue: "useAuth is undefined"
**Solution**: Ensure 001-user-auth is fully implemented. Import from `@features/auth/hooks/useAuth`.

### Issue: Logout succeeds but redirect doesn't happen
**Solution**: Check that `setUser(null)` is called before navigate. May need slight delay: `setTimeout(() => navigate(...), 100)`.

### Issue: localStorage not cleared after logout
**Solution**: Verify useAuth.setUser() implementation clears localStorage.

### Issue: Button stays disabled after logout error
**Solution**: Ensure error handler calls `setIsLoading(false)` in finally block.

---

## Performance Optimization Tips

1. **Memoize UserInfo component** (pure display):
   ```typescript
   export const UserInfo = React.memo(UserInfoComponent);
   ```

2. **Debounce logout retries** - prevent rapid API calls
3. **Cache fetch result** - don't re-fetch on component remount

---

## Summary

After completing all steps:
- ✅ 1 profile page with protected route
- ✅ 3-4 reusable components
- ✅ Logout service with error handling
- ✅ Sidebar integration
- ✅ Full test coverage
- ✅ ~300-400 lines of code

**Total time estimate**: 4-6 hours (varies by experience level)

---

## Next Steps

After implementation:
1. Run tests: `npm run type-check && npm run lint`
2. Manual testing in browser
3. Review with team
4. Merge to main branch

---

## Reference Materials

- [Logout API Spec](https://github.com/coderHDY/speckit-awsome/blob/main/doc/logout.md)
- [Project Constitution](../../.specify/memory/constitution.md)
- [001-user-auth Feature](../001-user-auth/spec.md)
- [React Router Docs](https://reactrouter.com/)
- [Material-UI Documentation](https://mui.com/)
