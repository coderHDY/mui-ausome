import { IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import { useFullscreen } from '../hooks';

/**
 * 同步舞台开关
 * 本 tab 不进入全屏；打开只读舞台窗供录屏端手动采集
 */
export function FullscreenToggle() {
  const { isFullscreen, isFullscreenSupported, toggleFullscreen } =
    useFullscreen();

  if (!isFullscreenSupported) {
    return null;
  }

  return (
    <Tooltip title={isFullscreen ? '关闭同步舞台' : '打开同步全屏舞台'}>
      <IconButton
        onClick={toggleFullscreen}
        color="inherit"
        aria-label={isFullscreen ? '关闭同步舞台' : '打开同步全屏舞台'}
      >
        {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
    </Tooltip>
  );
}
