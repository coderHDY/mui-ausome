import { useEffect } from 'react';
import {
  getStageRole,
  publishStageView,
  subscribeStageMessages,
  subscribeStageView,
} from '@shared/stage';
import type { CameraViewport } from '../engine/camera/cameraMath';
import type { AnnotationsSnapshot } from '../model/history/command-stack';
import {
  useSlideCameraStore,
  type CameraViewportSnapshot,
} from '../model/store/slide-camera-store';
import { useSlideEditorStore } from '../model/store/slide-editor-store';
import { useSlideOverlayStore } from '../model/store/slide-overlay-store';

export const SLIDE_ANNOTATIONS_VIEW_KEY = 'slides:annotations';
export const SLIDE_CAMERA_VIEW_KEY = 'slides:camera';
export const SLIDE_OVERLAY_VIEW_KEY = 'slides:overlay';

type OverlaySnapshot = {
  previewElementId: string | null;
};

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

function isCameraViewportSnapshot(
  value: unknown,
): value is CameraViewportSnapshot {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }
    const viewport = item as CameraViewport;
    return (
      Number.isFinite(viewport.scale) &&
      viewport.scale > 0 &&
      Number.isFinite(viewport.centerX) &&
      Number.isFinite(viewport.centerY)
    );
  });
}

function isOverlaySnapshot(value: unknown): value is OverlaySnapshot {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const previewElementId = (value as OverlaySnapshot).previewElementId;
  return previewElementId === null || typeof previewElementId === 'string';
}

function publishSlideViews(): void {
  publishStageView(
    SLIDE_ANNOTATIONS_VIEW_KEY,
    useSlideEditorStore.getState().annotationsBySlideId,
  );
  publishStageView(
    SLIDE_CAMERA_VIEW_KEY,
    useSlideCameraStore.getState().viewportsBySlideId,
  );
  publishStageView(SLIDE_OVERLAY_VIEW_KEY, {
    previewElementId: useSlideOverlayStore.getState().previewElementId,
  });
}

/**
 * 控制端标注、相机视口、预览弹窗 → 舞台。绘制/拖移按帧合并。
 */
export function useSlideStageSync(): void {
  const role = getStageRole();

  useEffect(() => {
    if (role !== 'controller') {
      return;
    }

    let frame = 0;

    const schedule = (): void => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        publishSlideViews();
      });
    };

    publishSlideViews();
    const unsubscribeAnnotations = useSlideEditorStore.subscribe(schedule);
    const unsubscribeCamera = useSlideCameraStore.subscribe(schedule);
    const unsubscribeOverlay = useSlideOverlayStore.subscribe(schedule);
    const unsubscribeHello = subscribeStageMessages((message) => {
      if (message.type === 'hello') {
        publishSlideViews();
      }
    });

    return () => {
      unsubscribeAnnotations();
      unsubscribeCamera();
      unsubscribeOverlay();
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

    const unsubscribeAnnotations = subscribeStageView(
      SLIDE_ANNOTATIONS_VIEW_KEY,
      (payload) => {
        if (!isAnnotationRecord(payload)) {
          return;
        }
        useSlideEditorStore.getState().replaceAnnotations(payload);
      },
    );

    const unsubscribeCamera = subscribeStageView(
      SLIDE_CAMERA_VIEW_KEY,
      (payload) => {
        if (!isCameraViewportSnapshot(payload)) {
          return;
        }
        useSlideCameraStore.getState().replaceViewports(payload);
      },
    );

    const unsubscribeOverlay = subscribeStageView(
      SLIDE_OVERLAY_VIEW_KEY,
      (payload) => {
        if (!isOverlaySnapshot(payload)) {
          return;
        }
        useSlideOverlayStore
          .getState()
          .setPreviewElementId(payload.previewElementId);
      },
    );

    return () => {
      unsubscribeAnnotations();
      unsubscribeCamera();
      unsubscribeOverlay();
    };
  }, [role]);
}
