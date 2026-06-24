/** 用户绘制的标注元素（Phase 2，与 slide 静态元素分离） */
export type FreehandAnnotation = {
  type: 'freehand';
  id: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
};

export type TextAnnotation = {
  type: 'text';
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  fill: string;
};

export type StampKind = 'check' | 'cross' | 'star' | 'arrow';

export type StampAnnotation = {
  type: 'stamp';
  id: string;
  x: number;
  y: number;
  stamp: StampKind;
  size: number;
  fill: string;
};

export type AnnotationElement =
  | FreehandAnnotation
  | TextAnnotation
  | StampAnnotation;

export type EditorTool = 'pan' | 'select' | 'brush' | 'text' | 'stamp';

export function isFreehand(
  el: AnnotationElement,
): el is FreehandAnnotation {
  return el.type === 'freehand';
}

export function isTextAnnotation(
  el: AnnotationElement,
): el is TextAnnotation {
  return el.type === 'text';
}

export function isStampAnnotation(
  el: AnnotationElement,
): el is StampAnnotation {
  return el.type === 'stamp';
}
