// Login API Contract
// Endpoint: POST /auth/login
// Authentication: None (but sets session cookie on success)

/**
 * Login Request Payload
 */
export interface LoginRequest {
  username: string;  // Registered username
  password: string;  // User's password
}

/**
 * Login Success Response (HTTP 200 OK)
 * Sets Set-Cookie header with session cookie
 */
export interface LoginSuccessResponse {
  success: true;
  message: string;   // e.g., "登录成功"
  data: {
    id: string;      // User ID (UUID v4)
    username: string; // Confirmed username
  };
}

/**
 * Login Error Response
 * HTTP Status Codes: 400, 401, 500
 */
export interface LoginErrorResponse {
  success: false;
  message: string;   // User-friendly error message
  error: 
    | 'MISSING_CREDENTIALS'  // HTTP 400: username or password missing
    | 'INVALID_CREDENTIALS'  // HTTP 401: wrong username/password combination
    | 'INTERNAL_ERROR';      // HTTP 500: server error
}

export type LoginResponse = 
  | LoginSuccessResponse 
  | LoginErrorResponse;

/**
 * Session Cookie Details (Set by Backend)
 * 
 * Cookie name: connect.sid
 * HttpOnly: true (not accessible to JavaScript)
 * Secure: true (production, HTTPS only)
 * SameSite: Strict (CSRF protection)
 * Path: /
 * Max-Age: 604800 (7 days = 7 * 24 * 60 * 60 seconds)
 */
export const SESSION_COOKIE = {
  name: 'connect.sid',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  httpOnly: true,
  secure: true,              // Production only
  sameSite: 'Strict'
} as const;

/**
 * Frontend Cookie Configuration for HTTP Requests
 * Must use credentials: 'include' to send/receive cookies
 */
export const FETCH_CREDENTIALS = {
  include: 'include'
} as const;

/**
 * Validation Rules (Enforced by Backend)
 */
export const LOGIN_VALIDATION = {
  username: {
    required: true,
    description: 'Username is required'
  },
  password: {
    required: true,
    description: 'Password is required'
  }
} as const;

/**
 * Example Request
 */
export const LOGIN_REQUEST_EXAMPLE: LoginRequest = {
  username: 'testuser123',
  password: 'securePassword456'
};

/**
 * Example Success Response
 * Backend will also set Set-Cookie header
 */
export const LOGIN_SUCCESS_EXAMPLE: LoginSuccessResponse = {
  success: true,
  message: '登录成功',
  data: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'testuser123'
  }
};

/**
 * Example Error Responses
 */
export const LOGIN_ERROR_EXAMPLES = {
  missingCredentials: {
    success: false,
    message: '用户名和密码不能为空',
    error: 'MISSING_CREDENTIALS' as const
  },
  invalidCredentials: {
    success: false,
    message: '用户名或密码错误',
    error: 'INVALID_CREDENTIALS' as const
  },
  internalError: {
    success: false,
    message: '服务器内部错误',
    error: 'INTERNAL_ERROR' as const
  }
} as const;

/**
 * Request Configuration Helper
 * Use this when making login requests to ensure cookies are handled
 */
export interface LoginRequestConfig {
  method: 'POST';
  headers: {
    'Content-Type': 'application/json';
  };
  credentials: 'include'; // Important: enables cookie handling
  body: string; // JSON.stringify(LoginRequest)
}

/**
 * Axios Configuration Example
 * const response = await axios.post('/auth/login', {
 *   username: 'user',
 *   password: 'pass'
 * }, {
 *   withCredentials: true  // Equivalent to credentials: 'include'
 * });
 */

/**
 * Fetch API Configuration Example
 * const response = await fetch('/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   credentials: 'include',  // Critical for cookie handling
 *   body: JSON.stringify({ username, password })
 * });
 */
