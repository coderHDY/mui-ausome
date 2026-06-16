import { useCallback, useRef } from 'react';

const DEFAULT_DRAG_THRESHOLD_PX = 8;

/**
 * 区分「点击」与「拖动」：移动距离超过阈值视为拖动，不触发 onClick。
 * 不在 pointerDown 上阻止冒泡，画布 pan 可正常从交互元素上开始。
 */
export function useClickWithoutDrag(
  onClick: () => void,
  threshold = DEFAULT_DRAG_THRESHOLD_PX,
) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const didDragRef = useRef(false);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;

      startRef.current = { x: e.clientX, y: e.clientY };
      didDragRef.current = false;

      const onMove = (ev: PointerEvent) => {
        if (!startRef.current) return;
        const dx = ev.clientX - startRef.current.x;
        const dy = ev.clientY - startRef.current.y;
        if (Math.hypot(dx, dy) > threshold) {
          didDragRef.current = true;
        }
      };

      const onUp = () => {
        if (!didDragRef.current) {
          onClick();
        }
        startRef.current = null;
        didDragRef.current = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    },
    [onClick, threshold],
  );

  return { handlePointerDown };
}
