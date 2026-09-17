import { STAGE_TITLE_PREFIX, type StageRole } from './constants';

interface CaptureHandleMediaDevices extends MediaDevices {
  setCaptureHandleConfig?: (config: {
    handle: string;
    permittedOrigins?: string[];
    exposeOrigin?: boolean;
  }) => void;
}

export function applyCaptureHandle(role: StageRole): void {
  const devices = navigator.mediaDevices as CaptureHandleMediaDevices;
  devices.setCaptureHandleConfig?.({
    handle: JSON.stringify({ app: 'mui-ausome', role }),
    permittedOrigins: ['*'],
    exposeOrigin: true,
  });
}

export function applyStageTitle(role: StageRole): void {
  if (role !== 'stage') {
    return;
  }
  if (!document.title.startsWith(STAGE_TITLE_PREFIX)) {
    document.title = `${STAGE_TITLE_PREFIX}${document.title}`;
  }
}
