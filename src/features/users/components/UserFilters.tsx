import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Button,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { spacing, radius } from '@design-system/tokens';
import type { User } from './UserTable';

interface UserFiltersProps {
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

/**
 * 用户筛选组件
 * 展示MUI复杂样式技巧：
 * - 组合式表单控件
 * - 自定义输入框样式
 * - 筛选标签展示
 * - 响应式布局
 */
export function UserFilters({
  searchQuery,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onClear,
}: UserFiltersProps) {
  const theme = useTheme();
  const hasActiveFilters = searchQuery || roleFilter || statusFilter;

  return (
    <Paper
      elevation={0}
      sx={{
        p: spacing.sm,
        mb: spacing.md,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: radius.sm,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
      }}
    >
      <Stack spacing={spacing.md}>
        {/* 搜索和筛选行 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '2fr 1fr 1fr auto',
            },
            gap: spacing.md,
            alignItems: 'center',
          }}
        >
          {/* 搜索框 */}
          <TextField
            fullWidth
            placeholder="搜索用户名称或邮箱..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  sx={{
                    color: theme.palette.text.secondary,
                    mr: spacing.sm,
                  }}
                />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: radius.md,
                transition: theme.transitions.create(['border-color', 'box-shadow'], {
                  duration: theme.transitions.duration.short,
                }),
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              },
            }}
          />

          {/* 角色筛选 */}
          <FormControl fullWidth>
            <InputLabel
              sx={{
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              角色
            </InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => onRoleChange(e.target.value)}
              label="角色"
              sx={{
                borderRadius: radius.md,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="">全部</MenuItem>
              <MenuItem value="admin">管理员</MenuItem>
              <MenuItem value="moderator">版主</MenuItem>
              <MenuItem value="user">用户</MenuItem>
            </Select>
          </FormControl>

          {/* 状态筛选 */}
          <FormControl fullWidth>
            <InputLabel
              sx={{
                '&.Mui-focused': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              状态
            </InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              label="状态"
              sx={{
                borderRadius: radius.md,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="">全部</MenuItem>
              <MenuItem value="active">活跃</MenuItem>
              <MenuItem value="inactive">非活跃</MenuItem>
              <MenuItem value="pending">待审核</MenuItem>
            </Select>
          </FormControl>

          {/* 清除按钮 */}
          <IconButton
            onClick={onClear}
            disabled={!hasActiveFilters}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              },
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            }}
          >
            <ClearIcon />
          </IconButton>
        </Box>

        {/* 活动筛选标签 */}
        {hasActiveFilters && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: spacing.sm,
              alignItems: 'center',
              pt: spacing.sm,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <FilterListIcon
              sx={{
                color: theme.palette.text.secondary,
                fontSize: 20,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              活动筛选：
            </Typography>
            {searchQuery && (
              <Chip
                label={`搜索: ${searchQuery}`}
                size="small"
                onDelete={() => onSearchChange('')}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              />
            )}
            {roleFilter && (
              <Chip
                label={`角色: ${roleFilter}`}
                size="small"
                onDelete={() => onRoleChange('')}
                sx={{
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                }}
              />
            )}
            {statusFilter && (
              <Chip
                label={`状态: ${statusFilter}`}
                size="small"
                onDelete={() => onStatusChange('')}
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                }}
              />
            )}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

