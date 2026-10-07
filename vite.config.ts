import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Serve gallery.html at /gallery in dev and preview, matching the Vercel rewrite.
const galleryRoute = (): Plugin => {
  const rewrite = (req: { url?: string }) => {
    if (req.url && /^\/gallery\/?(\?.*)?$/.test(req.url)) {
      req.url = req.url.replace(/^\/gallery\/?/, '/gallery.html')
    }
  }
  return {
    name: 'gallery-route',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => { rewrite(req); next() })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => { rewrite(req); next() })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), galleryRoute()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
      },
    },
  },
})
