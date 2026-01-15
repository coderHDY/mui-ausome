# MUI Theme 系统开发与使用指南

本文档详细说明本项目中 MUI Theme 系统的架构设计、开发流程和使用方法。

## 📋 目录

- [系统架构概览](#系统架构概览)
- [第一层：设计令牌 (Design Tokens)](#第一层设计令牌-design-tokens)
- [第二层：类型定义 (Type Definitions)](#第二层类型定义-type-definitions)
- [第三层：调色板定义 (Palettes)](#第三层调色板定义-palettes)
- [第四层：主题创建 (Theme Creation)](#第四层主题创建-theme-creation)
- [第五层：主题提供者 (Theme Provider)](#第五层主题提供者-theme-provider)
- [状态管理：主题模式存储](#状态管理主题模式存储)
- [应用入口：主题初始化](#应用入口主题初始化)
- [组件中使用主题](#组件中使用主题)
- [主题切换组件](#主题切换组件)
- [完整数据流](#完整数据流)
- [最佳实践](#最佳实践)

---

## 系统架构概览

本项目的 MUI Theme 系统采用**分层设计**，从底层设计令牌到顶层主题应用，共分为 5 层：

```
设计令牌 (tokens) 
    ↓
类型定义 (types) 
    ↓
调色板 (palettes) 
    ↓
主题创建 (createTheme) 
    ↓
主题提供者 (ThemeProvider)
```

### 文件结构

```
src/
├── design-system/
│   ├── tokens/                    # 设计令牌层
│   │   ├── colors.ts              # 基础颜色定义
│   │   ├── spacing.ts             # 间距定义
│   │   ├── typography.ts          # 字体排版定义
│   │   ├── radius.ts              # 圆角定义
│   │   ├── shadows.ts             # 阴影定义
│   │   └── index.ts               # 统一导出
│   └── theme/                     # 主题系统层
│       ├── types.ts                # TypeScript 类型定义
│       ├── palettes.ts             # 调色板定义（light/dark/custom）
│       ├── createTheme.ts          # 主题创建函数
│       └── index.ts                # 统一导出
├── shared/
│   ├── components/
│   │   └── ThemeProvider.tsx      # 主题提供者组件
│   └── state/
│       └── ui-store.ts            # 主题状态管理
└── App.tsx                         # 应用入口（初始化主题）
```

---

## 第一层：设计令牌 (Design Tokens)

### 文件：`src/design-system/tokens/colors.ts`

**作用**：定义基础颜色值，作为所有主题的**单一数据源**。

```typescript
/**
 * 颜色设计令牌
 * 定义基础颜色调色板，主题特定的颜色在主题文件中定义
 */
export const colors = {
  // 基础灰度
  white: '#FFFFFF',
  black: '#000000',
  
  // 语义化颜色（基础定义，实际使用通过主题）
  primary: {
    50: '#E3F2FD',   // 最浅
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',  // 主色
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',  // 最深
  },
  // ... error, warning, success 类似结构
} as const;
```

**关键点**：
- 使用 `as const` 确保类型推断为字面量类型
- 提供完整的色阶（50-900），便于不同主题选择不同深浅
- 只定义基础颜色，不包含主题特定的颜色（如背景色、文字色）

### 其他设计令牌

- **spacing.ts**：定义间距规范（xs, sm, md, lg, xl 等）
- **typography.ts**：定义字体大小、字重、行高等
- **radius.ts**：定义圆角大小
- **shadows.ts**：定义阴影效果

---

## 第二层：类型定义 (Type Definitions)

### 文件：`src/design-system/theme/types.ts`

**作用**：提供 TypeScript 类型约束，确保主题配置的类型安全。

```typescript
/**
 * 主题模式枚举
 */
export type ThemeMode = 'light' | 'dark' | 'custom';

/**
 * 调色板接口
 * 定义主题调色板的完整结构
 */
export interface ThemePalette {
  mode: ThemeMode;
  background: {
    default: string;   // 默认背景色
    paper: string;     // 卡片/纸张背景色
    elevated: string;  // 悬浮元素背景色
  };
  text: {
    primary: string;    // 主要文字色
    secondary: string;  // 次要文字色
    disabled: string;   // 禁用文字色
  };
  primary: {
    main: string;        // 主色
    light: string;       // 浅色变体
    dark: string;        // 深色变体
    contrastText: string; // 对比文字色（用于主色背景上）
  };
  // ... error, warning, success 类似结构
  divider: string;  // 分割线颜色
  border: string;   // 边框颜色
}

/**
 * 完整主题配置接口
 * 包含调色板 + 所有设计令牌
 */
export interface ThemeConfig {
  palette: ThemePalette;
  spacing: typeof import('../tokens/spacing').spacing;
  typography: typeof import('../tokens/typography').typography;
  radius: typeof import('../tokens/radius').radius;
  shadows: typeof import('../tokens/shadows').shadows;
}
```

**关键点**：
- `ThemeMode`：限制主题模式只能是预定义的三种
- `ThemePalette`：定义调色板的完整结构，确保所有调色板都遵循相同结构
- `ThemeConfig`：使用 `typeof` 动态引用设计令牌类型，保持类型同步

---

## 第三层：调色板定义 (Palettes)

### 文件：`src/design-system/theme/palettes.ts`

**作用**：为不同主题模式定义具体的颜色值。

### 浅色主题 (lightPalette)

```typescript
export const lightPalette: ThemePalette = {
  mode: 'light',
  background: {
    default: '#F5F5F5',  // 浅灰背景
    paper: '#FFFFFF',    // 白色卡片
    elevated: '#FFFFFF', // 白色悬浮元素
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',   // 深色文字（87% 不透明度）
    secondary: 'rgba(0, 0, 0, 0.6)',   // 次要文字（60% 不透明度）
    disabled: 'rgba(0, 0, 0, 0.38)',   // 禁用文字（38% 不透明度）
  },
  primary: {
    main: colors.primary[500],   // 使用主色 500
    light: colors.primary[300],   // 使用浅色 300
    dark: colors.primary[700],    // 使用深色 700
    contrastText: colors.white,   // 白色对比文字
  },
  // ...
};
```

### 深色主题 (darkPalette)

```typescript
export const darkPalette: ThemePalette = {
  mode: 'dark',
  background: {
    default: '#121212',  // 深色背景
    paper: '#1E1E1E',    // 深灰卡片
    elevated: '#2C2C2C', // 更亮的悬浮元素
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',   // 浅色文字（87% 不透明度）
    secondary: 'rgba(255, 255, 255, 0.6)',   // 次要文字（60% 不透明度）
    disabled: 'rgba(255, 255, 255, 0.38)',   // 禁用文字（38% 不透明度）
  },
  primary: {
    main: colors.primary[400],   // ⚠️ 使用 400 而不是 500（更亮）
    light: colors.primary[300],
    dark: colors.primary[600],
    contrastText: colors.white,
  },
  // ...
};
```

**关键差异**：
- **浅色主题**：背景浅、文字深，primary 使用 500
- **深色主题**：背景深、文字浅，primary 使用 400（更亮，在深色背景下更易读）

### 自定义主题 (customPalette)

可以根据业务需求扩展，例如品牌色、特殊配色方案等。

---

## 第四层：主题创建 (Theme Creation)

### 文件：`src/design-system/theme/createTheme.ts`

**作用**：将我们的主题配置转换为 MUI 可以使用的 `Theme` 对象。

### 1. createThemeConfig 函数

```typescript
/**
 * 创建主题配置
 * 将设计令牌和调色板组合成完整的主题配置
 */
export function createThemeConfig(mode: ThemeMode): ThemeConfig {
  const palettes = {
    light: lightPalette,
    dark: darkPalette,
    custom: customPalette,
  };

  return {
    palette: palettes[mode],
    spacing,
    typography,
    radius,
    shadows,
  };
}
```

**作用**：根据主题模式选择对应的调色板，并组合所有设计令牌。

### 2. createTheme 函数

```typescript
/**
 * 创建MUI主题
 * 将我们的主题配置转换为MUI主题对象
 */
export function createTheme(mode: ThemeMode = 'light'): Theme {
  const themeConfig = createThemeConfig(mode);
  const { palette } = themeConfig;

  return createMuiTheme({
    palette: {
      mode: palette.mode === 'dark' ? 'dark' : 'light',
      primary: {
        main: palette.primary.main,
        light: palette.primary.light,
        dark: palette.primary.dark,
        contrastText: palette.primary.contrastText,
      },
      // ... error, warning, success
      background: {
        default: palette.background.default,
        paper: palette.background.paper,
      },
      text: {
        primary: palette.text.primary,
        secondary: palette.text.secondary,
        disabled: palette.text.disabled,
      },
      divider: palette.divider,
    },
    typography: {
      fontFamily: themeConfig.typography.fontFamily.primary,
      fontSize: 16,
      h1: {
        fontSize: themeConfig.typography.fontSize.xxxl,
        fontWeight: themeConfig.typography.fontWeight.bold,
        lineHeight: themeConfig.typography.lineHeight.tight,
      },
      // ... h2, h3, h4, body1, body2
    },
    shape: {
      borderRadius: themeConfig.radius.md,
    },
    shadows: [
      'none',
      themeConfig.shadows.sm,
      themeConfig.shadows.md,
      themeConfig.shadows.lg,
      themeConfig.shadows.xl,
      ...Array(19).fill(themeConfig.shadows.xl),
    ] as any,
    spacing: (factor: number) => `${factor * 4}px`,
  });
}
```

**关键点**：
- 调用 MUI 的 `createMuiTheme` 创建标准 MUI Theme 对象
- 将我们的 `ThemePalette` 映射到 MUI 的 `palette` 结构
- 配置 typography、shape、shadows 等
- `spacing` 函数：`spacing(2)` 返回 `'8px'`（2 * 4px）

---

## 第五层：主题提供者 (Theme Provider)

### 文件：`src/shared/components/ThemeProvider.tsx`

**作用**：在应用根部提供主题上下文，使所有子组件都能访问主题。

```typescript
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
```

**关键点**：
1. **从状态管理读取主题模式**：`useUIStore((state) => state.themeMode)`
2. **使用 useMemo 优化性能**：只有当 `themeMode` 变化时才重新创建主题
3. **MuiThemeProvider**：MUI 提供的 Context Provider，注入主题到 React Context
4. **CssBaseline**：MUI 提供的全局样式重置组件

---

## 状态管理：主题模式存储

### 文件：`src/shared/state/ui-store.ts`

**作用**：使用 Zustand 管理主题模式，并持久化到 localStorage。

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@design-system/theme';

interface UIState {
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
}

interface UIActions {
  setThemeMode: (mode: ThemeMode) => void;
  // ... 其他 actions
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      themeMode: 'light',  // 默认浅色主题
      // ...
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        themeMode: state.themeMode,  // 只持久化主题模式
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
```

**关键点**：
- 使用 `persist` 中间件将主题模式保存到 localStorage
- `partialize` 只持久化需要的字段，节省存储空间
- 刷新页面后主题模式会自动恢复

---

## 应用入口：主题初始化

### 文件：`src/App.tsx`

**作用**：在应用根部包裹 `ThemeProvider`，初始化主题系统。

```typescript
import { ThemeProvider } from '@shared/components';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* 路由配置 */}
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

**关键点**：
- `ThemeProvider` 必须在最外层，确保所有组件都能访问主题
- 通常与路由、状态管理等全局组件一起放在应用根部

---

## 组件中使用主题

### 基本用法

```typescript
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
      }}
    >
      Hello World
    </Box>
  );
}
```

### 实际示例：UserTable.tsx

```typescript
import { useTheme } from '@mui/material/styles';

export function UserTable({ users }: UserTableProps) {
  const theme = useTheme();

  // 根据角色获取颜色
  const getRoleColor = (role: User['role']) => {
    const colors = {
      admin: theme.palette.error.main,
      moderator: theme.palette.warning.main,
      user: theme.palette.primary.main,
    };
    return colors[role];
  };

  return (
    <TableContainer
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: radius.lg,
      }}
    >
      {/* ... */}
    </TableContainer>
  );
}
```

### 常用主题属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `theme.palette.primary.main` | 主色 | `'#2196F3'` |
| `theme.palette.text.primary` | 主要文字色 | `'rgba(0, 0, 0, 0.87)'` |
| `theme.palette.background.paper` | 卡片背景色 | `'#FFFFFF'` |
| `theme.palette.divider` | 分割线颜色 | `'rgba(0, 0, 0, 0.12)'` |
| `theme.spacing(2)` | 间距（2 * 4px） | `'8px'` |
| `theme.typography.h1` | H1 样式对象 | `{ fontSize: '2rem', ... }` |
| `theme.shape.borderRadius` | 默认圆角 | `4` |
| `theme.breakpoints.down('sm')` | 响应式断点 | `'@media (max-width:600px)'` |

### 使用 alpha 函数创建半透明颜色

```typescript
import { alpha, useTheme } from '@mui/material/styles';

const theme = useTheme();

<Box
  sx={{
    backgroundColor: alpha(theme.palette.primary.main, 0.1),  // 10% 不透明度
    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`, // 50% 不透明度
  }}
/>
```

---

## 主题切换组件

### 文件：`src/shared/components/ThemeToggle.tsx`

**作用**：提供用户界面来切换主题模式。

```typescript
import { useUIStore } from '../state';
import type { ThemeMode } from '@design-system/theme';

export function ThemeToggle() {
  const themeMode = useUIStore((state) => state.themeMode);
  const setThemeMode = useUIStore((state) => state.setThemeMode);

  const cycleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'custom'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  return (
    <IconButton onClick={cycleTheme}>
      {/* 根据当前主题显示不同图标 */}
    </IconButton>
  );
}
```

**工作流程**：
1. 用户点击切换按钮
2. 调用 `setThemeMode` 更新状态
3. `ThemeProvider` 监听到状态变化
4. 重新创建主题并更新所有组件

---

## 完整数据流

```
┌─────────────────────────────────────────────────────────────┐
│  用户操作：点击主题切换按钮                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  ThemeToggle.setThemeMode('dark')                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  ui-store 更新 themeMode 状态                                │
│  (同时保存到 localStorage)                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  ThemeProvider 监听到 themeMode 变化                         │
│  (通过 useUIStore hook)                                      │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  useMemo 重新计算，调用 createTheme('dark')                  │
│  (只有当 themeMode 变化时才重新创建)                          │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  createTheme('dark')                                         │
│    ↓                                                         │
│  createThemeConfig('dark')                                   │
│    ↓                                                         │
│  返回包含 darkPalette 的 ThemeConfig                         │
│    ↓                                                         │
│  转换为 MUI Theme 对象                                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  MuiThemeProvider 更新 theme prop                            │
│  (触发 React Context 更新)                                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  所有使用 useTheme() 的组件自动更新样式                       │
│  (React Context 自动传播更新)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 最佳实践

### ✅ 推荐做法

1. **始终使用主题颜色**：不要硬编码颜色值
   ```typescript
   // ✅ 正确
   backgroundColor: theme.palette.primary.main
   
   // ❌ 错误
   backgroundColor: '#2196F3'
   ```

2. **使用设计令牌**：间距、圆角等使用设计系统令牌
   ```typescript
   // ✅ 正确
   padding: spacing.md
   borderRadius: radius.lg
   
   // ❌ 错误
   padding: '16px'
   borderRadius: '8px'
   ```

3. **使用 useMemo 优化主题创建**：避免不必要的重新创建
   ```typescript
   // ✅ 正确（已在 ThemeProvider 中实现）
   const theme = useMemo(() => createTheme(themeMode), [themeMode]);
   ```

4. **使用 alpha 函数创建半透明效果**
   ```typescript
   backgroundColor: alpha(theme.palette.primary.main, 0.1)
   ```

5. **利用主题的响应式功能**
   ```typescript
   sx={{
     width: { xs: '100%', sm: '50%', md: '33%' },
     fontSize: { xs: '0.875rem', md: '1rem' },
   }}
   ```

### ❌ 避免的做法

1. **不要直接导入设计令牌在组件中使用**
   ```typescript
   // ❌ 错误：应该通过主题访问
   import { colors } from '@design-system/tokens';
   backgroundColor: colors.primary[500]
   
   // ✅ 正确：通过主题访问
   backgroundColor: theme.palette.primary.main
   ```

2. **不要在组件中直接创建主题**
   ```typescript
   // ❌ 错误：应该使用 ThemeProvider
   const theme = createTheme('light');
   
   // ✅ 正确：使用 useTheme hook
   const theme = useTheme();
   ```

3. **不要硬编码主题相关的值**
   ```typescript
   // ❌ 错误
   color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
   
   // ✅ 正确：使用主题提供的颜色
   color: theme.palette.text.primary
   ```

---

## 扩展主题系统

### 添加新的主题模式

1. 在 `types.ts` 中添加新的 `ThemeMode`
   ```typescript
   export type ThemeMode = 'light' | 'dark' | 'custom' | 'high-contrast';
   ```

2. 在 `palettes.ts` 中创建新的调色板
   ```typescript
   export const highContrastPalette: ThemePalette = {
     mode: 'high-contrast',
     // ...
   };
   ```

3. 在 `createTheme.ts` 中注册新调色板
   ```typescript
   const palettes = {
     light: lightPalette,
     dark: darkPalette,
     custom: customPalette,
     'high-contrast': highContrastPalette,
   };
   ```

### 添加新的颜色语义

1. 在 `types.ts` 的 `ThemePalette` 中添加新颜色
   ```typescript
   export interface ThemePalette {
     // ...
     info: {
       main: string;
       light: string;
       dark: string;
       contrastText: string;
     };
   }
   ```

2. 在所有调色板中定义新颜色
3. 在 `createTheme.ts` 中映射到 MUI Theme

---

## 总结

本项目的 MUI Theme 系统具有以下特点：

- ✅ **类型安全**：完整的 TypeScript 类型约束
- ✅ **可扩展**：易于添加新主题模式和颜色语义
- ✅ **可维护**：清晰的分层架构，职责明确
- ✅ **性能优化**：使用 `useMemo` 避免重复创建主题
- ✅ **持久化**：主题选择自动保存到 localStorage
- ✅ **一致性**：所有样式通过设计系统统一管理

通过这套系统，你可以：
- 轻松切换主题模式
- 保持 UI 样式的一致性
- 快速扩展新的主题
- 确保类型安全
- 优化应用性能

---

## 相关文件索引

- 设计令牌：`src/design-system/tokens/`
- 主题类型：`src/design-system/theme/types.ts`
- 调色板：`src/design-system/theme/palettes.ts`
- 主题创建：`src/design-system/theme/createTheme.ts`
- 主题提供者：`src/shared/components/ThemeProvider.tsx`
- 状态管理：`src/shared/state/ui-store.ts`
- 应用入口：`src/App.tsx`
