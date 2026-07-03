import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type Konva from 'konva';
import type { CameraConfig } from '../../constants/viewport';
import {
  clampCameraToBounds,
  clientToStagePoint,
  getCenteredCamera,
  resolveInitialScale,
  resolveScaleBounds,
  getTouchCenter,
  getTouchDistance,
  scaleFromDoubleClick,
  scaleFromPinch,
  scaleFromWheel,
  zoomAtPointer,
  type CameraState,
  type ContentSize,
  type StageSize,
} from './cameraMath';

type UseKonvaCameraOptions = {
  config: CameraConfig;
  stageSize: StageSize;
  contentSize: ContentSize;
  resetKey?: string;
  disabled?: boolean;
  panEnabled?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

/** 超过此像素位移视为拖动，不再触发元素 click */
const DRAG_CLICK_THRESHOLD_PX = 5;

type PointerSession = {
  startX: number;
  startY: number;
  didDrag: boolean;
};

export function useKonvaCamera({
  config,
  stageSize,
  contentSize,
  resetKey,
  disabled = false,
  panEnabled = true,
  containerRef,
}: UseKonvaCameraOptions) {
  const [camera, setCamera] = useState<CameraState>(() =>
    getCenteredCamera(
      stageSize,
      contentSize,
      resolveInitialScale(stageSize, contentSize, config),
    ),
  );

  const isPanningRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const pointerSessionRef = useRef<PointerSession>({
    startX: 0,
    startY: 0,
    didDrag: false,
  });
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  const zoomConfig = useMemo(() => {
    const bounds = resolveScaleBounds(stageSize, contentSize, config);
    return { ...config, ...bounds };
  }, [config, contentSize, stageSize]);

  const markDragIfNeeded = useCallback((clientX: number, clientY: number) => {
    const session = pointerSessionRef.current;
    if (session.didDrag) return;

    const dx = clientX - session.startX;
    const dy = clientY - session.startY;
    if (Math.hypot(dx, dy) >= DRAG_CLICK_THRESHOLD_PX) {
      session.didDrag = true;
    }
  }, []);

  const beginPointerSession = useCallback((clientX: number, clientY: number) => {
    pointerSessionRef.current = {
      startX: clientX,
      startY: clientY,
      didDrag: false,
    };
    lastPointerRef.current = { x: clientX, y: clientY };
  }, []);

  const shouldSuppressClick = useCallback(
    () => pointerSessionRef.current.didDrag,
    [],
  );

  const applyCamera = useCallback(
    (next: CameraState) => {
      const clamped = clampCameraToBounds(next, stageSize, contentSize, config);
      setCamera(clamped);
      return clamped;
    },
    [config, contentSize, stageSize],
  );

  const resetCamera = useCallback(() => {
    applyCamera(
      getCenteredCamera(
        stageSize,
        contentSize,
        resolveInitialScale(stageSize, contentSize, config),
      ),
    );
  }, [applyCamera, config, contentSize, stageSize]);

  useEffect(() => {
    if (stageSize.width <= 0 || stageSize.height <= 0) return;
    if (contentSize.width <= 0 || contentSize.height <= 0) return;
    resetCamera();
  }, [
    resetKey,
    resetCamera,
    stageSize.width,
    stageSize.height,
    contentSize.width,
    contentSize.height,
  ]);

  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      if (disabled) return;
      e.evt.preventDefault();

      const container = containerRef.current;
      if (!container) return;

      const pointer = clientToStagePoint(
        e.evt.clientX,
        e.evt.clientY,
        container.getBoundingClientRect(),
      );

      const current = cameraRef.current;
      const newScale = scaleFromWheel(
        current.scale,
        e.evt.deltaY,
        e.evt.deltaMode,
        zoomConfig,
      );

      if (newScale === current.scale) return;

      applyCamera(zoomAtPointer(current, pointer, newScale));
    },
    [applyCamera, containerRef, disabled, zoomConfig],
  );

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (disabled || !panEnabled) return;
      if (e.evt.button !== 0) return;

      isPanningRef.current = true;
      beginPointerSession(e.evt.clientX, e.evt.clientY);
    },
    [beginPointerSession, disabled, panEnabled],
  );

  const handlePointerMove = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>) => {
      if (disabled || !panEnabled || !isPanningRef.current) return;

      markDragIfNeeded(e.evt.clientX, e.evt.clientY);

      const dx = e.evt.clientX - lastPointerRef.current.x;
      const dy = e.evt.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.evt.clientX, y: e.evt.clientY };

      const current = cameraRef.current;
      applyCamera({
        ...current,
        x: current.x + dx,
        y: current.y + dy,
      });
    },
    [applyCamera, disabled, markDragIfNeeded, panEnabled],
  );

  const stopPanning = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  const handleTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (disabled) return;

      if (e.evt.touches.length === 2) {
        e.evt.preventDefault();
        pinchStartRef.current = {
          distance: getTouchDistance(e.evt.touches),
          scale: cameraRef.current.scale,
        };
        isPanningRef.current = false;
      } else if (e.evt.touches.length === 1) {
        if (!panEnabled) return;
        isPanningRef.current = true;
        beginPointerSession(
          e.evt.touches[0].clientX,
          e.evt.touches[0].clientY,
        );
      }
    },
    [beginPointerSession, disabled, panEnabled],
  );

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (disabled) return;

      const container = containerRef.current;
      if (!container) return;

      if (e.evt.touches.length === 2 && pinchStartRef.current) {
        e.evt.preventDefault();
        const distance = getTouchDistance(e.evt.touches);
        const ratio = distance / pinchStartRef.current.distance;
        const newScale = scaleFromPinch(
          pinchStartRef.current.scale,
          ratio,
          zoomConfig.pinchStep,
          zoomConfig,
        );

        const center = getTouchCenter(e.evt.touches);
        const pointer = clientToStagePoint(
          center.x,
          center.y,
          container.getBoundingClientRect(),
        );

        applyCamera(
          zoomAtPointer(
            { ...cameraRef.current, scale: newScale },
            pointer,
            newScale,
          ),
        );
        return;
      }

      if (e.evt.touches.length === 1 && isPanningRef.current) {
        const touch = e.evt.touches[0];
        markDragIfNeeded(touch.clientX, touch.clientY);

        const dx = touch.clientX - lastPointerRef.current.x;
        const dy = touch.clientY - lastPointerRef.current.y;
        lastPointerRef.current = { x: touch.clientX, y: touch.clientY };

        const current = cameraRef.current;
        applyCamera({
          ...current,
          x: current.x + dx,
          y: current.y + dy,
        });
      }
    },
    [applyCamera, containerRef, disabled, markDragIfNeeded, zoomConfig],
  );

  const handleTouchEnd = useCallback(() => {
    pinchStartRef.current = null;
    isPanningRef.current = false;
  }, []);

  const handleDoubleClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (disabled || config.doubleClick.disabled) return;

      const container = containerRef.current;
      if (!container) return;

      const pointer = clientToStagePoint(
        e.evt.clientX,
        e.evt.clientY,
        container.getBoundingClientRect(),
      );

      const current = cameraRef.current;
      const newScale = scaleFromDoubleClick(
        current.scale,
        zoomConfig.doubleClick,
        zoomConfig,
      );

      applyCamera(zoomAtPointer(current, pointer, newScale));
    },
    [applyCamera, containerRef, disabled, zoomConfig],
  );

  return {
    camera,
    shouldSuppressClick,
    stageProps: {
      scaleX: camera.scale,
      scaleY: camera.scale,
      x: camera.x,
      y: camera.y,
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: stopPanning,
      onPointerLeave: stopPanning,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onDblClick: handleDoubleClick,
    },
    resetCamera,
  };
}
