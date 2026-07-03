# Slides 功能模块

基于 **Konva + React** 实现的可缩放幻灯片查看器，支持多类型元素渲染、画布相机交互、用户标注（画笔 / 文字 / 图章）以及撤销重做。

---

## 1. 关联库

| 库 | 版本 | 用途 |
|---|---|---|
| `konva` | ^9.3.22 | 2D canvas 渲染引擎 |
| `react-konva` | ^18.2.16 | Konva 的 React 封装（Stage / Layer / Group / Shape） |
| `zustand` | ^4.4.7 | 编辑器全局状态（工具选择、标注数据、历史记录） |
| `@mui/material` | ^5.15.0 | UI 组件（Dialog、IconButton、Toolbar 等） |
| `@mui/icons-material` | ^5.15.0 | 工具栏图标 |

> **注意**：刻意**不使用** `react-zoom-pan-pinch`，相机逻辑完全自研，移植了其边界钳制算法（`clampCameraToBounds`）。

---

## 2. 目录结构

```
src/features/slides/
├── index.ts                    # 公共 API（仅导出 SlidesPage 与类型）
├── pages/
│   └── SlidesPage.tsx          # 页面入口，组合所有子组件
├── components/
│   ├── SlideViewport.tsx       # 画布容器（KonvaCameraStage 封装）
│   ├── SlideControls.tsx       # 右侧控制栏（导航 + 工具栏 + 历史按钮）
│   ├── SlideEditorToolbar.tsx  # 浮动工具面板（工具选择 + 色板 + 描边宽度）
│   ├── SlideHistoryButtons.tsx # 撤销 / 重做按钮
│   └── ElementPreviewModal.tsx # 元素点击后弹出的全屏预览
├── engine/
│   ├── camera/
│   │   ├── cameraMath.ts           # 纯函数：缩放、平移、边界钳制
│   │   ├── useKonvaCamera.ts       # 相机 hook（鼠标/触摸/滚轮事件）
│   │   ├── cameraStateContext.ts   # Context：向子组件暴露 camera + containerRef
│   │   └── cameraInteractionContext.ts  # Context：shouldSuppressClick（区分拖动与点击）
│   └── components/
│       ├── KonvaCameraStage.tsx    # 通用带相机的 Konva Stage
│       ├── KonvaSlideScene.tsx     # 渲染静态 slide 元素（image / hotspot / text）
│       ├── KonvaAnnotationLayer.tsx # 渲染用户标注，处理绘制/选择/拖动
│       └── KonvaPreviewImage.tsx   # 弹窗内可缩放图片预览
├── model/
│   ├── store/
│   │   └── slide-editor-store.ts  # Zustand store（工具状态 + 标注数据 + 历史）
│   └── history/
│       └── command-stack.ts       # 快照式 undo/redo（最多 50 步）
├── hooks/
│   ├── useSlideNavigation.ts      # 幻灯片翻页逻辑
│   ├── useSlideImage.ts           # 加载图片到 Konva（含 CDN 代理 + decode）
│   ├── useSlideEditorHistory.ts   # 键盘快捷键 Cmd+Z / Cmd+Shift+Z
│   └── usePreventBrowserZoom.ts   # 禁止浏览器级缩放（viewport meta + wheel/gesture）
├── constants/
│   ├── tools.ts                   # 工具定义、色板、默认值、STAMP_GLYPH
│   └── viewport.ts                # 相机配置（CameraConfig）+ 预设（canvas / modal）
├── types/
│   ├── slide.types.ts             # Slide / SlideElement / SlideDeck / SlidePreviewPayload
│   └── annotation.types.ts        # AnnotationElement / EditorTool / StampKind
├── data/
│   └── sample-deck.ts             # 示例数据（5 张 slide，演示各元素类型）
└── utils/
    └── resolveSlideImageUrl.ts    # CDN 外链转本地代理路径
```

---

## 3. 设计方式

### 3.1 渲染层分离

画布内有两个独立的 Konva 层，共享同一个 `KonvaCameraStage`（即同一个 `<Stage><Layer>`）：

```
KonvaCameraStage
└── <Layer>
    ├── KonvaSlideScene      ← 静态内容（slide 定义的元素）
    └── KonvaAnnotationLayer ← 用户标注（运行时绘制，不修改 slide 数据）
```

两层通过 `slideId` 关联，标注数据独立存储在 Zustand store 的 `annotationsBySlideId` 字典中。

### 3.2 自研相机系统

相机状态为 `{ scale, x, y }`（screen 空间偏移 + 缩放比），通过 `useKonvaCamera` hook 统一管理：

- **滚轮缩放**：以鼠标指针为锚点（`zoomAtPointer`）
- **触控板双指缩放（pinch）**：两点中心为锚点
- **双击缩放**：可配置 `zoomIn / zoomOut / reset`
- **拖动平移**：`panEnabled` 控制开关；按下即平移，拖动超过 5px 标记 `didDrag`，阻止触发元素 `click`
- **边界钳制**：`clampCameraToBounds` 移植自 react-zoom-pan-pinch 算法，支持 `limitToBounds / centerZoomedOut / disablePadding` 三种模式
- **ResizeObserver**：监听容器大小，stage 自动适配

通过两个 Context 向 Konva 子组件传递相机信息：
- `CameraStateContext`：`camera` 状态 + `containerRef`（坐标转换用）
- `CameraInteractionContext`：`shouldSuppressClick()`（区分 pan 点击与元素点击）

### 3.3 坐标空间

```
clientXY  →  clientToStagePoint(clientXY, containerRect)  →  screenXY
screenXY  →  screenToWorld(screenXY, camera)              →  worldXY (slide 坐标系)
```

标注元素坐标均为 **slide 坐标系（world space）**，`KonvaAnnotationLayer` 通过 `worldFromEvent` 完成转换。

### 3.4 状态管理（Zustand）

`useSlideEditorStore` 是编辑器的单一状态源，职责：

| 字段/方法 | 说明 |
|---|---|
| `activeTool` | 当前工具（pan / select / brush / text / stamp） |
| `toolbarOpen / editorOpen` | 工具面板展开状态（`toolbarOpen`=浮窗展开，`editorOpen`=已进入绘制模式） |
| `strokeColor / strokeWidth / stampKind` | 当前画笔参数 |
| `selectedAnnotationId` | 选中的标注 ID |
| `annotationsBySlideId` | 全 deck 标注数据（`Record<slideId, AnnotationElement[]>`） |
| `historyPast / historyFuture` | 快照式历史栈 |
| `addAnnotation / updateAnnotation / removeAnnotation` | 标注 CRUD（每次操作自动 `recordHistory`） |
| `createFreehand / createText / createStamp` | 工厂方法，生成带随机 ID 的标注元素 |

### 3.5 历史记录（快照式 Undo/Redo）

```
recordHistory()           → 将当前 annotationsBySlideId 深拷贝压入 historyPast
undo()                    → 从 historyPast 弹出，当前状态推入 historyFuture
redo()                    → 从 historyFuture 弹出，当前状态推入 historyPast
MAX_UNDO_STACK = 50       → 历史栈最大深度，超出后丢弃最旧快照
```

键盘快捷键由 `useSlideEditorHistory` hook 注册（`keydown` 事件）。

### 3.6 CORS 图片代理

Konva 使用 `<canvas>` 渲染，外链图片须同源或配置 CORS 头。项目通过 Vite 代理绕过：

```
src 中的 cdn.openvideos.ai/* 链接
  → resolveSlideImageUrl()
  → 转为 /cdn-media/*（本地同源路径）
  → Vite dev server 代理到 https://cdn.openvideos.ai
```

生产环境需在 Nginx 等配置同等的 `/cdn-media` 反向代理规则。

---

## 4. 各功能说明

### 4.1 幻灯片导航

- **入口**：`useSlideNavigation(deck)` → 返回 `{ currentSlide, goPrev, goNext, canGoPrev, canGoNext }`
- **触发**：`SlideControls` 中的 `ChevronLeft / ChevronRight` 按钮
- **副作用**：切换页时自动重置预览弹窗、清除选中标注、关闭工具面板（在 `SlidesPage` useEffect 中处理）

### 4.2 画布缩放 / 平移

- **鼠标滚轮**：以光标为锚点缩放（canvas 预设：1× ~ 3×）
- **触控板双指**：pinch 缩放，同样以中心点为锚点
- **拖动**：`panEnabled` 为 true 时可拖动画布；进入标注模式且非 pan 工具时禁止拖动
- **`usePreventBrowserZoom`**：激活时修改 `viewport meta` 并阻止 `Ctrl+滚轮 / 手势事件 / Ctrl±` 快捷键，防止浏览器自带缩放与自定义缩放冲突

### 4.3 元素类型与点击预览

`SlideElement` 有三种类型，在 `KonvaSlideScene` 中渲染：

| 类型 | 渲染方式 | 点击行为 |
|---|---|---|
| `image` | `KonvaImage`（圆角 8px） | 弹出图片预览弹窗 |
| `hotspot` | 虚线圆角矩形 + 居中标签文字 | 弹出文字或图片预览弹窗 |
| `text` | `KonvaText`，支持 MUI 主题色 token | 无点击行为（仅展示） |

点击事件由 `onElementClick(elementId)` 传入，在 `SlidesPage` 中通过 `resolvePreviewPayload` 解析为 `SlidePreviewPayload`，控制 `ElementPreviewModal` 开关。

拖动 vs 点击区分：`shouldSuppressClick()` 检测本次 pointerdown → pointerup 位移是否超过 5px，超过则不触发 `onClick`。

### 4.4 元素预览弹窗（ElementPreviewModal）

- MUI `Dialog`（90vw × 80vh，`maxWidth={false}`）
- `SlidePreviewPayload.kind === 'image'`：使用 `KonvaPreviewImage`（可缩放，modal 预设：1× ~ 4×，双击放大）
- `SlidePreviewPayload.kind === 'text'`：直接渲染 Typography，支持 `white-space: pre-line`
- 弹窗打开期间，主画布 `frozen=true`，禁止相机交互

### 4.5 标注工具栏（SlideEditorToolbar）

点击工具栏图标的两阶段流程：

```
第一次点击
  → pan 工具：直接进入平移模式（toolbarOpen=false, editorOpen=false）
  → 普通工具：toolbarOpen=true（展开子选项面板）
  → stamp 工具：展开面板，显示图章子选项（check / cross / star / arrow），尚未进入画布

第二次确认（confirmTool）
  → 非 stamp：toolbarOpen=false, editorOpen=true（进入绘制模式）
  → stamp：选择图章种类后调用 confirmTool，进入画布
```

色板（`EDITOR_SWATCHES`，8 色）和描边宽度（1~10，步进 1）的更改：
- 绘制前：更新 `strokeColor / strokeWidth` 作为下次绘制的默认值
- 有选中标注时：同时调用 `applyColorToSelected` 更新已选中元素颜色

### 4.6 标注绘制

**画笔（brush）**：

```
pointerdown → createFreehand(slideId, x, y) → 返回 freehandId
pointermove → appendFreehandPoint(slideId, id, x, y) → 追加坐标点
pointerup   → recordHistory（结束一笔，写入历史）
```

Konva `Line` 使用 `tension=0.4`（贝塞尔平滑）+ `lineCap/lineJoin=round`，`hitStrokeWidth` 扩大到 `strokeWidth+8`（最小 12px）便于点击选中。

**文字（text）**：

`pointerup` 时在 world 坐标创建 `TextAnnotation`，默认 `fontSize=28`，`fill` 为当前 `strokeColor`。

**图章（stamp）**：

`pointerup` 时在 world 坐标创建 `StampAnnotation`，渲染为 `KonvaText`（字符来自 `STAMP_GLYPH` 映射）+ 选中时显示圆形选中框。

### 4.7 标注选中与拖动

工具为 `select` 时：
- 点击任意标注元素 → 设置 `selectedAnnotationId`，显示选中指示（高亮 / 起点圆圈）
- `draggable=true`，`onDragEnd` 回调通过 `updateAnnotation` 更新坐标（freehand 更新全部 points 偏移，text/stamp 更新 x/y）
- 点击背景空白 → 清除选中

### 4.8 撤销 / 重做

- **按钮**：`SlideHistoryButtons`（Undo / Redo IconButton）
- **键盘**：`⌘Z`（Ctrl+Z）撤销，`⌘⇧Z`（Ctrl+Shift+Z）或 `Ctrl+Y` 重做
- **范围**：覆盖全 deck 所有 slide 的标注，不区分当前页
- **上限**：50 步，超出后丢弃最旧快照

---

## 5. 数据流总览

```
SlidesPage
  ├── useSlideNavigation(sampleDeck)     → currentSlide
  ├── usePreventBrowserZoom(true)        → 锁定浏览器缩放
  ├── useSlideEditorHistory(true)        → 注册键盘快捷键
  │
  ├── SlideViewport(slide, slideKey, frozen, onElementClick)
  │     └── KonvaCameraStage(config, contentSize, resetKey, panEnabled)
  │           ├── KonvaSlideScene(slide, onElementClick)
  │           │     ├── SlideImageNode   → useSlideImage → CDN proxy
  │           │     ├── SlideHotspotNode
  │           │     └── SlideTextNode
  │           └── KonvaAnnotationLayer(slideId, slideWidth, slideHeight)
  │                 ├── FreehandNode / TextNode / StampNode（按 annotationsBySlideId[slideId]）
  │                 └── 交互事件 → useSlideEditorStore actions
  │
  ├── SlideControls
  │     ├── Prev / Next buttons → useSlideNavigation
  │     ├── SlideEditorToolbar  → useSlideEditorStore（工具选择 + 色板）
  │     └── SlideHistoryButtons → useSlideEditorStore（undo / redo）
  │
  └── ElementPreviewModal(open, preview, onClose)
        └── KonvaPreviewImage / Typography（按 preview.kind）
```

---

## 6. 快速复现步骤

### Step 1：安装依赖

```bash
npm install konva react-konva zustand
```

### Step 2：复制目录

将 `src/features/slides/` 整个目录拷入项目。

### Step 3：配置 Vite 代理（处理外链图片 CORS）

```ts
// vite.config.ts
server: {
  proxy: {
    '/cdn-media': {
      target: 'https://cdn.openvideos.ai',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/cdn-media/, ''),
    },
  },
},
```

### Step 4：注册路由

```tsx
// App.tsx
import { SlidesPage } from '@features/slides';
<Route path="/slides" element={<SlidesPage />} />
```

### Step 5：替换数据源

将 `data/sample-deck.ts` 中的 `sampleDeck` 替换为你的 `SlideDeck` 数据，或在 `SlidesPage.tsx` 顶部传入真实数据源。

### Step 6：生产环境图片代理

在 Nginx 中添加与 Vite proxy 等效的 `/cdn-media` 反向代理规则：

```nginx
location /cdn-media/ {
    proxy_pass https://cdn.openvideos.ai/;
}
```

---

## 7. 关键类型速查

```ts
// slide.types.ts
type SlideElement = ImageElement | HotspotElement | TextElement
type Slide        = { id, title?, width, height, elements: SlideElement[] }
type SlideDeck    = { slides: Slide[] }

// annotation.types.ts
type AnnotationElement = FreehandAnnotation | TextAnnotation | StampAnnotation
type EditorTool        = 'pan' | 'select' | 'brush' | 'text' | 'stamp'
type StampKind         = 'check' | 'cross' | 'star' | 'arrow'

// constants/viewport.ts
type CameraConfig = {
  initialScale, minScale, maxScale,
  wheelStep, pinchStep,
  centerOnInit, centerZoomedOut, limitToBounds, disablePadding,
  smooth, panningVelocityDisabled,
  doubleClick: { disabled, mode?, step? }
}
```
