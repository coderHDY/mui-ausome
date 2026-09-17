import { useShareStage } from '../stage';

interface FullscreenControls {
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  toggleFullscreen: () => void;
}

/**
 * 全屏按钮的兼容封装：本 tab 不进全屏，改为开关同步舞台窗。
 */
export function useFullscreen(): FullscreenControls {
  const { isStageOpen, toggleStage } = useShareStage();

  return {
    isFullscreen: isStageOpen,
    isFullscreenSupported: true,
    toggleFullscreen: toggleStage,
  };
}
