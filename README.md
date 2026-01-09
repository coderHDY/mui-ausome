# MUI Ausome - 生产级管理仪表板

基于 React + TypeScript + Material-UI 构建的生产级管理仪表板项目。

## 项目架构

本项目遵循严格的架构规范，确保代码的可维护性、可扩展性和一致性。

### 目录结构

```
src/
├── design-system/          # 设计系统（公共API）
│   ├── tokens/             # 设计令牌（spacing, colors, typography等）
│   └── theme/              # 主题系统（light/dark/custom）
├── shared/                 # 共享模块（公共API）
│   ├── components/         # 共享UI组件
│   ├── layout/             # 布局组件
│   └── state/              # 共享状态管理
├── features/               # 功能模块（按功能组织）
│   ├── dashboard/          # 仪表板功能
│   │   ├── components/     # 功能特定组件
│   │   └── pages/          # 页面组件
│   └── navigation/         # 导航功能
└── App.tsx                 # 应用根组件
```

### 架构原则

1. **模块化结构**：功能按模块组织，每个模块有明确的公共API
2. **关注点分离**：UI、状态、业务逻辑严格分离
3. **设计系统驱动**：所有样式通过设计令牌和主题系统管理
4. **状态管理**：UI状态与业务状态分离，使用专用状态层
5. **组件设计**：组件尽可能无状态，数据通过props传入

### 设计系统

所有UI样式必须通过设计系统：

- **间距**：使用 `@design-system/tokens/spacing`
- **颜色**：通过主题系统访问，不硬编码
- **字体**：使用 `@design-system/tokens/typography`
- **圆角**：使用 `@design-system/tokens/radius`
- **阴影**：使用 `@design-system/tokens/shadows`

### 主题系统

支持三种主题模式：
- `light`：浅色主题
- `dark`：深色主题
- `custom`：自定义主题

主题切换通过 `ThemeToggle` 组件实现，状态持久化到本地存储。

### 开发指南

#### 添加新功能模块

1. 在 `src/features/` 下创建新目录
2. 按以下结构组织：
   ```
   features/your-feature/
   ├── components/      # 功能特定组件
   ├── pages/          # 页面组件
   ├── hooks/          # 功能特定hooks（可选）
   └── index.ts        # 公共API导出
   ```
3. 在 `index.ts` 中只导出公共API
4. 在 `App.tsx` 中添加路由

#### 创建新组件

- **展示组件**：纯UI组件，通过props接收数据
- **容器组件**：在页面层或功能模块中，负责数据获取和状态管理
- **布局组件**：使用 `@shared/layout` 中的布局组件

#### 状态管理

- **UI状态**：使用 `@shared/state/ui-store`
- **业务状态**：在功能模块内部管理，或使用专门的状态管理方案
- **服务器状态**：使用React Query或其他数据获取库，与UI状态分离

### 技术栈

- **React 18**：UI框架
- **TypeScript**：类型安全
- **Material-UI (MUI)**：UI组件库
- **Zustand**：轻量级状态管理
- **React Router**：路由管理
- **Vite**：构建工具

### 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

### 代码规范

- 所有组件必须使用TypeScript
- 禁止内联样式，必须使用设计系统令牌
- 组件命名使用PascalCase
- 文件命名使用PascalCase（组件）或camelCase（工具函数）
- 每个模块必须有明确的公共API（index.ts）

### 决策优先级

当遇到冲突时，按以下优先级决策：

1. 长期可维护性
2. UI一致性
3. 开发者清晰度
4. 性能（除非关键）
5. 短期开发速度

## License

MIT

