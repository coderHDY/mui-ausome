import { useEffect, useState } from 'react';

interface FullscreenControls {
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  toggleFullscreen: () => void;
}

export function useFullscreen(): FullscreenControls {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    document.fullscreenElement !== null,
  );

  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
    toggleFullscreen,
  };
}
