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

        // Astro's sitemap integration emits trailing slashes because build.format is
        // 'directory'. Canonical tags (Seo.astro) and the served URLs (wrangler.jsonc
        // html_handling: drop-trailing-slash) both omit them — so strip them here too,
        // or search engines crawl a redirect for all 31 URLs and log "Page with redirect",
        // which suppresses indexing. Sitemap, canonical, served URL and internal hrefs
        // must all agree on one spelling.
        // Strip the trailing slash on every non-root URL. The root keeps its slash because
        // the WHATWG URL API forces it, and canonical() in lib/seo.ts matches that.
        if (path !== '/') item.url = new URL(item.url).origin + path;

        /*
          Priority tiers. Two things worth knowing: Astro serialises to one decimal, so
          0.95 and 0.9 are indistinguishable in the output — use whole tenths. And Google
          has stated it largely ignores this field, so treat it as documentation of intent
          rather than a ranking lever.

          /scorecard is in the top tier deliberately: it is the lead magnet and the bridge
          from engineer traffic to buyer conversations. It previously fell through to the
          0.6 default alongside /about and /contact, which understated it badly.
        */
        if (path === '/') item.priority = 1.0;
        else if (
          path === '/scorecard' ||
          path.startsWith('/solutions') ||
          path.startsWith('/industries') ||
          path.startsWith('/for-leaders') ||
          path.startsWith('/work-with-me')
        )
          item.priority = 0.9;
        else if (path.startsWith('/tools') || path.startsWith('/work')) item.priority = 0.8;
        else if (path.startsWith('/notes')) item.priority = 0.7;
        else item.priority = 0.5;
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
