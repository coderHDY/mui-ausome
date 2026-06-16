# Agent Harness 配置执行文档

基于《Agent Harness Engineering: A Survey》（CMU/Yale/JHU 联合）的 ETCLOVG 七层框架，为 mui-ausome 项目搭建 Agent Harness。

**日常操作：** Agent 以根目录 `AGENTS.md` 为准；本文档记录 ETCLOVG 框架、初始搭建步骤与当前状态。

**首次搭建 / 补全缺失文件：** 对 agent 说「按照 docs/agent-harness.md 执行所有步骤」。

---

## 当前 Harness 状态（ETCLOVG）

> 最后核对：2026-06-16。同一模型换 Harness，编码 benchmark 可差数倍——失败常是工具、上下文、验证、权限太弱，而非模型本身。

| 层 | 含义 | Cursor 实现 | 当前状态 |
|---|---|---|---|
| E Execution | Agent 在哪跑 | Cursor IDE | ✅ 已配置 |
| T Tooling | 工具描述与约束 | CodeGraph MCP + `.cursor/rules/*.mdc` | ✅ 已配置（`.cursor/` 本地存在，**整目录在 `.gitignore`，未入库**） |
| C Context | 模型该看见什么 | `AGENTS.md`（每次会话自动加载） | ✅ 已配置 |
| L Lifecycle | 任务编排 | `docs/` + `specs/` + `.specify/` + `todo.md` 防漂移 | ✅ 已配置（`todo.md` 不入库，会话级） |
| O Observability | 执行追踪 | `.cursor/hooks/state/tsc-errors.log`（`afterFileEdit` 写入） | 🔶 已配置，需编辑 `.ts/.tsx` 后才有日志 |
| V Verification | 验证正确性 | `afterFileEdit` → `ts-check.sh`（tsc + eslint，**不阻塞编辑**） | ✅ 已配置（无 CI 兜底） |
| G Governance | 权限与安全 | `protect-secrets.sh` + `shell-guard.sh` + `AGENTS.md` 禁止项 | ✅ 已配置（`.env.example` 供 agent 参考变量名） |

**已知缺口（未阻塞本地开发）：** `.cursor`/`.claude` 未进 git → 团队 clone 需自备或重跑下文 Step 1–7；无 GitHub Actions CI。

---

## 背景：为什么要配置 Harness

> 同一个模型换一套 Harness（工程外壳），编码 benchmark 最高提升 10 倍。失败往往不是模型不够强，是工具、上下文、验证、权限系统太弱。

Harness = ETCLOVG 七层，对应 Cursor 的映射见上表。

---

## 执行步骤：创建 7 个文件

### Step 1 — 创建 `AGENTS.md`（C 层，最高优先级）

创建 `AGENTS.md`（项目根目录），Cursor Agent 每次会话自动加载。内容见项目根目录 `AGENTS.md`（已按 mui-ausome 架构定制）。

---

### Step 2 — 创建 `.cursor/rules/`（T 层）

创建以下三个 rule 文件：

#### 2a — `.cursor/rules/architecture-first.mdc`

```
---
description: 架构优先，禁止打补丁（与 AGENTS.md 一致）
alwaysApply: true
---

在架构规定层级修改（design-system / shared / features 公共 API），不在页面或组件边缘打补丁绕过契约。
跨 feature 只通过 `@shared/*` 或目标 feature 的 `index.ts` 公共 API 导入，禁止深路径 `@features/foo/components/Bar`。
```

#### 2b — `.cursor/rules/feature-module.mdc`

```
---
description: Feature 模块编码规范 — 新增/修改功能模块时遵循
alwaysApply: true
globs: ["src/features/**", "src/shared/**", "src/design-system/**", "src/App.tsx"]
---

## Feature 模块编码规范

### 目录与公共 API

- 每个 feature 位于 `src/features/<name>/`，通过 `index.ts` 导出公共 API
- 页面组件放 `pages/`，功能组件放 `components/`，业务逻辑放 `hooks/` 或 `services/`
- 禁止从其他 feature 深路径导入；只 import 目标 feature 的 `index.ts` 或 `@shared/*`

### 设计系统

- 间距 / 圆角 / 阴影：使用 `@design-system/tokens/*`
- 颜色 / 主题：通过 MUI theme 或 `@design-system/theme`，禁止硬编码 hex/rgb
- 禁止内联 style 对象写 magic number（除非 MUI sx 引用 theme token）

### 状态分层

- 共享 UI 状态（主题、侧边栏等）：`@shared/state/ui-store`
- Feature 业务状态：feature 内部 hooks / services，不泄漏到 shared
- 展示组件无状态，数据通过 props 传入

### 路由

- 新页面在 `src/App.tsx` 注册路由
- 需鉴权的路由包在 `<ProtectedRoute>` 内
- Auth 路由（login/register）不使用 AppLayout

### 常见错误

- 在展示组件内直接 fetch / 调 API → 移到 page 层或 service
- 跨 feature 复制组件 → 提取到 `@shared/components`
- 硬编码颜色 `#fff` / `16px` → 改用 design token 或 theme
```

#### 2c — `.cursor/rules/codegraph.mdc`

从 seedance 项目复制 `codegraph.mdc`（CodeGraph MCP 通用规范，与项目无关）。

---

### Step 3 — 创建 `.cursor/hooks.json`（V+G 层入口）

创建 `.cursor/hooks.json`：

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": ".cursor/hooks/ts-check.sh",
        "timeout": 35
      }
    ],
    "beforeReadFile": [
      {
        "command": ".cursor/hooks/protect-secrets.sh",
        "failClosed": true
      }
    ],
    "beforeShellExecution": [
      {
        "command": ".cursor/hooks/shell-guard.sh",
        "timeout": 5
      }
    ]
  }
}
```

---

### Step 4 — 创建 `.cursor/hooks/ts-check.sh`（V — Verification）

创建 `.cursor/hooks/ts-check.sh`，**必须 `chmod +x`**：

```bash
#!/bin/bash
# afterFileEdit: 编辑 .ts/.tsx 文件后运行 tsc + eslint
# 作为"计算型传感器"——失败时写日志，不阻塞编辑

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty' 2>/dev/null)

if [[ "$file_path" != *.ts && "$file_path" != *.tsx ]]; then
  exit 0
fi

project_root=$(git -C "$(dirname "$file_path")" rev-parse --show-toplevel 2>/dev/null)
if [ -z "$project_root" ]; then
  exit 0
fi

log_dir="$project_root/.cursor/hooks/state"
mkdir -p "$log_dir"
log_file="$log_dir/tsc-errors.log"
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

tsc_result=$(cd "$project_root" && npm run type-check 2>&1)
tsc_exit=$?

lint_result=$(cd "$project_root" && npm run lint 2>&1)
lint_exit=$?

if [ $tsc_exit -ne 0 ] || [ $lint_exit -ne 0 ]; then
  {
    echo "[$timestamp] Errors after editing: $(basename "$file_path")"
    if [ $tsc_exit -ne 0 ]; then
      echo "## TypeScript"
      echo "$tsc_result"
    fi
    if [ $lint_exit -ne 0 ]; then
      echo "## ESLint"
      echo "$lint_result"
    fi
    echo "---"
  } > "$log_file"
else
  echo "" > "$log_file"
fi

exit 0
```

---

### Step 5 — 创建 `.cursor/hooks/protect-secrets.sh`（G — Governance）

创建 `.cursor/hooks/protect-secrets.sh`，**必须 `chmod +x`**：

```bash
#!/bin/bash
# beforeReadFile: 阻止读取包含生产密钥的 .env 文件
# failClosed: true — 脚本崩溃时也阻止读取

input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path // empty' 2>/dev/null)
basename_file=$(basename "$file_path")

if [[ "$basename_file" == ".env.local" ]] ||
   [[ "$basename_file" == ".env.production.local" ]] ||
   [[ "$basename_file" =~ ^\.env\..+\.local$ ]]; then
  echo '{"permission":"deny","user_message":"⛔ 该文件包含生产密钥，已阻止读取。如需了解环境变量，请参考 .env.example 或查阅项目文档。"}'
  exit 0
fi

echo '{"permission":"allow"}'
exit 0
```

---

### Step 6 — 创建 `.cursor/hooks/shell-guard.sh`（G — Governance）

创建 `.cursor/hooks/shell-guard.sh`，**必须 `chmod +x`**：

```bash
#!/bin/bash
# beforeShellExecution: 拦截危险 git 命令

input=$(cat)
command=$(echo "$input" | jq -r '.command // empty' 2>/dev/null)

if echo "$command" | grep -qE 'git\s+push.*(--force|-f).*(main|master)' ||
   echo "$command" | grep -qE 'git\s+push.*(main|master).*(--force|-f)'; then
  echo '{"permission":"deny","user_message":"⛔ 禁止 force push 到 main/master。请通过 PR 合并代码。","agent_message":"Force push to main/master is blocked by project governance. Use a pull request instead."}'
  exit 0
fi

if echo "$command" | grep -qE 'git\s+reset\s+--hard'; then
  echo '{"permission":"deny","user_message":"⛔ git reset --hard 已被拦截。请说明回滚意图，由用户手动确认后操作。","agent_message":"git reset --hard is blocked. Describe what you want to achieve and get explicit user confirmation first."}'
  exit 0
fi

echo '{"permission":"allow"}'
exit 0
```

---

### Step 7 — 更新 `.gitignore`

在 `.gitignore` 文件末尾追加以下内容：

```
# Cursor / Claude 本地配置（不入库，clone 后按 docs/agent-harness.md 重建）
.cursor
.claude
.codegraph
todo.md

# Cursor hooks 运行时状态
.cursor/hooks/state/
```

---

## 验证执行结果

所有文件创建完成后，确认：

```bash
# 1. 脚本有执行权限
ls -la .cursor/hooks/*.sh
# 应显示 -rwxr-xr-x

# 2. hooks.json 语法正确
cat .cursor/hooks.json | jq .

# 3. AGENTS.md 存在
ls -la AGENTS.md

# 4. cursor rules 存在
ls -la .cursor/rules/*.mdc

# 5. 类型检查与 lint 可运行
npm run type-check && npm run lint
```

Cursor 会自动监听 `hooks.json` 变化并热重载，无需重启编辑器。

---

## 完成后的 Harness 状态

与文首 **「当前 Harness 状态（ETCLOVG）」** 表一致；Step 1–7 为一次性/bootstrap 参考，勿重复创建已存在文件。
