/**
 * Profile Feature Module Public API
 * 
 * This is the public API for the profile feature module.
 * Other modules should only import from this file.
 */

export { ProfilePage } from './pages/ProfilePage';
export { useLogout } from './hooks/useLogout';
export type { User, LogoutState } from './types/profile';
