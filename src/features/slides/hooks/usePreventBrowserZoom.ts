import { useEffect } from 'react';

const VIEWPORT_DEFAULT =
  'width=device-width, initial-scale=1.0';
const VIEWPORT_NO_ZOOM =
  'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

function setViewportContent(content: string) {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute('content', content);
  }
}

/**
 * 在 Slide 页面激活时拦截浏览器级缩放手势，
 * 将 wheel/pinch 交给自定义 viewport 处理。
 */
export function usePreventBrowserZoom(active: boolean) {
  useEffect(() => {
    if (!active) return;

    setViewportContent(VIEWPORT_NO_ZOOM);

    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0') {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', preventWheelZoom, { passive: false });
    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('gesturechange', preventGesture);
    document.addEventListener('gestureend', preventGesture);
    document.addEventListener('keydown', preventKeyboardZoom);

    return () => {
      setViewportContent(VIEWPORT_DEFAULT);
      document.removeEventListener('wheel', preventWheelZoom);
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('gestureend', preventGesture);
      document.removeEventListener('keydown', preventKeyboardZoom);
    };
  }, [active]);
}
