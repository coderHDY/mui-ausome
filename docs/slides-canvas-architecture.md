# Slide 画布 — 最终架构方案

> 状态：Phase 1 进行中（Konva 替换 react-zoom-pan-pinch）  
> 路由：`/slides` · Feature：`src/features/slides/`

---

## 1. 目标

在 **不迁移应用栈**（React 18 · MUI · Zustand · React Router）的前提下，将 slide 画布从「DOM + react-zoom-pan-pinch」演进为 **Konva 场景引擎 + 自研 UI**，以支撑：

| 阶段 | 能力 |
|------|------|
| **Phase 1（当前）** | 原样迁移视口 zoom/pan、slide 渲染、弹窗预览 |
| **Phase 2** | 画笔、文字、盖戳；元素可拖；自定义颜色 |
| **Phase 3** | Undo/Redo、IndexedDB 持久化、后端同步 |

**硬约束：** 工具栏 / 属性面板 / 页面布局 **100% MUI 自研**，不嵌入 tldraw / Excalidraw 等 UI 绑定的整包编辑器。

---

## 2. 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│  SlidesPage（React · MUI）                                   │
│  ├─ 工具栏 / 右侧 SlideControls（未来扩展）                    │
│  ├─ SlideViewport → KonvaCameraStage + KonvaSlideScene       │
│  └─ ElementPreviewModal → KonvaCameraStage + KonvaPreview   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  engine/（Konva 场景引擎）                                    │
│  ├─ constants/viewport.ts   ← CameraConfig（原 pinch 配置）   │
│  ├─ camera/cameraMath.ts    ← 缩放锚点、边界钳制              │
│  ├─ camera/useKonvaCamera.ts← Stage 相机 hook                │
│  └─ components/              ← KonvaCameraStage / Scene      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  model/（Phase 2+）                                          │
│  ├─ types/slide.types.ts    ← SlideDocument / CanvasElement  │
│  ├─ store/                  ← Zustand + undo + persist       │
│  └─ tools/                  ← brush / text / stamp / select  │
└─────────────────────────────────────────────────────────────┘
```

**职责边界：**

| 层 | 职责 | 不负责 |
|----|------|--------|
| **Camera** | Stage `scale` + `position`、wheel/pinch/pan、边界 | 元素业务逻辑 |
| **Scene** | 在逻辑坐标（1920×1080）渲染 Konva 节点 | 视口变换 |
| **Model** | JSON 文档、命令栈、持久化 | 渲染细节 |
| **UI** | MUI 工具栏、弹窗 chrome | 画布命中检测 |

---

## 3. 相机配置（对应原 react-zoom-pan-pinch）

配置集中在 `src/features/slides/constants/viewport.ts`，分 **canvas**（主画布）与 **modal**（弹窗预览）两套 preset，字段与原库 prop 一一对应：

| 字段 | canvas | modal | 原 pinch prop |
|------|--------|-------|---------------|
| `initialScale` | 1 | 1 | `initialScale` |
| `minScale` | 1 | 1 | `minScale` |
| `maxScale` | 3 | 4 | `maxScale` |
| `wheelStep` | 0.02 | 0.02 | `wheel.step` |
| `pinchStep` | 1 | 1 | `pinch.step` |
| `centerOnInit` | true | true | `centerOnInit` |
| `centerZoomedOut` | false | true | `centerZoomedOut` |
| `limitToBounds` | false | true | `limitToBounds` |
| `disablePadding` | true | true | `disablePadding` |
| `smooth` | true | true | `smooth` |
| `panningVelocityDisabled` | true | true | `panning.velocityDisabled` |
| `doubleClick.disabled` | true | false | `doubleClick.disabled` |
| `doubleClick.mode` | — | zoomIn | `doubleClick.mode` |
| `doubleClick.step` | — | 0.5 | `doubleClick.step` |

**Konva 映射：**

```text
stage.scale({ x, y })     ←→  TransformWrapper scale
stage.position({ x, y })  ←→  TransformWrapper translate
wheel 事件 + 指针锚点       ←→  wheel.step + 以光标为中心缩放
双指距离变化               ←→  pinch.step
clampBounds()             ←→  limitToBounds + centerZoomedOut
切 slide / key 变化 reset   ←→  TransformWrapper key remount
frozen / disabled           ←→  TransformWrapper disabled
```

---

## 4. 目录结构（目标态）

```
src/features/slides/
├── index.ts
├── constants/
│   └── viewport.ts              # CameraConfig presets
├── types/
│   └── slide.types.ts           # SlideDocument（逐步扩展）
├── data/
│   └── sample-deck.ts
├── engine/
│   ├── camera/
│   │   ├── cameraMath.ts
│   │   └── useKonvaCamera.ts
│   └── components/
│       ├── KonvaCameraStage.tsx
│       ├── KonvaSlideScene.tsx
│       └── KonvaPreviewImage.tsx
├── components/
│   ├── SlideViewport.tsx        # 薄包装 → KonvaCameraStage
│   ├── SlideControls.tsx
│   └── ElementPreviewModal.tsx
├── hooks/
│   ├── useSlideNavigation.ts
│   └── usePreventBrowserZoom.ts
└── pages/
    └── SlidesPage.tsx
```

**Phase 2 新增（预留）：**

```
├── model/store/slide-store.ts
├── model/history/command-stack.ts
├── model/persist/indexed-db.ts
└── tools/{brush,text,stamp,select}/
```

---

## 5. 坐标系

- **世界坐标：** slide 逻辑尺寸 `1920 × 1080`（与现 `sample-deck` 一致）
- **屏幕坐标：** Konva Stage 容器像素
- **变换：** `screen = world * scale + position`（Stage 级 camera）
- **Phase 2 元素拖动：** 只改 world 坐标，camera 不变

---

## 6. 交互模式（Phase 2 规划）

| 模式 | Stage | 元素 |
|------|-------|------|
| `pan`（默认） | 拖动平移 | 点击选中 / 打开预览 |
| `select` | 可平移 | 拖动改 world x/y |
| `draw` | 锁定平移 | 采集 pointer → path |
| `text` / `stamp` | 点击放置 | 新建元素 |

Phase 1 等价于 **只读 pan + 元素 click 弹窗**。

---

## 7. Undo / 持久化（Phase 3 设计摘要）

**Undo/Redo：** Command 模式，操作 `SlideDocument`，与 Camera 状态分离（视图缩放不进 undo 栈）。

**持久化：**

```
autosave (debounce 500ms)
  → IndexedDB（idb-keyval）
  → 可选 POST /api/decks/:id
```

刷新恢复：启动 hydrate store → 渲染 Konva Scene。

---

## 8. 依赖

| 包 | 用途 | 版本策略 |
|----|------|----------|
| `konva` | 2D 场景 | ^9 |
| `react-konva` | React 绑定 | ^18（匹配 React 18） |
| `use-image` | 异步图片加载 | latest |
| ~~`react-zoom-pan-pinch`~~ | 已移除 | — |

---

## 9. 与项目架构的契合

- Feature 公共 API 仍通过 `src/features/slides/index.ts` 导出
- UI chrome 用 MUI + design tokens，Konva 只负责画布像素层
- 跨 feature 禁止深路径导入；slides 内部 `engine/` 不对外 export

---

## 10. 外链图片与 CORS

Konva 将图片绘制到 **Canvas**，跨域资源受浏览器 CORS 约束；原先 DOM `<img>` 仅展示时不触发此限制。

| 场景 | 方案 |
|------|------|
| 本地 dev / `vite preview` | `resolveSlideImageUrl` 将 `cdn.openvideos.ai` 转为 `/cdn-media/*`，由 Vite 代理 |
| 生产静态部署 | Nginx 等同理配置 `/cdn-media` 反向代理，或使用带 `Access-Control-Allow-Origin` 的 CDN |
| 仅展示、不需导出 | 也可直接加载（不设 `crossOrigin`），Canvas 会被 taint，无法 `toDataURL` |

---

## 11. 参考

- 现有 demo 数据：`src/features/slides/data/sample-deck.ts`
- 迁移步骤：`todo.md`
- Agent 手册：`AGENTS.md`
