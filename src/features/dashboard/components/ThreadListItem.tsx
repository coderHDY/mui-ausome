import {
  Box,
  Stack,
  Typography,
  Checkbox,
  Chip,
  IconButton,
} from "@mui/material";
import {
  DeleteOutline as DeleteOutlineIcon,
  Flag as FlagIcon,
  MailOutline as MailOutlineIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThreadLabel {
  id: string;
  text: string;
  /** MUI palette key — e.g. "primary" / "error" / "warning" / "success" / "info" */
  colorKey?: "primary" | "error" | "warning" | "success" | "info";
}

export interface ThreadItemData {
  id: string;
  /** Figma: Unread variant */
  unread?: boolean;
  /** Figma: Flag icon アクティブ */
  flagged?: boolean;
  /** Figma: DataDisplay/DraftLabel-OR "下書き" */
  isDraft?: boolean;
  /** Figma: from  bold 14px(desktop) / 16px(mobile) */
  from: string;
  /** Figma: reciever */
  receivers?: string[];
  /** Figma: cc "…" */
  hasCc?: boolean;
  /** Figma: ThreadNum — 99超→"99+" */
  threadCount?: number;
  /** Figma: attachment icon */
  hasAttachment?: boolean;
  /** Figma: tittle(desktop 14px) / bottom-container(mobile 12px) */
  subject: string;
  /** Figma: label-container Chip[] */
  labels?: ThreadLabel[];
  /** Figma: date text — desktop:"2023/02/23"  mobile:time "17:55" */
  date: string;
  checked?: boolean;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ThreadListItemProps {
  item: ThreadItemData;
  onCheckChange?: (id: string, checked: boolean) => void;
}

// ─── Private: SenderStrip ────────────────────────────────────────────────────
// Desktop left-container(480px) と Mobile top-row で共用

interface SenderStripProps {
  isDraft?: boolean;
  from: string;
  /** Desktop: 14px / Mobile: 16px */
  fromFontSize: number;
  receivers?: string[];
  hasCc?: boolean;
  threadCount?: number;
  hasAttachment?: boolean;
  flagged?: boolean;
  sx?: SxProps<Theme>;
}

function SenderStrip({
  isDraft,
  from,
  fromFontSize,
  receivers,
  hasCc,
  threadCount,
  hasAttachment,
  flagged,
  sx,
}: SenderStripProps) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ gap: "4px", overflow: "hidden", ...sx }}
    >
      {/* Figma: delete 20×20 */}
      <IconButton
        size="small"
        sx={{ width: 20, height: 20, flexShrink: 0, p: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <DeleteOutlineIcon sx={{ fontSize: 16, color: "text.secondary" }} />
      </IconButton>

      {/* Figma: flag 20×20 */}
      <IconButton
        size="small"
        sx={{ width: 20, height: 20, flexShrink: 0, p: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <FlagIcon
          sx={{
            fontSize: 16,
            color: flagged ? "error.main" : "text.secondary",
          }}
        />
      </IconButton>

      {/* Figma: DataDisplay/DraftLabel-OR "下書き" */}
      {isDraft && (
        <Chip
          label="下書き"
          size="small"
          sx={{
            height: 18,
            fontSize: 12,
            flexShrink: 0,
            bgcolor: alpha(theme.palette.warning.main, 0.12),
            color: "warning.dark",
            borderRadius: "4px",
            "& .MuiChip-label": { px: "6px" },
          }}
        />
      )}

      {/* Figma: from text */}
      <Typography
        noWrap
        sx={{
          fontSize: fromFontSize,
          lineHeight: "1.5",
          fontWeight: 700,
          color: "text.primary",
          flexShrink: 0,
          maxWidth: { xs: 140, md: 160 },
        }}
      >
        {from}
      </Typography>

      {/* Figma: reciever + cc */}
      {receivers && receivers.length > 0 && (
        <Typography
          noWrap
          sx={{
            fontSize: fromFontSize,
            lineHeight: "1.5",
            color: "text.secondary",
          }}
        >
          , {receivers.join(", ")}
          {hasCc && ", …"}
        </Typography>
      )}

      {/* Figma: ThreadNum MailOutlineIcon + count  itemSpacing:2 */}
      {threadCount != null && (
        <Stack
          direction="row"
          alignItems="center"
          sx={{ gap: "2px", flexShrink: 0 }}
        >
          <MailOutlineIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, lineHeight: "18px" }}
          >
            {threadCount > 99 ? "99+" : threadCount}
          </Typography>
        </Stack>
      )}

      {/* Figma: attachment AttachFileIcon 16px */}
      {hasAttachment && (
        <AttachFileIcon
          sx={{ fontSize: 16, color: "text.secondary", flexShrink: 0 }}
        />
      )}
    </Stack>
  );
}

// ─── Private: LabelChips ─────────────────────────────────────────────────────
// Desktop inline と Mobile label-row で共用

interface LabelChipsProps {
  labels: ThreadLabel[];
  sx?: SxProps<Theme>;
}

function LabelChips({ labels, sx }: LabelChipsProps) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ gap: "4px", flexShrink: 0, overflow: "hidden", ...sx }}
    >
      {labels.map((lbl) => {
        const main = (
          theme.palette[lbl.colorKey ?? "primary"] as { main: string }
        ).main;
        return (
          <Chip
            key={lbl.id}
            label={lbl.text}
            size="small"
            sx={{
              height: 18,
              fontSize: 12,
              bgcolor: alpha(main, 0.1),
              color: main,
              border: `1px solid ${alpha(main, 0.3)}`,
              borderRadius: "4px",
              "& .MuiChip-label": { px: "6px" },
            }}
          />
        );
      })}
    </Stack>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * ThreadList/ListItems — レスポンシブ対応
 *
 * Desktop (md+)  Figma: 491:24585  SIze:"xl"  height:48
 *   HORIZONTAL  paddingRight:16
 *   ├── unread RECTANGLE 4×48 (垂直バー)
 *   ├── Checkbox 48×40
 *   └── [left 480px fixed] + [right flexGrow:1  pl:40  gap:40]
 *       right: subject(14px bold?) + labels + date(12px)
 *
 * Mobile (xs-sm)  Figma: 337:30606  SIze:"xs"  height:76
 *   HORIZONTAL  paddingLeft:4  paddingRight:16
 *   ├── unread VECTOR 20×20 → 8px circle dot
 *   ├── Checkbox 40×40
 *   └── contents VERTICAL flexGrow:1
 *       ├── top-row:    SenderStrip(16px) + date(12px bold?)
 *       ├── bottom-row: subject(12px bold?)
 *       └── label-row:  LabelChips
 */
export function ThreadListItem({ item, onCheckChange }: ThreadListItemProps) {
  const theme = useTheme();
  const {
    id,
    unread,
    flagged,
    isDraft,
    from,
    receivers,
    hasCc,
    threadCount,
    hasAttachment,
    subject,
    labels,
    date,
    checked,
  } = item;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        // Mobile: min 76px HUG / Desktop: fixed 48px
        minHeight: { xs: 76, md: 48 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: unread
          ? alpha(theme.palette.primary.main, 0.03)
          : "background.paper",
        pr: 2,
        cursor: "pointer",
        overflow: "hidden",
        "&:hover": { bgcolor: alpha(theme.palette.action.hover, 0.04) },
      }}
    >
      {/* ── Unread: desktop — 4px vertical bar ───────────────────────────── */}
      {/* Figma desktop: RECTANGLE 4×48 fill:error.main */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: 4,
          alignSelf: "stretch",
          flexShrink: 0,
          bgcolor: unread ? "error.main" : "transparent",
        }}
      />

      {/* ── Unread: mobile — 8px circle dot ──────────────────────────────── */}
      {/* Figma mobile: VECTOR 20×20 fill:error.main → simplified to dot */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          width: 20,
          flexShrink: 0,
          justifyContent: "center",
          alignSelf: "flex-start",
          pt: "8px",
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: unread ? "error.main" : "transparent",
          }}
        />
      </Box>

      {/* ── Checkbox: 48×40(desktop) / 40×40(mobile) ─────────────────────── */}
      <Box
        sx={{
          width: { xs: 40, md: 48 },
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Checkbox
          size="small"
          checked={!!checked}
          onChange={(e) => onCheckChange?.(id, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          sx={{ p: "4px" }}
        />
      </Box>

      {/* ── Content: VERTICAL(mobile) / HORIZONTAL(desktop) ──────────────── */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          py: { xs: "8px", md: 0 },
        }}
      >
        {/* ════ MOBILE (xs ~ sm) ═══════════════════════════════════════════ */}

        {/* Mobile row 1: SenderStrip + date */}
        {/* Figma: top-container HORIZONTAL gap:4 */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            display: { xs: "flex", md: "none" },
            gap: "4px",
            overflow: "hidden",
          }}
        >
          <SenderStrip
            isDraft={isDraft}
            from={from}
            fromFontSize={16}
            receivers={receivers}
            hasCc={hasCc}
            threadCount={threadCount}
            hasAttachment={hasAttachment}
            flagged={flagged}
            sx={{ flexGrow: 1, gap: "2px" }}
          />
          {/* Figma mobile: date 12px bold(unread)/regular, time only */}
          <Typography
            noWrap
            sx={{
              fontSize: 12,
              lineHeight: "18px",
              fontWeight: unread ? 700 : 400,
              color: "text.secondary",
              flexShrink: 0,
            }}
          >
            {date}
          </Typography>
        </Stack>

        {/* Mobile row 2: subject */}
        {/* Figma: bottom-container fontSize:12 bold if unread */}
        <Box sx={{ display: { xs: "block", md: "none" }, overflow: "hidden" }}>
          <Typography
            noWrap
            sx={{
              fontSize: 12,
              lineHeight: "18px",
              fontWeight: unread ? 700 : 400,
              color: "text.primary",
            }}
          >
            {subject}
          </Typography>
        </Box>

        {/* Mobile row 3: labels */}
        {/* Figma: label-container HORIZONTAL gap:4 */}
        {labels && labels.length > 0 && (
          <LabelChips
            labels={labels}
            sx={{ display: { xs: "flex", md: "none" } }}
          />
        )}

        {/* ════ DESKTOP (md+) ══════════════════════════════════════════════ */}

        {/* Desktop left-container: 480px fixed, gap:4 */}
        {/* Figma: left-container width:480 HORIZONTAL itemSpacing:4 */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            display: { xs: "none", md: "flex" },
            width: 480,
            flexShrink: 0,
            gap: "4px",
            overflow: "hidden",
          }}
        >
          <SenderStrip
            isDraft={isDraft}
            from={from}
            fromFontSize={14}
            receivers={receivers}
            hasCc={hasCc}
            threadCount={threadCount}
            hasAttachment={hasAttachment}
            flagged={flagged}
          />
        </Stack>

        {/* Desktop right-container: flexGrow, pl:40, gap:40 */}
        {/* Figma: right-container HORIZONTAL layoutGrow:1 paddingLeft:40 itemSpacing:40 */}
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            display: { xs: "none", md: "flex" },
            flexGrow: 1,
            pl: "40px",
            gap: "40px",
            overflow: "hidden",
          }}
        >
          {/* tittle/label-container: flexGrow:1 gap:8 */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{ flexGrow: 1, gap: "8px", overflow: "hidden", minWidth: 0 }}
          >
            {/* Figma: tittle bold(unread)/regular 14px noWrap */}
            <Typography
              noWrap
              sx={{
                fontSize: 14,
                lineHeight: "21px",
                fontWeight: unread ? 700 : 400,
                color: "text.primary",
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              {subject}
            </Typography>
            {labels && labels.length > 0 && <LabelChips labels={labels} />}
          </Stack>

          {/* Figma: date 12px text.secondary */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, lineHeight: "18px", flexShrink: 0 }}
          >
            {date}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
