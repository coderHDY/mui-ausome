import { createContext, useContext } from 'react';

type CameraInteractionContextValue = {
  /** 本次指针会话中是否发生过超过阈值的拖动（用于区分 pan 与 click） */
  shouldSuppressClick: () => boolean;
};

export const CameraInteractionContext =
  createContext<CameraInteractionContextValue | null>(null);

export function useCameraInteraction(): CameraInteractionContextValue {
  const ctx = useContext(CameraInteractionContext);
  if (!ctx) {
    throw new Error('useCameraInteraction must be used within KonvaCameraStage');
  }
  return ctx;
}
