import type { AnnotationElement } from '../../types/annotation.types';

export const MAX_UNDO_STACK = 50;

/** 全 deck 标注快照（按 slideId 分组） */
export type AnnotationsSnapshot = Record<string, AnnotationElement[]>;

export function cloneAnnotationsSnapshot(
  src: AnnotationsSnapshot,
): AnnotationsSnapshot {
  return structuredClone(src);
}

export function pushSnapshot(
  past: AnnotationsSnapshot[],
  snapshot: AnnotationsSnapshot,
): AnnotationsSnapshot[] {
  return [...past.slice(-(MAX_UNDO_STACK - 1)), cloneAnnotationsSnapshot(snapshot)];
}
