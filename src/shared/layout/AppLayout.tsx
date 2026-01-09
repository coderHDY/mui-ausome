import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { type ReactNode } from 'react';
import { useUIStore } from '../state';
import { ThemeToggle } from '../components';
import { spacing } from '@design-system/tokens';

const DRAWER_WIDTH = 280;

interface AppLayoutProps {
  children: ReactNode;
  sidebarContent?: ReactNode;
  title?: string;
}

/**
 * 应用布局组件
 * 提供统一的页面布局结构，包括顶部栏和侧边栏
 * 纯布局组件，不包含业务逻辑
 */
export function AppLayout({ children, sidebarContent, title = 'Admin Dashboard' }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* 顶部应用栏 */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
          width: { md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          {/* 菜单按钮 - 移动端始终显示，桌面端仅在侧边栏关闭时显示 */}
          <IconButton
            color="inherit"
            aria-label={sidebarOpen ? '关闭菜单' : '打开菜单'}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: spacing.md,
              display: { xs: 'flex', md: sidebarOpen ? 'none' : 'flex' },
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      {/* 侧边栏 */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {sidebarContent || <Typography>导航菜单</Typography>}
        </Box>
      </Drawer>

      {/* 主内容区域 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : 0}px)` },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

