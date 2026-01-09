import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode, Palette } from '@mui/icons-material';
import { useUIStore } from '../state';
import type { ThemeMode } from '@design-system/theme';

/**
 * 主题切换组件
 * 纯UI组件，无业务逻辑，通过状态管理更新主题
 */
export function ThemeToggle() {
  const themeMode = useUIStore((state) => state.themeMode);
  const setThemeMode = useUIStore((state) => state.setThemeMode);

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'custom'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getIcon = () => {
    switch (themeMode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'custom':
        return <Palette />;
    }
  };

  const getTooltip = () => {
    switch (themeMode) {
      case 'light':
        return '切换到深色主题';
      case 'dark':
        return '切换到自定义主题';
      case 'custom':
        return '切换到浅色主题';
    }
  };

  return (
    <Tooltip title={getTooltip()}>
      <IconButton onClick={cycleTheme} color="inherit">
        {getIcon()}
      </IconButton>
    </Tooltip>
  );
}

