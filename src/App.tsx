import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@shared/components';
import { DashboardPage } from '@features/dashboard';
import { UsersPage } from '@features/users';
import { SettingsPage } from '@features/settings';
import { NotFoundPage } from '@features/errors';
import { NavigationMenu } from '@features/navigation';
import { DataPage } from '@features/data';
import { ProfilePage } from '@features/profile';
import { CopilotAwesomePage } from '@features/copilot';
import { SlidesPage } from '@features/slides';
import { AppLayout } from '@shared/layout';
import { LoginPage, RegisterPage } from '@features/auth/pages';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';

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
const routerBasename =
  import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter
        basename={routerBasename}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Auth routes - no layout wrapper */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Protected routes with layout */}
          <Route
            element={
              <ProtectedRoute>
                <LayoutRoute />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/copilot-awesome" element={<CopilotAwesomePage />} />
            <Route path="/slides" element={<SlidesPage />} />
          </Route>

          {/* Redirect unknown paths to 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

