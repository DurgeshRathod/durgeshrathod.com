import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts.ts';

export const GET: APIRoute = async (context) => {
  const notes = (await getCollection('notes')).filter((n) => !n.data.draft);
  const work = (await getCollection('work')).filter((w) => !w.data.draft);

  const items = [
    ...notes.map((n) => ({
      title: n.data.title,
      description: n.data.description,
      pubDate: new Date(n.data.published),
      link: `/notes/${n.id}`,
      categories: ['Notes', ...n.data.keywords.slice(0, 5)],
    })),
    ...work.map((w) => ({
      title: w.data.title,
      description: w.data.description,
      pubDate: new Date(w.data.published),
      link: `/work/${w.id}`,
      categories: ['Case study', ...w.data.keywords.slice(0, 5)],
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${SITE.name} — Agent reliability notes`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>en-us</language><copyright>© 2026 ${SITE.name}</copyright>`,
  });
};
