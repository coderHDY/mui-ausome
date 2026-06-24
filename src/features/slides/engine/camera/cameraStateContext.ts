import { createContext, useContext, type RefObject } from 'react';
import type { CameraState } from './cameraMath';

export type CameraStateContextValue = {
  camera: CameraState;
  containerRef: RefObject<HTMLDivElement | null>;
};

export const CameraStateContext = createContext<CameraStateContextValue | null>(
  null,
);

export function useCameraState(): CameraStateContextValue {
  const ctx = useContext(CameraStateContext);
  if (!ctx) {
    throw new Error('useCameraState must be used within KonvaCameraStage');
  }
  return ctx;
}
