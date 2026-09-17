import { useEffect, useState } from 'react';

export const APP_UI_SCALE_VAR = '--app-ui-scale';

interface FullscreenControls {
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  scale: number;
  toggleFullscreen: () => void;
}

function computeUiScale(isFullscreen: boolean): number {
  if (!isFullscreen) return 1;

  const { innerWidth, innerHeight, screen } = window;
  if (innerWidth <= 0 || innerHeight <= 0) return 1;

  return Math.max(
    1,
    Math.min(screen.width / innerWidth, screen.height / innerHeight),
  );
}

function applyUiScale(scale: number): void {
  document.documentElement.style.setProperty(APP_UI_SCALE_VAR, String(scale));
}

/** 指定元素按全局 scale 放大，例如 uiScaled(280) → calc(280px * var(--app-ui-scale, 1)) */
export function uiScaled(px: number): string {
  return `calc(${px}px * var(${APP_UI_SCALE_VAR}, 1))`;
}

export function useFullscreen(): FullscreenControls {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    document.fullscreenElement !== null,
  );
  const [scale, setScale] = useState(() =>
    computeUiScale(document.fullscreenElement !== null),
  );

  useEffect(() => {
    const sync = (): void => {
      const nextFullscreen = document.fullscreenElement !== null;
      const nextScale = computeUiScale(nextFullscreen);
      setIsFullscreen(nextFullscreen);
      setScale(nextScale);
      applyUiScale(nextScale);
    };

    sync();
    document.addEventListener('fullscreenchange', sync);
    window.addEventListener('resize', sync);
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  const toggleFullscreen = (): void => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
      return;
    }

    void document.documentElement.requestFullscreen().catch(() => undefined);
  };

  return {
    isFullscreen,
    isFullscreenSupported: document.fullscreenEnabled,
    scale,
    toggleFullscreen,
  };
}
