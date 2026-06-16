import { Box, Typography, useTheme } from '@mui/material';
import type { Slide, SlideElement } from '../types/slide.types';
import { SlideElementImage } from './SlideElementImage';
import { SlideElementHotspot } from './SlideElementHotspot';

interface SlideCanvasProps {
  slide: Slide;
  onElementClick: (elementId: string) => void;
}

const TEXT_COLOR_MAP = {
  primary: 'primary.main',
  secondary: 'secondary.main',
  textPrimary: 'text.primary',
  textSecondary: 'text.secondary',
} as const;

function renderTextElement(
  element: Extract<SlideElement, { type: 'text' }>,
) {
  const colorKey = element.color ?? 'textPrimary';

  return (
    <Typography
      key={element.id}
      component="div"
      sx={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        fontSize: element.fontSize ?? 24,
        fontWeight: element.fontWeight ?? 400,
        color: TEXT_COLOR_MAP[colorKey],
        whiteSpace: 'pre-line',
        lineHeight: 1.5,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {element.content}
    </Typography>
  );
}

export function SlideCanvas({ slide, onElementClick }: SlideCanvasProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: slide.width,
        height: slide.height,
        bgcolor: theme.palette.background.paper,
        borderRadius: 1,
        boxShadow: theme.shadows[4],
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {slide.elements.map((element) => {
        if (element.type === 'text') {
          return renderTextElement(element);
        }

        if (element.type === 'hotspot') {
          return (
            <SlideElementHotspot
              key={element.id}
              element={element}
              onClick={() => onElementClick(element.id)}
            />
          );
        }

        return (
          <SlideElementImage
            key={element.id}
            element={element}
            onClick={() => onElementClick(element.id)}
          />
        );
      })}
    </Box>
  );
}
