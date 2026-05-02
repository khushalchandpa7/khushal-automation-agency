import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      // TODO: replace hostname with production domain before deploy.
      hostname: 'https://khushalautomation.com',
      dynamicRoutes: ['/'],
      readable: true,
      changefreq: 'weekly',
      priority: 1.0,
    }),
  ],
})
