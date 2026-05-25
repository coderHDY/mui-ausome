import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { RecipientListItem, type RecipientItem } from "./RecipientListItem";

// ─── Props ─────────────────────────────────────────────────────────────────────
export interface RecipientListProps {
  items: RecipientItem[];
  /** Figma: アイコンを表示 — 全局控制图标显示，默认 true */
  showIcon?: boolean;
  /** Figma: 部署を表示 — 全局控制部署显示，默认 true */
  showDepartment?: boolean;
}

/**
 * 宛先列表
 *
 * Figma: Frame 10 (37:394)
 * layoutMode: VERTICAL  px:16 py:8  itemSpacing:4
 * 每个子项为 宛先 item (35:219)，横向 STRETCH
 */
export function RecipientList({
  items,
  showIcon = true,
  showDepartment = true,
}: RecipientListProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 2, // paddingLeft/Right: 16
        py: 1, // paddingTop/Bottom: 8
        display: "flex",
        flexDirection: "column",
        gap: "4px", // itemSpacing: 4
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            borderBottom:
              index < items.length - 1
                ? `1px solid ${theme.palette.divider}`
                : "none",
          }}
        >
          <RecipientListItem
            item={item}
            showIcon={showIcon}
            showDepartment={showDepartment}
          />
        </Box>
      ))}
    </Box>
  );
}
