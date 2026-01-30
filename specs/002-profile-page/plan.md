# Implementation Plan: User Profile Page with Logout

**Branch**: `002-profile-page` | **Date**: 2026-01-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-profile-page/spec.md`

## Summary

Build user profile page that displays authenticated user information and provides logout functionality. The solution leverages the existing authentication session (HTTP-only cookie) and localStorage-cached user data. Integrates logout API endpoint into a dedicated profile page accessible from sidebar. Uses React/TypeScript with Material-UI components following existing design system patterns.

## Technical Context

**Language/Version**: TypeScript 5+ / React 18+  
**Primary Dependencies**: React Router (navigation), Material-UI (components), Fetch API (HTTP client)  
**Storage**: Session cookie (HTTP-only, browser-managed) + localStorage (user data cache)  
**Testing**: Vitest (unit tests), React Testing Library (component tests)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (frontend React dashboard component)  
**Performance Goals**: Profile page load < 500ms, logout API call < 2 seconds, redirect to login < 1 second  
**Constraints**: No direct session data modification allowed (HTTP-only cookies), logout must clear localStorage AND invalidate backend session, sidebar integration requires responsive design  
**Scale/Scope**: 1 page (Profile), 3-4 components (ProfileCard, UserInfo, LogoutButton, ProfilePage), ~300-400 LOC

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Modular architecture**: Profile will be implemented as a feature module in `src/features/profile/`  
✅ **UI/State/Logic separation**: Logout logic isolated in service; components remain presentational  
✅ **Design system compliance**: All components use Material-UI from design system; no hardcoded colors or spacing  
✅ **Theme support**: Profile page inherits theme from ThemeProvider automatically  
✅ **No cross-module imports**: Profile feature only imports from design-system, shared, auth feature, and React  
✅ **Long-term maintainability**: Logout through API prevents direct session manipulation; clean separation of concerns  
✅ **No business logic in UI**: API communication isolated in service; components remain presentational  
✅ **Session reuse**: Leverages existing useAuth hook and localStorage pattern from 001-user-auth  

**Constitution Status**: ✅ **PASS** - Feature complies with all project principles

## Project Structure

### Documentation (this feature)

```text
specs/002-profile-page/
├── plan.md              # This file (implementation plan)
├── spec.md              # Feature specification
├── research.md          # Phase 0: Research findings (TBD)
├── data-model.md        # Phase 1: Data model and entities (TBD)
├── contracts/           # Phase 1: API request/response contracts (TBD)
│   └── logout.ts        # Logout endpoint contract
├── quickstart.md        # Phase 1: Development quickstart (TBD)
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2: Implementation tasks (TBD - created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/features/profile/                   # NEW: Profile feature module
├── components/                          # Presentational components
│   ├── ProfileCard.tsx                 # Profile information card
│   ├── UserInfo.tsx                    # User details display
│   ├── LogoutButton.tsx                # Logout button with state
│   ├── ProfileContent.tsx              # Profile page content layout
│   └── index.ts
├── pages/                              # Page-level components
│   ├── ProfilePage.tsx                 # Profile page (protected)
│   └── index.ts
├── services/                           # Business logic
│   └── logoutService.ts                # API communication for logout
├── types/                              # Type definitions
│   └── profile.ts                      # Profile-related types
├── hooks/                              # Custom React hooks
│   ├── useLogout.ts                    # Logout mutation hook
│   └── index.ts
├── index.ts                            # Public API exports
└── __tests__/                          # Feature tests (TBD)
    ├── ProfilePage.test.tsx
    ├── LogoutButton.test.tsx
    └── logoutService.test.ts

src/shared/
├── components/
│   └── NavigationMenu.tsx              # MODIFY: Add profile link to sidebar

src/features/auth/
└── hooks/
    └── useAuth.ts                      # REUSE: For user data + logout integration
```

**Structure Decision**: The feature uses Option 2 (Web application single feature) integrated into the existing React dashboard. Profile pages are placed in `src/features/profile/` following the modular architecture. Reuses `useAuth` hook from 001-user-auth for session state, and integrates profile navigation into existing NavigationMenu in `src/shared/components/`. Logout service is isolated for clarity and testability.

## Complexity Tracking

No Constitution violations requiring justification. The feature follows established patterns from 001-user-auth and integrates cleanly with existing architecture.

---

## Phase 0: Outline & Research

### Research Tasks

1. **Logout API Integration** - Verify logout endpoint behavior with HTTP-only cookies
   - Research backend logout.md documentation and expected behavior
   - Understand session termination and cookie clearing mechanisms
   - Document redirect and error response patterns

2. **Navigation Integration** - Sidebar modification for profile link
   - Review existing NavigationMenu component structure
   - Identify insertion point for profile link at bottom
   - Determine responsive behavior and active state styling

3. **State Management Pattern** - Session cleanup after logout
   - Verify localStorage clearing is sufficient with HTTP-only cookies
   - Document component re-render flow during logout
   - Identify any race conditions between API call and redirect

**Phase 0 Output**: `research.md` with all unknowns resolved

---

## Phase 1: Design & Contracts

### Phase 1 Deliverables

**Data Model** (`data-model.md`):
- User entity (from localStorage/useAuth): `id`, `username`
- Session state: authenticated flag, loading states, error states
- Logout operation flow and cleanup sequence

**API Contracts** (`contracts/logout.ts`):
- LogoutRequest: empty body `{}`
- LogoutResponse: `{ success: boolean, message: string, error?: string }`
- Error codes: SESSION_DESTROY_ERROR, INTERNAL_ERROR
- Headers: Content-Type, credentials include

**Quick Start** (`quickstart.md`):
- Step-by-step implementation guide
- Component tree and dependencies
- Integration points with existing features
- Testing checklist

### Phase 1 Expected Outcomes

- Detailed data model resolving all edge cases
- API contracts ready for implementation
- Development quickstart guide
- Updated agent context with profile feature technology

---

## Phase 2: Tasks & Implementation

Tasks will be generated by `/speckit.tasks` command after Phase 1 completes. Expected task categories:

1. **Setup** (T001-T003): Directory structure, types, index exports
2. **Services** (T004-T007): logoutService, error handling, API integration
3. **Components** (T008-T012): ProfileCard, UserInfo, LogoutButton, ProfileContent, ProfilePage
4. **Sidebar** (T013-T015): NavigationMenu update, styling, active states
5. **Testing** (T016-T021): Unit tests for components and service
6. **Integration** (T022-T024): End-to-end logout flow, error scenarios
7. **Polish** (T025-T026): Accessibility, documentation

---

## Assumptions & Dependencies

**Assumptions**:
1. useAuth hook is stable and provides user data + setUser method
2. localStorage is available and reliable for session persistence
3. HTTP-only cookies are automatically managed by browser
4. Material-UI Button and Card components available
5. React Router useNavigate hook available
6. Vite proxy handles `/api/auth/logout` routing

**Dependencies on Existing Features**:
- 001-user-auth: useAuth hook, session state management, logout.md API spec
- design-system: Theme tokens, Material-UI components
- shared: ThemeProvider, NavigationMenu component, AppLayout

**External APIs**:
- Backend: `POST /auth/logout` endpoint with HTTP-only cookie handling

---

## Known Constraints & Risks

**Constraints**:
- Cannot access HTTP-only cookies from JavaScript (security by design)
- Must clear localStorage in parallel with backend logout for consistency
- Sidebar navigation requires responsive design consideration
- Logout must work even if frontend state is corrupted

**Risks**:
- Race condition if user navigates away during logout API call
- localStorage cleared but backend session still valid (partial failure)
- Session cookie not cleared if browser storage is full
- Multiple logout attempts could cause multiple redirects

**Mitigation**:
- Use loading state to prevent multiple logout clicks
- Clear localStorage immediately, handle any errors gracefully
- Implement timeout for logout operation
- Test error scenarios with network simulation
