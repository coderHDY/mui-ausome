import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@shared/components';
import { DashboardPage } from '@features/dashboard';
import { UsersPage } from '@features/users';
import { SettingsPage } from '@features/settings';
import { NotFoundPage } from '@features/errors';
import { NavigationMenu } from '@features/navigation';
import { DataPage } from '@features/data';
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
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route element={<LayoutRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          {/* 兜底路由：捕获所有未匹配的路径 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

