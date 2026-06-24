import type { CameraConfig } from '../../constants/viewport';

export type CameraState = {
  scale: number;
  x: number;
  y: number;
};

export type ContentSize = {
  width: number;
  height: number;
};

export type StageSize = {
  width: number;
  height: number;
};

export function clampScale(
  scale: number,
  config: Pick<CameraConfig, 'minScale' | 'maxScale'>,
): number {
  return Math.min(config.maxScale, Math.max(config.minScale, scale));
}

/** 初始居中：等价 centerOnInit */
export function getCenteredCamera(
  stage: StageSize,
  content: ContentSize,
  scale: number,
): CameraState {
  return {
    scale,
    x: (stage.width - content.width * scale) / 2,
    y: (stage.height - content.height * scale) / 2,
  };
}

/** 以指针为锚点缩放 — 等价 wheel + pinch 锚点行为 */
export function zoomAtPointer(
  camera: CameraState,
  pointer: { x: number; y: number },
  newScale: number,
): CameraState {
  const worldX = (pointer.x - camera.x) / camera.scale;
  const worldY = (pointer.y - camera.y) / camera.scale;

  return {
    scale: newScale,
    x: pointer.x - worldX * newScale,
    y: pointer.y - worldY * newScale,
  };
}

/**
 * 边界钳制 — 移植 react-zoom-pan-pinch getBounds 逻辑
 * @see node_modules/react-zoom-pan-pinch calculateBounds
 */
export function clampCameraToBounds(
  camera: CameraState,
  stage: StageSize,
  content: ContentSize,
  config: Pick<CameraConfig, 'limitToBounds' | 'centerZoomedOut' | 'disablePadding'>,
): CameraState {
  if (!config.limitToBounds) {
    return camera;
  }

  const scaledWidth = content.width * camera.scale;
  const scaledHeight = content.height * camera.scale;
  const diffWidth = stage.width - scaledWidth;
  const diffHeight = stage.height - scaledHeight;

  const contentFits =
    stage.width >= scaledWidth && stage.height >= scaledHeight;

  if (config.disablePadding && contentFits && !config.centerZoomedOut) {
    return { ...camera, x: 0, y: 0 };
  }

  const scaleWidthFactor =
    stage.width > scaledWidth
      ? diffWidth * (config.centerZoomedOut ? 0.5 : 1)
      : 0;
  const scaleHeightFactor =
    stage.height > scaledHeight
      ? diffHeight * (config.centerZoomedOut ? 0.5 : 1)
      : 0;

  const minX = stage.width - scaledWidth - scaleWidthFactor;
  const maxX = scaleWidthFactor;
  const minY = stage.height - scaledHeight - scaleHeightFactor;
  const maxY = scaleHeightFactor;

  return {
    ...camera,
    x: Math.min(maxX, Math.max(minX, camera.x)),
    y: Math.min(maxY, Math.max(minY, camera.y)),
  };
}

const DEFAULT_PINCH_STEP = 5;

/** 单次滚轮/触控板缩放的有效幅度区间（用于 scale 增量 = wheelStep × magnitude） */
const WHEEL_MAGNITUDE_MIN = 3;
const WHEEL_MAGNITUDE_MAX = 20;

/**
 * 将原始 wheel delta 映射到 [MIN, MAX]：
 * - 下限：轻扫触控板也有即时反馈
 * - 上限：鼠标滚轮一格不会跳变过大
 * - 中间：pixel 模式用 sqrt 曲线，快慢手势都能按比例感知
 */
function clampWheelMagnitude(magnitude: number): number {
  return Math.min(WHEEL_MAGNITUDE_MAX, Math.max(WHEEL_MAGNITUDE_MIN, magnitude));
}

/** 将 wheel delta 归一化为带符号的有效幅度（绝对值 ∈ [3, 20]） */
export function normalizeWheelDelta(deltaY: number, deltaMode: number): number {
  if (deltaY === 0) return 0;

  const sign = deltaY < 0 ? -1 : 1;
  const abs = Math.abs(deltaY);

  let magnitude: number;
  switch (deltaMode) {
    case 1: // DOM_DELTA_LINE — 鼠标滚轮常见 ±1~3
      magnitude = abs * 6;
      break;
    case 2: // DOM_DELTA_PAGE
      magnitude = abs * 15;
      break;
    default: {
      // DOM_DELTA_PIXEL — 触控板 1~15，滚轮 40~120+
      // sqrt 压缩大 delta，保留小 delta 的梯度差异
      magnitude = Math.sqrt(abs) * 2.5;
      break;
    }
  }

  return sign * clampWheelMagnitude(magnitude);
}

/** 滚轮 delta → 新 scale，对齐 react-zoom-pan-pinch handleCalculateWheelZoom */
export function scaleFromWheel(
  currentScale: number,
  deltaY: number,
  deltaMode: number,
  config: Pick<CameraConfig, 'minScale' | 'maxScale' | 'smooth' | 'wheelStep'>,
): number {
  const normalized = normalizeWheelDelta(deltaY, deltaMode);
  const direction = normalized < 0 ? 1 : -1;
  const step = config.smooth
    ? config.wheelStep * Math.abs(normalized)
    : config.wheelStep;
  return clampScale(currentScale + direction * step, config);
}

/** 双指 pinch → 新 scale，对齐 react-zoom-pan-pinch calculatePinchZoom */
export function scaleFromPinch(
  startScale: number,
  distanceRatio: number,
  pinchStep: number,
  config: Pick<CameraConfig, 'minScale' | 'maxScale'>,
): number {
  const rawScale = distanceRatio * startScale;
  const scaleDelta = (rawScale - startScale) * (pinchStep / DEFAULT_PINCH_STEP);
  return clampScale(startScale + scaleDelta, config);
}

/** doubleClick zoomIn — step 0.5 表示增加 50% 相对倍率 */
export function scaleFromDoubleClick(
  currentScale: number,
  doubleClick: CameraConfig['doubleClick'],
  bounds: Pick<CameraConfig, 'minScale' | 'maxScale'>,
): number {
  if (doubleClick.disabled || !doubleClick.mode) {
    return currentScale;
  }

  const step = doubleClick.step ?? 0.5;

  switch (doubleClick.mode) {
    case 'zoomIn':
      return clampScale(currentScale * (1 + step), bounds);
    case 'zoomOut':
      return clampScale(currentScale * (1 - step), bounds);
    case 'reset':
      return bounds.minScale;
    default:
      return currentScale;
  }
}

export function getTouchDistance(touches: TouchList): number {
  if (touches.length < 2) return 0;
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

export function getTouchCenter(touches: TouchList): { x: number; y: number } {
  if (touches.length < 2) {
    return { x: touches[0].clientX, y: touches[0].clientY };
  }
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

/** 将屏幕 client 坐标转为 Stage 内坐标 */
export function clientToStagePoint(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
): { x: number; y: number } {
  return {
    x: clientX - containerRect.left,
    y: clientY - containerRect.top,
  };
}

/** Stage 屏幕坐标 → slide 世界坐标 */
export function screenToWorld(
  screen: { x: number; y: number },
  camera: CameraState,
): { x: number; y: number } {
  return {
    x: (screen.x - camera.x) / camera.scale,
    y: (screen.y - camera.y) / camera.scale,
  };
}
