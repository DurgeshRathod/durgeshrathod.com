import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { OG_PAGES, type OgEntry } from '../../lib/og-manifest.ts';
import { SITE } from '../../consts.ts';

/**
 * Open Graph images, rendered at build time into static PNGs.
 *
 * Build-time generation (not SSR) is what keeps this compatible with Cloudflare Pages
 * and GitHub Pages alike — the output is just files in /og/. Satori is given explicit
 * font buffers so the result is byte-identical on a laptop and in CI, which a
 * system-font approach cannot guarantee.
 */

const FONT_DIR = path.join(process.cwd(), 'src/assets/fonts');
const regular = fs.readFileSync(path.join(FONT_DIR, 'Inter-Regular.ttf'));
const bold = fs.readFileSync(path.join(FONT_DIR, 'Inter-Bold.ttf'));

/*
  Portrait embedded as a data URI. Satori cannot fetch remote images during a static build,
  and a face on a shared card measurably lifts click-through — which matters because LinkedIn
  is the primary distribution channel. Optional: if the file is absent the card renders
  without it rather than failing the build.
*/
const PORTRAIT_FILE = path.join(process.cwd(), 'src/assets/portrait-og.jpg');
const portraitDataUri = fs.existsSync(PORTRAIT_FILE)
  ? `data:image/jpeg;base64,${fs.readFileSync(PORTRAIT_FILE).toString('base64')}`
  : null;

const BG = '#0a0c11';
const FG = '#eef0f4';
const MUTED = '#8b93a3';
// Dark-mode accent step: the OG card is always on the dark surface.
const ACCENT = '#60a5fa';

export const getStaticPaths: GetStaticPaths = async () => {
  const notes = await getCollection('notes');

  const noteEntries: OgEntry[] = notes.map((n) => ({
    slug: `notes-${n.id}`,
    kind: 'Note',
    title: n.data.title,
    stat: n.data.description.slice(0, 90),
  }));

  return [...OG_PAGES, ...noteEntries].map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
};

/** Plain object trees — satori accepts React-element shapes without needing JSX. */
const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, children },
});

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: OgEntry };

  // Long headlines need a smaller face to stay on three lines or fewer.
  const len = entry.title.length;
  const titleSize = len > 68 ? 60 : len > 46 ? 70 : 82;

  const tree = el(
    'div',
    {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: BG,
      padding: '64px 72px',
      fontFamily: 'Inter',
      position: 'relative',
    },
    [
      // Accent rule along the top edge
      el('div', {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '1200px',
        height: '8px',
        backgroundColor: ACCENT,
      }),

      // Kind label
      el(
        'div',
        {
          display: 'flex',
          alignItems: 'center',
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: ACCENT,
        },
        entry.kind
      ),

      // Headline
      el(
        'div',
        {
          display: 'flex',
          fontSize: `${titleSize}px`,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: FG,
          maxWidth: '1020px',
        },
        entry.title
      ),

      // Footer: identity left, stat right
      el(
        'div',
        {
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          width: '1056px',
        },
        [
          el(
            'div',
            { display: 'flex', alignItems: 'center', gap: '18px' },
            [
              ...(portraitDataUri
                ? [
                    {
                      type: 'img',
                      props: {
                        src: portraitDataUri,
                        width: 72,
                        height: 72,
                        style: {
                          width: '72px',
                          height: '72px',
                          borderRadius: '36px',
                          objectFit: 'cover',
                        },
                      },
                    },
                  ]
                : []),
              el(
                'div',
                { display: 'flex', flexDirection: 'column' },
                [
                  el(
                    'div',
                    { display: 'flex', fontSize: '30px', fontWeight: 700, color: FG },
                    SITE.name
                  ),
                  el(
                    'div',
                    { display: 'flex', fontSize: '22px', color: MUTED, marginTop: '6px' },
                    SITE.url.replace(/^https?:\/\//, '')
                  ),
                ]
              ),
            ]
          ),
          entry.stat
            ? el(
                'div',
                {
                  display: 'flex',
                  fontSize: '22px',
                  color: MUTED,
                  maxWidth: '520px',
                  textAlign: 'right',
                  justifyContent: 'flex-end',
                },
                entry.stat
              )
            : el('div', { display: 'flex' }, ''),
        ]
      ),
    ]
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      { name: 'Inter', data: bold, weight: 700, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
