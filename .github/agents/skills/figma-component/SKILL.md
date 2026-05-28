---
name: figma-component
description: "根据 Figma 节点 URL 自动抓取设计数据并生成符合 MUI 5 规范的 React 组件。触发词：figma组件、接入figma组件、figma转MUI、figma转组件、根据figma写组件、figma节点生成、从figma生成、figma to MUI、figma component。用户消息包含「figma组件：<URL>」「接入figma组件：<URL>」或消息中含有 Figma URL（https://www.figma.com/design/... 或 https://www.figma.com/file/...）且要求生成组件时启用。"
---

# Figma → MUI 组件生成

**启动时宣告：** "我正在使用 figma-component skill，开始抓取 Figma 节点并生成 MUI 组件。"

## 触发格式

以下任意格式均可触发本 Skill：

```
figma组件：<Figma URL>
接入figma组件：<Figma URL>
figma转MUI：<Figma URL>
根据figma写组件 <Figma URL>
```

**核心规则：消息中包含 `https://www.figma.com/design/` 或 `https://www.figma.com/file/` 链接，且意图是生成组件，即触发本 Skill。**

示例：

```
figma组件：https://www.figma.com/design/JHvvuFjNysvggF06fX7L0h/...?node-id=37-394&m=dev
```

---

## 执行步骤

### Step 1 — 提取 URL，注入脚本变量

从用户消息中提取完整 Figma URL（`https://www.figma.com/design/...`），作为脚本的第一个命令行参数传入（对应 `process.argv[2]` / `FIGMA_URL`）。

若消息中没有 URL，立即追问：「请提供包含 `node-id` 参数的 Figma 页面 URL。」

### Step 2 — 运行抓取脚本（将 URL 作为 argv[2] 传入）

在项目根目录执行（脚本路径相对于本 SKILL.md 文件所在目录）：

```bash
node <SKILL_DIR>/scripts/fetch-figma.js "<从消息中提取的完整URL>"
```

> `<SKILL_DIR>` 为本 SKILL.md 文件的所在目录的绝对路径，由 AI 根据读取到的 SKILL 文件路径动态解析，无需硬编码。

脚本内部：`const FIGMA_URL = process.argv[2] || process.env.FIGMA_URL`

- 自动解析 URL 中的 `node-id` 参数
- 精简节点 JSON，写入 `.figma_context/node_<nodeId>.json`
  - 例：`node-id=37-395` → `.figma_context/node_37-395.json`
- 若失败（缺少 `FIGMA_TOKEN`、节点不存在等），将错误告知用户并停止。

### Step 3 — 读取节点 JSON

读取 `.figma_context/node_<nodeId>.json`，分析其完整树结构，重点关注：

- `layoutMode` / `primaryAxisAlignItems` / `counterAxisAlignItems` / `itemSpacing`
- `layoutGrow` / `layoutAlign`（flex 子项）
- `padding*`（内边距）
- `width` / `height`（固定尺寸）
- `componentProperties`（变体枚举）
- `styles`（Token 绑定）
- `fills`（颜色）
- `characters` / `style`（文字）

### Step 4 — 生成 MUI 组件（严格遵守以下映射规范）

#### 4.1 语义化组件优先

| Figma `name` 包含     | MUI 组件                  |
| --------------------- | ------------------------- |
| `Button`              | `<Button>`                |
| `TextField` / `Input` | `<TextField>`             |
| `Avatar`              | `<Avatar>`                |
| `Chip` / `Badge`      | `<Chip>` / `<Badge>`      |
| `Select` / `Dropdown` | `<Select>`                |
| `Checkbox` / `Switch` | `<Checkbox>` / `<Switch>` |

`componentProperties` 中的变体直接映射为 MUI props：

- `Type: "Secondary"` → `color="secondary"`
- `Variant: "Outlined"` → `variant="outlined"`
- `Size: "Small"` → `size="small"`

#### 4.2 布局树映射（禁止滥用 `<div>`）

| Figma 属性                                 | MUI 实现                                                        |
| ------------------------------------------ | --------------------------------------------------------------- |
| `layoutMode: "VERTICAL"` + `itemSpacing`   | `<Stack direction="column" spacing={N}>` 或 `sx={{ gap: Npx }}` |
| `layoutMode: "HORIZONTAL"` + `itemSpacing` | `<Stack direction="row" spacing={N}>`                           |
| 无 layoutMode 的容器                       | `<Box>`                                                         |
| `layoutGrow: 1`（父级是 Stack）            | `sx={{ flexGrow: 1 }}`                                          |
| `layoutAlign: "STRETCH"`                   | `sx={{ alignSelf: 'stretch' }}`                                 |
| `primaryAxisAlignItems: "MAX"`             | `justifyContent: 'flex-end'`                                    |
| `primaryAxisAlignItems: "CENTER"`          | `justifyContent: 'center'`                                      |
| `counterAxisAlignItems: "CENTER"`          | `alignItems: 'center'`                                          |
| `primaryAxisAlignItems: "SPACE_BETWEEN"`   | `justifyContent: 'space-between'`                               |

#### 4.3 颜色 Token 映射（禁止硬编码 hex / rgba）

1. 先检查节点 `styles` 字段是否绑定了 Token。
2. 根据 Token 名称（如 `primary`、`background.paper`、`text.secondary`）映射为 MUI 语义色：

| Token 语义                | MUI `sx` 写法                            |
| ------------------------- | ---------------------------------------- |
| 白色 / `background.paper` | `bgcolor: 'background.paper'`            |
| 主色                      | `color: 'primary.main'`                  |
| 浅灰背景（如 `#F7F7F9`）  | `bgcolor: 'grey.50'`                     |
| 分隔线                    | `theme.palette.divider`                  |
| 带透明度的主色            | `alpha(theme.palette.primary.main, 0.1)` |

3. 若无 Token 绑定，取 `fills[0].color` 转成最接近的 MUI 语义色，**不得**直接写 `r/g/b` 数值。

#### 4.4 间距映射

- 使用项目 `@design-system/tokens` 中的 `spacing` 常量。
- Figma `padding*` 值参考：`4→xs` `8→sm` `16→md` `24→lg` `32→xl`。
- `itemSpacing` 转 MUI `spacing`：除以 8（MUI 默认步长）；不整除时用 `sx={{ gap: 'Xpx' }}`。

#### 4.5 固定尺寸

- 仅对 Figma 中**明确锁定**的尺寸（如按钮 `width:142 height:40`、弹窗 `width:1022 height:669`）使用固定值。
- 弹性区域（`layoutGrow:1` 或占满剩余空间）不设固定宽/高，改用 `flex:1` / `flexGrow:1`。

#### 4.6 多端响应式策略（PC + 手机 / iPad 版本）

当用户同时提供同一组件的多个屏幕尺寸版本（PC、手机、iPad）时，**优先做响应式布局而不是完整复刻每个 Figma 帧的静态配置**。

**决策树：**

```
提供了多端设计稿？
  └─ 是 → 差异主要是间距/字号/排列方向？
              └─ 是 → ✅ 用 flex + MUI breakpoint 做单套响应式组件
              └─ 否（结构差异太大，无法共用一套 DOM）→ ✅ 写两套展示子组件，
                                                          用 display breakpoint 控制显示/隐藏，
                                                          状态统一提升到父组件
```

**方案 A — Flex + Breakpoint 响应式（首选）**

适用：布局方向、间距、字号、某些元素的显隐可以通过响应式 sx 值覆盖。

```tsx
// 方向切换示例
<Stack
  direction={{ xs: "column", md: "row" }}
  gap={{ xs: spacing.sm, md: spacing.md }}
>
  {/* 仅在移动端显示的元素 */}
  <Box sx={{ display: { xs: "flex", md: "none" } }}>...</Box>
  {/* 仅在桌面端显示的元素 */}
  <Box sx={{ display: { xs: "none", md: "flex" } }}>...</Box>
</Stack>
```

**方案 B — 双布局子组件（复杂结构时）**

适用：两端的 DOM 结构差异过大，强行合并会导致代码难以维护。

规则：

1. 提取私有子组件（不导出），命名如 `DesktopView` / `MobileView`。
2. 所有**状态、事件回调**统一定义在父组件，通过 props 向下传递，**禁止在子组件内各自维护独立状态**。
3. 使用 `display: { xs: 'none', md: 'block' }` / `display: { xs: 'block', md: 'none' }` 控制显示。

```tsx
// 状态统一在父组件
const [checked, setChecked] = useState(false);

return (
  <>
    {/* 桌面版 */}
    <DesktopView
      sx={{ display: { xs: "none", md: "flex" } }}
      checked={checked}
      onCheck={setChecked}
    />
    {/* 移动版 */}
    <MobileView
      sx={{ display: { xs: "flex", md: "none" } }}
      checked={checked}
      onCheck={setChecked}
    />
  </>
);
```

**MUI 断点参考（项目默认）：**

| 断点 | 宽度    | 对应场景           |
| ---- | ------- | ------------------ |
| xs   | 0px+    | 手机（纵向）       |
| sm   | 600px+  | 手机（横向）/ iPad |
| md   | 900px+  | iPad 宽屏 / 桌面   |
| lg   | 1200px+ | 大屏桌面           |

> **布局样式差异优先用 `sx` 响应式对象**（不触发重渲染，CSS 原生处理）；**需要条件渲染不同组件时用 `useMediaQuery`**（见下方说明）。

**`useMediaQuery` 适用场景（条件渲染，DOM 中只保留一个）：**

```tsx
const isMobile = useMediaQuery(theme.breakpoints.down("md"));
// ✅ 两个组件行为/生命周期完全不同，不应同时存在于 DOM
return isMobile ? <MobileDrawer /> : <DesktopSidebar />;
```

**`sx` 响应式对象适用场景（两者都在 DOM，CSS 控制显隐）：**

```tsx
// ✅ 结构相近，只是样式/排列不同；或隐藏的部分足够轻量
<Box sx={{ display: { xs: "none", md: "flex" } }}>...</Box>
```

**选择依据：**

| 情况                                            | 方案                                |
| ----------------------------------------------- | ----------------------------------- |
| 两端只是样式/间距/方向不同                      | `sx` 响应式                         |
| 两端 DOM 结构差异大，但逻辑相近                 | 方案 B（双子组件 + `display` 隐藏） |
| 两端是完全不同的组件（如 Drawer vs 固定侧边栏） | `useMediaQuery` 条件渲染            |
| 断点值需要影响非 UI 逻辑（请求参数等）          | `useMediaQuery`                     |

#### 4.7 文件放置规范

- 组件文件放到对应 feature 目录的 `components/` 下（如 `src/features/users/components/`）。
- 若是通用 UI 组件，放到 `src/shared/components/`。
- 写完后在同目录的 `index.ts` 追加导出。

#### 4.8 代码质量要求

- 完整 TypeScript 类型，包含 Props interface 和导出。
- 使用 `useTheme()` 获取主题，不 import 原始色值。
- 受控表单使用 `useState` + `useEffect` 同步外部数据。
- 禁止在组件内写业务逻辑（如 API 调用），通过 Props 回调暴露。

### Step 5 — 验证

运行类型检查确认零报错：

```bash
npx tsc --noEmit
```

如有错误，立即修复后重新验证。

---

## 注意事项

- `.figma_context/node_*.json` 按 nodeId 命名，**同一节点会覆盖，不同节点共存**，无需手动清理。
- 每次生成组件前必须重新执行 Step 2，确保数据是最新的 Figma 版本。
- `FIGMA_TOKEN` 需提前设置在 shell 环境（`~/.zshrc` 中 `export FIGMA_TOKEN=xxx`）。
