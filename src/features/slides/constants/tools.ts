import type { EditorTool, StampKind } from '../types/annotation.types';

/** Excalidraw 风格常用色板 */
export const EDITOR_SWATCHES = [
  '#1e1e1e',
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#868e96',
  '#fab005',
  '#ae3ec9',
] as const;

export const DEFAULT_STROKE_COLOR = EDITOR_SWATCHES[3];
export const DEFAULT_STROKE_WIDTH = 3;
export const DEFAULT_TEXT_SIZE = 28;
export const DEFAULT_STAMP_SIZE = 48;

export const STAMP_GLYPH: Record<StampKind, string> = {
  check: '✓',
  cross: '✗',
  star: '★',
  arrow: '➜',
};

export type ToolDefinition = {
  id: EditorTool;
  label: string;
};

export const EDITOR_TOOLS: ToolDefinition[] = [
  { id: 'pan', label: '平移' },
  { id: 'select', label: '选择' },
  { id: 'brush', label: '画笔' },
  { id: 'text', label: '文字' },
  { id: 'stamp', label: '图章' },
];

/** 需二次选择后才关闭弹窗、进入画布的工具（仅图章） */
export const TOOLS_WITH_SUBOPTIONS: EditorTool[] = ['stamp'];

export function toolNeedsSubOptionConfirm(tool: EditorTool): boolean {
  return TOOLS_WITH_SUBOPTIONS.includes(tool);
}
