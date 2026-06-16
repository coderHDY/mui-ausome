import { Box, useTheme } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { VIEWPORT_ZOOM } from '../constants/viewport';
import type { Slide } from '../types/slide.types';
import { SlideCanvas } from './SlideCanvas';

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
  const zoom = VIEWPORT_ZOOM.canvas;

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
        touchAction: 'none',
        overscrollBehavior: 'none',
        position: 'relative',
      }}
    >
      <TransformWrapper
        key={slideKey}
        disabled={frozen}
        initialScale={zoom.initialScale}
        minScale={zoom.minScale}
        maxScale={zoom.maxScale}
        centerOnInit
        limitToBounds={false}
        smooth
        wheel={{
          step: zoom.wheelStep,
        }}
        pinch={{
          step: zoom.pinchStep,
        }}
        panning={{ velocityDisabled: true }}
        trackPadPanning={{
          velocityDisabled: true,
        }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SlideCanvas slide={slide} onElementClick={onElementClick} />
        </TransformComponent>
      </TransformWrapper>

      {frozen && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            cursor: 'not-allowed',
          }}
          aria-hidden
        />
      )}
    </Box>
  );
}
