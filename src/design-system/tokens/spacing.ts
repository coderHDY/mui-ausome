/**
 * 间距设计令牌
 * 所有间距值必须使用这些令牌，禁止硬编码数值
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type Spacing = typeof spacing[keyof typeof spacing];

