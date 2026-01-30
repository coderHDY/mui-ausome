/**
 * Form validation functions for authentication
 * Used for real-time validation feedback before API submission
 */

/**
 * Validates username format
 * Requirements: 3-20 characters, alphanumeric and underscores only
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must not exceed 20 characters' };
  }

  // Match regex: /^[a-zA-Z0-9_]{3,20}$/
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return { 
      valid: false, 
      error: 'Username can only contain letters, numbers, and underscores' 
    };
  }

  return { valid: true };
}

/**
 * Validates password length
 * Requirements: 6-50 characters
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  if (password.length > 50) {
    return { valid: false, error: 'Password must not exceed 50 characters' };
  }

  return { valid: true };
}

/**
 * Validates both username and password together
 * Returns validation state for all fields
 */
export function validateAuthForm(
  username: string,
  password: string
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) {
    errors.username = usernameValidation.error || 'Invalid username';
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error || 'Invalid password';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
