/**
 * Base-aware URL helper.
 *
 * Every internal link and asset reference goes through this so the site works
 * unchanged at a domain root (Cloudflare Pages, custom domain) and under a
 * sub-path (a GitHub Pages project site, where BASE_PATH is e.g. /durgesh-portfolio).
 * Hardcoded absolute paths are the standard way GitHub Pages deployments break.
 */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

export function href(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}` || '/';
}

/** True when `current` is the given nav route or a child of it. */
export function isActive(current: string, target: string): boolean {
  const strip = (s: string) => s.replace(BASE, '').replace(/\/+$/, '') || '/';
  const c = strip(current);
  const t = strip(target);
  return t === '/' ? c === '/' : c === t || c.startsWith(`${t}/`);
}
