import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Box, alpha, useTheme } from '@mui/material';
import { SLIDE_INTERACTIVE_CLASS } from '../constants/viewport';
import { useClickWithoutDrag } from '../hooks/useClickWithoutDrag';
import type { ImageElement } from '../types/slide.types';

interface SlideElementImageProps {
  element: ImageElement;
  onClick: () => void;
}

export function SlideElementImage({ element, onClick }: SlideElementImageProps) {
  const theme = useTheme();
  const { handlePointerDown } = useClickWithoutDrag(onClick);

  return (
    <Box
      className={SLIDE_INTERACTIVE_CLASS}
      role="button"
      tabIndex={0}
      aria-label={`${element.alt ?? '图片'}，点击放大预览`}
      onPointerDown={handlePointerDown}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: 'grab',
        borderRadius: 1,
        overflow: 'hidden',
        '&:active': {
          cursor: 'grabbing',
        },
        '&:hover .slide-image-overlay': {
          opacity: 1,
        },
        '&:focus-visible': {
          outline: `3px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <Box
        component="img"
        src={element.src}
        alt={element.alt ?? ''}
        loading="lazy"
        draggable={false}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
      <Box
        className="slide-image-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(theme.palette.common.black, 0.35),
          opacity: 0,
          transition: theme.transitions.create('opacity', {
            duration: theme.transitions.duration.shorter,
          }),
          pointerEvents: 'none',
        }}
      >
        <ZoomInIcon sx={{ color: 'common.white', fontSize: 48 }} />
      </Box>
    </Box>
  );
}
