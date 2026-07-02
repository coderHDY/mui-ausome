/**
 * 将外链 CDN 转为本地代理路径，避免 Konva/Canvas 跨域限制。
 * dev：`npm run dev` 走 vite proxy；GitHub Pages 等静态托管直接用原链。
 */
export function resolveSlideImageUrl(src: string): string {
  if (!import.meta.env.DEV) {
    return src;
  }

  if (src.startsWith('/cdn-media/')) {
    return src;
  }

  try {
    const url = new URL(src);
    if (url.hostname === 'cdn.openvideos.ai') {
      return `/cdn-media${url.pathname}${url.search}`;
    }
  } catch {
    // 相对路径，原样返回
  }
  return src;
}
