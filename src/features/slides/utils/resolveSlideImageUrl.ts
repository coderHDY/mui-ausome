/**
 * 将外链 CDN 转为本地代理路径，避免 Konva/Canvas 跨域限制。
 * dev：`npm run dev` · preview：`npm run preview`（:4173）均走 vite proxy。
 * 生产：需在 Nginx 等配置同等 `/cdn-media` 反向代理。
 */
export function resolveSlideImageUrl(src: string): string {
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
