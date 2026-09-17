import type { ThemeMode } from '@design-system/theme';
import { STAGE_CHANNEL_NAME, STAGE_MESSAGE_VERSION } from './constants';
import type { StageRole } from './constants';

export type StageLocationMessage = {
  v: typeof STAGE_MESSAGE_VERSION;
  type: 'location';
  pathname: string;
  search: string;
  hash: string;
};

export type StageScrollMessage = {
  v: typeof STAGE_MESSAGE_VERSION;
  type: 'scroll';
  x: number;
  y: number;
};

export type StageUiMessage = {
  v: typeof STAGE_MESSAGE_VERSION;
  type: 'ui';
  themeMode: ThemeMode;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
};

export type StageHelloMessage = {
  v: typeof STAGE_MESSAGE_VERSION;
  type: 'hello';
  role: StageRole;
};

export type StageViewMessage = {
  v: typeof STAGE_MESSAGE_VERSION;
  type: 'view';
  key: string;
  payload: unknown;
};

export type StageCloseMessage = {
  v: typeof STAGE_MESSAGE_VERSION;
  type: 'close';
};

export type StageByeMessage = {
  v: typeof STAGE_MESSAGE_VERSION;
  type: 'bye';
};

export type StageMessage =
  | StageLocationMessage
  | StageScrollMessage
  | StageUiMessage
  | StageHelloMessage
  | StageViewMessage
  | StageCloseMessage
  | StageByeMessage;

let channel: BroadcastChannel | null = null;

function getStageChannel(): BroadcastChannel {
  if (!channel) {
    channel = new BroadcastChannel(STAGE_CHANNEL_NAME);
  }
  return channel;
}

export function postStageMessage(message: StageMessage): void {
  getStageChannel().postMessage(message);
}

export function subscribeStageMessages(
  listener: (message: StageMessage) => void,
): () => void {
  const nextChannel = getStageChannel();
  const handleMessage = (event: MessageEvent<StageMessage>): void => {
    const data = event.data;
    if (!data || data.v !== STAGE_MESSAGE_VERSION) {
      return;
    }
    listener(data);
  };

  nextChannel.addEventListener('message', handleMessage);
  return () => nextChannel.removeEventListener('message', handleMessage);
}

export function publishStageView(key: string, payload: unknown): void {
  postStageMessage({
    v: STAGE_MESSAGE_VERSION,
    type: 'view',
    key,
    payload,
  });
}

export function subscribeStageView(
  key: string,
  listener: (payload: unknown) => void,
): () => void {
  return subscribeStageMessages((message) => {
    if (message.type === 'view' && message.key === key) {
      listener(message.payload);
    }
  });
}
