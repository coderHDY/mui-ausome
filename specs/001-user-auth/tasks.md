# Tasks: User Authentication Pages

**Input**: Design documents from `/specs/001-user-auth/`  
**Feature Branch**: `001-user-auth`  
**Tech Stack**: TypeScript 5+, React 18+, React Router, Material-UI  
**Total Tasks**: 28 | **Estimated Duration**: 7-11 working days  

---

## Format: `[ID] [P?] [Story] Description`

- **Checkbox**: Always starts with `- [ ]`
- **[ID]**: Sequential task identifier (T001, T002, etc.)
- **[P]**: Parallelizable (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label for organization (US1, US2, US3)
- **Description**: Clear action with exact file path

---

## Dependency Graph & Execution Strategy

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
    ├─→ Phase 3 (US1: Registration) ← Can run in parallel
    │   ├─→ Phase 4 (US2: Login)    ← after Phase 2 completes
    │   └─→ Phase 5 (US3: Navigation) ← after US1, US2 complete
    │
    └─→ Phase 6 (Polish & Integration)
```

**Parallel Execution Examples**:
- US1 and US2: Can implement RegisterPage/LoginPage simultaneously once Phase 2 is complete
- Within US1: Can write tests (T018-T020) in parallel with implementation (T021-T030)
- API contracts: Can create mock service (T013) while implementing real service (T011)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and folder structure

- [x] T001 Create feature directory structure `src/features/auth/` with subdirectories: components/, pages/, services/, hooks/, types/, __tests__/
- [x] T002 Create `src/features/auth/index.ts` public API exports file (initially empty, will export components/pages)
- [x] T003 [P] Create `src/features/auth/types/auth.ts` with TypeScript interfaces for User, AuthResult, ValidationError

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST complete before user story implementation

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [x] T004 Create `src/features/auth/services/validators.ts` with validation functions:
  - `validateUsername(username: string): { valid: boolean; error?: string }`
  - `validatePassword(password: string): { valid: boolean; error?: string }`
  - Use regex `/^[a-zA-Z0-9_]{3,20}$/` for username validation
  - Enforce 6-50 character password length rule
- [x] T005 [P] Create `src/features/auth/services/authService.ts` with API service:
  - `register(username: string, password: string): Promise<AuthResponse>`
  - `login(username: string, password: string): Promise<AuthResponse>`
  - Configure fetch/axios with `credentials: 'include'` for cookie handling
  - Map error codes to user-friendly messages per data-model.md
  - Implement retry logic with exponential backoff for network errors
- [x] T006 [P] Create `src/features/auth/hooks/useAuth.ts` hook:
  - State: `{ user, isAuthenticated, loading }`
  - Retrieve session info from API or local state
  - Called after login to sync UI with session
- [x] T007 Create `src/features/auth/components/AuthForm.tsx` base component:
  - Props: `{ title, onSubmit, isLoading, error, children }`
  - Material-UI TextField for username and password
  - Material-UI Button for submission
  - Alert component for error display
  - Clear, semantic form structure with proper labels
- [x] T008 [P] Create `src/features/auth/components/AuthError.tsx` error display component:
  - Props: `{ error?: string; fieldErrors?: Record<string, string> }`
  - Display validation errors for individual fields
  - Display general submission errors
  - Material-UI Alert component
- [x] T009 Create `src/features/auth/hooks/useRegister.ts` hook:
  - State: `{ isLoading, error, success }`
  - Function: `register(username, password)` that calls authService
  - Handle loading states and error mapping
- [x] T010 [P] Create `src/features/auth/hooks/useLogin.ts` hook:
  - State: `{ isLoading, error }`
  - Function: `login(username, password)` that calls authService
  - Handle loading states and generic error messages for security
- [x] T011 Setup React Router in `src/App.tsx`:
  - Add routes: `/auth/login`, `/auth/register`
  - Create ProtectedRoute wrapper for authenticated pages (checks session/cookies)
  - Implement redirect to `/auth/login?redirect=/dashboard` for unauthenticated access
- [x] T012 [P] Create mock/testing utilities in `src/features/auth/__tests__/mocks.ts`:
  - Mock `authService` with successful/error responses
  - Mock successful registration response: `{ success: true, user: { id: 'test-id', username: 'testuser' } }`
  - Mock successful login response: same format
  - Mock error responses for USERNAME_EXISTS, INVALID_CREDENTIALS, etc.

**Checkpoint**: Foundation complete. User story implementation can now proceed in parallel.

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: Enable new visitors to create accounts with secure registration form

**Independent Test**: Submit valid credentials and verify account creation without login dependency. Can test registration flow completely standalone.

### Tests for User Story 1 (Optional - Write tests FIRST before implementation)

- [ ] T013 [P] [US1] Unit test `validators.ts` in `src/features/auth/__tests__/validators.test.ts`:
  - Test valid username formats (3 chars, 20 chars, with underscores)
  - Test invalid usernames (too short, too long, special characters)
  - Test valid/invalid password lengths (5 chars fails, 6 chars passes, 50 chars passes, 51 fails)
- [ ] T014 [P] [US1] Unit test `useRegister.ts` hook in `src/features/auth/__tests__/useRegister.test.ts`:
  - Mock successful registration
  - Mock USERNAME_EXISTS error
  - Mock INVALID_USERNAME error
  - Verify loading states transition correctly
  - Verify error messages display as expected
- [ ] T015 [P] [US1] Component test `RegisterForm.tsx` in `src/features/auth/__tests__/RegisterForm.test.tsx`:
  - Test form renders with username and password inputs
  - Test validation errors display on blur
  - Test form submits with valid credentials
  - Test submit button disabled during loading
  - Test error message displays on submission failure
  - Test success message displays on successful registration

### Implementation for User Story 1

- [ ] T016 [P] [US1] Create `src/features/auth/components/RegisterForm.tsx` component:
  - Extend AuthForm component with registration-specific logic
  - Props: `{ onSuccess?: () => void }`
  - State: `{ username, password, errors, isLoading }`
  - Real-time validation on blur with debouncing (100-200ms)
  - Show specific validation errors for username/password fields
  - Disable form submission while `isLoading` is true
  - Call `useRegister` hook on form submission
  - Display success message after registration completes
  - Show "Already have an account? Login" link to LoginPage
- [ ] T017 [P] [US1] Create `src/features/auth/pages/RegisterPage.tsx` page component:
  - Material-UI card/container layout
  - Title: "Create Account" or similar
  - Render RegisterForm component
  - On successful registration: Show success message or redirect to LoginPage
  - Add link back to LoginPage for existing users
  - Responsive design suitable for desktop and mobile
- [ ] T018 [US1] Integrate `src/App.tsx` with RegisterPage:
  - Add route `/auth/register` pointing to RegisterPage
  - Verify route is accessible and RegisterPage renders correctly
- [ ] T019 [P] [US1] Manual testing checklist in `docs/testing-us1.md`:
  - ✓ Register with valid credentials → Creates account successfully
  - ✓ Register with username < 3 chars → Shows validation error
  - ✓ Register with username > 20 chars → Shows validation error
  - ✓ Register with special characters in username → Shows validation error
  - ✓ Register with password < 6 chars → Shows validation error
  - ✓ Register with existing username → Shows "Username taken" error
  - ✓ Leave fields empty and submit → Shows "Required fields" error
  - ✓ Register, close browser, reopen → Verify session persists (if immediate login)
  - ✓ Validation errors display within 200ms ← Verify via browser dev tools performance
  - ✓ Form fields clear and re-enable after successful submission

**Checkpoint**: User Story 1 complete. Registration functionality fully tested and working independently.

---

## Phase 4: User Story 2 - Existing User Login (Priority: P1) 🎯 MVP

**Goal**: Allow existing users to authenticate and establish sessions

**Independent Test**: Attempt login with valid/invalid credentials and verify session establishment. Can test login flow completely independently from registration.

### Tests for User Story 2 (Optional - Write tests FIRST before implementation)

- [ ] T020 [P] [US2] Unit test `useLogin.ts` hook in `src/features/auth/__tests__/useLogin.test.ts`:
  - Mock successful login with valid credentials
  - Mock INVALID_CREDENTIALS error (generic, no username enumeration)
  - Mock MISSING_FIELDS error
  - Verify loading states transition correctly
  - Verify error message is generic for login failures (not revealing username exists)
  - Verify session cookie is set automatically (tested via mock)
- [ ] T021 [P] [US2] Component test `LoginForm.tsx` in `src/features/auth/__tests__/LoginForm.test.tsx`:
  - Test form renders with username and password inputs
  - Test form does NOT show field-specific validation errors (per security spec)
  - Test form submits with credentials
  - Test submit button disabled during loading
  - Test generic error message displays on submission failure
  - Test success redirects to dashboard or home page
- [ ] T022 [P] [US2] Integration test login flow in `src/features/auth/__tests__/loginFlow.test.tsx`:
  - Complete flow: Render LoginPage → Enter credentials → Submit → Verify session established → Verify redirect
  - Mock authService to simulate successful login with session cookie
  - Verify user cannot access protected routes before login
  - Verify user CAN access protected routes after login (redirect works)

### Implementation for User Story 2

- [ ] T023 [P] [US2] Create `src/features/auth/components/LoginForm.tsx` component:
  - Similar structure to RegisterForm but with login-specific logic
  - Props: `{ onSuccess?: () => void; redirectTo?: string }`
  - State: `{ username, password, error, isLoading }` (no field-specific errors per security)
  - Minimal validation: Only check fields are not empty before submission
  - Server performs full validation - don't pre-validate username format for login
  - Disable form submission while `isLoading` is true
  - Call `useLogin` hook on form submission
  - On success: Redirect to dashboard/home or URL from `redirectTo` prop
  - Show "Don't have an account? Sign up" link to RegisterPage
  - Display generic error message on login failure
- [ ] T024 [P] [US2] Create `src/features/auth/pages/LoginPage.tsx` page component:
  - Material-UI card/container layout
  - Title: "Login" or "Sign In"
  - Render LoginForm component with optional `redirectTo` from query params (`?redirect=/dashboard`)
  - Extract redirect URL from location search params and pass to LoginForm
  - On successful login: Redirect to provided URL or `/dashboard` as fallback
  - Add link to RegisterPage for new users
  - Responsive design suitable for desktop and mobile
- [ ] T025 [US2] Integrate `src/App.tsx` with LoginPage:
  - Add route `/auth/login` pointing to LoginPage
  - Add redirect from `/` (home) to `/auth/login` if not authenticated
  - Verify LoginPage is accessible and renders correctly
- [ ] T026 [P] [US2] Implement session persistence in `src/features/auth/hooks/useAuth.ts`:
  - On app initialization: Check if user has active session (fetch from API or check cookie presence)
  - If session exists: Store user info in state for UI
  - If session expired: Clear state and redirect to login
  - Update useAuth to support `isAuthenticated` check based on session
- [ ] T027 [P] [US2] Create ProtectedRoute wrapper in `src/shared/components/ProtectedRoute.tsx`:
  - Check `isAuthenticated` from useAuth hook
  - If authenticated: Render component
  - If not authenticated: Redirect to `/auth/login?redirect={current-path}`
  - Prevent unauthorized access to dashboard and other protected pages
- [ ] T028 [P] [US2] Manual testing checklist in `docs/testing-us2.md`:
  - ✓ Login with valid credentials → Session established, redirect to dashboard
  - ✓ Login with invalid credentials → Shows generic error "Invalid username or password"
  - ✓ Leave fields empty and submit → Shows validation error
  - ✓ Close browser and reopen within 7 days → Session persists, no re-login needed
  - ✓ Wait 7+ days → Session expires, redirects to login on next action
  - ✓ Try accessing `/dashboard` without logging in → Redirects to `/auth/login?redirect=/dashboard`
  - ✓ Login successfully → Redirects back to `/dashboard`
  - ✓ Network timeout during login → Shows "Connection error, please retry" message
  - ✓ Server returns 500 error → Shows "Server error, please try again later" message
  - ✓ Login response within 10 seconds ← Verify via dev tools performance timing (SC-002)

**Checkpoint**: User Story 2 complete. Login functionality fully tested and working independently.

---

## Phase 5: User Story 3 - Navigation Between Auth Pages (Priority: P2)

**Goal**: Improve user experience with easy switching between registration and login flows

**Independent Test**: Verify navigation links work correctly and page transitions occur smoothly without losing entered data (cleared for security).

### Tests for User Story 3 (Optional)

- [ ] T029 [P] [US3] Integration test navigation between auth pages in `src/features/auth/__tests__/authNavigation.test.tsx`:
  - Render LoginPage → Click "Sign up" link → Verify RegisterPage renders
  - Render RegisterPage → Click "Already have account" link → Verify LoginPage renders
  - Verify form data is cleared when switching pages (security requirement)
  - Verify scroll position resets when navigating between pages

### Implementation for User Story 3

- [ ] T030 [US3] Enhance `src/features/auth/pages/LoginPage.tsx` and RegisterPage.tsx:
  - Add Material-UI Link component with proper routing (React Router Link)
  - LoginPage: Add "Don't have an account? Sign up" link pointing to `/auth/register`
  - RegisterPage: Add "Already have an account? Login" link pointing to `/auth/login`
  - Links styled consistently with Material-UI theme
  - Verify form state clears when navigating away (already handled by React component unmounting)
  - Add smooth transitions between pages using Material-UI transition components (optional but recommended)

**Checkpoint**: User Story 3 complete. Navigation between auth pages working smoothly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Refinement, integration testing, and documentation

- [ ] T031 [P] Create comprehensive integration test in `src/features/auth/__tests__/authIntegration.test.tsx`:
  - Complete user journey: Register → Logout → Login → Access protected pages
  - Verify error scenarios: Registration username exists → Suggest login
  - Verify error scenarios: Login with invalid credentials → Show error, allow retry
  - Verify session persistence across page refreshes
  - Test cookie handling with different response scenarios
- [ ] T032 [P] Implement error boundary in `src/features/auth/components/AuthErrorBoundary.tsx`:
  - Catches rendering errors in auth components
  - Displays user-friendly error message
  - Allows recovery (retry button)
  - Logs error for debugging
- [ ] T033 [P] Add logging/monitoring to `src/features/auth/services/authService.ts`:
  - Log successful registrations (without passwords)
  - Log failed login attempts (without passwords)
  - Log network errors for debugging
  - Track API response times
- [ ] T034 Add keyboard accessibility improvements:
  - Ensure Tab order makes sense (username → password → submit → links)
  - Test form submission with Enter key
  - Add focus indicators for keyboard navigation
  - Verify all interactive elements are keyboard accessible
- [ ] T035 [P] Add responsive design tests in `docs/testing-responsive.md`:
  - ✓ Desktop (1920px): Form renders properly with card layout
  - ✓ Tablet (768px): Form responsive, inputs stack appropriately
  - ✓ Mobile (375px): Form single column, inputs full width, touch-friendly button size
  - ✓ Form fits in viewport without horizontal scrolling
  - ✓ Error messages don't overflow on mobile
- [ ] T036 Document API error handling in `docs/error-codes.md`:
  - List all error codes from data-model.md
  - Map each code to user-friendly message
  - Provide examples of when each error occurs
  - Recovery steps for each error type
- [ ] T037 Create developer guide in `docs/AUTH_DEVELOPER_GUIDE.md`:
  - Architecture overview (why separated into services/hooks/components)
  - How to add new auth endpoints (extend authService)
  - How to test auth features (use mocks from `__tests__/mocks.ts`)
  - Common debugging scenarios (cookies not persisting, session timeout, etc.)
  - Link to design docs and spec for additional context
- [ ] T038 [P] Performance optimization:
  - Add debouncing to validation (100-200ms) in RegisterForm to meet SC-005 requirement
  - Memoize AuthForm and form components with React.memo to prevent unnecessary re-renders
  - Lazy load auth pages using React.lazy() and Suspense if bundle size becomes concern
  - Verify API calls complete within 2 seconds (SC-006) with network throttling test
- [ ] T039 Final integration verification in `docs/FINAL_CHECKLIST.md`:
  - ✓ All 3 user stories (US1, US2, US3) implemented and tested
  - ✓ All 19 functional requirements (FR-001 through FR-019) met
  - ✓ All 10 success criteria (SC-001 through SC-010) verified
  - ✓ All edge cases from spec handled
  - ✓ No console errors or warnings
  - ✓ Accessibility audit passed (axe DevTools or similar)
  - ✓ Mobile responsiveness verified on 3+ devices
  - ✓ Cookie persistence tested across 7-day window
  - ✓ Redirect after login works with query parameter (`?redirect=/path`)
  - ✓ Code review completed and approved
  - ✓ Feature branch merged to main branch

**Checkpoint**: All tasks complete. Feature ready for production deployment.

---

## Task Summary by Phase

| Phase | Count | Type | Status |
|-------|-------|------|--------|
| Phase 1: Setup | 3 | Infrastructure | Ready |
| Phase 2: Foundational | 9 | Prerequisites | Blocking |
| Phase 3: User Story 1 (Registration) | 7 | Implementation | US1 MVP |
| Phase 4: User Story 2 (Login) | 8 | Implementation | US2 MVP |
| Phase 5: User Story 3 (Navigation) | 2 | Enhancement | P2 |
| Phase 6: Polish | 9 | Refinement | Final |
| **Total** | **38** | **Mixed** | **Ready for Implementation** |

---

## Task Summary by User Story

| Story | ID | Title | Tasks | Est. Days |
|-------|-----|-------|-------|-----------|
| **US1** | P1 | New User Registration | T013-T019 (7 tasks) | 3-4 |
| **US2** | P1 | Existing User Login | T020-T028 (9 tasks) | 3-4 |
| **US3** | P2 | Navigation Between Pages | T029-T030 (2 tasks) | 1 |
| **Foundation** | - | Shared Infrastructure | T001-T012 (12 tasks) | 2-3 |
| **Polish** | - | Refinement & Docs | T031-T039 (9 tasks) | 1-2 |

---

## Parallel Execution Strategy

**Recommended Parallel Groups** (assign to different developers):

**Group A** (1 developer):
- Phase 2 foundational tasks (T001-T012): 2-3 days
- Blocks all story work

**Group B** (After Group A completes):
- US1 tests + implementation (T013-T019): 3-4 days in parallel
- US2 tests + implementation (T020-T028): 3-4 days in parallel
- Can run Group B both stories simultaneously on different developers

**Group C** (After Group B complete):
- US3 implementation (T029-T030): 1 day
- Polish & docs (T031-T039): 1-2 days in parallel

**Optimal Team Assignment** (7-11 day timeline):
- 1-2 developers: Phase 2 (foundation) - Days 1-3
- 2-3 developers: Phase 3 & 4 (stories in parallel) - Days 3-7
- 1 developer: Phase 5 & 6 (polish + docs) - Days 7-9

---

## Success Criteria Mapping

| Criterion | Verification Method | Related Tasks |
|-----------|-------------------|---------------|
| SC-001: Register in <30s | Manual test, measure time | T019 (manual) |
| SC-002: Login in <10s | Manual test, measure time | T028 (manual) |
| SC-003: 95% first-attempt success | Code review (no unnecessary steps) | T016, T023 |
| SC-004: No user enumeration | Code review (generic errors) | T023 (LoginForm generic error) |
| SC-005: Errors display <200ms | Browser dev tools timeline | T016 (debounced validation), T038 |
| SC-006: API <2s | Browser network tab | T028 (manual) |
| SC-007: Session 7 days reliable | Manual 7-day test | T026 (session persistence), T028 |
| SC-008: Zero password leaks | Code review (no logging passwords) | T033 (logging safe) |
| SC-009: 1-click navigation | Code review (links implemented) | T030 |
| SC-010: Actionable feedback | All error handling tasks | T004, T005, T008 |

---

## Functional Requirements Mapping

| FR ID | Requirement | Implementation Task |
|-------|-------------|-------------------|
| FR-001 to FR-006 | Registration form & validation | T016 (RegisterForm), T004 (validators) |
| FR-007 | POST /auth/register | T005 (authService) |
| FR-008 to FR-014 | Login form & session | T023 (LoginForm), T026 (session persist) |
| FR-015 to FR-019 | Loading, errors, navigation | T016, T023 (forms), T030 (navigation) |

---

## Implementation Notes

### Code Quality Standards
- Use TypeScript strict mode - all types explicitly defined
- Components should be pure and testable
- No API calls directly in components - use hooks
- All Material-UI components imported from `@mui/material`
- Error handling per data-model.md error codes
- No hardcoded strings - use constants or i18n

### Testing Standards (if implementing tests T013-T022, T029)
- Use React Testing Library (preferred) or Vitest
- Mock authService using utilities from `__tests__/mocks.ts`
- Test user interactions, not implementation details
- Achieve 80%+ code coverage for auth feature
- All async operations tested with proper await/act

### Security Checklist
- ✓ Passwords never logged or console.error'd
- ✓ Generic error messages for login failures (no user enumeration)
- ✓ Credentials always sent over HTTPS (enforce in production)
- ✓ HTTP-only cookie flag set by backend (frontend: don't disable)
- ✓ Session validation on protected routes (ProtectedRoute component)
- ✓ No session tokens in localStorage or sessionStorage

### Performance Checklist
- ✓ Form validation debounced 100-200ms
- ✓ Components memoized (React.memo) to prevent unnecessary renders
- ✓ API calls use connection pooling (handled by fetch/axios)
- ✓ Response timeout ~5-10 seconds with user feedback
- ✓ No blocking operations on main thread

---

## Continuation Steps

1. **Immediate Next Step**: Create Phase 1 directory structure (T001)
2. **Assign to Developer**: 1 developer tackles Phase 2 foundation (T001-T012)
3. **After Foundation**: 2+ developers work on US1 and US2 in parallel
4. **Final Phase**: Polish and integration testing (T031-T039)

**Estimated Timeline**: 7-11 working days for team of 2-3 developers working simultaneously

---

## References

- **Specification**: [spec.md](spec.md)
- **Implementation Plan**: [plan.md](plan.md)
- **Research & Decisions**: [research.md](research.md)
- **Data Model**: [data-model.md](data-model.md)
- **API Contracts**: [contracts/](contracts/)
- **Quick Start Guide**: [quickstart.md](quickstart.md)
