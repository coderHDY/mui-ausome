import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import { useMemo, type ReactNode } from 'react';
import { createTheme } from '@design-system/theme';
import { useUIStore } from '../state';
import { APP_UI_SCALE_VAR, useFullscreen } from '../hooks';

/**
 * 主题提供者组件
 * 根据UI状态自动切换主题，确保所有子组件都能访问正确的主题
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useUIStore((state) => state.themeMode);
  useFullscreen();

  const theme = useMemo(() => createTheme(themeMode), [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: {
            [APP_UI_SCALE_VAR]: 1,
          },
          '.MuiDialog-paper': {
            zoom: `var(${APP_UI_SCALE_VAR}, 1)`,
          },
        }}
      />
      {children}
    </MuiThemeProvider>
  );
}

