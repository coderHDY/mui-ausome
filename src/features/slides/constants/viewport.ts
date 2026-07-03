/** 相机行为配置 — 字段与原 react-zoom-pan-pinch props 一一对应 */
export type CameraConfig = {
  initialScale: number;
  /** 为 true 时，重置/初始化/窗口 resize 按视口 contain 内容（完整展示 + 尽量铺满） */
  fitToViewOnInit?: boolean;
  /** fit 模式下的内边距（px） */
  fitPadding?: number;
  minScale: number;
  maxScale: number;
  wheelStep: number;
  pinchStep: number;
  centerOnInit: boolean;
  centerZoomedOut: boolean;
  limitToBounds: boolean;
  disablePadding: boolean;
  smooth: boolean;
  panningVelocityDisabled: boolean;
  doubleClick: {
    disabled: boolean;
    mode?: 'zoomIn' | 'zoomOut' | 'reset';
    step?: number;
  };
};

/** 主画布与弹窗共用的缩放参数 */
export const VIEWPORT_ZOOM = {
  /** 主 slide 画布 — 对应 SlideViewport TransformWrapper */
  canvas: {
    initialScale: 1,
    fitToViewOnInit: true,
    fitPadding: 0,
    minScale: 1,
    maxScale: 3,
    wheelStep: 0.03,
    pinchStep: 1.5,
    centerOnInit: true,
    centerZoomedOut: false,
    limitToBounds: false,
    disablePadding: true,
    smooth: true,
    panningVelocityDisabled: true,
    doubleClick: { disabled: true },
  },
  /** 弹窗内预览 — 对应 ElementPreviewModal TransformWrapper */
  modal: {
    initialScale: 1,
    minScale: 1,
    maxScale: 4,
    wheelStep: 0.03,
    pinchStep: 1.5,
    centerOnInit: true,
    centerZoomedOut: true,
    limitToBounds: true,
    disablePadding: true,
    smooth: true,
    panningVelocityDisabled: true,
    doubleClick: { disabled: false, mode: 'zoomIn', step: 0.5 },
  },
} as const satisfies Record<string, CameraConfig>;

export type ViewportPreset = keyof typeof VIEWPORT_ZOOM;
