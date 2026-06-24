import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { Stage, Layer } from 'react-konva';
import type { CameraConfig } from '../../constants/viewport';
import { CameraInteractionContext } from '../camera/cameraInteractionContext';
import { useKonvaCamera } from '../camera/useKonvaCamera';
import type { ContentSize } from '../camera/cameraMath';

interface KonvaCameraStageProps {
  config: CameraConfig;
  contentSize: ContentSize;
  resetKey?: string;
  disabled?: boolean;
  children: ReactNode;
  /** 外层 Box sx */
  sx?: object;
}

export function KonvaCameraStage({
  config,
  contentSize,
  resetKey,
  disabled = false,
  children,
  sx,
}: KonvaCameraStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStageSize({ width: Math.floor(width), height: Math.floor(height) });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { stageProps, shouldSuppressClick } = useKonvaCamera({
    config,
    stageSize,
    contentSize,
    resetKey,
    disabled,
    containerRef,
  });

  return (
    <CameraInteractionContext.Provider value={{ shouldSuppressClick }}>
      <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
        overscrollBehavior: 'none',
        cursor: disabled ? 'not-allowed' : 'grab',
        '&:active': { cursor: disabled ? 'not-allowed' : 'grabbing' },
        ...sx,
      }}
    >
      {stageSize.width > 0 && stageSize.height > 0 && (
        <Stage width={stageSize.width} height={stageSize.height} {...stageProps}>
          <Layer>{children}</Layer>
        </Stage>
      )}
    </Box>
    </CameraInteractionContext.Provider>
  );
}
