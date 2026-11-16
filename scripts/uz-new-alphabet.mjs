#!/usr/bin/env node
/**
 * Converts Uzbek text from the old Latin alphabet to the new one (law O'RQ-1184):
 *   Oʻ oʻ → Ö ö    Gʻ gʻ → Ğ ğ    Sh sh SH → Ş ş    Ch ch CH → Ç ç
 * and types the tutuq belgisi (maʼno, sanʼat) as ʼ (U+02BC). "ng" stays n + g.
 *
 * Usage:
 *   npm run uz -- src/content/about/uz.md        show the changes, then ask before writing
 *   npm run uz -- src/content                    a whole folder (only Uzbek files are changed)
 *   npm run uz -- --dry-run src/content          only show the changes
 *   npm run uz -- --yes src/content              write without asking
 *   npm run uz -- --all path/file.md             treat the whole file as Uzbek text
 *
 * What is never changed: code (`…` and ``` blocks), math ($…$, $$…$$), URLs, e-mails, DOIs, file paths, R_sh-style symbols,
 * HTML tags, Markdown link targets, YAML keys, BibTeX keys and field names, CamelCase
 * words (GitHub, BlackPy), words with w / c (Schwarzschild), and every word listed in
 * scripts/uz-new-alphabet-ignore.txt (English words, names such as Yovkochev).
 *
 * Which parts of a file are converted:
 *   - Uzbek files (in a uz/ folder, named uz.*, or *.uz.*): all text.
 *   - .yaml/.yml: only values under a key named `uz` (or ending in `uz`).
 *   - .bib: only fields whose name ends in `uz` (e.g. titleuz).
 *   - other files are skipped unless --all is given.
 */
import { readFileSync, writeFileSync, statSync, readdirSync, existsSync } from 'node:fs';
import { join, basename, extname, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';

const HERE = dirname(fileURLToPath(import.meta.url));
const TUTUQ = 'ʼ'; // U+02BC
const APOS = `['‘’\`ʻ]`; // apostrophe variants used for oʻ / gʻ (not U+02BC)

// ---------------------------------------------------------------- word rules
function loadIgnore() {
  const file = join(HERE, 'uz-new-alphabet-ignore.txt');
  if (!existsSync(file)) return new Set();
  return new Set(
    readFileSync(file, 'utf8')
      .split('\n')
      .map((l) => l.replace(/#.*/, '').trim().toLowerCase())
      .filter(Boolean),
  );
}
const IGNORE = loadIgnore();

/** True for words that must not be converted (foreign words, names, CamelCase). */
function isForeign(word) {
  const plain = word.replace(new RegExp(APOS, 'g'), '');
  if (IGNORE.has(plain.toLowerCase())) return true;
  if (/[a-z][A-Z]/.test(plain)) return true; // CamelCase: GitHub, BlackPy
  if (/[wW]|[cC](?![hH])/.test(plain)) return true; // Uzbek has no w, and c only in ch
  return false;
}

/** Converts one Uzbek word. */
export function convertWord(word) {
  if (isForeign(word)) return word;
  return (
    word
      // oʻ / gʻ with any apostrophe variant (U+02BC ʼ is the tutuq and stays)
      .replace(new RegExp(`O${APOS}`, 'g'), 'Ö')
      .replace(new RegExp(`o${APOS}`, 'g'), 'ö')
      .replace(new RegExp(`G${APOS}`, 'g'), 'Ğ')
      .replace(new RegExp(`g${APOS}`, 'g'), 'ğ')
      // digraphs
      .replace(/S[hH]/g, 'Ş')
      .replace(/s[hH]/g, 'ş')
      .replace(/C[hH]/g, 'Ç')
      .replace(/c[hH]/g, 'ç')
      // remaining apostrophes between letters are the tutuq belgisi
      .replace(new RegExp(`(\\p{L})${APOS}(?=\\p{L})`, 'gu'), `$1${TUTUQ}`)
  );
}

// Words may contain apostrophes (oʻzbek, maʼno) or end in oʻ / gʻ (togʻ); hyphens split words.
const WORD = new RegExp(
  `[\\p{L}\\p{M}]+(?:${APOS.slice(0, -1)}ʼ][\\p{L}\\p{M}]+)*(?:(?<=[oOgG])${APOS})?`,
  'gu',
);

/** Spans that are never touched, in plain text. */
const PROTECT = [
  /```[\s\S]*?```/g, // fenced code
  /`[^`\n]*`/g, // inline code
  /\$\$[\s\S]*?\$\$/g, // display math
  /\$[^$\n]+\$/g, // inline math
  /<[^>\n]+>/g, // HTML tags
  /\]\([^)\n]*\)/g, // Markdown link targets
  /\b(?:https?:\/\/|www\.)[^\s)>\]"']+/g, // URLs
  /[\w.+-]+@[\w-]+\.[\w.-]+/g, // e-mails
  /\b(?:[a-z0-9-]+\.)+(?:io|com|org|net|uz|edu|gov|dev|app|ru|de|info|xml|txt)\b/gi, // bare domains
  /\b10\.\d{4,9}\/[^\s"'<>{}]+/g, // DOIs
  /(?<![\p{L}\d])\.{0,2}\/?(?:[\w.-]+\/)+[\w.-]*/gu, // paths: files/a.pdf, research/tools
  /\{\{[^}]*\}\}/g, // template tags
  /[\p{L}\d]+(?:_[\p{L}\d{}]+)+/gu, // symbols with subscripts: R_sh, r_ph, nu_phi
];

/** Converts a piece of Uzbek text, leaving protected spans alone. */
export function convertText(text) {
  const marks = [];
  let masked = text;
  for (const re of PROTECT) {
    masked = masked.replace(re, (m) => {
      marks.push(m);
      return `\u0000${marks.length - 1}\u0000`;
    });
  }
  const converted = masked.replace(WORD, (w) => convertWord(w));
  return converted.replace(/\u0000(\d+)\u0000/g, (_, i) => marks[Number(i)]);
}

// ---------------------------------------------------------------- file types
/** Markdown / MDX: front-matter values + body; keys untouched. */
function convertMarkdown(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return convertText(src);
  const fm = m[1]
    .split('\n')
    .map((line) => convertYamlLine(line, true))
    .join('\n');
  return `---\n${fm}\n---\n${convertText(src.slice(m[0].length))}`;
}

/** One YAML line: converts the value part only (or list items). */
function convertYamlLine(line, convertAll, state = {}) {
  if (/^\s*#/.test(line)) return convertAll ? convertText(line) : line; // comment
  const kv = line.match(/^(\s*(?:-\s+)?)([\w.-]+)(\s*:)(.*)$/);
  if (kv) {
    const [, indent, key, colon, rest] = kv;
    const isUz = convertAll || /uz$/i.test(key);
    state.uzBlockIndent = isUz && rest.trim() === '' ? indent.length : state.uzBlockIndent;
    if (!isUz) {
      if (rest.trim() !== '' || indent.length <= (state.uzBlockIndent ?? -1))
        state.uzBlockIndent = undefined;
      return line;
    }
    return `${indent}${key}${colon}${convertText(rest)}`;
  }
  // list items or block text belonging to a uz key / whole-file mode
  const indent = line.match(/^\s*/)[0].length;
  if (convertAll || (state.uzBlockIndent !== undefined && indent > state.uzBlockIndent)) {
    return convertText(line);
  }
  return line;
}

function convertYaml(src, convertAll) {
  const state = {};
  return src
    .split('\n')
    .map((line) => convertYamlLine(line, convertAll, state))
    .join('\n');
}

/** BibTeX: only fields whose name ends in "uz", e.g. titleuz = {…}. */
function convertBib(src) {
  return src.replace(/(\b\w*uz\s*=\s*\{)([^{}]*(?:\{[^{}]*\}[^{}]*)*)(\})/gi, (_, a, value, b) => {
    return `${a}${convertText(value)}${b}`;
  });
}

/** TS/JS dictionaries: converts string literals that are values (after a ':'). */
function convertScript(src) {
  return src.replace(/(:\s*\n?\s*)'((?:[^'\\]|\\.)*)'/g, (_, a, s) => `${a}'${convertText(s)}'`);
}

function isUzbekPath(path) {
  const parts = path.split(/[\\/]/);
  const name = basename(path);
  return parts.includes('uz') || /^uz\./.test(name) || /\.uz\.\w+$/.test(name);
}

/** Returns the converted file content, or null if this file is not handled. */
export function convertFile(path, src, { all = false } = {}) {
  const ext = extname(path).toLowerCase();
  const uz = all || isUzbekPath(path);
  if (ext === '.bib') return all ? convertText(src) : convertBib(src);
  if (ext === '.yaml' || ext === '.yml') return convertYaml(src, uz);
  if (!uz) return null;
  if (ext === '.md' || ext === '.mdx') return convertMarkdown(src);
  if (ext === '.ts' || ext === '.js' || ext === '.mjs') return convertScript(src);
  if (ext === '.txt' || ext === '') return convertText(src);
  return null;
}

// ---------------------------------------------------------------- CLI
function* walk(path) {
  const st = statSync(path);
  if (st.isFile()) {
    yield path;
    return;
  }
  for (const name of readdirSync(path)) {
    if (name.startsWith('.') || name === 'node_modules' || name === 'dist') continue;
    yield* walk(join(path, name));
  }
}

const color = (code, s) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);

function showDiff(file, before, after) {
  const a = before.split('\n');
  const b = after.split('\n');
  console.log(color('1', `\n${file}`));
  let n = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      n++;
      console.log(color('2', `  line ${i + 1}`));
      console.log(color('31', `  - ${a[i] ?? ''}`));
      console.log(color('32', `  + ${b[i] ?? ''}`));
    }
  }
  return n;
}

async function main() {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith('--')));
  const paths = args.filter((a) => !a.startsWith('--'));
  if (!paths.length || flags.has('--help')) {
    console.log(
      'Usage: npm run uz -- [--dry-run] [--yes] [--all] <file or folder> …\n' +
        'Shows the changes from the old to the new Uzbek alphabet and asks before writing.',
    );
    process.exit(paths.length ? 0 : 1);
  }
  const changes = [];
  for (const p of paths) {
    if (!existsSync(p)) {
      console.error(`Not found: ${p}`);
      process.exit(1);
    }
    for (const file of walk(p)) {
      const src = readFileSync(file, 'utf8');
      const out = convertFile(file, src, { all: flags.has('--all') });
      if (out !== null && out !== src)
        changes.push({ file, out, lines: showDiff(relative('.', file), src, out) });
    }
  }
  if (!changes.length) {
    console.log('Nothing to change: the text already uses the new alphabet.');
    return;
  }
  const total = changes.reduce((s, c) => s + c.lines, 0);
  console.log(`\n${total} changed line(s) in ${changes.length} file(s).`);
  if (flags.has('--dry-run')) return;
  let ok = flags.has('--yes');
  if (!ok) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    ok = /^(y|yes|h|ha)$/i.test((await rl.question('Write these changes? [y/N] ')).trim());
    rl.close();
  }
  if (!ok) {
    console.log('Nothing written.');
    return;
  }
  for (const c of changes) writeFileSync(c.file, c.out);
  console.log('Done. Check the result with: git diff');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
