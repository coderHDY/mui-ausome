import { useEffect } from 'react';
import { useSlideEditorStore } from '../model/store/slide-editor-store';

/** Cmd/Ctrl+Z 撤销、Cmd/Ctrl+Shift+Z / Ctrl+Y 重做 */
export function useSlideEditorHistory(enabled = true) {
  const undo = useSlideEditorStore((s) => s.undo);
  const redo = useSlideEditorStore((s) => s.redo);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, redo, undo]);
}
