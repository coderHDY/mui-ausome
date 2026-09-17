import { create } from 'zustand';

type SlideOverlayState = {
  previewElementId: string | null;
  setPreviewElementId: (id: string | null) => void;
};

export const useSlideOverlayStore = create<SlideOverlayState>((set) => ({
  previewElementId: null,
  setPreviewElementId: (previewElementId) => set({ previewElementId }),
}));
