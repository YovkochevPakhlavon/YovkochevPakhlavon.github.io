/**
 * Language helpers: translations, localized links and the page list used by
 * the header, the footer ("Next: …") and the Home orbit.
 */
import { getRelativeLocaleUrl } from 'astro:i18n';
import en, { type UiKey } from './en';
import uz from './uz';

export const LANGS = ['en', 'uz'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

/** Value for <html lang> and hreflang. */
export const HTML_LANG: Record<Lang, string> = { en: 'en', uz: 'uz' };

const dictionaries: Record<Lang, Record<UiKey, string>> = { en, uz };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/** `const t = useTranslations(lang); t('nav.home')` */
export function useTranslations(lang: Lang) {
  return (key: UiKey): string => dictionaries[lang][key] ?? dictionaries[DEFAULT_LANG][key];
}

/**
 * Link to a page in a given language. `route` is the language-neutral path,
 * e.g. '' (Home), 'about', 'teaching/some-course'.
 */
export function localizePath(lang: Lang, route = ''): string {
  return getRelativeLocaleUrl(lang, route.replace(/^\/+|\/+$/g, ''));
}

/** Turns '/uz/about/' or '/about/' into 'about'. */
export function routeFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && isLang(parts[0]) && parts[0] !== DEFAULT_LANG) parts.shift();
  return parts.join('/');
}

/** Pages in navigation order. `num` is the eyebrow / orbit number. */
export const PAGES = [
  { key: 'home', route: '', num: '' },
  { key: 'about', route: 'about', num: '01' },
  { key: 'research', route: 'research', num: '02' },
  { key: 'publications', route: 'publications', num: '03' },
  { key: 'projects', route: 'projects', num: '04' },
  { key: 'teaching', route: 'teaching', num: '05' },
  { key: 'contact', route: 'contact', num: '06' },
] as const;

export type PageKey = (typeof PAGES)[number]['key'];

/** Footer "Next" link: About → Research → … → Contact → About. */
export function nextPage(key: PageKey) {
  const sections = PAGES.filter((p) => p.key !== 'home');
  const i = sections.findIndex((p) => p.key === key);
  return sections[(i + 1) % sections.length]!;
}

/** Eyebrow text such as "01 — about" / "01 — men haqimda". */
export function eyebrow(lang: Lang, key: Exclude<PageKey, 'home'>): string {
  const page = PAGES.find((p) => p.key === key)!;
  const label = useTranslations(lang)(`nav.${key}`);
  return `${page.num} — ${label.toLocaleLowerCase(HTML_LANG[lang])}`;
}
