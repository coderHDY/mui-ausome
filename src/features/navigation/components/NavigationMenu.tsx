import { type ReactNode } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Settings, People } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

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
    label: '设置',
    path: '/settings',
    icon: <Settings />,
  },
];

/**
 * 导航菜单组件
 * 纯UI组件，通过路由进行导航，不包含业务逻辑
 */
export function NavigationMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={isActive}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

