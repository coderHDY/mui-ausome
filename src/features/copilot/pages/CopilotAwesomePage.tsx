import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
  Hub,
  IntegrationInstructions,
  Psychology,
  Link,
  AccountTree,
  Extension,
  Build,
  School,
} from '@mui/icons-material';
import { spacing } from '@design-system/tokens';

type WorkflowKey = 'daily-issues' | 'org-health' | 'relevance-check';
type PluginKey = 'frontend-web-dev' | 'testing-automation' | 'project-planning';

const agentPresets = [
  {
    task: '我要重构一段 React 组件',
    agent: 'Expert React Frontend Engineer',
    reason: '擅长 React 19、TypeScript、性能优化与组件边界设计。',
  },
  {
    task: '我要做数据库性能诊断',
    agent: 'PostgreSQL Database Administrator',
    reason: '面向查询分析、索引优化与数据库运维场景。',
  },
  {
    task: '我要写一个完整实现计划',
    agent: 'Implementation Plan Generation Mode',
    reason: '专门负责把需求拆成可执行阶段任务。',
  },
];

const instructionSamples = [
  'nextjs.instructions.md',
  'security-and-owasp.instructions.md',
  'typescript-mcp-server.instructions.md',
  'github-actions-ci-cd-best-practices.instructions.md',
];

const skillSamples = [
  'copilot-sdk',
  'polyglot-test-agent',
  'create-implementation-plan',
  'webapp-testing',
];

const hookEvents = ['sessionStart', 'userPromptSubmitted', 'preToolUse', 'sessionEnd'];

const workflowSummaries: Record<WorkflowKey, string> = {
  'daily-issues': '每天自动汇总 open issue、最近评论和阻塞项，生成日报。',
  'org-health': '按周统计组织健康度：陈旧 PR、合并时长、贡献者趋势等。',
  'relevance-check': '通过 slash command 评估 issue/PR 是否仍与当前项目目标相关。',
};

const pluginBundles: Record<PluginKey, string[]> = {
  'frontend-web-dev': ['frontend-web-dev', 'premium-frontend-ui', 'context-engineering'],
  'testing-automation': ['testing-automation', 'polyglot-test-agent', 'webapp-testing'],
  'project-planning': ['project-planning', 'create-implementation-plan', 'technical-spike'],
};

const toolExamples = [
  {
    name: 'Awesome Copilot MCP Server',
    usage: '在编辑器中直接搜索/安装 agents、skills、instructions。',
  },
  {
    name: 'APM (Agent Package Manager)',
    usage: '像 npm 一样安装与编译 AI agent 能力包。',
  },
  {
    name: 'Awesome GitHub Copilot Browser',
    usage: '在 VS Code 里可视化浏览并下载 awesome-copilot 资源。',
  },
];

export function CopilotAwesomePage() {
  const [selectedAgentTask, setSelectedAgentTask] = useState(agentPresets[0].task);
  const [promptGoal, setPromptGoal] = useState('帮我生成一个 React 表单并带校验');
  const [selectedSkill, setSelectedSkill] = useState(skillSamples[0]);
  const [enabledHooks, setEnabledHooks] = useState<string[]>(['preToolUse', 'sessionEnd']);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowKey>('daily-issues');
  const [selectedPlugin, setSelectedPlugin] = useState<PluginKey>('frontend-web-dev');

  const selectedAgent = useMemo(() => {
    return agentPresets.find((item) => item.task === selectedAgentTask) ?? agentPresets[0];
  }, [selectedAgentTask]);

  const hookPreview = useMemo(() => {
    return hookEvents
      .filter((event) => enabledHooks.includes(event))
      .map((event) => `Hook matched: ${event}`);
  }, [enabledHooks]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: spacing.xl }}>
        <Typography variant="h4" component="h1" sx={{ mb: spacing.sm }}>
          Awesome Copilot 示例中心
        </Typography>
        <Typography variant="body1" color="text.secondary">
          这个页面把 awesome-copilot.github.com 的核心栏目映射成可操作示例，帮助你理解这些能力分别解决什么问题。
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Hub color="primary" />
                <Typography variant="h6">1) Agents</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Agents 是“人格化/场景化”的 Copilot 模式，强调角色职责、工具权限和任务边界。
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="agent-task-label">任务场景</InputLabel>
                <Select
                  labelId="agent-task-label"
                  label="任务场景"
                  value={selectedAgentTask}
                  onChange={(e) => setSelectedAgentTask(e.target.value)}
                >
                  {agentPresets.map((item) => (
                    <MenuItem key={item.task} value={item.task}>
                      {item.task}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="subtitle2">推荐 Agent: {selectedAgent.agent}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAgent.reason}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <IntegrationInstructions color="primary" />
                <Typography variant="h6">2) Instructions</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Instructions 是编码规范与行为规则，通常按文件类型或项目范围自动生效。
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="你的任务目标"
                value={promptGoal}
                onChange={(e) => setPromptGoal(e.target.value)}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                {instructionSamples.map((item) => (
                  <Chip key={item} size="small" label={item} />
                ))}
              </Stack>
              <Alert severity="info" sx={{ mt: 2 }}>
                规则注入示例: 针对“{promptGoal}”优先应用 TypeScript 与安全相关 instruction。
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Psychology color="primary" />
                <Typography variant="h6">3) Skills</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Skills 是“可复用流程包”，内部带触发条件、步骤说明和附加资源。
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="skill-label">选择 Skill</InputLabel>
                <Select
                  labelId="skill-label"
                  label="选择 Skill"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  {skillSamples.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      {skill}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="body2">示例调用: /skill {selectedSkill}</Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Link color="primary" />
                <Typography variant="h6">4) Hooks</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Hooks 在会话事件触发时自动执行，比如扫描 secrets、审计、拦截危险命令。
              </Typography>
              <Stack spacing={1}>
                {hookEvents.map((event) => (
                  <FormControlLabel
                    key={event}
                    control={
                      <Switch
                        checked={enabledHooks.includes(event)}
                        onChange={(_, checked) => {
                          setEnabledHooks((prev) => {
                            if (checked) {
                              return [...prev, event];
                            }
                            return prev.filter((item) => item !== event);
                          });
                        }}
                      />
                    }
                    label={event}
                  />
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                触发预览
              </Typography>
              {hookPreview.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  当前未启用任何 Hook。
                </Typography>
              ) : (
                <Stack spacing={0.5}>
                  {hookPreview.map((line) => (
                    <Typography key={line} variant="body2" color="text.secondary">
                      {line}
                    </Typography>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <AccountTree color="primary" />
                <Typography variant="h6">5) Workflows</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Workflows 是跑在 GitHub Actions 的“代理化自动流程”，常用于报表、巡检、治理。
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="workflow-label">自动化工作流</InputLabel>
                <Select
                  labelId="workflow-label"
                  label="自动化工作流"
                  value={selectedWorkflow}
                  onChange={(e) => setSelectedWorkflow(e.target.value as WorkflowKey)}
                >
                  <MenuItem value="daily-issues">Daily Issues Report</MenuItem>
                  <MenuItem value="org-health">OSPO Organization Health Report</MenuItem>
                  <MenuItem value="relevance-check">Relevance Check</MenuItem>
                </Select>
              </FormControl>
              <Alert severity="success" sx={{ mt: 2 }}>
                {workflowSummaries[selectedWorkflow]}
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Extension color="primary" />
                <Typography variant="h6">6) Plugins</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Plugins 是把 Agents/Hooks/Skills 打成“场景套餐”，用于一键安装完整工作流。
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="plugin-label">插件套餐</InputLabel>
                <Select
                  labelId="plugin-label"
                  label="插件套餐"
                  value={selectedPlugin}
                  onChange={(e) => setSelectedPlugin(e.target.value as PluginKey)}
                >
                  <MenuItem value="frontend-web-dev">frontend-web-dev</MenuItem>
                  <MenuItem value="testing-automation">testing-automation</MenuItem>
                  <MenuItem value="project-planning">project-planning</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                {pluginBundles[selectedPlugin].map((item) => (
                  <Chip key={item} label={item} size="small" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Build color="primary" />
                <Typography variant="h6">7) Tools</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tools 是外部工具或 MCP 基础设施，用来“让 Copilot 真能做事”，而不仅是聊天。
              </Typography>
              <Stack spacing={1.5}>
                {toolExamples.map((item) => (
                  <Paper key={item.name} variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="subtitle2">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.usage}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <School color="primary" />
                <Typography variant="h6">8) Learning Hub</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Learning Hub 是学习路径，按 Fundamentals、Reference、Hands-on 三层引导上手。
              </Typography>
              <Stack spacing={1}>
                <Chip icon={<AutoAwesome />} label="Fundamentals: 概念体系与配置基础" />
                <Chip icon={<AutoAwesome />} label="Reference: 术语与速查索引" />
                <Chip icon={<AutoAwesome />} label="Hands-on: Cookbook 实战示例" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
