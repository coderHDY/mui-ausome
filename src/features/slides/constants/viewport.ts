/** 主画布与弹窗共用的缩放参数（接近 Miro / Figma 主流区间） */
export const VIEWPORT_ZOOM = {
  /** 主 slide 画布 */
  canvas: {
    initialScale: 1,
    minScale: 1,
    maxScale: 3,
    wheelStep: 0.02,
    pinchStep: 1,
  },
  /** 弹窗内预览 */
  modal: {
    initialScale: 1,
    minScale: 1,
    maxScale: 4,
    wheelStep: 0.02,
    pinchStep: 1,
  },
} as const;

/** 可交互 slide 元素标记（样式 / 测试用） */
export const SLIDE_INTERACTIVE_CLASS = 'slide-interactive';
