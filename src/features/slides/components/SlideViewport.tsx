import { Box, useTheme } from '@mui/material';
import { VIEWPORT_ZOOM } from '../constants/viewport';
import { KonvaCameraStage } from '../engine/components/KonvaCameraStage';
import { KonvaSlideScene } from '../engine/components/KonvaSlideScene';
import type { Slide } from '../types/slide.types';

interface SlideViewportProps {
  slide: Slide;
  slideKey: string;
  frozen: boolean;
  onElementClick: (elementId: string) => void;
}

export function SlideViewport({
  slide,
  slideKey,
  frozen,
  onElementClick,
}: SlideViewportProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.200',
        position: 'relative',
      }}
    >
      <KonvaCameraStage
        config={VIEWPORT_ZOOM.canvas}
        contentSize={{ width: slide.width, height: slide.height }}
        resetKey={slideKey}
        disabled={frozen}
        sx={{ width: '100%', height: '100%' }}
      >
        <KonvaSlideScene slide={slide} onElementClick={onElementClick} />
      </KonvaCameraStage>
    </Box>
  );
}
