# 全屏 + 投屏（控制端 / 舞台）方案

> 适用栈：React 18 · TypeScript · MUI · Zustand · React Router · 仅桌面 Chrome  
> 本仓库实现：`src/shared/stage/`  
> 监视端：外部 `getDisplayMedia` 页（如 `screen-share.html`），**不改其源码**

本文是可移植规格。换一个同类技术栈项目时，按第 7 节清单实现即可，不必复制目录名。

---

## 1. 要解决的问题

操作员要在本机缩小窗口、干别的事；监视端（JOR / `getDisplayMedia`）仍要看到一份**大视口、尽量全屏**的应用画面。

直接对本 tab `requestFullscreen()` 或共享本 tab 会失败，因为：

- 一缩小工作窗口，tab 采集分辨率跟着变小
- 本 tab 进全屏会占掉操作员正在看的那块屏

因此拆成两个浏览上下文：

| 角色 | 谁 | 职责 |
|---|---|---|
| **controller** | 操作员正在点的 tab | 不进全屏；可任意缩放窗口 |
| **stage** | 新开的同 origin tab（`?stage=1`） | 只读镜像；尽量全屏；给监视端采集 |
| **monitor** | 外部 HTML（不可改） | `getDisplayMedia` + `surfaceSwitching: include` |

监视端**不能**用脚本切换采集表面。放大 / 缩小后，由操作员用 Chrome「改为共享此标签页」手动切到 `[Stage]` tab 或切回本 tab。

---

## 2. 浏览器硬限制（不要再尝试绕过）

这些在「纯网页、不加扩展、不改监视 HTML」下同时成立：

1. **没有内核级 live 复制 tab。** `window.open` 同一 URL 是第二份独立 JS 堆，状态必须自己同步。
2. **网页不能指定 `getDisplayMedia` 的下一个 tab。** `surfaceSwitching: "include"` 只显示 Chrome 的「改为共享此标签页」，必须人点。
3. **被采 tab 关掉后流会 `ended`，不会自动回到上一个 tab。** 原样监视 HTML 也不会重采。
4. **后台 tab 基本不能 `requestFullscreen()`。** 手势在 `window.open` 之后的 React 异步挂载里已经丢了。舞台全屏是尽力而为（mount 时试一次），失败就靠操作员 F11 / 丢到另一个 Space。
5. **硬件 `:hover` / 跟手 canvas 不能靠 `dispatchEvent` 跨窗口复现。** 要同步画面，同步**数据**（store 快照），不要转发鼠标事件。
6. **采集分辨率 ≤ 舞台窗口的设备像素。** 单屏无虚拟屏时，「4K」只是上限，不是保证。

本方案接受：手动切录屏 tab；像素级 hover 不做；舞台分辨率 = 该窗全屏设备像素。

---

## 3. 架构

```
controller tab                         stage tab (?stage=1)
┌─────────────────────┐                ┌─────────────────────┐
│ 完整 AppLayout      │  BroadcastChannel  │ 同一套 UI（只读）  │
│ header + 侧栏 + 主区 │ ───────────────► │ header + 侧栏 + 主区 │
│ 用户操作            │  location / ui /  │ pointer-events:none │
│ 不 requestFullscreen│  view / scroll    │ 尽力 requestFullscreen │
└─────────┬───────────┘                └──────────▲──────────┘
          │ window.open(url?stage=1)              │
          └───────────────────────────────────────┘
                      ▲
                      │ 操作员手动切采集目标
              getDisplayMedia（外部 HTML 不改）
```

### 3.1 分层

同步基础设施放**共享层**，业务 feature 只通过公共 API 发布/订阅自己的视图数据。禁止在页面组件里直接 `window.open` + 私有协议。

| 模块 | 职责 |
|---|---|
| 角色 | 用查询参数区分 `controller` / `stage`（刷新不丢） |
| 窗口 | `window.open` / `close`，具名窗口，打开后 `opener.focus()` |
| 频道 | 单一 `BroadcastChannel`，带版本号的消息联合类型 |
| 运行时 | 控制端推路由/壳状态/滚动；舞台应用；心跳 hello / bye / close |
| 开关 hook | 按钮只调「开/关舞台」，语义不再是本页 Fullscreen API |
| 布局 | 舞台渲染**完整壳**（header + 侧栏 + 主区）；根节点 `pointer-events: none` |
| Feature 同步 | 各 feature `publishStageView(key, payload)` |

本仓库对应：`src/shared/stage/*`，`AppLayout` 调 `useStageRuntime`，`FullscreenToggle` → `useFullscreen` → `useShareStage`。

### 3.2 角色识别

```
?stage=1  →  stage
否则      →  controller
```

舞台路由同步时必须**保留** `stage=1`，只覆盖 pathname / 其余 search / hash。  
控制端发出的 search 要先剥掉 `stage`，避免污染自己的 URL。

舞台 `document.title` 加前缀 `[Stage] `，方便 Chrome 采集器里辨认。

可选：`navigator.mediaDevices.setCaptureHandleConfig({ handle, permittedOrigins: ['*'] })`，监视端 `track.getCaptureHandle()` 能读到 `{ app, role }`（Chrome Capture Handle）。

---

## 4. 频道协议

`BroadcastChannel` 名建议固定，例如 `mui-ausome-share-stage`。所有消息带 `v: 1`，对不上的丢弃。

| `type` | 方向 | 载荷 | 含义 |
|---|---|---|---|
| `hello` | stage → 全体 | `role: 'stage'` | 上线 / 心跳（约 1s）。控制端重推 location + ui + 各 view |
| `bye` | stage → 控制端 | — | 舞台卸载；按钮恢复「未打开」 |
| `close` | 控制端 → 舞台 | — | 舞台 `window.close()` |
| `location` | 控制端 → 舞台 | `pathname, search, hash` | React Router `navigate(..., { replace: true })` |
| `ui` | 控制端 → 舞台 | 主题、侧栏开合/折叠 | 写入共享 UI store，保证壳一致 |
| `scroll` | 控制端 → 舞台 | `x, y` | `window.scrollTo` |
| `view` | 任意（约定控制端发） | `key: string, payload: unknown` | **业务扩展点** |

### 4.1 `view` 扩展（feature 接入法）

共享层不认识业务字段。Feature 自己：

1. 定一个稳定 `key`（如 `slides:index`、`slides:annotations`）
2. **控制端**在状态变化时 `publishStageView(key, payload)`；收到 `hello` 再发一次
3. **舞台** `subscribeStageView(key, …)`，校验 payload，写入**自己的** store（用 `replace*`，不要走会记 undo 的 add）

高频更新（画笔逐点）必须用 `requestAnimationFrame`（或 ≥16ms 节流）合并为最新快照，不要每点一条消息。

`payload` 必须能 **structured clone**（BroadcastChannel 限制）。不要传函数、DOM、Class 实例。

---

## 5. 生命周期

### 5.1 打开舞台（控制端按钮，必须在用户点击栈里）

1. `window.open(当前 URL + ?stage=1, 具名窗口)`  
   - 不要加 `noopener`（要留引用才能关）  
   - 不要用 feature 字符串开 popup（监视端选的是 **tab**）
2. 弹窗被拦 → 提示允许弹出窗口，状态保持未打开
3. `window.focus()` 把操作员拉回控制端
4. 舞台 mount：设 title / capture handle；试 `documentElement.requestFullscreen()`（常失败，可忽略）；开始 `hello` 心跳；`pagehide` 发 `bye`
5. 控制端收到 `hello`：推 location、ui、所有 view 快照
6. 按钮「已打开」：以 `hello` 心跳为准（`Window.closed` 在部分环境不可靠），超时约 2.5s 视为断开

### 5.2 关闭舞台

1. 发 `close`，并 `stageWindow.close()`
2. 舞台 `window.close()`（若中间发生过导航 / HMR，可能关不掉，操作员手动关 tab）
3. 监视端若正在采舞台，关 tab 后画面会黑，需再点「共有開始」或切回本 tab

### 5.3 操作员与监视端

1. 先对本应用 **controller tab** 点监视端「共有開始」，选 **Chrome 标签页**（不要选整个屏幕）
2. 再点应用内「打开同步舞台」
3. 用 Chrome 分享条切到标题带 `[Stage]` 的 tab
4. 控制端继续操作；舞台只读跟随
5. 点「关闭同步舞台」后，再把采集切回本 tab

---

## 6. 本仓库已同步的数据

| 数据 | 通道 | 说明 |
|---|---|---|
| 路由 | `location` | 全站页面切换 |
| 主题 / 侧栏 | `ui` | 舞台显示完整 header + 侧栏，且开合与控制端一致 |
| 窗口滚动 | `scroll` | 文档级滚动，不是画布 camera |
| 幻灯片页码 | `view` / `slides:index` | `useSlideNavigation` |
| 幻灯片标注 | `view` / `slides:annotations` | `annotationsBySlideId` 快照；含画笔/文字/图章/撤销后的结果 |
| 幻灯片相机 | `view` / `slides:camera` | 世界坐标中心 + scale；各 tab 按自己的 stage 尺寸重算 `{x,y}` |
| 幻灯片叠加层 | `view` / `slides:overlay` | 热区预览弹窗等 HTML Dialog；舞台只读、不关 |

**未同步（移植时按需加 `view` key）：**

- 编辑器 UI（当前工具、工具栏开合、选中标注、线宽/颜色）
- 预览弹窗自己的相机
- CSS `:hover`、原生 tooltip
- 未进 store 的瞬时 UI（开着的菜单动画等）
- 本机摄像头 / 原始 MediaStream
- 其他页面本地状态（筛选、表格滚动等）

---

## 7. 移植到同类项目的步骤

假设目标项目也是 React + TS + 客户端路由 + 全局 store。

### Step 1 — 共享模块

新建等价于 `src/shared/stage/` 的模块（名字自定），导出：

- `getStageRole()` / `buildStageUrl()`
- `useStageRuntime()`（放在带 Router 的根布局里，两个角色都要跑）
- `useShareStage()`（只给开关按钮）
- `publishStageView` / `subscribeStageView` / `subscribeStageMessages`

常量：`STAGE_QUERY_KEY`、窗口名、频道名、title 前缀、`MESSAGE_VERSION`。

### Step 2 — 改「全屏」按钮语义

本 tab **禁止**再调 `document.requestFullscreen()`。  
按钮绑定 `toggleStage`。舞台角色下不要再开一层舞台（`getStageRole() === 'stage'` 直接 return）。

### Step 3 — 根布局

- 始终调用 `useStageRuntime()`
- 舞台仍渲染 **完整壳**（顶栏 + 侧栏 + 主区），不要为了「干净投屏」拆掉壳，除非产品明确只要主区
- 舞台根节点：`pointerEvents: 'none'`、`userSelect: 'none'`
- 把侧栏 / 主题等壳状态放进 `ui` 消息，两边同一套 store

### Step 4 — 逐个 feature 接 `view`

对每个「控制端变了、舞台必须看见」的状态问：

- 它是否已经在可序列化的 store / URL 里？
- 有没有 `replaceXxx(snapshot)` 可以给舞台灌数据、且不污染 undo？

没有就补 hydrate API，再写一个 `useXxxStageSync`：控制端 subscribe + 节流 publish；舞台 subscribe + replace。

画布类状态优先同步 **文档模型**（笔画点列、页码），不要同步指针。

### Step 5 — 验证

- 控制端点开关：本页不进全屏；出现 `[Stage]` tab
- 控制端改路由 / 侧栏：舞台壳和主区一起变
- 控制端画画 / 改业务 store：舞台在 1～2 帧内跟上
- 弹窗被拦：有提示，按钮不假成功
- 监视端：手动切 tab 能采到舞台；关舞台后流可能结束（预期）

浏览器范围：只保证最新桌面 Chrome。

---

## 8. 关键实现要点（避免踩坑）

**打开窗口必须在 click 同步栈里。** 不要 `await` 权限 / 动画后再 `open`。

**`BroadcastChannel` 发给「其他」浏览上下文，发送者自己收不到。** 控制端不要指望自己收到刚发出的 `view`。

**具名 `window.open(url, NAME)`：** 再次打开会复用同名窗并导航。关闭时不要用 `window.open('', NAME)` 去找窗口——窗口不存在时会再弹出空白 tab。

**Zustand persist：** `localStorage` 的 `storage` 事件也能跨 tab，但打开瞬间、以及未 persist 的字段（如侧栏是否打开）不可靠。壳状态仍走频道。

**舞台 hydrate：** 用 `replaceAnnotations(snapshot)` 这类 API，禁止 `addAnnotation`（会记历史、id 冲突）。

**指针只读：** 舞台 `pointer-events: none` 后，操作只发生在控制端，避免双写。

**Capture Handle 的 `permittedOrigins: ['*']`：** 监视页若是 `file://` 或其它源，才能读到 handle。仅调试用，不是切 tab 的手段。

---

## 9. 本仓库文件地图

| 路径 | 作用 |
|---|---|
| `src/shared/stage/constants.ts` | 角色、频道、窗口、版本常量 |
| `src/shared/stage/role.ts` | `?stage=1` 读写 |
| `src/shared/stage/channel.ts` | 协议 + `view` 发布订阅 |
| `src/shared/stage/window.ts` | 打开 / 关闭舞台 tab |
| `src/shared/stage/captureHandle.ts` | Capture Handle + `[Stage]` 标题 |
| `src/shared/stage/useStageRuntime.ts` | 路由 / ui / 滚动 / hello |
| `src/shared/stage/useShareStage.ts` | 开关 + 在线心跳 |
| `src/shared/hooks/useFullscreen.ts` | 旧全屏 API 的适配封装 |
| `src/shared/layout/AppLayout.tsx` | 完整壳 + 舞台只读 |
| `src/features/slides/hooks/useSlideNavigation.ts` | 页码 `view` |
| `src/features/slides/hooks/useSlideStageSync.ts` | 标注 + 相机视口 `view` |
| `src/features/slides/model/store/slide-camera-store.ts` | 按 slideId 存世界中心/缩放 |
| `src/features/slides/model/store/slide-overlay-store.ts` | 热区预览等 HTML 叠加层 |
| `src/features/slides/model/store/slide-editor-store.ts` | `replaceAnnotations` |

---

## 10. 决策记录

| 曾考虑 | 为何不用 |
|---|---|
| 本 tab `requestFullscreen()` | 操作员无法缩小窗口继续干活 |
| 单 tab CSS scale 虚拟 4K | tab 采集的是窗口像素，一缩小监视画面一起小 |
| 角色对调（原 tab 变舞台、再开工作窗） | 只在「监视端绝不能手动切 tab」时才需要；当前接受手动切 |
| 事件转发模拟远程桌面 | `:hover` / 跟手 canvas 做不到；维护成本高 |
| Chrome 扩展 / Electron | 本需求约束为纯网页 |
| `about:blank` + `document.write` 保全屏手势 | 嵌入式浏览器 / 部分环境写不进新 tab；改为直接 `open` 应用 URL |
