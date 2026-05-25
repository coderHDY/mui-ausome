import { useState, useEffect, type ReactNode } from "react";
import { RecipientList } from "./RecipientList";
import type { RecipientItem } from "./RecipientListItem";
import {
  Dialog,
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as RoleIcon,
  ToggleOn as StatusIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Notifications as NotificationsIcon,
  PrivacyTip as PrivacyIcon,
  Tune as TuneIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { spacing as token } from "@design-system/tokens";
import type { User } from "./UserTable";

// ─── Demo 宛先数据（Figma: Frame 10 示例数据）────────────────────────────────
const DEMO_RECIPIENTS: RecipientItem[] = [
  {
    id: "1",
    name: "DA部店1",
    department: "北東北保険金サービス部青森保険金サービス課",
    email: "namaetarou@example.com",
  },
  {
    id: "2",
    name: "青森ユニット",
    department: "北東北保険金サービス部青森保険金サービス課",
    email: "namaetarou@example.com",
  },
  {
    id: "3",
    name: "秋田ユニット",
    department: "北東北保険金サービス部青森保険金サービス課",
    email: "namaetarou@example.com",
  },
];

// ─── 导航项类型 ───────────────────────────────────────────────────────────────

type SectionId =
  | "basic"
  | "email"
  | "role"
  | "status"
  | "security"
  | "activity"
  | "notifications"
  | "privacy"
  | "other";

interface NavItem {
  id: SectionId;
  label: string;
  icon: ReactNode;
}

/** Figma: Frame 4 — 第一组导航（6 个菜单项，对应 height: 45~58） */
const NAV_GROUP_1: NavItem[] = [
  { id: "basic", label: "基本情報", icon: <PersonIcon fontSize="small" /> },
  {
    id: "email",
    label: "メールアドレス",
    icon: <EmailIcon fontSize="small" />,
  },
  { id: "role", label: "権限設定", icon: <RoleIcon fontSize="small" /> },
  { id: "status", label: "ステータス", icon: <StatusIcon fontSize="small" /> },
  {
    id: "security",
    label: "セキュリティ",
    icon: <SecurityIcon fontSize="small" />,
  },
  {
    id: "activity",
    label: "アクティビティ",
    icon: <HistoryIcon fontSize="small" />,
  },
];

/** Figma: Frame 5 — 第二组导航（3 个菜单项） */
const NAV_GROUP_2: NavItem[] = [
  {
    id: "notifications",
    label: "通知設定",
    icon: <NotificationsIcon fontSize="small" />,
  },
  {
    id: "privacy",
    label: "プライバシー",
    icon: <PrivacyIcon fontSize="small" />,
  },
  { id: "other", label: "その他", icon: <TuneIcon fontSize="small" /> },
];

// ─── Props ───────────────────────────────────────────────────────────────────

export interface UserEditModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

// ─── 内容区子组件 ─────────────────────────────────────────────────────────────

interface ContentProps {
  formData: Partial<User>;
  onChange: (field: keyof User, value: string) => void;
}

function BasicInfoSection({ formData, onChange }: ContentProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="medium">
        基本情報
      </Typography>
      <TextField
        label="名前"
        value={formData.name ?? ""}
        onChange={(e) => onChange("name", e.target.value)}
        fullWidth
        size="small"
      />
    </Stack>
  );
}

function EmailSection({ formData, onChange }: ContentProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="medium">
        メールアドレス
      </Typography>
      <TextField
        label="メールアドレス"
        value={formData.email ?? ""}
        onChange={(e) => onChange("email", e.target.value)}
        fullWidth
        size="small"
        type="email"
      />
    </Stack>
  );
}

function RoleSection({ formData, onChange }: ContentProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="medium">
        権限設定
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel>ロール</InputLabel>
        <Select
          value={formData.role ?? "user"}
          label="ロール"
          onChange={(e) => onChange("role", e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="moderator">Moderator</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

function StatusSection({ formData, onChange }: ContentProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="medium">
        ステータス
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel>ステータス</InputLabel>
        <Select
          value={formData.status ?? "active"}
          label="ステータス"
          onChange={(e) => onChange("status", e.target.value)}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

function ReadonlySection({ formData }: { formData: Partial<User> }) {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="medium">
        セキュリティ
      </Typography>
      <TextField
        label="最終ログイン"
        value={formData.lastLogin ?? "—"}
        fullWidth
        size="small"
        disabled
      />
      <TextField
        label="アカウント作成日"
        value={formData.createdAt ?? "—"}
        fullWidth
        size="small"
        disabled
      />
    </Stack>
  );
}

function ActivitySection({ formData }: { formData: Partial<User> }) {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight="medium">
        アクティビティ
      </Typography>
      <TextField
        label="最終ログイン"
        value={formData.lastLogin ?? "—"}
        fullWidth
        size="small"
        disabled
      />
      <TextField
        label="ユーザー ID"
        value={formData.id ?? "—"}
        fullWidth
        size="small"
        disabled
      />
    </Stack>
  );
}

function PlaceholderSection({ label }: { label: string }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight="medium">
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        このセクションは準備中です。
      </Typography>
    </Stack>
  );
}

// ─── 左侧导航列表 ─────────────────────────────────────────────────────────────

interface NavListProps {
  items: NavItem[];
  activeId: SectionId;
  onSelect: (id: SectionId) => void;
}

function NavList({ items, activeId, onSelect }: NavListProps) {
  const theme = useTheme();
  return (
    /**
     * Figma: px: 8, py: 16 → sx={{ px: 1, py: 2 }}
     * 每项: paddingLeft/Right: 16, paddingTop/Bottom: 8, itemSpacing: 10, height: ~45px
     */
    <List
      disablePadding
      sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
    >
      {items.map((item) => (
        <ListItemButton
          key={item.id}
          selected={activeId === item.id}
          onClick={() => onSelect(item.id)}
          sx={{
            borderRadius: 1,
            px: 2,
            py: 1,
            minHeight: 45,
            gap: `${token.sm + 2}px`, // itemSpacing: 10
            "&.Mui-selected": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              "& .MuiListItemIcon-root": { color: "primary.main" },
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.15) },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "unset", color: "text.secondary" }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ variant: "body2" }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}

// ─── 右侧用户预览面板 ──────────────────────────────────────────────────────────

interface UserPreviewProps {
  user: User;
  formData: Partial<User>;
}

function UserPreview({ user, formData }: UserPreviewProps) {
  const theme = useTheme();

  const role = formData.role ?? user.role;
  const status = formData.status ?? user.status;

  const roleColor =
    role === "admin"
      ? theme.palette.error.main
      : role === "moderator"
        ? theme.palette.warning.main
        : theme.palette.primary.main;

  return (
    /**
     * Figma: Frame 4 右面板 (283px, bg "24:63" = white, px: 16, py: 12)
     * counterAxisAlignItems: CENTER → alignItems: center
     */
    <Stack spacing={2} alignItems="center" sx={{ width: "100%", pt: 2 }}>
      <Avatar
        src={user.avatar}
        sx={{
          width: 72,
          height: 72,
          border: `2px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[3],
          fontSize: "1.75rem",
        }}
      >
        {(formData.name ?? user.name).charAt(0).toUpperCase()}
      </Avatar>

      <Box textAlign="center">
        <Typography
          variant="subtitle1"
          fontWeight={theme.typography.fontWeightMedium}
        >
          {formData.name ?? user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {formData.email ?? user.email}
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        justifyContent="center"
      >
        <Chip
          label={role}
          size="small"
          sx={{
            bgcolor: alpha(roleColor, 0.1),
            color: roleColor,
            border: `1px solid ${alpha(roleColor, 0.3)}`,
            fontWeight: theme.typography.fontWeightMedium,
            textTransform: "capitalize",
          }}
        />
        <Chip
          label={status}
          size="small"
          color={status === "active" ? "success" : "default"}
          sx={{ textTransform: "capitalize" }}
        />
      </Stack>

      <Divider sx={{ width: "100%" }} />

      <Stack spacing={1.5} sx={{ width: "100%" }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            最終ログイン
          </Typography>
          <Typography variant="body2">{user.lastLogin}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            作成日時
          </Typography>
          <Typography variant="body2">{user.createdAt}</Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

// ─── メインコンポーネント ───────────────────────────────────────────────────────

/**
 * ユーザー編集モーダル
 *
 * Figma: モーダルテンプレート (1022 × 669)
 * ├── Left Sidebar  200px  VERTICAL / SPACE_BETWEEN  bg: grey.50
 * │   ├── Header (pl:24, height:48)
 * │   ├── NavGroup1 (px:8, py:16, borderBottom)
 * │   ├── NavGroup2 (px:8, py:16)
 * │   └── InfoNote  (px:8, py:16, HORIZONTAL)
 * └── Right Area   822px  VERTICAL
 *     ├── ContentRow  HORIZONTAL  flex:1
 *     │   ├── MainContent  flexGrow:1  bg:background.paper
 *     │   └── PreviewPanel 283px      bg:background.paper
 *     └── Footer  64px  HORIZONTAL / MAX  spacing:16  px:16 py:12
 *         ├── CancelButton  outlined  142×40
 *         └── SaveButton    contained 142×40  (with shadow)
 */
export function UserEditModal({
  open,
  user,
  onClose,
  onSave,
}: UserEditModalProps) {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const [formData, setFormData] = useState<Partial<User>>({});

  // 打开 / 切换用户时同步表单数据
  useEffect(() => {
    if (user) {
      setFormData({ ...user });
      setActiveSection("basic");
    }
  }, [user, open]);

  const handleFieldChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (user) {
      onSave({ ...user, ...(formData as User) });
    }
  };

  const renderContent = () => {
    const props: ContentProps = { formData, onChange: handleFieldChange };
    switch (activeSection) {
      case "basic":
        return <BasicInfoSection {...props} />;
      case "email":
        return <EmailSection {...props} />;
      case "role":
        return <RoleSection {...props} />;
      case "status":
        return <StatusSection {...props} />;
      case "security":
        return <ReadonlySection formData={formData} />;
      case "activity":
        return <ActivitySection formData={formData} />;
      case "notifications":
        return <PlaceholderSection label="通知設定" />;
      case "privacy":
        return <PlaceholderSection label="プライバシー" />;
      case "other":
        return <PlaceholderSection label="その他" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          /**
           * Figma root: width: 1022, height: 669
           * layoutMode: HORIZONTAL, counterAxisAlignItems: CENTER
           */
          width: 1022,
          height: 669,
          maxHeight: 669,
          borderRadius: 2,
          overflow: "hidden",
          m: 2,
        },
      }}
    >
      <Stack direction="row" sx={{ height: "100%" }}>
        {/* ── 左侧边栏 200px ────────────────────────────────────────────────── */}
        {/* Figma: Frame 6  VERTICAL / SPACE_BETWEEN  width:200  bg: #F7F7F9 ≈ grey.50 */}
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            width: 200,
            flexShrink: 0,
            bgcolor: "grey.50",
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box>
            {/* Header: Figma "Frame 2" paddingLeft:24, height:48 */}
            <Box
              sx={{
                pl: `${token.lg}px`,
                pt: `${token.md}px`,
                pb: `${token.md}px`,
                height: 48,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={theme.typography.fontWeightMedium}
              >
                編集セクション
              </Typography>
            </Box>

            {/* NavGroup1: Figma "Frame 4" px:8 py:16 borderBottom(stroke "21:4954") */}
            <Box
              sx={{
                px: 1,
                py: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <NavList
                items={NAV_GROUP_1}
                activeId={activeSection}
                onSelect={setActiveSection}
              />
            </Box>

            {/* NavGroup2: Figma "Frame 5" px:8 py:16 */}
            <Box sx={{ px: 1, py: 2 }}>
              <NavList
                items={NAV_GROUP_2}
                activeId={activeSection}
                onSelect={setActiveSection}
              />
            </Box>
          </Box>

          {/* Info note: Figma bottom "Frame 4" HORIZONTAL px:8 py:16 spacing:4 */}
          <Box sx={{ px: 1, py: 2 }}>
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <InfoIcon
                sx={{
                  fontSize: 16,
                  color: "text.secondary",
                  mt: "1px",
                  flexShrink: 0,
                }}
              />
              {/* Figma: fontSize:12, lineHeight:18, fontWeight:400 */}
              <Typography
                color="text.secondary"
                sx={{ fontSize: 12, lineHeight: "18px", fontWeight: 400 }}
              >
                変更は保存ボタンを押すまで反映されません
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* ── 右侧区域 822px ────────────────────────────────────────────────── */}
        {/* Figma: Frame 4 (right)  VERTICAL  flex:1 */}
        <Stack direction="column" sx={{ flex: 1, overflow: "hidden" }}>
          {/* 内容行: Figma "Frame 4 > Frame 4"  HORIZONTAL  height:605 */}
          <Stack direction="row" sx={{ flex: 1, overflow: "hidden" }}>
            {/* 主内容区: Figma "Frame 10"  flexGrow:1  bg:background.paper */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: "auto",
                bgcolor: "background.paper",
                borderRight: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ p: `${token.lg}px` }}>{renderContent()}</Box>
              {/* Figma: Frame 10 — 宛先列表 VERTICAL px:16 py:8 itemSpacing:4 */}
              <RecipientList items={DEMO_RECIPIENTS} />
            </Box>

            {/* 右侧预览面板: Figma "Frame 4" width:283 bg:"24:63"=white px:16 py:12 */}
            <Box
              sx={{
                width: 283,
                flexShrink: 0,
                bgcolor: "background.paper",
                px: 2,
                py: 1.5,
                overflowY: "auto",
              }}
            >
              {user && <UserPreview user={user} formData={formData} />}
            </Box>
          </Stack>

          {/* 页脚: Figma "Frame 4" HORIZONTAL/MAX  height:64  px:16 py:12  spacing:16 */}
          {/* bg:"24:63"=white  borderTop stroke:"21:4954" */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            sx={{
              height: 64,
              flexShrink: 0,
              px: 2,
              py: 1.5,
              bgcolor: "background.paper",
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Figma: button (24:58) outlined / stroke "24:56" — 142×40 */}
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                width: 142,
                height: 40,
              }}
            >
              キャンセル
            </Button>

            {/* Figma: button (24:60) filled / effect "24:64" (shadow) — 142×40 */}
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                width: 142,
                height: 40,
                boxShadow: theme.shadows[2],
              }}
            >
              保存
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
}
