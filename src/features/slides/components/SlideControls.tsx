import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { spacing } from '@design-system/tokens';

import { SlideEditorToolbar } from './SlideEditorToolbar';

interface SlideControlsProps {
  slideId: string;
  currentIndex: number;
  total: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  slideTitle?: string;
  onPrev: () => void;
  onNext: () => void;
}

export function SlideControls({
  slideId,
  currentIndex,
  total,
  canGoPrev,
  canGoNext,
  slideTitle,
  onPrev,
  onNext,
}: SlideControlsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.md,
        width: 72,
        flexShrink: 0,
        py: spacing.md,
        px: spacing.sm,
        borderLeft: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Tooltip title="上一页" placement="left">
        <span>
          <IconButton
            aria-label="上一页"
            onClick={onPrev}
            disabled={!canGoPrev}
            size="large"
          >
            <ChevronLeftIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="下一页" placement="left">
        <span>
          <IconButton
            aria-label="下一页"
            onClick={onNext}
            disabled={!canGoNext}
            size="large"
          >
            <ChevronRightIcon />
          </IconButton>
        </span>
      </Tooltip>

      <SlideEditorToolbar slideId={slideId} />

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textAlign: 'center', lineHeight: 1.4 }}
      >
        {currentIndex + 1} / {total}
      </Typography>

      {slideTitle && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            textAlign: 'center',
            lineHeight: 1.3,
            writingMode: 'vertical-rl',
            maxHeight: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {slideTitle}
        </Typography>
      )}
    </Box>
  );
}
