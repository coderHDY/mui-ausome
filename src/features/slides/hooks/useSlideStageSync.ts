import { useEffect } from 'react';
import {
  getStageRole,
  publishStageView,
  subscribeStageMessages,
  subscribeStageView,
} from '@shared/stage';
import type { AnnotationsSnapshot } from '../model/history/command-stack';
import { useSlideEditorStore } from '../model/store/slide-editor-store';

export const SLIDE_ANNOTATIONS_VIEW_KEY = 'slides:annotations';

function isAnnotationRecord(value: unknown): value is AnnotationsSnapshot {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((items) => {
    if (!Array.isArray(items)) {
      return false;
    }
    return items.every((item) => {
      if (!item || typeof item !== 'object') {
        return false;
      }
      const type = (item as { type?: unknown }).type;
      return type === 'freehand' || type === 'text' || type === 'stamp';
    });
  });
}

/**
 * 控制端标注快照 → 舞台。绘制中按帧合并，避免每点一条消息。
 */
export function useSlideStageSync(): void {
  const role = getStageRole();

  useEffect(() => {
    if (role !== 'controller') {
      return;
    }

    let frame = 0;

    const publish = (): void => {
      publishStageView(
        SLIDE_ANNOTATIONS_VIEW_KEY,
        useSlideEditorStore.getState().annotationsBySlideId,
      );
    };

    const schedule = (): void => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        publish();
      });
    };

    publish();
    const unsubscribeStore = useSlideEditorStore.subscribe(schedule);
    const unsubscribeHello = subscribeStageMessages((message) => {
      if (message.type === 'hello') {
        publish();
      }
    });

    return () => {
      unsubscribeStore();
      unsubscribeHello();
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [role]);

  useEffect(() => {
    if (role !== 'stage') {
      return;
    }

    return subscribeStageView(SLIDE_ANNOTATIONS_VIEW_KEY, (payload) => {
      if (!isAnnotationRecord(payload)) {
        return;
      }
      useSlideEditorStore.getState().replaceAnnotations(payload);
    });
  }, [role]);
}
