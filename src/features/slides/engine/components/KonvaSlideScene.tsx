import { Group, Rect, Text, Image as KonvaImage } from 'react-konva';
import { alpha, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { useSlideImage } from '../../hooks/useSlideImage';
import { useCameraInteraction } from '../camera/cameraInteractionContext';
import { useSlideEditorStore } from '../../model/store/slide-editor-store';
import type { Slide, SlideElement } from '../../types/slide.types';

const TEXT_COLOR_MAP = {
  primary: 'primary.main',
  secondary: 'secondary.main',
  textPrimary: 'text.primary',
  textSecondary: 'text.secondary',
} as const;

interface KonvaSlideSceneProps {
  slide: Slide;
  onElementClick: (elementId: string) => void;
}

const TEXT_FILL: Record<
  keyof typeof TEXT_COLOR_MAP,
  (theme: Theme) => string
> = {
  primary: (t) => t.palette.primary.main,
  secondary: (t) => t.palette.secondary.main,
  textPrimary: (t) => t.palette.text.primary,
  textSecondary: (t) => t.palette.text.secondary,
};

function resolveThemeColor(
  theme: Theme,
  token: keyof typeof TEXT_COLOR_MAP,
): string {
  return TEXT_FILL[token](theme);
}

function SlideImageNode({
  element,
  onClick,
}: {
  element: Extract<SlideElement, { type: 'image' }>;
  onClick: () => void;
}) {
  const [image] = useSlideImage(element.src);

  return (
    <Group
      x={element.x}
      y={element.y}
      onClick={onClick}
      onTap={onClick}
    >
      <KonvaImage
        image={image}
        width={element.width}
        height={element.height}
        cornerRadius={8}
      />
    </Group>
  );
}

function SlideHotspotNode({
  element,
  primaryColor,
  onClick,
}: {
  element: Extract<SlideElement, { type: 'hotspot' }>;
  primaryColor: string;
  onClick: () => void;
}) {
  return (
    <Group
      x={element.x}
      y={element.y}
      onClick={onClick}
      onTap={onClick}
    >
      <Rect
        width={element.width}
        height={element.height}
        cornerRadius={8}
        stroke={primaryColor}
        strokeWidth={2}
        dash={[8, 4]}
        fill={alpha(primaryColor, 0.08)}
      />
      <Text
        text={element.label}
        width={element.width}
        height={element.height}
        align="center"
        verticalAlign="middle"
        fill={primaryColor}
        fontSize={16}
        fontStyle="600"
        listening={false}
      />
    </Group>
  );
}

function SlideTextNode({
  element,
  fill,
}: {
  element: Extract<SlideElement, { type: 'text' }>;
  fill: string;
}) {
  return (
    <Text
      x={element.x}
      y={element.y}
      width={element.width}
      text={element.content}
      fontSize={element.fontSize ?? 24}
      fontStyle={element.fontWeight && element.fontWeight >= 600 ? 'bold' : 'normal'}
      fill={fill}
      lineHeight={1.5}
      listening={false}
    />
  );
}

export function KonvaSlideScene({ slide, onElementClick }: KonvaSlideSceneProps) {
  const theme = useTheme();
  const { shouldSuppressClick } = useCameraInteraction();
  const editorOpen = useSlideEditorStore((s) => s.editorOpen);
  const paperColor = theme.palette.background.paper;
  const primaryColor = theme.palette.primary.main;

  const handleElementClick = (elementId: string) => {
    if (editorOpen) return;
    if (shouldSuppressClick()) return;
    onElementClick(elementId);
  };

  return (
    <Group>
      <Rect
        width={slide.width}
        height={slide.height}
        fill={paperColor}
        cornerRadius={8}
        shadowColor="black"
        shadowBlur={16}
        shadowOpacity={0.15}
        shadowOffsetY={4}
        listening={false}
      />
      {slide.elements.map((element) => {
        if (element.type === 'text') {
          const colorKey = element.color ?? 'textPrimary';
          return (
            <SlideTextNode
              key={element.id}
              element={element}
              fill={resolveThemeColor(theme, colorKey)}
            />
          );
        }

        if (element.type === 'hotspot') {
          return (
            <SlideHotspotNode
              key={element.id}
              element={element}
              primaryColor={primaryColor}
              onClick={() => handleElementClick(element.id)}
            />
          );
        }

        return (
          <SlideImageNode
            key={element.id}
            element={element}
            onClick={() => handleElementClick(element.id)}
          />
        );
      })}
    </Group>
  );
}
