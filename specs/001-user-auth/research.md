# Research & Clarifications: User Authentication Pages

**Phase**: 0 - Research  
**Created**: 2026-01-30  
**Status**: Complete

---

## Research Topics & Resolutions

### 1. Form Validation Strategy

**Topic**: How to validate username and password formats while providing real-time user feedback

**Research Finding**: 
- **Decision**: Client-side validation with server-side backup
- **Rationale**: Real-time feedback improves UX significantly. Per API specification, validation rules are fixed: username 3-20 chars (alphanumeric + underscore), password 6-50 chars
- **Implementation**: 
  - Immediate validation as user types (debounced)
  - Show validation errors within 200ms (success criterion SC-005)
  - Server response will confirm final validation before submission
  - Use regex: `/^[a-zA-Z0-9_]{3,20}$/` for username
  - Use simple length check for password (all characters allowed)

### 2. Error Messaging Strategy

**Topic**: How to handle and display authentication errors securely

**Research Finding**:
- **Decision**: Generic error messages for authentication failures; specific errors for form validation
- **Rationale**: API specification requires not revealing whether username exists (security best practice against enumeration attacks)
- **Implementation**:
  - Username/password validation errors: Show specific validation rules violated
  - Login failures: "Invalid username or password" regardless of which field failed
  - Username exists (registration): "Username already taken" (specific because registration doesn't expose existing users)
  - Network errors: "Connection error. Please check your internet and retry"
  - Server errors (500): "Server error. Please try again later"

### 3. Session Management Approach

**Topic**: How to manage authenticated sessions after login without storing passwords

**Research Finding**:
- **Decision**: Rely on HTTP-only session cookies managed by browser/backend
- **Rationale**: 
  - API uses HTTP-only cookies for security (prevents JavaScript access)
  - No need to implement custom session storage in frontend
  - Browser automatically includes cookie in subsequent requests
  - Session expiration handled by backend (7 days)
- **Implementation**:
  - Use `credentials: 'include'` in fetch/axios to send/receive cookies
  - No session state in Redux/Zustand (let backend manage via cookies)
  - Detect logout by redirect to login page or API 401 response
  - Optional: Store user info (ID, username) in state after login for UI display

### 4. Navigation & Routing Strategy

**Topic**: How to route between login/register pages and handle post-login redirects

**Research Finding**:
- **Decision**: Use React Router with protected routes and return URL preservation
- **Rationale**: 
  - React Router already in use (implicit from React app)
  - Can easily implement redirects after successful login
  - Can preserve `?redirect=/path` query parameter to return user to intended page
- **Implementation**:
  - `/auth/login` - Login page
  - `/auth/register` - Registration page
  - Add ProtectedRoute wrapper that redirects to login if not authenticated
  - After login: redirect to `redirectUrl` param or dashboard

### 5. API Integration Points

**Topic**: How to structure API communication for authentication endpoints

**Research Finding**:
- **Decision**: Dedicated auth service with typed request/response contracts
- **Rationale**: 
  - Centralizes API logic, making it testable and reusable
  - Type-safe contracts prevent mistakes
  - Easy to mock for testing
- **Implementation**:
  - Create `services/authService.ts` with:
    - `register(username: string, password: string): Promise<AuthResponse>`
    - `login(username: string, password: string): Promise<AuthResponse>`
  - Use axios or fetch with proper error handling
  - Requests: POST to `/auth/register` and `/auth/login` with JSON body
  - Responses: Handle `{ success, message, data, error }` format from API

### 6. Form State Management

**Topic**: Whether to use Zustand/Redux or local component state for form data

**Research Finding**:
- **Decision**: Local component state (useState) for form fields
- **Rationale**: 
  - Form state is transient (cleared after submission)
  - No need to persist across page navigation
  - Simpler and more performant than global state
  - Constitution principle: "local UI state stays local"
- **Implementation**:
  - Use `useState` for username, password, errors, loading state
  - Clear state after successful submission or page navigation
  - Optional: Use React Hook Form for complex validation scenarios

### 7. Loading & Disabled States

**Topic**: How to prevent form re-submission while API request is pending

**Research Finding**:
- **Decision**: Disable form fields and show loading indicator during API calls
- **Rationale**: 
  - Prevents duplicate submissions
  - Provides user feedback (SC-015: loading states)
  - Simple to implement with form state
- **Implementation**:
  - Add `isLoading` state
  - Disable submit button and inputs when `isLoading === true`
  - Show spinner or loading text on button
  - Set `isLoading = true` before API call, `false` after completion

### 8. Component Composition

**Topic**: How to structure components to avoid duplication between RegisterForm and LoginForm

**Research Finding**:
- **Decision**: Base AuthForm component with customization props
- **Rationale**: 
  - Both forms have identical structure (username + password + submit)
  - Reduces duplication
  - Easier to maintain consistent UX
- **Implementation**:
  - Create `AuthForm.tsx` with:
    - Username and password inputs
    - Error display
    - Submit button
    - Customizable labels, placeholders, button text
    - Customizable submit handler
  - Create `RegisterForm.tsx` and `LoginForm.tsx` as thin wrappers around AuthForm
  - Create page components (RegisterPage, LoginPage) for routing integration

### 9. Accessibility & Validation UX

**Topic**: How to ensure forms are accessible and provide good keyboard navigation

**Research Finding**:
- **Decision**: Leverage Material-UI form components with native accessibility
- **Rationale**: 
  - Material-UI TextField, Button, etc. include ARIA labels and roles
  - Reduces need for custom accessibility code
  - Constitution: Use design system components
- **Implementation**:
  - Use `<TextField>` for inputs with proper `label` prop
  - Use `<Button>` for submit with proper type
  - Use `<Alert>` or similar for error messages with `role="alert"`
  - Test keyboard navigation (Tab through fields, Enter to submit)

### 10. Testing Strategy

**Topic**: How to test forms without hitting real API endpoints

**Research Finding**:
- **Decision**: Mock API service using Jest mocks
- **Rationale**: 
  - Unit tests should not depend on backend
  - Can test success and error scenarios
  - Fast and reliable
- **Implementation**:
  - Mock `authService.ts` in tests
  - Test RegisterForm: valid input → calls register → shows success
  - Test LoginForm: invalid credentials → shows error
  - Test validators: test all validation rules
  - Test routing: successful login → redirects to dashboard

---

## Technology Decisions

| Technology | Decision | Rationale |
|------------|----------|-----------|
| Form State | Local useState | Constitution: UI state stays local. No persistence needed. |
| HTTP Client | Fetch API or Axios | Both support credentials: 'include' for cookie handling |
| Routing | React Router | Already in project; supports redirects and query params |
| Components | Material-UI | Design system requirement; consistent with dashboard UI |
| Validation | Client + Server | Real-time UX feedback + security validation |
| Session | HTTP-only cookies | API requirement; prevents XSS access to session |
| Error Handling | Try-catch + state | Standard pattern; integrates with error display |

---

## Dependency Analysis

### External Dependencies
- ✅ React Router (routing/redirects)
- ✅ Material-UI (components, forms)
- ✅ Axios/Fetch (HTTP requests)
- ✅ Design System tokens (colors, spacing)

### Internal Dependencies
- ✅ `src/design-system/` - Theme and component tokens
- ✅ `src/shared/state/` - Optional: authentication state store
- ✅ `src/shared/layout/` - AppLayout component if wrapping pages

### Backend Assumptions
- ✅ POST /auth/register endpoint available
- ✅ POST /auth/login endpoint available
- ✅ API returns `{ success, message, data, error }` format
- ✅ Session cookies set automatically by backend
- ✅ Validation errors include specific error codes

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| API not deployed | Blocking | Integrate with mock API initially; switch to real API once available |
| CORS misconfiguration | Blocking | Verify CORS settings allow credentials: 'include' requests |
| Session cookie not set | High | Verify API sets Set-Cookie header; test with browser DevTools |
| Username already exists edge case | Medium | Display specific error message; guide user to login |
| Session expiration during use | Medium | Detect 401 responses; redirect to login with preserved URL |
| Network timeout | Medium | Set reasonable timeouts; show clear error messages; allow retry |

---

## Completion Checklist

- ✅ Form validation strategy defined (client + server)
- ✅ Error messaging strategy established (generic for auth, specific for validation)
- ✅ Session management approach chosen (HTTP-only cookies)
- ✅ Navigation/routing design completed (React Router)
- ✅ API integration points identified (POST /auth/register, /auth/login)
- ✅ Form state management strategy (local useState)
- ✅ Loading states and disabled states planned
- ✅ Component composition architecture designed
- ✅ Accessibility approach determined (Material-UI)
- ✅ Testing strategy outlined (Jest mocks)
- ✅ Technology stack confirmed
- ✅ Dependencies identified and verified
- ✅ Risks identified and mitigated

**Status**: ✅ **PHASE 0 COMPLETE** - All research topics resolved. Ready to proceed to Phase 1 design.
