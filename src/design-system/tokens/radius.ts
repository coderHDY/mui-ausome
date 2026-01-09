/**
 * 圆角设计令牌
 * 所有圆角值必须使用这些令牌
 */
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type Radius = typeof radius[keyof typeof radius];

