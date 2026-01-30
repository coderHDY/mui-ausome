# Research & Clarifications: User Profile Page with Logout

**Phase**: 0 - Research  
**Created**: 2026-01-30  
**Status**: Complete

---

## Research Topics & Resolutions

### 1. Logout API Integration with HTTP-Only Cookies

**Topic**: How to properly handle logout when session is managed by HTTP-only cookies

**Research Finding**:
- **Decision**: Make POST request to `/auth/logout` endpoint with `credentials: 'include'`
- **Rationale**: 
  - HTTP-only cookies are automatically sent by browser with `credentials: 'include'`
  - Backend will validate session cookie and destroy it
  - Frontend cannot directly access or clear HTTP-only cookies
  - Logout success means backend session is terminated
- **Implementation**:
  - POST request to `http://localhost:3000/auth/logout` (via `/api/auth/logout` proxy)
  - Include `credentials: 'include'` to send session cookie
  - Check `response.success === true` to confirm backend session destroyed
  - Clear localStorage user data on success
  - Redirect to login page after successful logout
  - Handle network errors with retry mechanism

**API Reference**: [logout.md](https://github.com/coderHDY/speckit-awsome/blob/main/doc/logout.md)

### 2. Session Data Storage & Reuse

**Topic**: How to access user information from existing session state without redundant API calls

**Research Finding**:
- **Decision**: Reuse useAuth hook from 001-user-auth; user data already in localStorage
- **Rationale**:
  - useAuth hook provides `user` state (username, ID) populated after login/register
  - User data stored in localStorage automatically
  - No need for additional API call to fetch profile data
  - Profile page can render immediately from existing state
- **Implementation**:
  - Import useAuth from `@features/auth/hooks/useAuth`
  - Display `user.username` and `user.id` directly
  - No loading state needed (data already cached)
  - Profile page marked as ProtectedRoute (useAuth will handle unauthenticated redirect)

### 3. Logout Error Handling & Recovery

**Topic**: How to handle logout failures (network errors, server errors) and allow recovery

**Research Finding**:
- **Decision**: Show error message and provide retry mechanism
- **Rationale**:
  - Network failures should not trap user
  - User should be able to attempt logout again
  - Partial failure (localStorage cleared but backend session still active) is safe state
  - Error handling consistent with form submission patterns from 001-user-auth
- **Implementation**:
  - Catch fetch errors and server 500s
  - Display error message: "Failed to logout. Please try again."
  - Disable logout button during API call (loading state)
  - Enable button after error, allowing retry
  - On success: immediately clear localStorage, then redirect
  - Timeout after 5 seconds if no response

### 4. Sidebar Navigation Integration

**Topic**: How to add profile link to existing navigation sidebar at bottom

**Research Finding**:
- **Decision**: Modify NavigationMenu component to add profile link after other menu items
- **Rationale**:
  - NavigationMenu already exists in `src/shared/components/`
  - User requirement specifies "底部" (bottom position)
  - Can reuse existing menu styling and patterns
  - Profile link only visible when authenticated
- **Implementation**:
  - Add conditional "My Profile" link at end of menu items
  - Show link only if `useAuth().isAuthenticated === true`
  - Use React Router Link component for navigation
  - Active state styling when on profile page
  - Consistent styling with other menu items
  - Mobile responsive design maintained

### 5. Component Structure & Reusability

**Topic**: How to structure profile components for clarity and testability

**Research Finding**:
- **Decision**: Create separate components for user info display and logout button
- **Rationale**:
  - Separation of concerns (profile display vs logout action)
  - Each component testable independently
  - Follows existing 001-user-auth pattern (AuthForm, RegisterForm, LoginForm, etc.)
  - Consistent with project constitution principles
- **Implementation**:
  - ProfileCard: Top-level layout component for profile section
  - UserInfo: Display user details (username, ID) - pure presentational
  - LogoutButton: Logout action with loading/error states - handles mutation
  - ProfileContent: Container combining UserInfo + LogoutButton
  - ProfilePage: Route-level component with ProtectedRoute wrapper

### 6. Loading States & User Feedback

**Topic**: How to provide visual feedback during logout operation

**Research Finding**:
- **Decision**: Use Material-UI Button loading state + optional skeleton loader
- **Rationale**:
  - Material-UI provides built-in `loading` prop for Button
  - Shows spinner while API call in progress
  - Prevents duplicate submissions (button disabled during loading)
  - Consistent with form patterns in 001-user-auth
- **Implementation**:
  - LogoutButton disabled and shows spinner during logout
  - No skeleton for profile content (data already cached)
  - On success: show success message briefly, then redirect
  - On error: show error message with retry button

### 7. Redirect & Route Protection

**Topic**: How to protect profile page and handle redirect after logout

**Research Finding**:
- **Decision**: Reuse ProtectedRoute component; logout redirects to `/auth/login`
- **Rationale**:
  - ProtectedRoute already validates authentication before rendering
  - Unauthenticated users automatically redirected
  - Logout endpoint response indicates success before redirect
  - Consistent with 001-user-auth implementation
- **Implementation**:
  - Wrap ProfilePage with ProtectedRoute in App.tsx
  - Navigate to `/auth/login` after successful logout
  - useAuth hook provides loading state for route protection
  - Clear localStorage before redirect to ensure clean state

---

## Technology Stack Confirmation

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| State Management | useAuth hook + localStorage | Reuse existing pattern from 001-user-auth |
| HTTP Client | Fetch API | Consistent with authService, no additional dependencies |
| UI Components | Material-UI (Button, Card, Typography) | Existing design system |
| Styling | MUI sx prop + theme tokens | Consistent with project constitution |
| Routing | React Router v6+ | Existing routing infrastructure |
| Side Effects | Fetch + async/await | Simple and effective for logout operation |
| Testing Framework | Vitest + React Testing Library | Consistent with 001-user-auth tests |

---

## Integration Dependencies

**Existing Features Required**:
1. **001-user-auth**:
   - useAuth hook (provides user state and setUser method)
   - ProtectedRoute component (guards profile page)
   - authService patterns (error handling, error mapping)
   - localStorage user data (populated after login)

2. **design-system**:
   - Material-UI components (Button, Card, Box, Typography, Alert)
   - Theme tokens (colors, spacing, typography)
   - ThemeProvider (automatic theming)

3. **shared**:
   - NavigationMenu component (add profile link)
   - AppLayout (wraps protected pages)

**No Breaking Changes**: Profile feature integrates cleanly without modifying core infrastructure.

---

## Edge Cases & Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| User navigates away during logout | useLogout hook includes timeout and cleanup |
| localStorage cleared but backend session active | Safe state - next API call will fail with 401, trigger re-auth |
| Logout succeeds but redirect fails | Use setTimeout to ensure redirect completion |
| Multiple logout clicks | Disable button during loading state |
| Session expires while viewing profile | useAuth hook returns isAuthenticated=false, redirect triggered |
| Backend logout returns 500 | Show error message, allow retry without clearing localStorage |

---

## Performance Considerations

- Profile data load: < 500ms (data cached in localStorage)
- Logout API: < 2 seconds (per success criterion)
- Component rendering: < 100ms (simple display components)
- No unnecessary re-renders (useAuth provides stable reference)

---

## Security Considerations

1. **HTTP-Only Cookies**: Backend manages session security
2. **localStorage Cleanup**: Prevents user data leakage if browser not closed
3. **No Sensitive Data in Component State**: User only stores username + ID
4. **Redirect After Logout**: Ensures user doesn't remain on protected route
5. **Error Messages**: Generic errors prevent information leakage

---

## Summary

Profile feature will reuse existing authentication infrastructure (useAuth, localStorage, ProtectedRoute) and cleanly integrate logout functionality. API integration is straightforward with logout.md documentation. Navigation sidebar modification is minimal. No new architectural patterns required - follows established 001-user-auth conventions.

**Phase 0 Complete**: All research questions resolved. Ready for Phase 1 design.
