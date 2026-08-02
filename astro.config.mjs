// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Deploy-target agnostic config. Works unchanged on Cloudflare Pages and GitHub Pages.
 *
 *   SITE_URL   full origin, e.g. https://durgeshrathod.com  (used for canonical, sitemap, OG)
 *   BASE_PATH  sub-path, only needed for a GitHub Pages *project* site, e.g. /durgesh-portfolio
 *
 * Static output only: no adapter, no SSR, no serverless. Every route is a plain file.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://durgeshrathod.com';
const BASE_PATH = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // 'directory' emits /about/index.html — correctly served at /about by every static host.
  // Canonical tags are always emitted without a trailing slash, so crawlers see one URL.
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        if (path === '/') item.priority = 1.0;
        // Solutions are the commercial landing pages; tools and case studies are the
        // assets most likely to be linked and cited.
        else if (
          path.startsWith('/solutions') ||
          path.startsWith('/industries') ||
          path.startsWith('/for-leaders') ||
          path.startsWith('/work-with-me')
        )
          item.priority = 0.95;
        else if (path.startsWith('/tools') || path.startsWith('/work')) item.priority = 0.9;
        else if (path.startsWith('/notes')) item.priority = 0.8;
        else item.priority = 0.6;
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
