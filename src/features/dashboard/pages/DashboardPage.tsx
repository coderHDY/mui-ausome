import { Container, Typography, Box } from '@mui/material';
import { DashboardStats, defaultStats } from '../components';
import { spacing } from '@design-system/tokens';

/**
 * 仪表板页面
 * 页面层负责编排数据和布局，不包含业务逻辑
 * 数据获取应该在页面层或更高层处理
 * 注意：布局由App.tsx统一管理，页面组件只包含内容
 */
export function DashboardPage() {
  // 在实际应用中，这里应该从数据层获取统计数据
  // const { data, isLoading, error } = useDashboardStats();
  
  // 示例：使用默认数据
  const stats = defaultStats;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: spacing.lg }}>
        <Typography variant="h4" component="h1" gutterBottom>
          仪表板
        </Typography>
        <Typography variant="body2" color="text.secondary">
          欢迎回来！这里是您的数据概览。
        </Typography>
      </Box>

      <DashboardStats stats={stats} />
    </Container>
  );
}

