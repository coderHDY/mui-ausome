import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { type ReactNode } from 'react';
import { spacing, radius } from '@design-system/tokens';

/**
 * 用户数据类型
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin: string;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

/**
 * 用户表格组件
 * 展示MUI复杂样式技巧：
 * - 使用theme进行精细化样式控制
 * - 响应式表格设计
 * - 自定义单元格样式
 * - 状态指示器
 * - 交互式操作按钮
 */
export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const theme = useTheme();

  const getRoleColor = (role: User['role']) => {
    const colors = {
      admin: theme.palette.error.main,
      moderator: theme.palette.warning.main,
      user: theme.palette.primary.main,
    };
    return colors[role];
  };

  const getStatusIcon = (status: User['status']) => {
    return status === 'active' ? (
      <CheckCircleIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
    ) : (
      <CancelIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
    );
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: radius.sm,
        overflow: 'hidden',
        '& .MuiTable-root': {
          minWidth: 800,
        },
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              '& .MuiTableCell-head': {
                fontWeight: theme.typography.fontWeightBold,
                color: theme.palette.text.primary,
                borderBottom: `2px solid ${theme.palette.divider}`,
                py: spacing.md,
              },
            }}
          >
            <TableCell>用户</TableCell>
            <TableCell>角色</TableCell>
            <TableCell>状态</TableCell>
            <TableCell>最后登录</TableCell>
            <TableCell>创建时间</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                transition: theme.transitions.create(['background-color', 'transform'], {
                  duration: theme.transitions.duration.short,
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateX(4px)',
                },
                '&:last-child td': {
                  borderBottom: 0,
                },
                // 交替行背景色
                backgroundColor:
                  index % 2 === 0
                    ? theme.palette.background.paper
                    : alpha(theme.palette.action.hover, 0.02),
              }}
            >
              {/* 用户信息单元格 */}
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.md,
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 40,
                      height: 40,
                      border: `2px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        display: 'block',
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* 角色单元格 */}
              <TableCell>
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    backgroundColor: alpha(getRoleColor(user.role), 0.1),
                    color: getRoleColor(user.role),
                    fontWeight: theme.typography.fontWeightMedium,
                    textTransform: 'capitalize',
                    border: `1px solid ${alpha(getRoleColor(user.role), 0.3)}`,
                    '&:hover': {
                      backgroundColor: alpha(getRoleColor(user.role), 0.2),
                    },
                  }}
                />
              </TableCell>

              {/* 状态单元格 */}
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}
                >
                  {getStatusIcon(user.status)}
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        user.status === 'active'
                          ? theme.palette.success.main
                          : theme.palette.text.secondary,
                      textTransform: 'capitalize',
                      fontWeight:
                        user.status === 'active'
                          ? theme.typography.fontWeightMedium
                          : theme.typography.fontWeightRegular,
                    }}
                  >
                    {user.status}
                  </Typography>
                </Box>
              </TableCell>

              {/* 最后登录 */}
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {user.lastLogin}
                </Typography>
              </TableCell>

              {/* 创建时间 */}
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {user.createdAt}
                </Typography>
              </TableCell>

              {/* 操作单元格 */}
              <TableCell align="right">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: spacing.xs,
                  }}
                >
                  <Tooltip title="编辑" arrow>
                    <IconButton
                      size="small"
                      onClick={() => onEdit?.(user)}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          transform: 'scale(1.1)',
                        },
                        transition: theme.transitions.create(['background-color', 'transform'], {
                          duration: theme.transitions.duration.short,
                        }),
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="删除" arrow>
                    <IconButton
                      size="small"
                      onClick={() => onDelete?.(user)}
                      sx={{
                        color: theme.palette.error.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          transform: 'scale(1.1)',
                        },
                        transition: theme.transitions.create(['background-color', 'transform'], {
                          duration: theme.transitions.duration.short,
                        }),
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="更多操作" arrow>
                    <IconButton
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.action.hover, 0.5),
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

