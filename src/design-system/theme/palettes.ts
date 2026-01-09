import { colors } from '../tokens';
import type { ThemePalette } from './types';

/**
 * 浅色主题调色板
 */
export const lightPalette: ThemePalette = {
  mode: 'light',
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  primary: {
    main: colors.primary[500],
    light: colors.primary[300],
    dark: colors.primary[700],
    contrastText: colors.white,
  },
  error: {
    main: colors.error[500],
    light: colors.error[300],
    dark: colors.error[700],
    contrastText: colors.white,
  },
  warning: {
    main: colors.warning[500],
    light: colors.warning[300],
    dark: colors.warning[700],
    contrastText: colors.white,
  },
  success: {
    main: colors.success[500],
    light: colors.success[300],
    dark: colors.success[700],
    contrastText: colors.white,
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  border: 'rgba(0, 0, 0, 0.12)',
};

/**
 * 深色主题调色板
 */
export const darkPalette: ThemePalette = {
  mode: 'dark',
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    elevated: '#2C2C2C',
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    disabled: 'rgba(255, 255, 255, 0.38)',
  },
  primary: {
    main: colors.primary[400],
    light: colors.primary[300],
    dark: colors.primary[600],
    contrastText: colors.white,
  },
  error: {
    main: colors.error[400],
    light: colors.error[300],
    dark: colors.error[600],
    contrastText: colors.white,
  },
  warning: {
    main: colors.warning[400],
    light: colors.warning[300],
    dark: colors.warning[600],
    contrastText: colors.white,
  },
  success: {
    main: colors.success[400],
    light: colors.success[300],
    dark: colors.success[600],
    contrastText: colors.white,
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  border: 'rgba(255, 255, 255, 0.12)',
};

/**
 * 自定义主题调色板（示例）
 * 可以根据业务需求扩展
 */
export const customPalette: ThemePalette = {
  mode: 'custom',
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
  },
  primary: {
    main: '#6F42C1',
    light: '#9D7CE8',
    dark: '#5A32A3',
    contrastText: colors.white,
  },
  error: {
    main: colors.error[500],
    light: colors.error[300],
    dark: colors.error[700],
    contrastText: colors.white,
  },
  warning: {
    main: colors.warning[500],
    light: colors.warning[300],
    dark: colors.warning[700],
    contrastText: colors.white,
  },
  success: {
    main: colors.success[500],
    light: colors.success[300],
    dark: colors.success[700],
    contrastText: colors.white,
  },
  divider: '#DEE2E6',
  border: '#DEE2E6',
};

