import { useEffect, useState } from 'react';
import { resolveSlideImageUrl } from '../utils/resolveSlideImageUrl';

type ImageStatus = 'loading' | 'loaded' | 'failed';

/**
 * 加载 slide 图片到 Konva。
 * - 外链经 `/cdn-media` 同源代理（见 vite.config.ts），工程内解决 CORS
 * - 不设置 img.crossOrigin，避免 CDN 未配 ACAO 时加载失败
 */
export function useSlideImage(src: string): [HTMLImageElement | undefined, ImageStatus] {
  const resolvedSrc = resolveSlideImageUrl(src);
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [status, setStatus] = useState<ImageStatus>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setImage(undefined);

    const img = new Image();
    // 禁止设置 crossOrigin — 否则无 ACAO 头的 CDN 会直接 CORS 失败

    const onLoad = () => {
      void img
        .decode()
        .catch(() => undefined)
        .finally(() => {
          if (cancelled) return;
          setImage(img);
          setStatus('loaded');
        });
    };

    const onError = () => {
      if (cancelled) return;
      setImage(undefined);
      setStatus('failed');
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    img.src = resolvedSrc;

    return () => {
      cancelled = true;
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [resolvedSrc]);

  return [image, status];
}
