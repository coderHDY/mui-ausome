# Quick Start: Implementing User Authentication

**Phase**: 1 - Design  
**Created**: 2026-01-30  
**Purpose**: Guide developers through building the authentication feature

---

## Overview

This guide covers building secure, user-friendly authentication pages (Login & Registration) integrated with the Material-UI design system and backend authentication API.

**Key Files**:
- [Specification](spec.md) - Complete requirements
- [Data Model](data-model.md) - Entity definitions
- [Research](research.md) - Technical decisions
- [API Contracts](contracts/) - Request/response types

**Estimated Time to Implement**: 3-4 days (for experienced React developers)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 src/features/auth/                       │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Pages (Route-connected)                         │   │
│  │  - RegisterPage.tsx (route: /auth/register)     │   │
│  │  - LoginPage.tsx (route: /auth/login)           │   │
│  └────────────────────┬────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐   │
│  │ Components (Reusable UI)                        │   │
│  │  - AuthForm.tsx (base form)                     │   │
│  │  - RegisterForm.tsx (auth + registration logic)│   │
│  │  - LoginForm.tsx (auth + login logic)           │   │
│  │  - AuthError.tsx (error display)                │   │
│  └────────────────────┬────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐   │
│  │ Services (Business Logic)                       │   │
│  │  - authService.ts (API calls)                   │   │
│  │  - validators.ts (validation rules)             │   │
│  └────────────────────┬────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐   │
│  │ Hooks (State Management)                        │   │
│  │  - useAuth.ts (auth state)                      │   │
│  │  - useLogin.ts (login mutation)                 │   │
│  │  - useRegister.ts (register mutation)           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │
         ├──→ Design System (@design-system/*)
         ├──→ Material-UI (components)
         └──→ Backend API (POST /auth/register, /auth/login)
```

---

## Step-by-Step Implementation

### Step 1: Create Feature Directory Structure

```bash
mkdir -p src/features/auth/{components,pages,services,hooks,types,__tests__}
```

### Step 2: Define Types

**File**: `src/features/auth/types/auth.ts`

```typescript
// User data after login
export interface User {
  id: string;
  username: string;
}

// Form submission results
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Validation result
export interface ValidationError {
  field: string;
  message: string;
}
```

### Step 3: Create API Service

**File**: `src/features/auth/services/authService.ts`

```typescript
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../../specs/001-user-auth/contracts';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: { id: string; username: string };
  error?: string;
}

export const authService = {
  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.register}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: handle cookies
      body: JSON.stringify({ username, password })
    });

    if (!response.ok && response.status !== 409) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: handle cookies
      body: JSON.stringify({ username, password })
    });

    if (!response.ok && response.status !== 401) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }
};
```

### Step 4: Create Validators

**File**: `src/features/auth/services/validators.ts`

```typescript
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 50;

export const validators = {
  validateUsername(username: string): string | undefined {
    if (!username) return 'Username is required';
    if (!USERNAME_PATTERN.test(username)) {
      return 'Username must be 3-20 characters with letters, numbers, and underscore only';
    }
    return undefined;
  },

  validatePassword(password: string): string | undefined {
    if (!password) return 'Password is required';
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    if (password.length > PASSWORD_MAX_LENGTH) {
      return `Password must be at most ${PASSWORD_MAX_LENGTH} characters`;
    }
    return undefined;
  },

  validateRegistration(username: string, password: string) {
    return {
      username: this.validateUsername(username),
      password: this.validatePassword(password)
    };
  }
};
```

### Step 5: Create Components

**File**: `src/features/auth/components/AuthForm.tsx`

```typescript
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';

interface AuthFormProps {
  title: string;
  submitButtonText: string;
  onSubmit: (username: string, password: string) => Promise<void>;
  showPasswordValidation?: boolean;
  alternateLink?: { text: string; onClick: () => void };
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  submitButtonText,
  onSubmit,
  alternateLink
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(username, password);
    } catch (error) {
      setErrors({ submit: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <h1>{title}</h1>
      
      {errors.submit && <Alert severity="error">{errors.submit}</Alert>}
      
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!errors.username}
        helperText={errors.username}
        disabled={isLoading}
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        disabled={isLoading}
        margin="normal"
      />
      
      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : submitButtonText}
      </Button>
      
      {alternateLink && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button onClick={alternateLink.onClick} variant="text">
            {alternateLink.text}
          </Button>
        </Box>
      )}
    </Box>
  );
};
```

### Step 6: Create Custom Hooks

**File**: `src/features/auth/hooks/useRegister.ts`

```typescript
import { useState } from 'react';
import { authService } from '../services/authService';
import { validators } from '../services/validators';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate
      const validationErrors = validators.validateRegistration(username, password);
      if (validationErrors.username || validationErrors.password) {
        throw new Error(validationErrors.username || validationErrors.password);
      }

      // Submit
      const response = await authService.register(username, password);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
```

### Step 7: Create Pages

**File**: `src/features/auth/pages/RegisterPage.tsx`

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthForm } from '../components/AuthForm';
import { useRegister } from '../hooks/useRegister';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading } = useRegister();

  const handleSubmit = async (username: string, password: string) => {
    await register(username, password);
    // On success, redirect to login
    navigate('/auth/login', { state: { message: 'Registration successful. Please log in.' } });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <AuthForm
        title="Sign Up"
        submitButtonText="Create Account"
        onSubmit={handleSubmit}
        alternateLink={{
          text: 'Already have an account? Sign In',
          onClick: () => navigate('/auth/login')
        }}
      />
    </Box>
  );
};
```

### Step 8: Add Routing

**File**: `src/App.tsx` (update)

```typescript
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { LoginPage } from './features/auth/pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      {/* other routes */}
    </Routes>
  );
}
```

---

## Testing Checklist

### Unit Tests
- [ ] `validators.test.ts` - All validation rules
- [ ] `authService.test.ts` - API calls with mocked responses
- [ ] `RegisterForm.test.tsx` - Form submission, validation display
- [ ] `LoginForm.test.tsx` - Form submission, error handling

### Integration Tests
- [ ] Register flow: Valid input → success → redirect to login
- [ ] Register flow: Username taken → show error → allow retry
- [ ] Login flow: Valid credentials → success → redirect to dashboard
- [ ] Login flow: Invalid credentials → show generic error
- [ ] Navigation: Register ↔ Login page switching

### Manual Testing
- [ ] [ ] Test with valid credentials
- [ ] [ ] Test with invalid formats (too short username, etc.)
- [ ] [ ] Test network error handling
- [ ] [ ] Test form submission disabled while loading
- [ ] [ ] Test error message clearing on new input
- [ ] [ ] Test session persistence (close browser, re-open)
- [ ] [ ] Test redirect after login
- [ ] [ ] Test redirect to login when not authenticated

---

## Key Decisions Reference

| Decision | Rationale | File |
|----------|-----------|------|
| Local state for forms | Transient, no persistence | [research.md](research.md#6-form-state-management) |
| Fetch API | Native support, no dependency | [research.md](research.md#5-api-integration-points) |
| HTTP-only cookies | Security, prevents XSS | [research.md](research.md#3-session-management-approach) |
| Generic login errors | Security, prevents enumeration | [research.md](research.md#2-error-messaging-strategy) |
| Material-UI components | Design system compliance | [research.md](research.md#9-accessibility--validation-ux) |

---

## Performance Tips

1. **Debounce validation**: Use 300ms debounce for username validation to avoid excessive regex checks
2. **Lazy load routes**: Use React.lazy() for auth pages if not immediately visible
3. **Avoid inline styles**: Use MUI sx prop or theme values
4. **Memoize components**: Consider useMemo for form validation results

---

## Security Checklist

- ✅ Password never logged or displayed
- ✅ Password cleared from state after submission
- ✅ Credentials: 'include' for cookie handling
- ✅ Generic errors for login failures
- ✅ HTTPS in production (enforce via Secure flag)
- ✅ No password confirmation field (single entry)
- ✅ No password reset link (backend responsibility)

---

## Debugging Tips

**"Session not persisting"**: 
- Check `credentials: 'include'` in fetch call
- Verify backend sets Set-Cookie header
- Check browser DevTools → Application → Cookies

**"CORS errors"**:
- Verify API URL is correct
- Check backend CORS configuration
- Ensure credentials are handled properly

**"Validation not showing"**:
- Check error state is being set
- Verify TextField error and helperText props
- Check for setTimeout clearing errors prematurely

---

## Next Steps

1. ✅ Understand architecture and data model
2. → Implement Step 1-3: Structure and types
3. → Implement Step 4-8: Services, components, routing
4. → Write unit tests
5. → Integration testing with real API
6. → Deploy and monitor

---

## Additional Resources

- [Feature Specification](spec.md)
- [API Documentation](https://github.com/coderHDY/speckit-awsome/tree/main/doc)
- [Material-UI Docs](https://mui.com)
- [React Router Docs](https://reactrouter.com)

---

**Ready to build?** Start with Step 1 and create the directory structure!
