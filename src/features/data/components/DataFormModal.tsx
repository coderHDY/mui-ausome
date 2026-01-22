import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { spacing, radius } from '@design-system/tokens';
import type { DataRecord, DataStatus } from '../types';

export interface DataFormValues {
  name: string;
  category: string;
  status: DataStatus;
  owner: string;
  description?: string;
}

interface DataFormModalProps {
  open: boolean;
  initialValue?: DataRecord | null;
  categories: string[];
  statuses: DataStatus[];
  onClose: () => void;
  onSubmit: (values: DataFormValues) => void;
}

export function DataFormModal({
  open,
  initialValue,
  categories,
  statuses,
  onClose,
  onSubmit,
}: DataFormModalProps) {
  const theme = useTheme();
  const [values, setValues] = useState<DataFormValues>({
    name: '',
    category: categories[0] ?? '默认分类',
    status: statuses[0] ?? 'active',
    owner: '',
    description: '',
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setValues({
        name: initialValue.name,
        category: initialValue.category,
        status: initialValue.status,
        owner: initialValue.owner,
        description: initialValue.description ?? '',
      });
    } else {
      setValues({
        name: '',
        category: categories[0] ?? '默认分类',
        status: statuses[0] ?? 'active',
        owner: '',
        description: '',
      });
    }
    setTouched(false);
  }, [initialValue, categories, statuses]);

  const hasError = useMemo(() => {
    return !values.name.trim() || !values.owner.trim();
  }, [values]);

  const handleChange = (key: keyof DataFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = () => {
    setTouched(true);
    if (hasError) return;
    onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: radius.md,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[12],
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: spacing.xs,
          fontWeight: theme.typography.fontWeightBold,
        }}
      >
        {initialValue ? '编辑数据' : '新增数据'}
      </DialogTitle>
      <DialogContent sx={{ pt: spacing.xs }}>
        <Stack spacing={spacing.md}>
          <TextField
            required
            label="名称"
            value={values.name}
            onChange={handleChange('name')}
            onBlur={() => setTouched(true)}
            error={touched && !values.name.trim()}
            helperText={touched && !values.name.trim() ? '请输入名称' : ' '}
            autoFocus
          />
          <TextField
            required
            label="分类"
            select
            value={values.category}
            onChange={handleChange('category')}
            helperText="请选择所属分类"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            label="状态"
            select
            value={values.status}
            onChange={handleChange('status')}
            helperText="请选择当前状态"
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            label="负责人"
            value={values.owner}
            onChange={handleChange('owner')}
            onBlur={() => setTouched(true)}
            error={touched && !values.owner.trim()}
            helperText={touched && !values.owner.trim() ? '请输入负责人' : ' '}
          />
          <TextField
            label="描述"
            value={values.description}
            onChange={handleChange('description')}
            multiline
            minRows={3}
            placeholder="补充备注信息，便于协作"
            InputProps={{
              sx: {
                backgroundColor: alpha(theme.palette.action.hover, 0.1),
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: spacing.md, pb: spacing.md }}>
        <Button onClick={onClose} color="inherit" sx={{ mr: spacing.sm }}>
          取消
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={hasError}>
          {initialValue ? '保存修改' : '创建'}
        </Button>
      </DialogActions>
      {touched && hasError && (
        <Typography
          variant="caption"
          color="error"
          sx={{ px: spacing.md, pb: spacing.sm, mt: -spacing.sm, display: 'block' }}
        >
          请完善必填字段后再提交。
        </Typography>
      )}
    </Dialog>
  );
}
