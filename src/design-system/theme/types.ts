/**
 * 主题类型定义
 */
export type ThemeMode = 'light' | 'dark' | 'custom';

export interface ThemePalette {
  mode: ThemeMode;
  background: {
    default: string;
    paper: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  error: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  warning: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  success: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  divider: string;
  border: string;
}

export interface ThemeConfig {
  palette: ThemePalette;
  spacing: typeof import('../tokens/spacing').spacing;
  typography: typeof import('../tokens/typography').typography;
  radius: typeof import('../tokens/radius').radius;
  shadows: typeof import('../tokens/shadows').shadows;
}

