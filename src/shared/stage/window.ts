import { STAGE_WINDOW_NAME } from './constants';

let stageWindow: Window | null = null;

export function getStageWindow(): Window | null {
  if (stageWindow?.closed) {
    stageWindow = null;
  }
  return stageWindow;
}

export function isStageWindowOpen(): boolean {
  return getStageWindow() !== null;
}

export function openStageWindow(stageUrl: string): Window | null {
  const existing = getStageWindow();
  if (existing) {
    return existing;
  }

  const child = window.open(stageUrl, STAGE_WINDOW_NAME);
  if (!child) {
    return null;
  }

  stageWindow = child;
  window.focus();
  return child;
}

export function closeStageWindow(): void {
  const child = getStageWindow();
  if (child && !child.closed) {
    child.close();
  }
  stageWindow = null;
}
