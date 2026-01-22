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
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { spacing, radius } from '@design-system/tokens';
import type { DataRecord, DataStatus } from '../types';

interface DataTableProps {
  records: DataRecord[];
  onEdit?: (record: DataRecord) => void;
  onDelete?: (record: DataRecord) => void;
}

const statusColorMap: Record<DataStatus, 'success' | 'warning' | 'info' | 'error'> = {
  active: 'success',
  draft: 'warning',
  inactive: 'info',
  archived: 'error',
};

export function DataTable({ records, onEdit, onDelete }: DataTableProps) {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: radius.sm,
        overflow: 'hidden',
        '& .MuiTable-root': {
          minWidth: 900,
        },
      }}
    >
      <Table>
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
            <TableCell>名称</TableCell>
            <TableCell>分类</TableCell>
            <TableCell>状态</TableCell>
            <TableCell>负责人</TableCell>
            <TableCell>更新时间</TableCell>
            <TableCell>创建时间</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((item, index) => {
            const paletteKey = statusColorMap[item.status];
            const paletteColor = theme.palette[paletteKey].main;

            return (
              <TableRow
                key={item.id}
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
                  backgroundColor:
                    index % 2 === 0
                      ? theme.palette.background.paper
                      : alpha(theme.palette.action.hover, 0.02),
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        border: `2px solid ${theme.palette.divider}`,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <DescriptionIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: theme.typography.fontWeightMedium,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          display: 'block',
                        }}
                      >
                        {item.description || '暂无描述'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                      fontWeight: theme.typography.fontWeightMedium,
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      backgroundColor: alpha(paletteColor, 0.1),
                      color: paletteColor,
                      border: `1px solid ${alpha(paletteColor, 0.3)}`,
                      textTransform: 'capitalize',
                      fontWeight: theme.typography.fontWeightMedium,
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.primary">
                    {item.owner}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {item.updatedAt}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {item.createdAt}
                  </Typography>
                </TableCell>

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
                        onClick={() => onEdit?.(item)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            transform: 'scale(1.05)',
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
                        onClick={() => onDelete?.(item)}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                            transform: 'scale(1.05)',
                          },
                          transition: theme.transitions.create(['background-color', 'transform'], {
                            duration: theme.transitions.duration.short,
                          }),
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
