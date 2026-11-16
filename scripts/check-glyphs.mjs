#!/usr/bin/env node
/**
 * Checks that every self-hosted font file can draw the Uzbek new-alphabet letters,
 * so no page ever shows a fallback-font box.
 *
 *   npm run check:glyphs
 *
 * The list of font files is read from src/styles/fonts.ts (the single source of truth).
 * For each character we find the subset whose unicode-range covers it (latin or
 * latin-ext) and check that THAT file contains the glyph.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as fontkit from 'fontkit';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));

// Must render in every font (hard failure).
const REQUIRED = {
  'Uzbek new alphabet': 'ÖöĞğŞşÇç',
  'tutuq belgisi (U+02BC)': 'ʼ',
  'basic Latin': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
};
// Used in the design; reported if missing (the browser falls back for them).
const NICE_TO_HAVE = '—–·©…←→↗✓’“”';

const fontsTs = readFileSync(join(root, 'src/styles/fonts.ts'), 'utf8');
const files = [...fontsTs.matchAll(/'(@fontsource\/([^/]+)\/files\/([^']+)\.woff2)\?url'/g)].map(
  (m) => ({ spec: m[1], pkg: m[2], name: m[3] }),
);
if (files.length === 0) {
  console.error('check-glyphs: no font imports found in src/styles/fonts.ts');
  process.exit(1);
}

function parseRanges(str) {
  return str.split(',').map((part) => {
    const [a, b] = part.replace('U+', '').split('-');
    const lo = parseInt(a, 16);
    return [lo, b ? parseInt(b, 16) : lo];
  });
}
const inRanges = (cp, ranges) => ranges.some(([lo, hi]) => cp >= lo && cp <= hi);

// Group files by family+weight: { 'inter 400': { latin: font, 'latin-ext': font } }
const groups = new Map();
for (const f of files) {
  const m = f.name.match(/^(.*)-(latin|latin-ext)-(\d+)-normal$/);
  if (!m) continue;
  const [, family, subset, weight] = m;
  const key = `${family} ${weight}`;
  const unicode = JSON.parse(readFileSync(require.resolve(`@fontsource/${f.pkg}/unicode.json`)));
  const font = fontkit.create(readFileSync(require.resolve(f.spec)));
  if (!groups.has(key)) groups.set(key, {});
  groups.get(key)[subset] = { font, ranges: parseRanges(unicode[subset]) };
}

function canDraw(group, ch) {
  const cp = ch.codePointAt(0);
  for (const sub of Object.values(group)) {
    if (inRanges(cp, sub.ranges)) return sub.font.hasGlyphForCodePoint(cp);
  }
  return false; // no subset covers it -> browser would use a fallback font
}

let failed = false;
for (const [key, group] of groups) {
  const missing = [];
  for (const [label, chars] of Object.entries(REQUIRED)) {
    const bad = [...chars].filter((ch) => !canDraw(group, ch));
    if (bad.length) missing.push(`${label}: ${bad.join(' ')}`);
  }
  const soft = [...NICE_TO_HAVE].filter((ch) => !canDraw(group, ch));
  if (missing.length) {
    failed = true;
    console.error(`✗ ${key}\n    missing ${missing.join('; ')}`);
  } else {
    console.log(`✓ ${key}${soft.length ? `   (falls back for: ${soft.join(' ')})` : ''}`);
  }
}

if (failed) {
  console.error(
    '\nSome fonts cannot draw Uzbek letters. Check the subsets in src/styles/fonts.ts.',
  );
  process.exit(1);
}
console.log(`\nAll ${groups.size} font weights draw Ö ö Ğ ğ Ş ş Ç ç ʼ.`);
