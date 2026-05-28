import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ThreadListItem, type ThreadItemData } from "./ThreadListItem";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ThreadListProps {
  items: ThreadItemData[];
  onItemCheck?: (id: string, checked: boolean) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ul — スレッドリストコンテナ (node: 1805:217021)
 *
 * Figma:
 * layoutMode: VERTICAL  overflowDirection: VERTICAL_SCROLLING
 * width: 1296  height: 648(固定、内部スクロール)
 * children: ThreadList/ListItems[]
 */
export function ThreadList({ items, onItemCheck }: ThreadListProps) {
  const theme = useTheme();

  if (items.length === 0) {
    return (
      <Box
        sx={{
          py: 4,
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          メッセージはありません
        </Typography>
      </Box>
    );
  }

  return (
    /* Figma: ul — VERTICAL  overflowDirection:VERTICAL_SCROLLING */
    <Box
      sx={{
        overflowY: "auto",
        // Desktop: Figma 固定 648px / Mobile: 100vhに合わせてフレキシブル
        maxHeight: { xs: "calc(100vh - 200px)", md: 648 },
        bgcolor: "background.paper",
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {items.map((item) => (
        <ThreadListItem key={item.id} item={item} onCheckChange={onItemCheck} />
      ))}
    </Box>
  );
}
