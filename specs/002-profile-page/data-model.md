# Data Model: User Profile Page with Logout

**Phase**: 1 - Design & Contracts  
**Created**: 2026-01-30  
**Status**: Complete

---

## Core Entities

### User

Represents authenticated user information, populated from login/register response and cached in localStorage.

```typescript
interface User {
  id: string;              // Unique user identifier from backend
  username: string;        // Username (3-20 chars, alphanumeric + underscore)
}
```

**Lifecycle**:
- **Created**: After successful login or registration
- **Stored**: localStorage (key: "auth_user")
- **Accessed**: Profile page displays this data
- **Cleared**: After successful logout

**Validation Rules**:
- `id`: Non-empty string
- `username`: 3-20 characters, alphanumeric and underscore only

**Constraints**:
- Immutable during profile page session
- Only cleared by explicit logout action

---

### Session

Represents the authenticated session maintained by backend via HTTP-only cookie.

```typescript
interface Session {
  connect_sid: string;  // HTTP-only cookie (browser/backend managed)
  expiresAt: Date;      // 7 days from login
  isValid: boolean;      // Validated by server
}
```

**Lifecycle**:
- **Created**: After successful login (cookie automatically set by backend)
- **Managed**: Browser automatically includes in all requests
- **Destroyed**: Backend terminates session when `/auth/logout` called
- **Expired**: Automatically after 7 days

**Access Rules**:
- Frontend cannot read or modify (HTTP-only)
- Backend validates on every protected request
- Invalid session → API returns 401 → Frontend triggers re-auth

---

## Domain Models

### LogoutRequest

Request payload for logout API call.

```typescript
interface LogoutRequest {
  // Empty body - session validated via cookie
}
```

**Implementation**:
```typescript
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Send HTTP-only cookie
  body: JSON.stringify({})
});
```

---

### LogoutResponse

Response from logout API endpoint.

```typescript
interface LogoutResponse {
  success: boolean;        // true if logout successful
  message: string;         // "登出成功" or error description
  error?: string;          // Error code if success=false
}
```

**Success Case** (200 OK):
```json
{
  "success": true,
  "message": "登出成功"
}
```

**Error Cases**:
- SESSION_DESTROY_ERROR (500): Backend failed to destroy session
- INTERNAL_ERROR (500): Unexpected server error

---

### LogoutState

Component state for logout mutation and loading.

```typescript
interface LogoutState {
  isLoading: boolean;      // true while API call in progress
  error: string | null;    // Error message if logout failed
  isLoggedOut: boolean;    // true after successful logout
}
```

**Transitions**:
- Initial: `{ isLoading: false, error: null, isLoggedOut: false }`
- During call: `{ isLoading: true, error: null, isLoggedOut: false }`
- Success: `{ isLoading: false, error: null, isLoggedOut: true }` → redirect
- Error: `{ isLoading: false, error: "message", isLoggedOut: false }`

---

### AuthState

Represents the overall authentication state.

```typescript
interface AuthState {
  user: User | null;           // Logged-in user from localStorage
  isAuthenticated: boolean;    // !!user
  loading: boolean;            // Initial load from localStorage
  setUser: (user: User | null) => void;  // Update user and localStorage
}
```

**Used By**: Profile page, ProtectedRoute, NavigationMenu

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Profile Page Load                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ useAuth hook reads localStorage (if available)           │
│ Sets user state, isAuthenticated=true                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Display ProfileCard with User Info                       │
│ (username, id from user state)                           │
└─────────────────────────────────────────────────────────┘
                          ↓
                   [User clicks Logout]
                          ↓
┌─────────────────────────────────────────────────────────┐
│ LogoutButton disabled, loading spinner shown             │
│ POST /api/auth/logout (with credentials)                │
└─────────────────────────────────────────────────────────┘
                          ↓
                    ┌──────┴──────┐
                    ↓             ↓
              [Success]       [Error]
                    ↓             ↓
         ┌─────────────────┐  ┌──────────────────┐
         │ Clear localStorage   │ Show error msg  │
         │ setUser(null)    │  │ Enable button   │
         │ Redirect login   │  │ Allow retry     │
         └─────────────────┘  └──────────────────┘
```

---

## Component Data Requirements

### ProfilePage
- Consumes: `useAuth()` hook
- Passes to children: user, isAuthenticated
- Protected by: ProtectedRoute

### ProfileCard
- Receives: user (User), isLoading (boolean)
- Displays: User information in card format
- No state mutations

### UserInfo
- Receives: user (User)
- Displays: username, id, formatted user details
- Pure presentational component

### LogoutButton
- Receives: onLogout callback, disabled state
- State: isLoading, error
- Emits: logout request to API
- Updates: localStorage via useAuth.setUser()
- Triggers: navigation via useNavigate()

---

## Error Handling Model

```typescript
// Error response from backend
interface ErrorResponse {
  success: false;
  message: string;
  error: 'SESSION_DESTROY_ERROR' | 'INTERNAL_ERROR';
}

// Mapped to user-friendly message
const errorMessages: Record<string, string> = {
  'SESSION_DESTROY_ERROR': 'Failed to end session. Please try again.',
  'INTERNAL_ERROR': 'Server error. Please try again later.',
  'NETWORK_ERROR': 'Connection error. Please check your internet.',
  'TIMEOUT_ERROR': 'Request timeout. Please try again.',
};
```

---

## Validation Rules

### User Data
- `username`: Must match `/^[a-zA-Z0-9_]{3,20}$/` (enforced by backend)
- `id`: Non-empty string, typically numeric or UUID

### Logout Request
- Must include valid session cookie (automatic via credentials: 'include')
- Body must be JSON (empty object)

### Logout Response
- `success`: Required boolean
- `message`: Required string
- `error`: Optional string, present only if success=false

---

## Data Persistence

| Data | Location | Lifecycle |
|------|----------|-----------|
| User info | localStorage | Set on login, cleared on logout |
| Session cookie | HTTP-only cookie | Set on login, cleared by backend on logout |
| UI state (loading, error) | Component state | Temporary, reset on unmount |

---

## Integration Points

### With 001-user-auth
- Reuses: `useAuth` hook, `User` type, `ProtectedRoute`
- Data source: localStorage populated by login/register

### With design-system
- Uses: Material-UI components, theme tokens
- No custom data structures

### With shared components
- Modifies: NavigationMenu (adds profile link)
- Reuses: AppLayout wrapper

---

## Assumptions

1. localStorage is available and persistent
2. User data in localStorage is always consistent with backend state
3. HTTP-only cookies managed entirely by browser
4. Session expiration handled by backend (7 days)
5. No user data changes occur while viewing profile (read-only view)

---

## Future Extensibility

**Profile Information** (out of scope for this feature):
- Email address
- Account creation date
- Last login timestamp
- Activity log

**Profile Editing** (out of scope):
- Change username
- Change password
- Update profile picture
- Two-factor authentication settings

These can be added as separate features without modifying current data model.

---

## Summary

Profile feature uses minimal data model:
- **User**: Already exists, cached in localStorage
- **Session**: Managed by backend via HTTP-only cookies
- **LogoutState**: Local component state, no persistence
- **Error handling**: Maps backend errors to user-friendly messages

Clean separation between user display (read-only) and session management (backend-driven) with simple localStorage as the source of truth.

**Phase 1 Data Model Complete**: Ready for API contracts.
