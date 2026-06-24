import { Box, useTheme } from '@mui/material';
import { VIEWPORT_ZOOM } from '../constants/viewport';
import { KonvaCameraStage } from '../engine/components/KonvaCameraStage';
import { KonvaSlideScene } from '../engine/components/KonvaSlideScene';
import { KonvaAnnotationLayer } from '../engine/components/KonvaAnnotationLayer';
import { useSlideEditorStore } from '../model/store/slide-editor-store';
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
  const editorOpen = useSlideEditorStore((s) => s.editorOpen);
  const activeTool = useSlideEditorStore((s) => s.activeTool);
  const panEnabled = !editorOpen || activeTool === 'pan';

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
        panEnabled={panEnabled && !frozen}
        sx={{ width: '100%', height: '100%' }}
      >
        <KonvaSlideScene slide={slide} onElementClick={onElementClick} />
        <KonvaAnnotationLayer
          slideId={slide.id}
          slideWidth={slide.width}
          slideHeight={slide.height}
        />
      </KonvaCameraStage>
    </Box>
  );
}
