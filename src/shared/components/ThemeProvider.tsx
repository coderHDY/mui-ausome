import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useMemo, type ReactNode } from 'react';
import { createTheme } from '@design-system/theme';
import { useUIStore } from '../state';

/**
 * 主题提供者组件
 * 根据UI状态自动切换主题，确保所有子组件都能访问正确的主题
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useUIStore((state) => state.themeMode);
  
  const theme = useMemo(() => createTheme(themeMode), [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

