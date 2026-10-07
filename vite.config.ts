import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Adds public/gallery.js (gallery categories) after index.html's own script, so index.html stays untouched.
const galleryScript = (): Plugin => ({
  name: 'gallery-script',
  transformIndexHtml: () => [{ tag: 'script', attrs: { src: '/gallery.js' }, injectTo: 'body' }],
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), galleryScript()],
})
