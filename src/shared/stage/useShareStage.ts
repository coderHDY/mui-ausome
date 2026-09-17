import { useCallback, useEffect, useState } from 'react';
import { STAGE_MESSAGE_VERSION } from './constants';
import { postStageMessage, subscribeStageMessages } from './channel';
import { getStageRole, buildStageUrl } from './role';
import {
  closeStageWindow,
  isStageWindowOpen,
  openStageWindow,
} from './window';

interface ShareStageControls {
  role: ReturnType<typeof getStageRole>;
  isStageOpen: boolean;
  toggleStage: () => void;
}

const PRESENCE_TIMEOUT_MS = 2500;

export function useShareStage(): ShareStageControls {
  const role = getStageRole();
  const [isStageOpen, setIsStageOpen] = useState(isStageWindowOpen);

  useEffect(() => {
    if (role === 'stage') {
      return;
    }

    let expireTimer: number | undefined;

    const markOpen = (): void => {
      setIsStageOpen(true);
      if (expireTimer !== undefined) {
        window.clearTimeout(expireTimer);
      }
      expireTimer = window.setTimeout(() => {
        setIsStageOpen(false);
      }, PRESENCE_TIMEOUT_MS);
    };

    const unsubscribe = subscribeStageMessages((message) => {
      if (message.type === 'hello' && message.role === 'stage') {
        markOpen();
        return;
      }
      if (message.type === 'bye') {
        setIsStageOpen(false);
      }
    });

    const poll = window.setInterval(() => {
      if (isStageWindowOpen()) {
        markOpen();
      }
    }, 400);

    return () => {
      unsubscribe();
      window.clearInterval(poll);
      if (expireTimer !== undefined) {
        window.clearTimeout(expireTimer);
      }
    };
  }, [role]);

  const toggleStage = useCallback((): void => {
    if (role === 'stage') {
      return;
    }

    if (isStageOpen || isStageWindowOpen()) {
      postStageMessage({
        v: STAGE_MESSAGE_VERSION,
        type: 'close',
      });
      closeStageWindow();
      setIsStageOpen(false);
      return;
    }

    const child = openStageWindow(buildStageUrl(window.location.href));
    if (!child) {
      window.alert('请允许本站弹出窗口，才能打开同步全屏舞台');
      setIsStageOpen(false);
      return;
    }

    setIsStageOpen(true);
  }, [isStageOpen, role]);

  return {
    role,
    isStageOpen,
    toggleStage,
  };
}
