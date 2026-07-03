import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { Stage, Layer } from 'react-konva';
import type { CameraConfig } from '../../constants/viewport';
import { CameraInteractionContext } from '../camera/cameraInteractionContext';
import { CameraStateContext } from '../camera/cameraStateContext';
import { useKonvaCamera } from '../camera/useKonvaCamera';
import type { ContentSize } from '../camera/cameraMath';

interface KonvaCameraStageProps {
  config: CameraConfig;
  contentSize: ContentSize;
  resetKey?: string;
  disabled?: boolean;
  panEnabled?: boolean;
  children: ReactNode;
  /** 外层 Box sx */
  sx?: object;
}

export function KonvaCameraStage({
  config,
  contentSize,
  resetKey,
  disabled = false,
  panEnabled = true,
  children,
  sx,
}: KonvaCameraStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const { width, height } = el.getBoundingClientRect();
      setStageSize({ width: Math.floor(width), height: Math.floor(height) });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { stageProps, shouldSuppressClick, camera } = useKonvaCamera({
    config,
    stageSize,
    contentSize,
    resetKey,
    disabled,
    panEnabled,
    containerRef,
  });

  const cursor =
    disabled ? 'not-allowed' : panEnabled ? 'grab' : 'default';

  return (
    <CameraInteractionContext.Provider value={{ shouldSuppressClick }}>
      <CameraStateContext.Provider value={{ camera, containerRef }}>
      <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
        overscrollBehavior: 'none',
        cursor,
        '&:active': {
          cursor: disabled ? 'not-allowed' : panEnabled ? 'grabbing' : 'default',
        },
        ...sx,
      }}
    >
      {stageSize.width > 0 && stageSize.height > 0 && (
        <Stage width={stageSize.width} height={stageSize.height} {...stageProps}>
          <Layer>{children}</Layer>
        </Stage>
      )}
    </Box>
      </CameraStateContext.Provider>
    </CameraInteractionContext.Provider>
  );
}
