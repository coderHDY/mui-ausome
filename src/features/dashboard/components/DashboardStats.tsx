import { Grid, Paper, Typography, Box } from '@mui/material';
import { spacing } from '@design-system/tokens';
import { type ReactNode } from 'react';

/**
 * 仪表板统计卡片组件
 * 纯展示组件，数据通过props传入，不包含业务逻辑
 */
interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: spacing.xs, lg: spacing.sm }, // 响应式padding：手机小，平板中等，PC大
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: spacing.sm }}>
        <Box
          sx={{
            p: spacing.sm,
            borderRadius: 2,
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            mr: spacing.md,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Paper>
  );
}

interface DashboardStatsProps {
  stats: Array<{
    title: string;
    value: string;
    icon: ReactNode;
    color: 'primary' | 'success' | 'warning' | 'error';
  }>;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <Grid container spacing={spacing.md}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
}


