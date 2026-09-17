import { IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import { useFullscreen } from '../hooks';

/**
 * 全屏切换按钮
 * 进入/退出浏览器全屏，不支持时不展示
 */
export function FullscreenToggle() {
  const { isFullscreen, isFullscreenSupported, toggleFullscreen } =
    useFullscreen();

  if (!isFullscreenSupported) {
    return null;
  }

  return (
    <Tooltip title={isFullscreen ? '退出全屏' : '进入全屏'}>
      <IconButton
        onClick={toggleFullscreen}
        color="inherit"
        aria-label={isFullscreen ? '退出全屏' : '进入全屏'}
      >
        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
    </Tooltip>
  );
}
