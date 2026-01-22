import { useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { Add as AddIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { DataTable, DataFormModal, DataFilters, DataStats } from '../components';
import type { DataRecord, DataStatus } from '../types';
import { spacing } from '@design-system/tokens';

const categories = ['业务配置', '系统参数', '内容模板', '监控规则'];
const statuses: DataStatus[] = ['active', 'draft', 'inactive', 'archived'];

const initialRecords: DataRecord[] = [
  {
    id: '1',
    name: '渠道投放策略',
    category: '业务配置',
    status: 'active',
    owner: '张敏',
    description: '用于渠道A/B测试的默认策略集合',
    updatedAt: '2025-12-12 10:22',
    createdAt: '2025-11-01 09:10',
  },
  {
    id: '2',
    name: '风控规则模板',
    category: '监控规则',
    status: 'inactive',
    owner: '李雷',
    description: '暂存的风控规则，待评审后启用',
    updatedAt: '2025-12-28 14:05',
    createdAt: '2025-12-15 08:40',
  },
  {
    id: '3',
    name: '短信内容模板',
    category: '内容模板',
    status: 'draft',
    owner: '王珊',
    description: '节日短信批量发送模板，等待法务确认',
    updatedAt: '2025-12-30 16:30',
    createdAt: '2025-12-20 11:02',
  },
  {
    id: '4',
    name: '全局阈值配置',
    category: '系统参数',
    status: 'archived',
    owner: '赵宇',
    description: '历史版本参数，保留备查',
    updatedAt: '2025-10-18 18:20',
    createdAt: '2025-08-05 10:00',
  },
];

const formatNow = () => new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date());

export function DataPage() {
  const theme = useTheme();
  const [records, setRecords] = useState<DataRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<DataStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DataRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DataRecord | null>(null);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || item.category === categoryFilter;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [records, searchQuery, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = records.length;
    return {
      total,
      active: records.filter((item) => item.status === 'active').length,
      draft: records.filter((item) => item.status === 'draft').length,
      archived: records.filter((item) => item.status === 'archived').length,
    };
  }, [records]);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (record: DataRecord) => {
    setEditing(record);
    setModalOpen(true);
  };

  const handleSubmit = (payload: Omit<DataRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editing) {
      setRecords((prev) =>
        prev.map((item) =>
          item.id === editing.id
            ? { ...item, ...payload, updatedAt: formatNow() }
            : item
        )
      );
    } else {
      const now = formatNow();
      setRecords((prev) => [
        {
          ...payload,
          id: String(Date.now()),
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (record: DataRecord) => {
    setDeleteTarget(record);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setRecords((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  return (
    <Container maxWidth="xl">
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
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${
              theme.palette.secondary?.main || theme.palette.primary.dark
            } 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: spacing.sm,
          }}
        >
          数据管理
        </Typography>
        <Typography variant="body2" color="text.secondary">
          管理常规配置、模板和规则，支持快速增删改查
        </Typography>
      </Box>

      <DataStats {...stats} />

      <DataFilters
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        categories={categories}
        statuses={statuses}
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
        onClear={handleClearFilters}
      />

      <Box sx={{ position: 'relative' }}>
        <DataTable records={filteredRecords} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>

      <Tooltip title="新增数据" arrow placement="left">
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleCreate}
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

      <DataFormModal
        open={modalOpen}
        initialValue={editing}
        categories={categories}
        statuses={statuses}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={(values) => handleSubmit({
          ...values,
        })}
      />

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            确认删除“{deleteTarget?.name}”吗？此操作不可恢复。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: spacing.md, pb: spacing.md }}>
          <Button onClick={() => setDeleteTarget(null)}>取消</Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            onClick={confirmDelete}
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>

      {filteredRecords.length === 0 && (
        <Stack
          alignItems="center"
          spacing={spacing.sm}
          sx={{ py: spacing.xl, color: theme.palette.text.secondary }}
        >
          <Typography variant="body1">未找到符合条件的数据</Typography>
          <Button variant="outlined" onClick={handleCreate}>
            新增一条数据
          </Button>
        </Stack>
      )}
    </Container>
  );
}
