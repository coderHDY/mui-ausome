import { Grid, Paper, Box, Typography, LinearProgress } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Assessment, PlayCircle, Inventory2, Archive } from '@mui/icons-material';
import { spacing, radius } from '@design-system/tokens';

interface DataStatsProps {
  total: number;
  active: number;
  draft: number;
  archived: number;
}

export function DataStats({ total, active, draft, archived }: DataStatsProps) {
  const theme = useTheme();
  const activeRate = total > 0 ? (active / total) * 100 : 0;

  const stats = [
    {
      label: '总数据量',
      value: total,
      icon: <Assessment />,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
        theme.palette.primary.main,
        0.05
      )} 100%)`,
    },
    {
      label: '启用中',
      value: active,
      icon: <PlayCircle />,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(
        theme.palette.success.main,
        0.05
      )} 100%)`,
    },
    {
      label: '草稿',
      value: draft,
      icon: <Inventory2 />,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(
        theme.palette.warning.main,
        0.05
      )} 100%)`,
    },
    {
      label: '已归档',
      value: archived,
      icon: <Archive />,
      color: theme.palette.text.secondary,
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.text.secondary, 0.1)} 0%, ${alpha(
        theme.palette.text.secondary,
        0.05
      )} 100%)`,
    },
  ];

  return (
    <Grid container spacing={spacing.sm} sx={{ mb: spacing.md }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} lg={3} key={stat.label}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: spacing.sm, lg: spacing.md },
              background: stat.gradient,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              border: `1px solid ${alpha(stat.color, 0.2)}`,
              borderRadius: radius.sm,
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
                alignItems: 'center',
                gap: spacing.sm,
                mb: spacing.sm,
              }}
            >
              <Box
                sx={{
                  p: spacing.sm,
                  borderRadius: radius.full,
                  backgroundColor: alpha(stat.color, 0.1),
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    letterSpacing: 1,
                    fontWeight: theme.typography.fontWeightMedium,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: theme.typography.fontWeightBold,
                    color: stat.color,
                  }}
                >
                  {stat.value.toLocaleString()}
                </Typography>
              </Box>
            </Box>
            {index === 1 && (
              <LinearProgress
                variant="determinate"
                value={activeRate}
                sx={{
                  width: '100%',
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
