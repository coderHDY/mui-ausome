import { useCallback, useRef } from 'react';
import { Circle, Group, Line, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import { useTheme } from '@mui/material';
import { STAMP_GLYPH } from '../../constants/tools';
import { useSlideEditorStore } from '../../model/store/slide-editor-store';
import type { AnnotationElement } from '../../types/annotation.types';
import {
  clientToStagePoint,
  screenToWorld,
} from '../camera/cameraMath';
import { useCameraInteraction } from '../camera/cameraInteractionContext';
import { useCameraState } from '../camera/cameraStateContext';

interface KonvaAnnotationLayerProps {
  slideId: string;
  slideWidth: number;
  slideHeight: number;
}

function worldFromEvent(
  e: Konva.KonvaEventObject<PointerEvent>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  camera: { scale: number; x: number; y: number },
) {
  const container = containerRef.current;
  if (!container) return null;
  const screen = clientToStagePoint(
    e.evt.clientX,
    e.evt.clientY,
    container.getBoundingClientRect(),
  );
  return screenToWorld(screen, camera);
}

function FreehandNode({
  element,
  isSelected,
  draggable,
  onSelect,
  onDragEnd,
}: {
  element: Extract<AnnotationElement, { type: 'freehand' }>;
  isSelected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onDragEnd: (dx: number, dy: number) => void;
}) {
  const theme = useTheme();

  return (
    <Group
      draggable={draggable}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onDragEnd={(e) => {
        onDragEnd(e.target.x(), e.target.y());
        e.target.position({ x: 0, y: 0 });
      }}
    >
      <Line
        points={element.points}
        stroke={element.stroke}
        strokeWidth={element.strokeWidth}
        lineCap="round"
        lineJoin="round"
        tension={0.4}
        hitStrokeWidth={Math.max(element.strokeWidth + 8, 12)}
      />
      {isSelected && element.points.length >= 2 && (
        <Circle
          x={element.points[0]}
          y={element.points[1]}
          radius={6}
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          listening={false}
        />
      )}
    </Group>
  );
}

function TextNode({
  element,
  isSelected,
  draggable,
  onSelect,
  onDragEnd,
}: {
  element: Extract<AnnotationElement, { type: 'text' }>;
  isSelected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}) {
  const theme = useTheme();

  return (
    <Group
      x={element.x}
      y={element.y}
      draggable={draggable}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onDragEnd={(e) => {
        onDragEnd(e.target.x(), e.target.y());
      }}
    >
      {isSelected && (
        <Rect
          x={-4}
          y={-4}
          width={(element.content.length || 1) * element.fontSize * 0.55 + 8}
          height={element.fontSize * 1.4}
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          dash={[4, 4]}
          listening={false}
        />
      )}
      <Text
        text={element.content}
        fontSize={element.fontSize}
        fill={element.fill}
        fontStyle="600"
      />
    </Group>
  );
}

function StampNode({
  element,
  isSelected,
  draggable,
  onSelect,
  onDragEnd,
}: {
  element: Extract<AnnotationElement, { type: 'stamp' }>;
  isSelected: boolean;
  draggable: boolean;
  onSelect: () => void;
  onDragEnd: (x: number, y: number) => void;
}) {
  const theme = useTheme();

  return (
    <Group
      x={element.x}
      y={element.y}
      draggable={draggable}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onDragEnd={(e) => {
        onDragEnd(e.target.x(), e.target.y());
      }}
    >
      {isSelected && (
        <Circle
          x={0}
          y={0}
          radius={element.size / 2 + 6}
          stroke={theme.palette.primary.main}
          strokeWidth={2}
          listening={false}
        />
      )}
      <Text
        text={STAMP_GLYPH[element.stamp]}
        fontSize={element.size}
        fill={element.fill}
        offsetX={element.size / 2}
        offsetY={element.size / 2}
        x={0}
        y={0}
      />
    </Group>
  );
}

export function KonvaAnnotationLayer({
  slideId,
  slideWidth,
  slideHeight,
}: KonvaAnnotationLayerProps) {
  const { camera, containerRef } = useCameraState();
  const { shouldSuppressClick } = useCameraInteraction();
  const drawingIdRef = useRef<string | null>(null);

  const editorOpen = useSlideEditorStore((s) => s.editorOpen);
  const activeTool = useSlideEditorStore((s) => s.activeTool);
  const selectedId = useSlideEditorStore((s) => s.selectedAnnotationId);
  const annotations = useSlideEditorStore((s) => s.getAnnotations(slideId));
  const createFreehand = useSlideEditorStore((s) => s.createFreehand);
  const appendFreehandPoint = useSlideEditorStore((s) => s.appendFreehandPoint);
  const createText = useSlideEditorStore((s) => s.createText);
  const createStamp = useSlideEditorStore((s) => s.createStamp);
  const setSelectedAnnotationId = useSlideEditorStore(
    (s) => s.setSelectedAnnotationId,
  );
  const clearSelection = useSlideEditorStore((s) => s.clearSelection);
  const updateAnnotation = useSlideEditorStore((s) => s.updateAnnotation);

  const isSelectMode = editorOpen && activeTool === 'select';
  const isDrawOverlay =
    editorOpen &&
    (activeTool === 'brush' || activeTool === 'text' || activeTool === 'stamp');

  const shiftFreehand = useCallback(
    (id: string, dx: number, dy: number) => {
      const el = annotations.find((a) => a.id === id);
      if (!el || el.type !== 'freehand') return;
      const points = el.points.map((v, i) => v + (i % 2 === 0 ? dx : dy));
      updateAnnotation(slideId, id, { points });
    },
    [annotations, slideId, updateAnnotation],
  );

  const handleOverlayPointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (!editorOpen) return;
      e.cancelBubble = true;

      const world = worldFromEvent(e, containerRef, camera);
      if (!world) return;

      if (activeTool === 'brush') {
        drawingIdRef.current = createFreehand(slideId, world.x, world.y);
        return;
      }

      if (activeTool === 'text') {
        const content = window.prompt('输入文字', '文字');
        if (content?.trim()) {
          createText(slideId, world.x, world.y, content.trim());
        }
        return;
      }

      if (activeTool === 'stamp') {
        createStamp(slideId, world.x, world.y);
      }
    },
    [
      activeTool,
      camera,
      containerRef,
      createFreehand,
      createStamp,
      createText,
      editorOpen,
      slideId,
    ],
  );

  const handleOverlayPointerMove = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (activeTool !== 'brush' || !drawingIdRef.current) return;
      e.cancelBubble = true;

      const world = worldFromEvent(e, containerRef, camera);
      if (!world) return;

      appendFreehandPoint(
        slideId,
        drawingIdRef.current,
        world.x,
        world.y,
      );
    },
    [activeTool, appendFreehandPoint, camera, containerRef, slideId],
  );

  const handleOverlayPointerUp = useCallback(() => {
    drawingIdRef.current = null;
  }, []);

  const handleBackgroundClick = useCallback(() => {
    if (shouldSuppressClick()) return;
    if (isSelectMode) clearSelection();
  }, [clearSelection, isSelectMode, shouldSuppressClick]);

  if (!editorOpen && annotations.length === 0) {
    return null;
  }

  return (
    <Group>
      {isSelectMode && (
        <Rect
          width={slideWidth}
          height={slideHeight}
          fill="transparent"
          onClick={handleBackgroundClick}
          onTap={handleBackgroundClick}
        />
      )}

      {annotations.map((element) => {
        const isSelected = selectedId === element.id;
        const draggable = isSelectMode;

        if (element.type === 'freehand') {
          return (
            <FreehandNode
              key={element.id}
              element={element}
              isSelected={isSelected}
              draggable={draggable}
              onSelect={() => setSelectedAnnotationId(element.id)}
              onDragEnd={(dx, dy) => shiftFreehand(element.id, dx, dy)}
            />
          );
        }

        if (element.type === 'text') {
          return (
            <TextNode
              key={element.id}
              element={element}
              isSelected={isSelected}
              draggable={draggable}
              onSelect={() => setSelectedAnnotationId(element.id)}
              onDragEnd={(x, y) =>
                updateAnnotation(slideId, element.id, { x, y })
              }
            />
          );
        }

        return (
          <StampNode
            key={element.id}
            element={element}
            isSelected={isSelected}
            draggable={draggable}
            onSelect={() => setSelectedAnnotationId(element.id)}
            onDragEnd={(x, y) =>
              updateAnnotation(slideId, element.id, { x, y })
            }
          />
        );
      })}

      {isDrawOverlay && (
        <Rect
          width={slideWidth}
          height={slideHeight}
          fill="transparent"
          onPointerDown={handleOverlayPointerDown}
          onPointerMove={handleOverlayPointerMove}
          onPointerUp={handleOverlayPointerUp}
          onPointerLeave={handleOverlayPointerUp}
          style={{
            cursor:
              activeTool === 'brush'
                ? 'crosshair'
                : activeTool === 'text'
                  ? 'text'
                  : 'copy',
          }}
        />
      )}
    </Group>
  );
}
