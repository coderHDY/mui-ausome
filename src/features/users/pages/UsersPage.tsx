import { useState, useMemo } from 'react';
import { Container, Typography, Box, Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { UserTable, UserFilters, UserStats, type User } from '../components';
import { spacing } from '@design-system/tokens';
import { alpha, useTheme } from '@mui/material/styles';

/**
 * 用户管理页面
 * 展示MUI复杂样式技巧的综合应用
 */
export function UsersPage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // 模拟用户数据
  const mockUsers: User[] = [
    {
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2小时前',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: '李四',
      email: 'lisi@example.com',
      role: 'moderator',
      status: 'active',
      lastLogin: '5小时前',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      name: '王五',
      email: 'wangwu@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '3天前',
      createdAt: '2024-02-01',
    },
    {
      id: '4',
      name: '赵六',
      email: 'zhaoliu@example.com',
      role: 'user',
      status: 'pending',
      lastLogin: '从未',
      createdAt: '2024-02-10',
    },
    {
      id: '5',
      name: '钱七',
      email: 'qianqi@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '1小时前',
      createdAt: '2024-02-12',
    },
  ];

  // 筛选逻辑
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === 'active').length,
    inactive: mockUsers.filter((u) => u.status === 'inactive').length,
    newToday: 2,
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
    setStatusFilter('');
  };

  return (
    <Container maxWidth="xl">
      {/* 页面标题 */}
      <Box
        sx={{
          mb: spacing.xl,
          pb: spacing.lg,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: theme.typography.fontWeightBold,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || theme.palette.primary.dark} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: spacing.sm,
          }}
        >
          用户管理
        </Typography>
        <Typography variant="body2" color="text.secondary">
          管理系统中的所有用户账户，包括角色分配、状态管理和权限控制
        </Typography>
      </Box>

      {/* 统计卡片 */}
      <UserStats {...stats} />

      {/* 筛选器 */}
      <UserFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onRoleChange={setRoleFilter}
        onStatusChange={setStatusFilter}
        onClear={handleClearFilters}
      />

      {/* 用户表格 */}
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <UserTable
          users={filteredUsers}
          onEdit={(user) => console.log('Edit:', user)}
          onDelete={(user) => console.log('Delete:', user)}
        />
      </Box>

      {/* 浮动操作按钮 */}
      <Tooltip title="添加新用户" arrow placement="left">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: spacing.xl,
            right: spacing.xl,
            boxShadow: theme.shadows[12],
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: theme.shadows[16],
            },
            transition: theme.transitions.create(['transform', 'box-shadow'], {
              duration: theme.transitions.duration.short,
            }),
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Container>
  );
}

