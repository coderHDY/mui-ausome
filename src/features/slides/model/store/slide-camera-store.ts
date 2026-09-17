import { create } from 'zustand';
import {
  viewportsClose,
  type CameraViewport,
} from '../../engine/camera/cameraMath';

export type CameraViewportSnapshot = Record<string, CameraViewport>;

type SlideCameraState = {
  viewportsBySlideId: CameraViewportSnapshot;
  setViewport: (slideId: string, viewport: CameraViewport) => void;
  replaceViewports: (snapshot: CameraViewportSnapshot) => void;
};

export const useSlideCameraStore = create<SlideCameraState>((set) => ({
  viewportsBySlideId: {},

  setViewport: (slideId, viewport) =>
    set((state) => {
      const previous = state.viewportsBySlideId[slideId];
      if (previous && viewportsClose(previous, viewport)) {
        return state;
      }
      return {
        viewportsBySlideId: {
          ...state.viewportsBySlideId,
          [slideId]: viewport,
        },
      };
    }),

  replaceViewports: (snapshot) => set({ viewportsBySlideId: snapshot }),
}));
