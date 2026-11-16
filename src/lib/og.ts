/**
 * Open Graph images (1200×630 PNG), one per page and language, generated at build time:
 * page title + name/position on the dark background with the black-hole ring.
 * Layout with satori (text drawn with the site's own fonts, incl. Uzbek letters),
 * PNG with sharp. Served from /og/<lang>/<route>.png (see src/pages/og/[...path].png.ts).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { getCollection } from 'astro:content';
import { LANGS, PAGES, useTranslations, type Lang } from '../i18n';
import { profile } from './profile';
import { getCourses, getNotes, getPageText, type PageName } from './content';
import { SITE_URL } from '../config/site';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Path of the OG image for a page. */
export const ogPath = (lang: Lang, route: string) =>
  `/og/${lang}/${route.replace(/\/+$/, '') || 'home'}.png`;

export interface OgEntry {
  lang: Lang;
  route: string;
  /** Big text. */
  title: string;
  /** Small amber line above the title. */
  eyebrow: string;
}

/** Every page that gets an OG image. */
export async function ogEntries(): Promise<OgEntry[]> {
  const out: OgEntry[] = [];
  for (const lang of LANGS) {
    const t = useTranslations(lang);
    out.push({ lang, route: '', title: profile.name[lang], eyebrow: t('home.field') });
    for (const p of PAGES.filter((x) => x.key !== 'home')) {
      const { entry } =
        p.key === 'about'
          ? { entry: { data: { title: t('nav.about') } } }
          : await getPageText(p.key as PageName, lang);
      out.push({
        lang,
        route: p.route,
        title: entry.data.title,
        eyebrow: `${p.num} — ${t(`nav.${p.key}`)}`,
      });
    }
    const tools = await getPageText('tools', lang);
    out.push({
      lang,
      route: 'research/tools',
      title: tools.entry.data.title,
      eyebrow: t('nav.research'),
    });
    out.push({
      lang,
      route: 'research/talks',
      title: t('research.talks'),
      eyebrow: t('nav.research'),
    });
    out.push({ lang, route: 'notes', title: t('research.notes'), eyebrow: t('nav.research') });
    for (const n of await getNotes(lang)) {
      out.push({
        lang,
        route: `notes/${n.slug}`,
        title: n.entry.data.title,
        eyebrow: t('research.notes'),
      });
    }
    for (const c of await getCourses()) {
      out.push({
        lang,
        route: `teaching/${c.id}`,
        title: c.data.title[lang],
        eyebrow: t('nav.teaching'),
      });
    }
  }
  // Touch the collections Astro tracks, so OG images rebuild when content changes.
  await getCollection('pages');
  return out;
}

// ---------------------------------------------------------------- fonts
const require = createRequire(import.meta.url);
const font = (pkg: string, file: string): ArrayBuffer => {
  const buf = readFileSync(require.resolve(`@fontsource/${pkg}/files/${file}`));
  // Copy out exactly this file (small Buffers share a larger memory pool).
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
};

let fonts: Parameters<typeof satori>[1]['fonts'] | undefined;
function loadFonts() {
  fonts ??= [
    {
      name: 'SG',
      data: font('space-grotesk', 'space-grotesk-latin-600-normal.woff'),
      weight: 600,
      style: 'normal',
    },
    {
      name: 'SGx',
      data: font('space-grotesk', 'space-grotesk-latin-ext-600-normal.woff'),
      weight: 600,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: font('inter', 'inter-latin-400-normal.woff'),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Interx',
      data: font('inter', 'inter-latin-ext-400-normal.woff'),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Mono',
      data: font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Monox',
      data: font('jetbrains-mono', 'jetbrains-mono-latin-ext-400-normal.woff'),
      weight: 400,
      style: 'normal',
    },
  ];
  return fonts;
}

// The black hole: tilted disk, shadow with amber ring and glow (like the site's CSS one).
const RING = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560">
  <defs><radialGradient id="g" cx="50%" cy="50%" r="50%">
    <stop offset="35%" stop-color="#F2A541" stop-opacity="0.35"/>
    <stop offset="70%" stop-color="#F2A541" stop-opacity="0.06"/>
    <stop offset="100%" stop-color="#F2A541" stop-opacity="0"/></radialGradient></defs>
  <circle cx="280" cy="280" r="270" fill="url(#g)"/>
  <circle cx="280" cy="280" r="240" fill="none" stroke="#3A4152" stroke-dasharray="6 8"/>
  <g transform="rotate(-10 280 280)">
    <ellipse cx="280" cy="280" rx="258" ry="56" fill="none" stroke="#F2A541" stroke-opacity="0.55" stroke-width="5"/>
  </g>
  <circle cx="280" cy="280" r="90" fill="#000" stroke="#F2A541" stroke-width="5"/>
  <g transform="rotate(-10 280 280)">
    <path d="M 22 280 A 258 56 0 0 0 538 280" fill="none" stroke="#F7C27A" stroke-opacity="0.95" stroke-width="5"/>
  </g>
</svg>`;
const RING_URI = `data:image/svg+xml;base64,${Buffer.from(RING).toString('base64')}`;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

/** Renders one OG image to PNG. */
export async function renderOg(e: OgEntry): Promise<Buffer> {
  const isHome = e.route === '';
  const host = new URL(SITE_URL).host;
  const tree = h(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      position: 'relative',
      background: '#0B0D12',
      color: '#E8EAF0',
      fontFamily: 'Inter, Interx',
      padding: '64px 72px',
    },
    [
      h('img', { position: 'absolute', right: -40, top: 35, width: 560, height: 560 }, undefined, {
        src: RING_URI,
        width: 560,
        height: 560,
      }),
      h(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 720,
          height: '100%',
        },
        [
          h(
            'div',
            { display: 'flex', fontFamily: 'SG, SGx', fontSize: 30, color: '#E8EAF0' },
            profile.shortName[e.lang],
          ),
          h('div', { display: 'flex', flexDirection: 'column' }, [
            h(
              'div',
              {
                display: 'flex',
                fontFamily: 'Mono, Monox',
                fontSize: 26,
                color: '#F2A541',
                marginBottom: 18,
              },
              e.eyebrow,
            ),
            h(
              'div',
              {
                display: 'flex',
                fontFamily: 'SG, SGx',
                fontSize: e.title.length > 34 ? 56 : 76,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              },
              e.title,
            ),
            h(
              'div',
              { display: 'flex', fontSize: 28, color: '#C5CAD6', marginTop: 24 },
              isHome
                ? `${profile.position[e.lang]} · ${profile.institution[e.lang]}`
                : `${profile.name[e.lang]} · ${profile.position[e.lang]}`,
            ),
          ]),
          h(
            'div',
            { display: 'flex', fontFamily: 'Mono, Monox', fontSize: 22, color: '#9AA3B2' },
            host,
          ),
        ],
      ),
    ],
  );
  const svg = await satori(tree as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: loadFonts(),
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
