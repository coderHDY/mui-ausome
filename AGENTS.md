# MUI Ausome — Agent 操作手册

**技术栈：** React 18 · TypeScript · Material-UI · Zustand · React Router · Vite  
**架构规范：** 模块化 feature 结构 + 设计系统驱动 UI

**Harness 说明：** ETCLOVG 七层配置与搭建步骤见 [`docs/agent-harness.md`](docs/agent-harness.md)。

---

## 架构优先（最高原则）

在架构规定层级修改（design-system / shared 公共 API / feature 的 index.ts），不在页面或组件边缘打补丁绕过契约。

跨 feature 只通过 `@shared/*` 或目标 feature 的 `index.ts` 导入，禁止深路径 `@features/foo/components/Bar`。

---

## 任务规范（必读）

- **长任务 / 多步骤任务**（预计 ≥3 步或跨多个文件）：任务开始前创建或更新根目录 `todo.md`（目标一句话 + 勾选步骤 + 完成标准）；每完成一步后重读 `todo.md`，全部完成后清空模板内容。
- **短任务**（单文件小改、一问一答）：可不写 `todo.md`。

---

## 目录架构

```
src/
├── design-system/     # 设计令牌 + 主题（@design-system/*）
├── shared/            # 共享组件、布局、UI 状态（@shared/*）
├── features/          # 功能模块（@features/*，各模块 index.ts 为公共 API）
└── App.tsx            # 路由编排
```

**路径别名：** `@/*` · `@design-system/*` · `@features/*` · `@shared/*` · `@specs/*`

---

## 关键文件地图

| 文件 | 作用 |
|---|---|
| `src/App.tsx` | 路由配置；ProtectedRoute + AppLayout 编排 |
| `src/design-system/tokens/` | spacing / colors / radius / shadows / typography |
| `src/design-system/theme/` | light / dark / custom 主题与 ThemeProvider |
| `src/shared/components/` | ThemeProvider、ProtectedRoute、ThemeToggle 等 |
| `src/shared/layout/AppLayout.tsx` | 主布局（侧边栏 + 内容区） |
| `src/shared/state/ui-store.ts` | 共享 UI 状态（Zustand） |
| `src/features/auth/` | 登录 / 注册 / authService / useAuth |
| `src/features/dashboard/` | 仪表板首页 |
| `src/features/users/` | 用户管理 |
| `src/features/data/` | 数据管理 |
| `src/features/settings/` | 设置页 |
| `src/features/profile/` | 个人资料 / 登出 |
| `src/features/navigation/` | NavigationMenu 侧边导航 |
| `src/features/copilot/` | Copilot Awesome 页面 |
| `src/features/errors/` | NotFoundPage |
| `specs/` | 功能规格（user-auth、profile-page 等） |
| `.specify/memory/constitution.md` | 项目宪法（架构原则） |
| `vite.config.ts` | Vite 配置 + 路径别名 + `/api` 代理 |

---

## 新增 Feature 标准流程（5 步）

```
Step 1 规划    阅读 specs/ 或 constitution.md，确认模块边界
Step 2 创建    src/features/<name>/ 按 components / pages / hooks / services 组织
Step 3 导出    index.ts 只导出公共 API（页面、hooks、类型）
Step 4 路由    在 App.tsx 注册；需鉴权则包在 ProtectedRoute 内
Step 5 验证    npm run type-check && npm run lint + 前端手测 happy path
```

---

## MCP 工具（优先于 grep+read）

| 需求 | 工具 |
|---|---|
| 查找符号定义 | `codegraph_search` |
| 查看函数签名/源码 | `codegraph_node` |
| 查谁调用了 X | `codegraph_callers` |
| 跟踪 X→Y 的调用链 | `codegraph_trace` |
| 变更影响范围 | `codegraph_impact` |
| 任务/区域上下文 | `codegraph_context` |
| 浏览目录 | `codegraph_files` |

**不要先 grep 再读文件**——codegraph 已经是预构建索引，比 grep+read 快且准确。

---

## 参考文档

| 文档 | 内容 |
|---|---|
| `docs/agent-harness.md` | ETCLOVG Harness 状态表 + hooks/rules 搭建步骤 |
| `README.md` | 项目架构与开发指南 |
| `.specify/memory/constitution.md` | 项目宪法与决策优先级 |
| `THEME_SYSTEM.md` | 主题系统说明 |
| `specs/` | 各功能模块规格与 contracts |

---

## 禁止事项

- **不跨 feature 深路径导入**（只走 `index.ts` 或 `@shared/*`）
- **不在展示组件内写 fetch / API 调用**（page 层或 service 负责）
- **不硬编码颜色 / 间距**（用 design token 或 MUI theme）
- **不读取 `.env.local` / `.env.*.local`**（可能含密钥；参考 `.env.example`）
- **不 `git push --force` 到 main/master**
- **不 `git reset --hard`**（应说明意图后手动操作）
- **不内联 magic number 样式**（除非引用 theme token）
