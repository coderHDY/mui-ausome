import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
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
import type { DataStatus } from '../types';

interface DataFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  statusFilter: DataStatus | '';
  categories: string[];
  statuses: DataStatus[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: DataStatus | '') => void;
  onClear: () => void;
}

export function DataFilters({
  searchQuery,
  categoryFilter,
  statusFilter,
  categories,
  statuses,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClear,
}: DataFiltersProps) {
  const theme = useTheme();
  const hasActiveFilters = searchQuery || categoryFilter || statusFilter;

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
          <TextField
            fullWidth
            placeholder="搜索名称或负责人..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: theme.palette.text.secondary, mr: spacing.sm }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: radius.md,
                transition: theme.transitions.create(['border-color', 'box-shadow'], {
                  duration: theme.transitions.duration.short,
                }),
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ '&.Mui-focused': { color: theme.palette.primary.main } }}>
              分类
            </InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              label="分类"
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
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={{ '&.Mui-focused': { color: theme.palette.primary.main } }}>
              状态
            </InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as DataStatus | '')}
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
              {statuses.map((status) => (
                <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            <FilterListIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
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
            {categoryFilter && (
              <Chip
                label={`分类: ${categoryFilter}`}
                size="small"
                onDelete={() => onCategoryChange('')}
                sx={{
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
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
