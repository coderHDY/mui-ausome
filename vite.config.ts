import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import type { ProxyOptions } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** slide 外链图片代理 — 工程内解决 Canvas CORS，无需 CDN 配置跨域头 */
const cdnMediaProxy: Record<string, ProxyOptions> = {
  '/cdn-media': {
    target: 'https://cdn.openvideos.ai',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/cdn-media/, ''),
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@design-system': resolve(__dirname, './src/design-system'),
      '@features': resolve(__dirname, './src/features'),
      '@shared': resolve(__dirname, './src/shared'),
      '@specs': resolve(__dirname, './specs'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      ...cdnMediaProxy,
    },
  },
  // preview（npm run preview / :4173）需单独配置 proxy，不会继承 server.proxy
  preview: {
    proxy: {
      ...cdnMediaProxy,
    },
  },
})
