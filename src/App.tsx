import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@shared/components';
import { DashboardPage } from '@features/dashboard';
import { UsersPage } from '@features/users';
import { SettingsPage } from '@features/settings';
import { NavigationMenu } from '@features/navigation';
import { AppLayout } from '@shared/layout';

/**
 * 布局路由组件
 * 使用Outlet渲染子路由，实现布局与路由的分离
 */
function LayoutRoute() {
  return (
    <AppLayout sidebarContent={<NavigationMenu />} title="管理仪表板">
      <Outlet />
    </AppLayout>
  );
}

/**
 * 应用根组件
 * 负责路由配置和全局布局编排
 */
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<LayoutRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

