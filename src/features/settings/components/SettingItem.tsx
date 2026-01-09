import {
  Box,
  Typography,
  Switch,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { type ReactNode } from 'react';
import { spacing, radius, typography } from '@design-system/tokens';

interface SettingItemProps {
  label: string;
  description?: string;
  type: 'switch' | 'text' | 'select' | 'custom';
  value?: any;
  onChange?: (value: any) => void;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  helperText?: string;
  children?: ReactNode;
  disabled?: boolean;
}

/**
 * 设置项组件
 * 展示MUI复杂样式技巧：
 * - 多种输入类型
 * - 自定义Switch样式
 * - 响应式布局
 * - 精细的间距控制
 */
export function SettingItem({
  label,
  description,
  type,
  value,
  onChange,
  options,
  placeholder,
  helperText,
  children,
  disabled = false,
}: SettingItemProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: spacing.md,
        px: spacing.lg,
        mb: spacing.md,
        borderRadius: radius.md,
        backgroundColor: alpha(theme.palette.action.hover, 0.03),
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        transition: theme.transitions.create(['background-color', 'border-color'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          backgroundColor: alpha(theme.palette.action.hover, 0.05),
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={spacing.md}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        {/* 标签和描述 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: theme.typography.fontWeightMedium,
              mb: description ? spacing.xs : 0,
            }}
          >
            {label}
          </Typography>
          {description && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: 'block',
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* 控件区域 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: { xs: '100%', sm: 200 },
          }}
        >
          {type === 'switch' && (
            <Switch
              checked={value || false}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
              sx={{
                '& .MuiSwitch-switchBase': {
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                    '& + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                },
                '& .MuiSwitch-thumb': {
                  boxShadow: theme.shadows[2],
                },
                '& .MuiSwitch-track': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.2),
                },
              }}
            />
          )}

          {type === 'text' && (
            <TextField
              fullWidth
              value={value || ''}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: radius.sm,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          )}

          {type === 'select' && (
            <FormControl fullWidth size="small">
              <Select
                value={value || ''}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                sx={{
                  borderRadius: radius.sm,
                  backgroundColor: theme.palette.background.paper,
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
                {options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {type === 'custom' && children}
        </Box>
      </Stack>

      {helperText && (
        <FormHelperText
          sx={{
            mt: spacing.xs,
            mx: 0,
            fontSize: '0.75rem',
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

