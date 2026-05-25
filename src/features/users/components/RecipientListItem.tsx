import { Box, Stack, Typography } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

// ─── Props ─────────────────────────────────────────────────────────────────────
// Figma: 宛先 (componentId: 35:219)
// componentProperties:
//   名前#35:1       TEXT     — 主名称
//   部署#35:2       TEXT     — 所属部署
//   アイコンを表示#391:0  BOOLEAN  — 是否显示图标
//   部署を表示#35:0  BOOLEAN  — 是否显示部署 & 邮箱行
export interface RecipientItem {
  id: string;
  name: string;
  department?: string;
  email?: string;
}

export interface RecipientListItemProps {
  item: RecipientItem;
  /** Figma: アイコンを表示 — 默认 true */
  showIcon?: boolean;
  /** Figma: 部署を表示 — 默认 true */
  showDepartment?: boolean;
}

/**
 * 宛先 item
 *
 * Figma: 宛先 (35:219)
 * layoutMode: HORIZONTAL  px:16 py:8  height:73(HUG)  align:STRETCH
 * ├── Frame 14  28×24  HORIZONTAL/CENTER  paddingRight:4  itemSpacing:10
 * │   └── Frame 13  24×24  CENTER
 * │       └── Icon  16×16  variant:user  fill:text.primary
 * └── Frame 4   VERTICAL
 *     ├── name     fontSize:14  lineHeight:21  fill:text.primary
 *     ├── dept     fontSize:12  lineHeight:18  fill:text.secondary
 *     └── email    fontSize:12  lineHeight:18  fill:text.secondary
 */
export function RecipientListItem({
  item,
  showIcon = true,
  showDepartment = true,
}: RecipientListItemProps) {
  return (
    <Stack
      direction="row"
      sx={{
        px: 2, // paddingLeft/Right: 16
        py: 1, // paddingTop/Bottom: 8
        minHeight: 73,
        alignItems: "flex-start",
      }}
    >
      {/* Figma: Frame 14 — 图标容器 28×24，paddingRight:4 */}
      {showIcon && (
        <Box
          sx={{
            width: 28,
            height: 24,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            pr: "4px",
          }}
        >
          {/* Figma: Frame 13 24×24 CENTER */}
          <Box
            sx={{
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Figma: Icon 16×16 variant:user fill:21:4906 (text.primary) */}
            <PersonIcon sx={{ fontSize: 16, color: "text.primary" }} />
          </Box>
        </Box>
      )}

      {/* Figma: Frame 4 — 文本纵排 */}
      <Stack direction="column" sx={{ minWidth: 0 }}>
        {/* Figma: 名前太郎 fontSize:14 lineHeight:21 fill:text.primary */}
        <Typography
          variant="body2"
          sx={{
            fontSize: 14,
            lineHeight: "21px",
            color: "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </Typography>

        {showDepartment && item.department && (
          /* Figma: 部署テキスト fontSize:12 lineHeight:18 fill:text.secondary */
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              lineHeight: "18px",
              color: "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.department}
          </Typography>
        )}

        {item.email && (
          /* Figma: email テキスト fontSize:12 lineHeight:18 fill:text.secondary */
          <Typography
            variant="caption"
            sx={{
              fontSize: 12,
              lineHeight: "18px",
              color: "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.email}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
