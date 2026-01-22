import { type ReactNode } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { Dashboard, Settings, People, Storage } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '@shared/state';
import { useMediaQuery, useTheme } from '@mui/material';

/**
 * 导航菜单项配置
 * 配置与组件分离，便于维护和扩展
 */

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    label: '仪表板',
    path: '/',
    icon: <Dashboard />,
  },
  {
    label: '用户管理',
    path: '/users',
    icon: <People />,
  },
  {
    label: '数据管理',
    path: '/data',
    icon: <Storage />,
  },
  {
    label: '设置',
    path: '/settings',
    icon: <Settings />,
  },
];

/**
 * 导航菜单组件
 * 纯UI组件，通过路由进行导航，不包含业务逻辑
 * 支持折叠状态下的图标模式
 */
export function NavigationMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  
  // PC版本折叠时显示Tooltip
  const showTooltip = !isMobile && sidebarCollapsed;

  // 处理菜单项点击：导航并在移动端关闭侧边栏
  const handleItemClick = (path: string) => {
    navigate(path);
    // 只在移动端关闭侧边栏，PC端保持打开
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <List>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const button = (
          <ListItemButton
            selected={isActive}
            onClick={() => handleItemClick(item.path)}
            sx={{
              justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
              px: sidebarCollapsed && !isMobile ? 1.5 : 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: sidebarCollapsed && !isMobile ? 0 : 56,
                justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              sx={{
                display: { xs: 'block', md: sidebarCollapsed ? 'none' : 'block' },
              }}
            />
          </ListItemButton>
        );

        return (
          <ListItem key={item.path} disablePadding>
            {showTooltip ? (
              <Tooltip title={item.label} placement="right" arrow>
                {button}
              </Tooltip>
            ) : (
              button
            )}
          </ListItem>
        );
      })}
    </List>
  );
}

