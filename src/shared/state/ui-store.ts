import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@design-system/theme';

/**
 * UI状态存储
 * 管理全局UI状态，如主题模式、侧边栏状态等
 * 与业务逻辑状态严格分离
 */
interface UIState {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
}

interface UIActions {
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // State
      themeMode: 'light',
      sidebarOpen: true,

      // Actions
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ themeMode: state.themeMode }),
    }
  )
);

