import { createTheme as createMuiTheme, Theme } from '@mui/material/styles';
import { spacing, typography, radius, shadows } from '../tokens';
import { lightPalette, darkPalette, customPalette } from './palettes';
import type { ThemeMode, ThemeConfig } from './types';

/**
 * 创建主题配置
 * 将设计令牌和调色板组合成完整的主题配置
 */
export function createThemeConfig(mode: ThemeMode): ThemeConfig {
  const palettes = {
    light: lightPalette,
    dark: darkPalette,
    custom: customPalette,
  };

  return {
    palette: palettes[mode],
    spacing,
    typography,
    radius,
    shadows,
  };
}

/**
 * 创建MUI主题
 * 将我们的主题配置转换为MUI主题对象
 */
export function createTheme(mode: ThemeMode = 'light'): Theme {
  const themeConfig = createThemeConfig(mode);
  const { palette } = themeConfig;

  return createMuiTheme({
    palette: {
      mode: palette.mode === 'dark' ? 'dark' : 'light',
      primary: {
        main: palette.primary.main,
        light: palette.primary.light,
        dark: palette.primary.dark,
        contrastText: palette.primary.contrastText,
      },
      error: {
        main: palette.error.main,
        light: palette.error.light,
        dark: palette.error.dark,
        contrastText: palette.error.contrastText,
      },
      warning: {
        main: palette.warning.main,
        light: palette.warning.light,
        dark: palette.warning.dark,
        contrastText: palette.warning.contrastText,
      },
      success: {
        main: palette.success.main,
        light: palette.success.light,
        dark: palette.success.dark,
        contrastText: palette.success.contrastText,
      },
      background: {
        default: palette.background.default,
        paper: palette.background.paper,
      },
      text: {
        primary: palette.text.primary,
        secondary: palette.text.secondary,
        disabled: palette.text.disabled,
      },
      divider: palette.divider,
    },
    typography: {
      fontFamily: themeConfig.typography.fontFamily.primary,
      fontSize: 16,
      h1: {
        fontSize: themeConfig.typography.fontSize.xxxl,
        fontWeight: themeConfig.typography.fontWeight.bold,
        lineHeight: themeConfig.typography.lineHeight.tight,
      },
      h2: {
        fontSize: themeConfig.typography.fontSize.xxl,
        fontWeight: themeConfig.typography.fontWeight.bold,
        lineHeight: themeConfig.typography.lineHeight.tight,
      },
      h3: {
        fontSize: themeConfig.typography.fontSize.xl,
        fontWeight: themeConfig.typography.fontWeight.semibold,
        lineHeight: themeConfig.typography.lineHeight.normal,
      },
      h4: {
        fontSize: themeConfig.typography.fontSize.lg,
        fontWeight: themeConfig.typography.fontWeight.semibold,
        lineHeight: themeConfig.typography.lineHeight.normal,
      },
      body1: {
        fontSize: themeConfig.typography.fontSize.md,
        lineHeight: themeConfig.typography.lineHeight.normal,
      },
      body2: {
        fontSize: themeConfig.typography.fontSize.sm,
        lineHeight: themeConfig.typography.lineHeight.normal,
      },
    },
    shape: {
      borderRadius: themeConfig.radius.md,
    },
    shadows: [
      'none',
      themeConfig.shadows.sm,
      themeConfig.shadows.md,
      themeConfig.shadows.lg,
      themeConfig.shadows.xl,
      ...Array(19).fill(themeConfig.shadows.xl),
    ] as any,
    spacing: (factor: number) => `${factor * 4}px`,
  });
}

