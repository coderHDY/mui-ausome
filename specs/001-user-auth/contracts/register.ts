// Registration API Contract
// Endpoint: POST /auth/register
// Authentication: None

/**
 * Registration Request Payload
 */
export interface RegisterRequest {
  username: string;  // 3-20 characters, letters/numbers/underscore only
  password: string;  // 6-50 characters, any character allowed
}

/**
 * Registration Success Response (HTTP 201 Created)
 */
export interface RegisterSuccessResponse {
  success: true;
  message: string;   // e.g., "注册成功"
  data: {
    id: string;      // UUID v4 of newly created user
    username: string; // Confirmed username
  };
}

/**
 * Registration Error Response
 * HTTP Status Codes: 400, 409, 500
 */
export interface RegisterErrorResponse {
  success: false;
  message: string;   // User-friendly error message
  error: 
    | 'MISSING_FIELDS'      // HTTP 400: username or password missing
    | 'INVALID_USERNAME'    // HTTP 400: username format invalid
    | 'INVALID_PASSWORD'    // HTTP 400: password format invalid
    | 'USERNAME_EXISTS'     // HTTP 409: username already registered
    | 'INTERNAL_ERROR';     // HTTP 500: server error
}

export type RegisterResponse = 
  | RegisterSuccessResponse 
  | RegisterErrorResponse;

/**
 * Validation Rules (Enforced by Backend)
 */
export const REGISTER_VALIDATION = {
  username: {
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    description: '3-20 characters, letters/numbers/underscore only'
  },
  password: {
    minLength: 6,
    maxLength: 50,
    description: '6-50 characters, any character allowed'
  }
} as const;

/**
 * Example Request
 */
export const REGISTER_REQUEST_EXAMPLE: RegisterRequest = {
  username: 'newuser_123',
  password: 'securePassword456'
};

/**
 * Example Success Response
 */
export const REGISTER_SUCCESS_EXAMPLE: RegisterSuccessResponse = {
  success: true,
  message: '注册成功',
  data: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'newuser_123'
  }
};

/**
 * Example Error Responses
 */
export const REGISTER_ERROR_EXAMPLES = {
  missingFields: {
    success: false,
    message: '用户名和密码不能为空',
    error: 'MISSING_FIELDS' as const
  },
  invalidUsername: {
    success: false,
    message: '用户名必须是3-20个字符，只能包含字母、数字和下划线',
    error: 'INVALID_USERNAME' as const
  },
  invalidPassword: {
    success: false,
    message: '密码长度必须在6-50个字符之间',
    error: 'INVALID_PASSWORD' as const
  },
  usernameExists: {
    success: false,
    message: '用户名已存在',
    error: 'USERNAME_EXISTS' as const
  },
  internalError: {
    success: false,
    message: '服务器内部错误',
    error: 'INTERNAL_ERROR' as const
  }
} as const;
