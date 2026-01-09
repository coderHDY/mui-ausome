import { Grid, Paper, Box, Typography, LinearProgress } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { People, PersonAdd, PersonOff, TrendingUp } from '@mui/icons-material';
import { spacing, radius } from '@design-system/tokens';

interface UserStatsProps {
  total: number;
  active: number;
  inactive: number;
  newToday: number;
}

/**
 * 用户统计卡片组件
 * 展示MUI复杂样式技巧：
 * - 渐变背景
 * - 自定义图标样式
 * - 进度条集成
 * - 响应式网格布局
 */
export function UserStats({ total, active, inactive, newToday }: UserStatsProps) {
  const theme = useTheme();
  const activePercentage = total > 0 ? (active / total) * 100 : 0;

  const stats = [
    {
      label: '总用户数',
      value: total,
      icon: <People />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
    },
    {
      label: '活跃用户',
      value: active,
      icon: <TrendingUp />,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
    },
    {
      label: '非活跃用户',
      value: inactive,
      icon: <PersonOff />,
      color: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
    },
    {
      label: '今日新增',
      value: newToday,
      icon: <PersonAdd />,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
    },
  ];

  return (
    <Grid container spacing={spacing.md} sx={{ mb: spacing.lg }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: spacing.lg,
              background: stat.gradient,
              border: `1px solid ${alpha(stat.color, 0.2)}`,
              borderRadius: radius.lg,
              position: 'relative',
              overflow: 'hidden',
              transition: theme.transitions.create(['transform', 'box-shadow'], {
                duration: theme.transitions.duration.short,
              }),
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${stat.color} 0%, ${alpha(stat.color, 0.5)} 100%)`,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                mb: spacing.md,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: theme.typography.fontWeightMedium,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    color: stat.color,
                    mt: spacing.xs,
                  }}
                >
                  {stat.value.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: spacing.sm,
                  borderRadius: radius.md,
                  backgroundColor: alpha(stat.color, 0.1),
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </Box>
            </Box>
            {index === 1 && (
              <LinearProgress
                variant="determinate"
                value={activePercentage}
                sx={{
                  height: 6,
                  borderRadius: radius.full,
                  backgroundColor: alpha(stat.color, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: radius.full,
                    backgroundColor: stat.color,
                  },
                }}
              />
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

