import { create } from 'zustand';
import {
  DEFAULT_STROKE_COLOR,
  DEFAULT_STROKE_WIDTH,
  DEFAULT_STAMP_SIZE,
  toolNeedsSubOptionConfirm,
} from '../../constants/tools';
import {
  cloneAnnotationsSnapshot,
  pushSnapshot,
  type AnnotationsSnapshot,
} from '../history/command-stack';
import type {
  AnnotationElement,
  EditorTool,
  StampKind,
} from '../../types/annotation.types';

function createAnnotationId(): string {
  return `ann-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type SlideEditorState = {
  toolbarOpen: boolean;
  editorOpen: boolean;
  activeTool: EditorTool;
  strokeColor: string;
  strokeWidth: number;
  stampKind: StampKind;
  selectedAnnotationId: string | null;
  annotationsBySlideId: AnnotationsSnapshot;
  historyPast: AnnotationsSnapshot[];
  historyFuture: AnnotationsSnapshot[];

  toggleToolbar: () => void;
  closeToolbar: () => void;
  selectTool: (tool: EditorTool) => void;
  confirmTool: () => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setStampKind: (kind: StampKind) => void;
  setSelectedAnnotationId: (id: string | null) => void;
  clearSelection: () => void;

  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;

  getAnnotations: (slideId: string) => AnnotationElement[];
  addAnnotation: (slideId: string, element: AnnotationElement) => void;
  updateAnnotation: (
    slideId: string,
    id: string,
    patch: Partial<AnnotationElement>,
  ) => void;
  removeAnnotation: (slideId: string, id: string) => void;
  appendFreehandPoint: (
    slideId: string,
    id: string,
    x: number,
    y: number,
  ) => void;

  createFreehand: (slideId: string, x: number, y: number) => string;
  createText: (slideId: string, x: number, y: number, content: string) => void;
  createStamp: (slideId: string, x: number, y: number) => void;
  applyColorToSelected: (slideId: string, color: string) => void;
};

function syncSelectionAfterRestore(
  selectedId: string | null,
  snapshot: AnnotationsSnapshot,
): string | null {
  if (!selectedId) return null;
  for (const elements of Object.values(snapshot)) {
    if (elements.some((el) => el.id === selectedId)) {
      return selectedId;
    }
  }
  return null;
}

export const useSlideEditorStore = create<SlideEditorState>((set, get) => {
  const recordHistory = () => {
    const snapshot = cloneAnnotationsSnapshot(get().annotationsBySlideId);
    set((state) => ({
      historyPast: pushSnapshot(state.historyPast, snapshot),
      historyFuture: [],
    }));
  };

  return {
    toolbarOpen: false,
    editorOpen: false,
    activeTool: 'select',
    strokeColor: DEFAULT_STROKE_COLOR,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    stampKind: 'check',
    selectedAnnotationId: null,
    annotationsBySlideId: {},
    historyPast: [],
    historyFuture: [],

    toggleToolbar: () =>
      set((state) => ({ toolbarOpen: !state.toolbarOpen })),

    closeToolbar: () => set({ toolbarOpen: false }),

    selectTool: (tool) => {
      if (tool === 'pan') {
        set({
          activeTool: 'pan',
          toolbarOpen: false,
          editorOpen: false,
          selectedAnnotationId: null,
        });
        return;
      }
      if (toolNeedsSubOptionConfirm(tool)) {
        set({
          activeTool: tool,
          toolbarOpen: true,
          editorOpen: false,
        });
        return;
      }
      set({
        activeTool: tool,
        toolbarOpen: false,
        editorOpen: true,
      });
    },

    confirmTool: () =>
      set({
        toolbarOpen: false,
        editorOpen: true,
      }),

    setStrokeColor: (color) => set({ strokeColor: color }),

    setStrokeWidth: (width) => set({ strokeWidth: width }),

    setStampKind: (kind) => set({ stampKind: kind }),

    setSelectedAnnotationId: (id) => set({ selectedAnnotationId: id }),

    clearSelection: () => set({ selectedAnnotationId: null }),

    canUndo: () => get().historyPast.length > 0,

    canRedo: () => get().historyFuture.length > 0,

    undo: () => {
      const { historyPast, annotationsBySlideId, selectedAnnotationId } = get();
      if (historyPast.length === 0) return;

      const previous = historyPast[historyPast.length - 1];
      const current = cloneAnnotationsSnapshot(annotationsBySlideId);

      set((state) => ({
        annotationsBySlideId: cloneAnnotationsSnapshot(previous),
        historyPast: state.historyPast.slice(0, -1),
        historyFuture: [current, ...state.historyFuture],
        selectedAnnotationId: syncSelectionAfterRestore(
          selectedAnnotationId,
          previous,
        ),
      }));
    },

    redo: () => {
      const { historyFuture, annotationsBySlideId, selectedAnnotationId } =
        get();
      if (historyFuture.length === 0) return;

      const next = historyFuture[0];
      const current = cloneAnnotationsSnapshot(annotationsBySlideId);

      set((state) => ({
        annotationsBySlideId: cloneAnnotationsSnapshot(next),
        historyPast: pushSnapshot(state.historyPast, current),
        historyFuture: state.historyFuture.slice(1),
        selectedAnnotationId: syncSelectionAfterRestore(
          selectedAnnotationId,
          next,
        ),
      }));
    },

    getAnnotations: (slideId) => get().annotationsBySlideId[slideId] ?? [],

    addAnnotation: (slideId, element) => {
      recordHistory();
      set((state) => ({
        annotationsBySlideId: {
          ...state.annotationsBySlideId,
          [slideId]: [...(state.annotationsBySlideId[slideId] ?? []), element],
        },
      }));
    },

    updateAnnotation: (slideId, id, patch) => {
      recordHistory();
      set((state) => ({
        annotationsBySlideId: {
          ...state.annotationsBySlideId,
          [slideId]: (state.annotationsBySlideId[slideId] ?? []).map((el) =>
            el.id === id ? ({ ...el, ...patch } as AnnotationElement) : el,
          ),
        },
      }));
    },

    removeAnnotation: (slideId, id) => {
      recordHistory();
      set((state) => ({
        selectedAnnotationId:
          state.selectedAnnotationId === id ? null : state.selectedAnnotationId,
        annotationsBySlideId: {
          ...state.annotationsBySlideId,
          [slideId]: (state.annotationsBySlideId[slideId] ?? []).filter(
            (el) => el.id !== id,
          ),
        },
      }));
    },

    /** 画笔绘制中逐点追加，不单独入栈；整笔在 addAnnotation 时记一次历史 */
    appendFreehandPoint: (slideId, id, x, y) =>
      set((state) => ({
        annotationsBySlideId: {
          ...state.annotationsBySlideId,
          [slideId]: (state.annotationsBySlideId[slideId] ?? []).map((el) =>
            el.id === id && el.type === 'freehand'
              ? { ...el, points: [...el.points, x, y] }
              : el,
          ),
        },
      })),

    createFreehand: (slideId, x, y) => {
      const id = createAnnotationId();
      const { strokeColor, strokeWidth } = get();
      get().addAnnotation(slideId, {
        type: 'freehand',
        id,
        points: [x, y],
        stroke: strokeColor,
        strokeWidth,
      });
      return id;
    },

    createText: (slideId, x, y, content) => {
      const id = createAnnotationId();
      get().addAnnotation(slideId, {
        type: 'text',
        id,
        x,
        y,
        content,
        fontSize: 28,
        fill: get().strokeColor,
      });
      get().setSelectedAnnotationId(id);
    },

    createStamp: (slideId, x, y) => {
      const id = createAnnotationId();
      const { strokeColor, stampKind } = get();
      get().addAnnotation(slideId, {
        type: 'stamp',
        id,
        x,
        y,
        stamp: stampKind,
        size: DEFAULT_STAMP_SIZE,
        fill: strokeColor,
      });
      get().setSelectedAnnotationId(id);
    },

    applyColorToSelected: (slideId, color) => {
      const { selectedAnnotationId } = get();
      if (!selectedAnnotationId) return;

      const target = get()
        .getAnnotations(slideId)
        .find((el) => el.id === selectedAnnotationId);
      if (!target) return;

      if (target.type === 'freehand') {
        get().updateAnnotation(slideId, selectedAnnotationId, { stroke: color });
      } else {
        get().updateAnnotation(slideId, selectedAnnotationId, { fill: color });
      }
      set({ strokeColor: color });
    },
  };
});
