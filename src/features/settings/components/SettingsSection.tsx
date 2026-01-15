import {
  Paper,
  Typography,
  Box,
  Divider,
  type SxProps,
  type Theme,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { type ReactNode } from 'react';
import { spacing, radius, typography } from '@design-system/tokens';

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * 设置分组组件
 * 展示MUI复杂样式技巧：
 * - 自定义Paper样式
 * - 渐变边框
 * - 图标集成
 * - 响应式间距
 */
export function SettingsSection({
  title,
  description,
  icon,
  children,
  sx,
}: SettingsSectionProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: spacing.sm,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: radius.sm,
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        transition: theme.transitions.create(['box-shadow', 'transform'], {
          duration: theme.transitions.duration.short,
        }),
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || theme.palette.primary.dark} 100%)`,
        },
        ...sx,
      }}
    >
      {/* 标题区域 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing.md,
        }}
      >
        {icon && (
          <Box
            sx={{
              p: spacing.sm,
              borderRadius: radius.md,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 40,
              height: 40,
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              mb: description ? spacing.xs : 0,
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: spacing.sm, borderColor: alpha(theme.palette.divider, 0.5) }} />

      {/* 内容区域 */}
      <Box>{children}</Box>
    </Paper>
  );
}

