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
      // Single-page app: only the homepage is a real route. Anchor sections
      // (#portfolio, #services, ...) are not separate URLs and don't belong
      // in a sitemap.
      readable: true,
      changefreq: 'weekly',
      priority: 1.0,
      // Don't auto-generate robots.txt — we ship a custom one in public/
      // that includes scraper-blocking rules and explicit Sitemap reference.
      generateRobotsTxt: false,
    }),
  ],
})
