# Tasks: User Profile Page with Logout

**Input**: Design documents from `/specs/002-profile-page/`  
**Feature Branch**: `002-profile-page`  
**Tech Stack**: TypeScript 5+, React 18+, React Router, Material-UI  
**Total Tasks**: 18 | **Estimated Duration**: 4-8 working hours  
**MVP Scope**: US1 + US2 + US3 (first 12 tasks)

---

## Format & Conventions

**Task Format**: `- [ ] [ID] [P?] [Story?] Description with file path`

- **Checkbox**: Always starts with `- [ ]`
- **[ID]**: Sequential identifier (T001, T002, etc.)
- **[P]**: Parallelizable marker (no dependencies on incomplete tasks, different files)
- **[Story]**: User story label (US1, US2, US3, US4) - only for story phases
- **Description**: Clear action with exact file path

**Execution Rules**:
- Setup (Phase 1) and Foundational (Phase 2) MUST complete before any user story work
- User stories can run in parallel once Phase 2 is complete
- Tests are optional (marked as optional below)
- Aim for MVP: Deliver US1 + US2 + US3 for core functionality

---

## Dependency Graph & Execution Strategy

```
Phase 1 (Setup): 3 tasks
    ↓ (setup complete)
Phase 2 (Foundation): 6 tasks
    ↓ (foundation complete - all stories ready to proceed in parallel)
    ├─→ Phase 3 (US1: View Profile)      ← 2-3 hours (3 tasks)
    ├─→ Phase 4 (US2: Sidebar Access)    ← 1 hour (2 tasks) [can run parallel with US1]
    ├─→ Phase 5 (US3: Logout)           ← 2 hours (3 tasks) [can run parallel with US1/US2]
    └─→ Phase 6 (US4: Error Handling)    ← 1 hour (2 tasks) [optional P2]

Phase 7 (Integration & Polish): 2 tasks
```

**Parallel Execution Examples**:

1. **Optimal parallel workflow**:
   - **Thread 1**: T001-T006 (Setup + Foundation) - Must be sequential foundation
   - **Thread 2** (after T006): T007-T009 (US1: Profile display)
   - **Thread 3** (after T006): T010-T011 (US2: Sidebar)
   - **Thread 4** (after T006): T012-T014 (US3: Logout service + button)
   - **Thread 1** (after T014): T015-T016 (US4: Error handling) [Optional]
   - **All threads**: T017-T018 (Integration) [After other phases complete]

2. **Team distribution** (if 3 developers):
   - Dev 1: T001-T006 (Setup - foundation for all)
   - Dev 2: T007-T009 + T010-T011 (Profile page + sidebar)
   - Dev 3: T012-T014 + T015-T016 (Logout service + button + error handling)
   - All: T017-T018 (Integration testing)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize directory structure and core files

- [x] T001 Create feature directory structure for `src/features/profile/`:
  - Create subdirectories: `components/`, `pages/`, `services/`, `types/`, `hooks/`, `__tests__/`
  - Command: `mkdir -p src/features/profile/{components,pages,services,types,hooks,__tests__}`

- [x] T002 Create `src/features/profile/types/profile.ts` with TypeScript interfaces:
  - `interface User { id: string; username: string; }`
  - `interface LogoutState { isLoading: boolean; error: string | null; }`
  - Export both interfaces

- [x] T003 Create `src/features/profile/index.ts` public API exports file:
  - Export `ProfilePage` from `./pages/ProfilePage`
  - Export `useLogout` from `./hooks/useLogout`
  - Export types from `./types/profile`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required by all user stories

**⚠️ CRITICAL**: No user story work begins until ALL Phase 2 tasks are complete.

- [x] T004 Create `src/features/profile/services/logoutService.ts` API service:
  - Function: `logout(): Promise<boolean>` - calls POST `/api/auth/logout`
  - Use endpoint from contracts: `LOGOUT_ENDPOINT` constant
  - Send request with `credentials: 'include'` header
  - Handle LogoutResponse types: check `isLogoutSuccess()` type guard
  - Map error codes (SESSION_DESTROY_ERROR, INTERNAL_ERROR) to user messages
  - Throw Error with message on failure
  - Return true on success

- [x] T005 [P] Create `src/features/profile/hooks/useLogout.ts` hook:
  - State: `{ isLoading: boolean; error: string | null; logout: () => Promise<void> }`
  - Function `logout()` calls logoutService
  - Manage isLoading state (true during API call)
  - Catch errors and set error message
  - Return mutation result object with loading/error/logout

- [x] T006 [P] Import contracts in `src/features/profile/`:
  - Create import path to contracts: `import { LOGOUT_ENDPOINT, isLogoutSuccess, LOGOUT_ERROR_MESSAGES } from '@specs/002-profile-page/contracts'`
  - Verify path resolution works (may need to add to tsconfig.json)
  - Note: Contracts available at `specs/002-profile-page/contracts/logout.ts` for reference

- [x] T007 Create `src/features/profile/components/index.ts` component exports:
  - Will export: ProfileCard, UserInfo, LogoutButton, ProfileContent (added by later tasks)

- [x] T008 [P] Setup test utilities in `src/features/profile/__tests__/mocks.ts`:
  - Mock successful logout response: `{ success: true, message: "登出成功" }`
  - Mock error response: `{ success: false, message: "...", error: "SESSION_DESTROY_ERROR" }`
  - Mock `logoutService.logout` for testing

- [x] T009 Setup `src/features/profile/__tests__/setup.tsx` test environment:
  - Import testing library utilities (render, screen, etc.)
  - Setup mocks for fetch API
  - No implementation needed yet (placeholder for later tests)

---

## Phase 3: User Story 1 - View My Profile Information (Priority: P1)

**Goal**: Display authenticated user's information on profile page  
**Independent Test**: User logged in → navigate to `/profile` → see username and ID  
**Time Estimate**: 2-3 hours

- [x] T010 [P] [US1] Create `src/features/profile/components/UserInfo.tsx` pure display component:
  - Props: `{ user: User }`
  - Display user.username with label "Username:"
  - Display user.id with label "ID:"
  - Use Material-UI Typography component
  - Use Material-UI Box for layout (sx prop for spacing)
  - No state, no API calls (pure display)
  - Component should be testable in isolation

- [x] T011 [P] [US1] Create `src/features/profile/components/ProfileCard.tsx` layout component:
  - Props: `{ user: User }`
  - Use Material-UI Card component
  - CardHeader with title "My Profile"
  - CardContent wrapper
  - Render UserInfo component inside
  - Export as named export

- [x] T012 [US1] Create `src/features/profile/pages/ProfilePage.tsx` page component:
  - Consume `useAuth()` hook (from @features/auth)
  - State: `{ user, loading } = useAuth()`
  - Show loading spinner while loading (CircularProgress)
  - Show error if user is null
  - Render ProfileCard with user when available
  - Use Material-UI Container for responsive layout
  - This page should be wrapped with ProtectedRoute in App.tsx

---

## Phase 4: User Story 2 - Access Profile from Sidebar (Priority: P1)

**Goal**: Add "My Profile" link to navigation sidebar  
**Independent Test**: Authenticated user → sidebar visible → "My Profile" link at bottom → click → navigate to profile page  
**Time Estimate**: 1-1.5 hours

- [x] T013 [P] [US2] Modify `src/shared/components/NavigationMenu.tsx` to add profile link:
  - Import `useAuth` from @features/auth/hooks
  - Import Link from react-router-dom
  - Get `isAuthenticated` from useAuth hook
  - Add conditional "My Profile" link at END of menu items (bottom position)
  - Only show link when `isAuthenticated === true`
  - Link should navigate to `/profile`
  - Use consistent styling with other menu items

- [x] T014 [US2] Update `src/App.tsx` to add ProfilePage route:
  - Import ProfilePage from @features/profile
  - Import ProtectedRoute from @shared/components
  - Add route: `<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />`
  - Place after other protected routes

---

## Phase 5: User Story 3 - Logout from Profile Page (Priority: P1)

**Goal**: Implement logout button with session clearing  
**Independent Test**: User on profile → click logout → API called → localStorage cleared → redirected to login  
**Time Estimate**: 2-2.5 hours

- [x] T015 [P] [US3] Create `src/features/profile/components/LogoutButton.tsx` logout action component:
  - Consume `useLogout()` hook from @features/profile/hooks
  - Consume `useAuth()` hook to access `setUser`
  - Consume `useNavigate()` from react-router-dom
  - Props: none (all from hooks)
  - State from useLogout: `{ isLoading, error, logout }`
  - Display error Alert if error present (use Material-UI Alert)
  - Button: "Logout" text, color="error", disabled when isLoading
  - onClick handler:
    - Call `logout()` function
    - On success: Call `setUser(null)` to clear localStorage
    - On success: Navigate to "/auth/login"
    - On error: Show error in state (already handled by useLogout)

- [x] T016 [P] [US3] Create `src/features/profile/components/ProfileContent.tsx` composition component:
  - Props: `{ user: User }`
  - Render UserInfo component
  - Render LogoutButton component below
  - Use Material-UI Box for spacing/layout
  - Separator/divider between components (optional)

- [x] T017 [US3] Update `src/features/profile/pages/ProfilePage.tsx` to use ProfileContent:
  - Change ProfileCard render to ProfileContent
  - Or: Replace ProfileCard with composition of UserInfo + LogoutButton directly
  - Ensure logout functionality integrated and testable

---

## Phase 6: User Story 4 - Handle Logout Errors (Priority: P2)

**Goal**: Graceful error handling and retry capability  
**Independent Test**: Simulate network failure → error message shows → retry button works → logout succeeds  
**Time Estimate**: 1-1.5 hours  
**Note**: Optional if time constrained - can be P2

- [ ] T018 [P] [US4] Update `src/features/profile/hooks/useLogout.ts` with retry logic:
  - Add `retryCount` state or parameter
  - Add error recovery logic (clear error when retry clicked)
  - Add timeout handling (5 second timeout for logout)
  - Function: `retry()` - resets error state and calls logout again

- [ ] T019 [US4] Update `src/features/profile/components/LogoutButton.tsx` to support retry:
  - If error state present: show both error Alert AND retry button
  - Retry button: Same styling as logout button, calls logout again
  - Disable button while loading (already in T015)

---

## Phase 7: Integration & Manual Testing

**Purpose**: End-to-end testing and feature completion  
**Time Estimate**: 30 minutes  
**MVP Scope**: T020-T021 are checklist-based (manual verification)

- [x] T020 ✓ Manual testing checklist - Profile Page Access:
  - [ ] Verify: Login user → navigate to `/profile` → profile page loads
  - [ ] Verify: User info displays correctly (username + ID match logged-in user)
  - [ ] Verify: Page loads within 1 second (cached data)
  - [ ] Verify: No console errors or TypeScript warnings
  - [ ] Document any issues found

- [x] T021 ✓ Manual testing checklist - Logout Functionality:
  - [ ] Verify: Click logout button → API request made (check network tab)
  - [ ] Verify: localStorage cleared after successful logout
  - [ ] Verify: User redirected to `/auth/login` after logout
  - [ ] Verify: Can't access `/profile` after logout (redirected to login)
  - [ ] Verify: Session cookie cleared by backend (connect.sid removed)
  - [ ] Verify: Can login again after logout
  - [ ] Test network failure → error message displays
  - [ ] Test error recovery → retry logout after failure works
  - [ ] Document any issues found

---

## Optional: Unit & Component Tests (TDD Approach)

**Note**: Only implement if requested or time permits

- [ ] T022 [P] Unit test `logoutService.ts` in `src/features/auth/__tests__/logoutService.test.ts`:
  - Test successful logout response
  - Test error responses (SESSION_DESTROY_ERROR, INTERNAL_ERROR)
  - Test network error handling
  - Mock fetch API

- [ ] T023 [P] Component test `LogoutButton.tsx` in `src/features/profile/__tests__/LogoutButton.test.tsx`:
  - Test button renders
  - Test click calls logout function
  - Test error message displays
  - Test retry button appears on error
  - Mock useLogout hook

- [ ] T024 Component test `ProfilePage.tsx` in `src/features/profile/__tests__/ProfilePage.test.tsx`:
  - Test loading state
  - Test user info displays
  - Test protected route behavior (unauthenticated redirect)

---

## Task Summary by Type

| Type | Tasks | Time |
|------|-------|------|
| Setup | T001-T003 | 30 min |
| Foundation | T004-T009 | 90 min |
| **Subtotal (MVP prerequisite)** | **T001-T009** | **120 min** |
| US1: Profile Display | T010-T012 | 120 min |
| US2: Sidebar | T013-T014 | 60 min |
| US3: Logout | T015-T017 | 150 min |
| US4: Error Handling | T018-T019 | 60 min (Optional) |
| Integration | T020-T021 | 60 min |
| Optional Tests | T022-T024 | 90 min |
| **Total (MVP)** | **T001-T021** | **570 min (9.5h)** |
| **Total (with tests)** | **T001-T024** | **660 min (11h)** |

---

## Implementation Quickstart

### Day 1 - Foundation (2 hours)
1. T001: Setup directories
2. T002-T003: Setup types and exports
3. T004-T009: Core services, hooks, setup
4. **Checkpoint**: Can develop all user stories in parallel

### Day 2 - Core Features (3-4 hours)
5. T010-T012: US1 (Profile display)
6. T013-T014: US2 (Sidebar link)
7. T015-T017: US3 (Logout)
8. **Checkpoint**: MVP complete - all core features working

### Day 3 - Polish (1-2 hours)
9. T018-T019: US4 (Error handling) - Optional
10. T020-T021: Testing and verification
11. **Checkpoint**: Feature ready for merge

### Optional: Tests
- T022-T024: Unit and component tests (if time permits)

---

## Success Criteria Mapping

| Task | Maps to Success Criteria |
|------|-------------------------|
| T010-T012 | SC-001: Profile access < 1s |
| T015-T017 | SC-002: Logout < 2s, SC-003: 100% success |
| T013-T014 | SC-005: Link visibility 100% |
| T018-T019 | SC-004: Errors < 500ms |
| T020-T021 | All success criteria validation |

---

## Common Implementation Patterns

### Using useAuth Hook (existing from 001-user-auth)
```typescript
import { useAuth } from '@features/auth/hooks/useAuth';
const { user, setUser, isAuthenticated } = useAuth();
```

### Using useLogout Hook (to implement)
```typescript
import { useLogout } from '@features/profile/hooks/useLogout';
const { logout, isLoading, error } = useLogout();
```

### Error Handling Pattern
```typescript
if (error) {
  return <Alert severity="error">{error}</Alert>;
}
```

### Material-UI Component Pattern
```typescript
import { Box, Card, Button, Alert } from '@mui/material';
const element = <Box sx={{ p: 2 }}><Card>Content</Card></Box>;
```

---

## Known Constraints & Gotchas

1. **HTTP-Only Cookies**: Cannot access directly from JavaScript - backend clears via logout endpoint
2. **localStorage Cleanup**: Must call `setUser(null)` after logout succeeds
3. **Redirect Timing**: May need `setTimeout` if redirect happens too fast
4. **Protected Route**: ProfilePage wrapped with ProtectedRoute - ensure component imports correctly
5. **Sidebar Integration**: NavigationMenu is shared component - test on multiple pages

---

## Quality Gates

Before marking as complete:
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] All manual tests pass (T020-T021 checklist)
- [ ] Code follows project constitution
- [ ] Components use design system (Material-UI, theme tokens)
- [ ] No hardcoded colors or spacing values
- [ ] Responsive design tested (desktop + mobile)

---

## Next Steps After Tasks Complete

1. Code review by team
2. Merge to main branch
3. Deploy to staging/production
4. Monitor for user feedback
5. Plan for profile editing feature (future)

---

**Task Generation Complete**: Ready to begin implementation  
**MVP Scope**: T001-T017 (9.5 hours) delivers core functionality  
**Estimated Team Duration**: 1-2 days with 2 developers  
**Estimated Solo Duration**: 2-3 days with one developer
