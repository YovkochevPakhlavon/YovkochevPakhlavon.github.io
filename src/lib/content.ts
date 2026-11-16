/**
 * Content helpers. Every lookup takes a language; if the Uzbek file is missing we use
 * the English one and return `fallback: true` so the page can show a small "(English)" note.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { DEFAULT_LANG, type Lang } from '../i18n';

export interface Localized<T> {
  entry: T;
  /** True when the requested language was missing and English is shown instead. */
  fallback: boolean;
}

async function pick<T>(
  load: (l: Lang) => Promise<T | undefined>,
  lang: Lang,
  what: string,
): Promise<Localized<T>> {
  const own = await load(lang);
  if (own) return { entry: own, fallback: false };
  const en = await load(DEFAULT_LANG);
  if (!en) throw new Error(`Missing content: ${what} (no ${lang} or ${DEFAULT_LANG} file)`);
  return { entry: en, fallback: lang !== DEFAULT_LANG };
}

export const getAbout = (lang: Lang) =>
  pick(async (l) => await getEntry('about', l), lang, 'src/content/about/');

export type PageName =
  'home' | 'research' | 'tools' | 'publications' | 'projects' | 'teaching' | 'contact';
export const getPageText = (page: PageName, lang: Lang) =>
  pick(async (l) => await getEntry('pages', `${page}/${l}`), lang, `src/content/pages/${page}/`);

/** Research themes in order. Each theme falls back to English on its own. */
export async function getResearchThemes(
  lang: Lang,
): Promise<Localized<CollectionEntry<'research'>>[]> {
  const all = await getCollection('research');
  const byId = new Map(all.map((e) => [e.id, e]));
  return all
    .filter((e) => e.id.startsWith(`${DEFAULT_LANG}/`))
    .map((en) => {
      const own = byId.get(en.id.replace(`${DEFAULT_LANG}/`, `${lang}/`));
      return own ? { entry: own, fallback: false } : { entry: en, fallback: lang !== DEFAULT_LANG };
    })
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
}

export async function getProjects() {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export async function getCourses() {
  const all = await getCollection('courses');
  return all.sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

/** True when a text is (or contains) a visible placeholder such as "[MSc university]". */
export const isPlaceholder = (value: string | undefined | null): boolean =>
  !value || /\[[^\]]+\]/.test(value);

const UZ_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];

/** "1 Dec 2026" / "2026-yil 1-dekabr" (fixed spelling, not browser-dependent). */
export function formatDate(d: Date, lang: Lang): string {
  if (lang === 'uz')
    return `${d.getUTCFullYear()}-yil ${d.getUTCDate()}-${UZ_MONTHS[d.getUTCMonth()]}`;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ---------------------------------------------------------------- notes & talks
/** Note slug: "en/my-note" → "my-note". */
export const noteSlug = (id: string) => id.replace(/^(en|uz)\//, '');

const showDrafts = import.meta.env.DEV;

/**
 * Notes for a language, newest first. Uzbek pages also list English notes that have no
 * Uzbek version (marked fallback: true).
 */
export async function getNotes(lang: Lang) {
  const all = (await getCollection('notes')).filter((n) => showDrafts || !n.data.draft);
  const bySlug = new Map<string, { entry: CollectionEntry<'notes'>; fallback: boolean }>();
  for (const n of all) {
    const slug = noteSlug(n.id);
    const isOwn = n.id.startsWith(`${lang}/`);
    const isDefault = n.id.startsWith(`${DEFAULT_LANG}/`);
    if (isOwn) bySlug.set(slug, { entry: n, fallback: false });
    else if (isDefault && !bySlug.has(slug)) bySlug.set(slug, { entry: n, fallback: true });
  }
  return [...bySlug.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
}

/** Talks, newest first. */
export async function getTalks() {
  const all = (await getCollection('talks')).filter((x) => showDrafts || !x.data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
