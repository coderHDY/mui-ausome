import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../state';
import { STAGE_MESSAGE_VERSION, type StageRole } from './constants';
import { applyCaptureHandle, applyStageTitle } from './captureHandle';
import {
  postStageMessage,
  subscribeStageMessages,
  type StageMessage,
  type StageUiMessage,
} from './channel';
import {
  getStageRole,
  stripStageParam,
  withStageParam,
} from './role';

function postUiSnapshot(): void {
  const { themeMode, sidebarOpen, sidebarCollapsed } = useUIStore.getState();
  postStageMessage({
    v: STAGE_MESSAGE_VERSION,
    type: 'ui',
    themeMode,
    sidebarOpen,
    sidebarCollapsed,
  });
}

function applyUiSnapshot(message: StageUiMessage): void {
  const store = useUIStore.getState();
  store.setThemeMode(message.themeMode);
  store.setSidebarOpen(message.sidebarOpen);
  store.setSidebarCollapsed(message.sidebarCollapsed);
}

function sameLocation(
  left: { pathname: string; search: string; hash: string },
  right: { pathname: string; search: string; hash: string },
): boolean {
  return (
    left.pathname === right.pathname &&
    stripStageParam(left.search) === stripStageParam(right.search) &&
    left.hash === right.hash
  );
}

export function useStageRuntime(): StageRole {
  const role = getStageRole();
  const location = useLocation();
  const navigate = useNavigate();
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    applyCaptureHandle(role);
    applyStageTitle(role);
  }, [role]);

  useEffect(() => {
    if (role !== 'stage') {
      return;
    }

    void document.documentElement.requestFullscreen().catch(() => undefined);

    const announce = (): void => {
      postStageMessage({
        v: STAGE_MESSAGE_VERSION,
        type: 'hello',
        role: 'stage',
      });
    };

    announce();
    const heartbeat = window.setInterval(announce, 1000);

    const handleUnload = (): void => {
      postStageMessage({
        v: STAGE_MESSAGE_VERSION,
        type: 'bye',
      });
    };
    window.addEventListener('pagehide', handleUnload);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener('pagehide', handleUnload);
      handleUnload();
    };
  }, [role]);

  useEffect(() => {
    if (role !== 'controller') {
      return;
    }

    postStageMessage({
      v: STAGE_MESSAGE_VERSION,
      type: 'location',
      pathname: location.pathname,
      search: stripStageParam(location.search),
      hash: location.hash,
    });
  }, [role, location.hash, location.pathname, location.search]);

  useEffect(() => {
    if (role !== 'controller') {
      return;
    }

    const handleScroll = (): void => {
      postStageMessage({
        v: STAGE_MESSAGE_VERSION,
        type: 'scroll',
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [role]);

  useEffect(() => {
    if (role !== 'controller') {
      return;
    }

    postUiSnapshot();
    return useUIStore.subscribe(() => {
      postUiSnapshot();
    });
  }, [role]);

  useEffect(() => {
    return subscribeStageMessages((message: StageMessage) => {
      if (role === 'controller' && message.type === 'hello') {
        const current = locationRef.current;
        postStageMessage({
          v: STAGE_MESSAGE_VERSION,
          type: 'location',
          pathname: current.pathname,
          search: stripStageParam(current.search),
          hash: current.hash,
        });
        postUiSnapshot();
        return;
      }

      if (role !== 'stage') {
        return;
      }

      if (message.type === 'close') {
        window.close();
        return;
      }

      if (message.type === 'location') {
        const next = {
          pathname: message.pathname,
          search: withStageParam(message.search),
          hash: message.hash,
        };
        if (!sameLocation(locationRef.current, next)) {
          navigate(next, { replace: true });
        }
        return;
      }

      if (message.type === 'scroll') {
        window.scrollTo(message.x, message.y);
        return;
      }

      if (message.type === 'ui') {
        applyUiSnapshot(message);
      }
    });
  }, [navigate, role]);

  return role;
}
