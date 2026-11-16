/**
 * Self-hosted fonts (@fontsource), latin + latin-ext subsets only.
 *
 * Why not import @fontsource's CSS? Its per-subset CSS files have no `unicode-range`,
 * so the latin-ext file would replace the latin one. Here every face gets the right
 * range, and the browser downloads latin-ext only when a page contains Ğ, Ş, etc.
 * Uzbek needs both: Ö ö Ç ç ʼ are in "latin", Ğ ğ Ş ş in "latin-ext".
 * `npm run check:glyphs` verifies these files really contain the Uzbek letters.
 */
import sgLatin500 from '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2?url';
import sgExt500 from '@fontsource/space-grotesk/files/space-grotesk-latin-ext-500-normal.woff2?url';
import sgLatin600 from '@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2?url';
import sgExt600 from '@fontsource/space-grotesk/files/space-grotesk-latin-ext-600-normal.woff2?url';
import sgLatin700 from '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2?url';
import sgExt700 from '@fontsource/space-grotesk/files/space-grotesk-latin-ext-700-normal.woff2?url';
import interLatin400 from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
import interExt400 from '@fontsource/inter/files/inter-latin-ext-400-normal.woff2?url';
import interLatin500 from '@fontsource/inter/files/inter-latin-500-normal.woff2?url';
import interExt500 from '@fontsource/inter/files/inter-latin-ext-500-normal.woff2?url';
import interLatin600 from '@fontsource/inter/files/inter-latin-600-normal.woff2?url';
import interExt600 from '@fontsource/inter/files/inter-latin-ext-600-normal.woff2?url';
import monoLatin400 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2?url';
import monoExt400 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-400-normal.woff2?url';
import monoLatin500 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2?url';
import monoExt500 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-ext-500-normal.woff2?url';

export const UNICODE_RANGE = {
  latin:
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  'latin-ext':
    'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
} as const;

export interface FontFace {
  family: string;
  weight: number;
  subset: keyof typeof UNICODE_RANGE;
  url: string;
}

export const FONT_FACES: FontFace[] = [
  { family: 'Space Grotesk', weight: 500, subset: 'latin', url: sgLatin500 },
  { family: 'Space Grotesk', weight: 500, subset: 'latin-ext', url: sgExt500 },
  { family: 'Space Grotesk', weight: 600, subset: 'latin', url: sgLatin600 },
  { family: 'Space Grotesk', weight: 600, subset: 'latin-ext', url: sgExt600 },
  { family: 'Space Grotesk', weight: 700, subset: 'latin', url: sgLatin700 },
  { family: 'Space Grotesk', weight: 700, subset: 'latin-ext', url: sgExt700 },
  { family: 'Inter', weight: 400, subset: 'latin', url: interLatin400 },
  { family: 'Inter', weight: 400, subset: 'latin-ext', url: interExt400 },
  { family: 'Inter', weight: 500, subset: 'latin', url: interLatin500 },
  { family: 'Inter', weight: 500, subset: 'latin-ext', url: interExt500 },
  { family: 'Inter', weight: 600, subset: 'latin', url: interLatin600 },
  { family: 'Inter', weight: 600, subset: 'latin-ext', url: interExt600 },
  { family: 'JetBrains Mono', weight: 400, subset: 'latin', url: monoLatin400 },
  { family: 'JetBrains Mono', weight: 400, subset: 'latin-ext', url: monoExt400 },
  { family: 'JetBrains Mono', weight: 500, subset: 'latin', url: monoLatin500 },
  { family: 'JetBrains Mono', weight: 500, subset: 'latin-ext', url: monoExt500 },
];

/** Faces used above the fold on every page: preloaded to avoid a late swap. */
export const PRELOAD = FONT_FACES.filter(
  (f) =>
    f.subset === 'latin' &&
    ((f.family === 'Inter' && f.weight === 400) ||
      (f.family === 'Space Grotesk' && f.weight === 600)),
);

/**
 * Local fallback fonts with adjusted metrics so the page does not jump when the
 * web fonts arrive (values measured from the font files against Arial / Courier New).
 */
export const FALLBACK_FACES = [
  {
    family: 'Inter Fallback',
    local: 'Arial',
    size: '104.33%',
    ascent: '92.85%',
    descent: '23.12%',
  },
  {
    family: 'Space Grotesk Fallback',
    local: 'Arial',
    size: '96.71%',
    ascent: '101.75%',
    descent: '30.19%',
  },
  {
    family: 'JetBrains Mono Fallback',
    local: 'Courier New',
    size: '99.98%',
    ascent: '102.02%',
    descent: '30%',
  },
];

export function fontFaceCss(): string {
  const real = FONT_FACES.map(
    (f) =>
      `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:swap;src:url(${f.url}) format('woff2');unicode-range:${UNICODE_RANGE[f.subset]}}`,
  );
  const fallback = FALLBACK_FACES.map(
    (f) =>
      `@font-face{font-family:'${f.family}';src:local('${f.local}');size-adjust:${f.size};ascent-override:${f.ascent};descent-override:${f.descent};line-gap-override:0%}`,
  );
  return [...real, ...fallback].join('\n');
}
