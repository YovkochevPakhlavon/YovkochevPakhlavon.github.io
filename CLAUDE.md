# CLAUDE.md — conventions for this repository

Academic website of Pakhlavon Yovkochev (theoretical physics, black holes).
Full requirements: `website-prompt/SITE_SPEC.md` (spec wins over the mockups in
`website-prompt/design-reference/`). Work in the phases listed at the end of the spec;
after each phase run `npm run check && npm run build`, list what to look at, commit.
**Never push to GitHub without the owner's explicit OK.**

## Stack

- Astro 7 (static output), TypeScript strict, npm, Node 26 LTS (`.nvmrc`). Versions pinned exactly.
- Astro 7 notes: `compressHTML: true` is set on purpose (the 'jsx' default strips spaces
  between inline elements); the Rust compiler rejects unclosed tags and `<div>` inside `<p>`;
  Markdown uses Sätteri by default — remark/rehype plugins (KaTeX) need
  `@astrojs/markdown-remark` + `markdown.processor: unified()`.
- Fonts: `@fontsource` files, faces declared in `src/styles/fonts.ts` (latin + latin-ext with
  proper `unicode-range`; fontsource's per-subset CSS lacks it). `npm run check:glyphs` must pass.
- Prettier (`npm run format`).

## Where things live

| What                                         | Where                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Public URL (only place)                      | `src/config/site.ts`                                                                      |
| Names, position, links, email, form endpoint | `src/data/profile.yaml` (validated in `src/lib/profile.ts`)                               |
| UI strings                                   | `src/i18n/en.ts`, `src/i18n/uz.ts` (same keys; TS enforces it)                            |
| Page order, numbers, link helpers            | `src/i18n/index.ts` (`PAGES`, `localizePath`, `eyebrow`)                                  |
| Design tokens                                | `src/styles/tokens.css`; base styles `src/styles/global.css`                              |
| Layouts                                      | `src/layouts/BaseLayout.astro` (head, hreflang), `PageLayout.astro` (header/footer)       |
| Page bodies                                  | `src/views/*.astro`, shared by both languages                                             |
| Routes                                       | `src/pages/*.astro` (English) and `src/pages/uz/*.astro` — 2-line wrappers passing `lang` |
| Placeholders still to fill                   | `TODO-CONTENT.md`                                                                         |

Every page exists in both languages. Links always go through `localizePath(lang, route)`;
never hard-code hostnames or `/uz/` prefixes. Pages are `trailingSlash: 'always'`.

## Never invent facts

No made-up dates, co-authors, journals, awards or numbers. Unknown values are visible
placeholders like `[MSc university]` and each one is listed in `TODO-CONTENT.md`.

## Uzbek orthography — new Latin alphabet (law O'RQ-1184, Oct 2026)

All Uzbek text uses: Oʻ→**Ö ö** (U+00D6/U+00F6), Gʻ→**Ğ ğ** (U+011E/U+011F),
Sh→**Ş ş** (U+015E/U+015F), Ch→**Ç ç** (U+00C7/U+00E7). Precomposed characters only.

- "ng" stays plain `n`+`g` (no ñ, no new letter).
- The tutuq belgisi stays where it separates sounds and is typed `ʼ` (U+02BC): maʼno, sanʼat.
- Do not convert English words, names, DOIs, URLs or code inside Uzbek files.
- Uzbek UI strings from SITE_SPEC §3 are fixed; other Uzbek text is translated from English
  and checked letter by letter. Mark Claude-written Uzbek with `// REVIEW` and list it in TODO-CONTENT.md.

Name spellings (from `profile.yaml`): EN "Pakhlavon Yovkochev" / logo "Yovkochev";
UZ "Pahlavon Yovqoçev" / logo "Yovqoçev". The mockups' "Pahlavon Yovqochev" is outdated.

## Design tokens (dark theme only)

`--bg #0B0D12 · --surface #11141B · --surface-2 #1A1F2B · --code-bg #07080C ·
--line #1E2330 · --line-2 #2A3040 · --line-3 #3A4152 · --text #E8EAF0 · --heading #FFF ·
--text-2 #C5CAD6 · --text-3 #B4BBC8 · --muted #9AA3B2 · --accent #F2A541 · --accent-hi #F7C27A ·
--info #A9BBFF`

Headings Space Grotesk 600, −0.02em; body Inter; eyebrows/meta JetBrains Mono.
Pills 999px, cards 14–20px, small buttons 8px. Container 1200px (Home 1280px), gutter 32px/20px.
Buttons ≥ 44px tall. No emoji, no gradient washes, no icon fonts — inline stroke SVGs only.
Visible amber focus ring, `aria-current="page"`, skip link, `prefers-reduced-motion` everywhere.
