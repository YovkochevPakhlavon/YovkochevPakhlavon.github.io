/**
 * Reads src/data/publications.bib at build time, checks it, and turns it into the list
 * shown on the Publications page. Mistakes stop the build with a message naming the
 * entry and the field.
 *
 * Parser: @retorquere/bibtex-parser (the engine of Better BibTeX for Zotero).
 */
import { parse, parseVerbatim, type Creator, type Entry } from '@retorquere/bibtex-parser/js';
import { getCollection } from 'astro:content';
import raw from '../data/publications.bib?raw';
import { profile } from './profile';
import { publicFileExists, publicUrl } from './files';

const FILE = 'src/data/publications.bib';

export const PUBTYPES = ['journal', 'preprint', 'thesis', 'textbook'] as const;
export const STATUSES = ['under-revision', 'submitted', 'accepted', 'published'] as const;
export type PubType = (typeof PUBTYPES)[number];
export type Status = (typeof STATUSES)[number];
/** Filter pills: "published" and "review" group statuses; the rest are pubtypes. */
export type Category = 'published' | 'review' | 'thesis' | 'textbook';

/** Fields used only by the website; removed from downloadable BibTeX. */
const SITE_FIELDS = ['pubtype', 'status', 'themes', 'pdf', 'supervisor', 'titleuz'];

export interface Author {
  text: string;
  isMe: boolean;
  isPlaceholder: boolean;
}

export interface Publication {
  key: string;
  pubtype: PubType;
  status?: Status;
  categories: Category[];
  themes: string[];
  /** Numeric year, or null when unknown/placeholder. */
  year: number | null;
  yearLabel: string;
  month: number;
  /** Safe HTML (only <sup>, <sub>, <i>, <b>, <em>, <strong>). */
  titleHtml: string;
  titleText: string;
  titleUzHtml?: string;
  authors: Author[];
  /** Author list as safe HTML: "<strong>P. Yovkochev</strong>, A. Other". */
  authorsHtml: string;
  supervisor?: string;
  /** Venue parts: `venue` is shown in italics, `details` after it. */
  venue: string;
  details: string;
  doi?: string;
  arxiv?: string;
  url?: string;
  pdf?: string;
  bibtex: string;
}

const isPlaceholder = (s: string) => /\[[^\]]*\]/.test(s);

// ---------- Safe HTML for titles ----------
const ALLOWED = /^<\/?(sup|sub|i|b|em|strong)>$/;
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Keeps a few inline formatting tags from the parser, escapes everything else. */
export function safeInlineHtml(s: string): string {
  return s
    .split(/(<\/?[a-z]+(?:\s[^<>]*)?>)/i)
    .map((part) => (/^<\/?[a-z]/i.test(part) ? (ALLOWED.test(part) ? part : '') : escapeHtml(part)))
    .join('');
}
const stripTags = (s: string) => s.replace(/<[^>]+>/g, '');

// ---------- Names ----------
const myNames = new Set(profile.bibtexNames.map((n) => n.toLocaleLowerCase()));

function initials(first: string): string {
  return first
    .split(/\s+/)
    .filter(Boolean)
    .map((part) =>
      part
        .split('-')
        .map((p) => (p.endsWith('.') ? p : `${p[0]}.`))
        .join('-'),
    )
    .join(' ');
}

function formatCreator(c: Creator): Author {
  if (c.name) {
    return { text: c.name, isMe: false, isPlaceholder: isPlaceholder(c.name) };
  }
  const last = [c.prefix, c.lastName].filter(Boolean).join(' ');
  const text = [c.firstName ? initials(c.firstName) : '', last, c.suffix ?? '']
    .filter(Boolean)
    .join(' ');
  return {
    text,
    isMe: myNames.has((c.lastName ?? '').toLocaleLowerCase()),
    isPlaceholder: isPlaceholder(text),
  };
}

function formatPlainName(value: string): string {
  // "Last, First" → "F. Last"
  const [last, first] = value.split(',').map((s) => s.trim());
  return first ? `${initials(first)} ${last}` : value;
}

// ---------- Clean BibTeX for download ----------
function cleanBibtex(entry: { type: string; key: string; fields: Record<string, string> }): string {
  const fields = Object.entries(entry.fields).filter(([k]) => !SITE_FIELDS.includes(k));
  const width = Math.max(...fields.map(([k]) => k.length), 0);
  const body = fields.map(([k, v]) => `  ${k.padEnd(width)} = {${v}}`).join(',\n');
  return `@${entry.type}{${entry.key},\n${body}\n}\n`;
}

// ---------- Main ----------
function fail(key: string, msg: string): never {
  throw new Error(`${FILE}: entry "${key}": ${msg}`);
}

function str(e: Entry, field: string): string {
  const v = e.fields[field];
  if (v === undefined) return '';
  return (Array.isArray(v) ? v.join(', ') : String(v)).trim();
}

let cache: Publication[] | undefined;

export async function getPublications(): Promise<Publication[]> {
  if (cache) return cache;

  const knownThemes = new Set((await getCollection('research')).map((e) => e.data.tag));
  // Titles keep the capitalization you wrote ("richtext" mode); see CLAUDE.md.
  const lib = parse(raw, {
    sentenceCase: false,
    caseProtection: false,
    fieldMode: {
      title: 'richtext',
      titleuz: 'richtext',
      journal: 'richtext',
      booktitle: 'richtext',
    },
  });
  if (lib.errors.length) {
    throw new Error(
      `${FILE} could not be read:\n${lib.errors.map((e) => `  • ${e.error}${e.input ? ` near: ${e.input.slice(0, 60)}` : ''}`).join('\n')}`,
    );
  }
  const verbatim = new Map(parseVerbatim(raw).entries.map((e) => [e.key, e]));
  const seen = new Set<string>();

  cache = lib.entries.map((e): Publication => {
    const key = e.key;
    if (seen.has(key)) fail(key, 'this key is used twice; every entry needs its own key');
    seen.add(key);

    const pubtype = str(e, 'pubtype') as PubType;
    if (!PUBTYPES.includes(pubtype)) {
      fail(key, `pubtype must be one of ${PUBTYPES.join(', ')} (found "${pubtype}")`);
    }
    const statusRaw = str(e, 'status');
    if (statusRaw && !STATUSES.includes(statusRaw as Status)) {
      fail(key, `status must be one of ${STATUSES.join(', ')} (found "${statusRaw}")`);
    }
    const status = (statusRaw || undefined) as Status | undefined;

    const themes = str(e, 'themes')
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const th of themes) {
      if (!knownThemes.has(th)) {
        fail(
          key,
          `themes: "${th}" is not a research theme tag (known: ${[...knownThemes].join(', ')})`,
        );
      }
    }

    const yearRaw = str(e, 'year');
    const year = /^\d{4}$/.test(yearRaw) ? Number(yearRaw) : null;
    if (!yearRaw) fail(key, 'year is missing (write [year] if you do not know it yet)');
    if (year === null && !isPlaceholder(yearRaw)) {
      fail(key, `year must be four digits like 2026 (found "${yearRaw}")`);
    }
    const month = Number(str(e, 'month')) || 0;

    const titleRaw = str(e, 'title');
    if (!titleRaw) fail(key, 'title is missing');
    const authorsRaw = e.fields.author ?? e.fields.editor ?? [];
    if (!authorsRaw.length) fail(key, 'author is missing');

    const pdf = str(e, 'pdf').replace(/^\/+/, '');
    if (pdf && !publicFileExists(pdf)) {
      fail(key, `pdf file not found: public/${pdf} (upload it or remove the pdf field)`);
    }

    // Venue
    let venue = '';
    let details = '';
    const publisher = str(e, 'publisher');
    const address = str(e, 'address') || str(e, 'location');
    if (pubtype === 'journal') {
      venue = stripTags(str(e, 'journal'));
      const volume = [str(e, 'volume'), str(e, 'number') && `(${str(e, 'number')})`]
        .filter(Boolean)
        .join('');
      details = [
        publisher && `(${publisher})`,
        [volume, str(e, 'pages')].filter(Boolean).join(', '),
      ]
        .filter(Boolean)
        .join(' ');
    } else if (pubtype === 'thesis') {
      venue = [str(e, 'school') || str(e, 'institution'), address].filter(Boolean).join(', ');
    } else if (pubtype === 'textbook') {
      venue = [publisher, address].filter(Boolean).join(', ');
    } else {
      venue = str(e, 'journal') || str(e, 'howpublished');
    }

    const categories: Category[] = [];
    if (status === 'published' || status === 'accepted') categories.push('published');
    if (status === 'under-revision' || status === 'submitted') categories.push('review');
    if (pubtype === 'thesis') categories.push('thesis');
    if (pubtype === 'textbook') categories.push('textbook');

    const archive = (str(e, 'archiveprefix') || str(e, 'eprinttype')).toLowerCase();
    const eprint = str(e, 'eprint');
    const arxiv = str(e, 'arxiv') || (eprint && (!archive || archive === 'arxiv') ? eprint : '');
    const doi = str(e, 'doi').replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
    const titleUz = str(e, 'titleuz');
    const supervisor = str(e, 'supervisor');
    const v = verbatim.get(key);
    const authors = authorsRaw.map(formatCreator);

    return {
      key,
      pubtype,
      status,
      categories,
      themes,
      year,
      yearLabel: year ? String(year) : yearRaw,
      month,
      titleHtml: safeInlineHtml(titleRaw),
      titleText: stripTags(titleRaw),
      titleUzHtml: titleUz ? safeInlineHtml(titleUz) : undefined,
      authors,
      authorsHtml: authors
        .map((a) =>
          a.isMe
            ? `<strong>${escapeHtml(a.text)}</strong>`
            : a.isPlaceholder
              ? `<span class="placeholder">${escapeHtml(a.text)}</span>`
              : escapeHtml(a.text),
        )
        .join(', '),
      supervisor: supervisor ? formatPlainName(supervisor) : undefined,
      venue,
      details,
      doi: doi || undefined,
      arxiv: arxiv || undefined,
      url: str(e, 'url') || undefined,
      pdf: pdf ? publicUrl(pdf) : undefined,
      bibtex: v ? cleanBibtex(v) : '',
    };
  });

  // Newest first; unknown years (in preparation / under review) on top.
  cache.sort(
    (a, b) =>
      (b.year ?? 9999) - (a.year ?? 9999) ||
      b.month - a.month ||
      a.titleText.localeCompare(b.titleText),
  );
  return cache;
}

/** All entries as one clean BibTeX file (website fields removed). */
export async function allBibtex(): Promise<string> {
  const pubs = await getPublications();
  return `% Publications of ${profile.name.en}\n% ${new Date().toISOString().slice(0, 10)}\n\n${pubs.map((p) => p.bibtex).join('\n')}`;
}

/** Group publications by year label, keeping the sort order. */
export function groupByYear(pubs: Publication[]): { label: string; items: Publication[] }[] {
  const groups: { label: string; items: Publication[] }[] = [];
  for (const p of pubs) {
    const last = groups[groups.length - 1];
    if (last && last.label === p.yearLabel) last.items.push(p);
    else groups.push({ label: p.yearLabel, items: [p] });
  }
  return groups;
}
