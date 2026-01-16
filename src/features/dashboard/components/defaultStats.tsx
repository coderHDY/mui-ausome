import { People, ShoppingCart, AttachMoney, TrendingUp } from '@mui/icons-material';
import { type ReactNode } from 'react';

/**
 * 仪表板统计数据默认值
 * 实际应用中应该从API获取，这里仅作为示例数据
 */
export interface DashboardStatItem {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
}

export const defaultStats: DashboardStatItem[] = [
  {
    title: '总用户数',
    value: '1,234',
    icon: <People />,
    color: 'primary' as const,
  },
  {
    title: '订单数',
    value: '567',
    icon: <ShoppingCart />,
    color: 'success' as const,
  },
  {
    title: '总收入',
    value: '¥89,012',
    icon: <AttachMoney />,
    color: 'warning' as const,
  },
  {
    title: '增长率',
    value: '+12.5%',
    icon: <TrendingUp />,
    color: 'error' as const,
  },
];
