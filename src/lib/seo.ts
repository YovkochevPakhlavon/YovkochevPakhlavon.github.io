/** Structured data (JSON-LD) for search engines. */
import { SITE_URL } from '../config/site';
import { DEFAULT_LANG, type Lang } from '../i18n';
import { profile } from './profile';

/** schema.org Person, used on Home and About. */
export function personJsonLd(lang: Lang, topics: string[] = []) {
  const other: Lang = lang === DEFAULT_LANG ? 'uz' : 'en';
  const sameAs = Object.values(profile.links).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name[lang],
    alternateName: profile.name[other] !== profile.name[lang] ? profile.name[other] : undefined,
    jobTitle: profile.position[lang],
    url: SITE_URL,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: profile.institution[lang],
      address: { '@type': 'PostalAddress', addressLocality: 'Samarkand', addressCountry: 'UZ' },
    },
    worksFor: { '@type': 'CollegeOrUniversity', name: profile.institution[lang] },
    knowsAbout: topics.length ? topics : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}
