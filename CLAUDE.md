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

### Content (schemas in `src/content.config.ts`, helpers in `src/lib/content.ts`)

| Collection | Files                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `about`    | `src/content/about/{en,uz}.md` — bio (body) + timeline, interests, beyond, achievements                                                          |
| `pages`    | `src/content/pages/<home\|research\|publications\|projects\|teaching\|contact>/{en,uz}.md` — intro (body), meta description, page-specific lists |
| `research` | `src/content/research/{en,uz}/NN-name.md` — `order`, `title`, `tag` (matches BibTeX `themes`)                                                    |
| `projects` | `src/content/projects/<name>.yaml` — bilingual fields inside one file                                                                            |
| `courses`  | `src/content/courses/<slug>/course.yaml` — everything incl. `description: {en, uz}` (Markdown), covers next to it                                |
| `talks`    | `src/content/talks/<name>.yaml` (page in Phase 8)                                                                                                |
| `notes`    | `src/content/notes/{en,uz}/<name>.md` (page in Phase 8)                                                                                          |

- Missing Uzbek file → English is used and `<FallbackNote>` shows "(inglizça)"; wrap the text in `lang="en"`.
- Text containing `[...]` is a placeholder: `isPlaceholder()` styles it muted/dashed.
- Portrait: drop `src/assets/portrait.{jpg,png,webp}`; `Portrait.astro` optimizes it (AVIF/WebP).
- Files in `public/files/` are checked at build time (`src/lib/files.ts`); missing → dashed placeholder, never a broken link.
- Publications: `src/data/publications.bib` → `src/lib/publications.ts` (validation, sorting, safe title HTML,
  clean BibTeX without website fields) → `src/views/Publications.astro`; downloads at `/publications/all.bib`
  and `/publications/bib/<key>.bib`. Parser `@retorquere/bibtex-parser/js`: its `sentenceCase: false` is
  overridden by its own defaults, so titles use `fieldMode: { title: 'richtext' }` to keep the author's casing.
- Courses: everything in `course.yaml` (schema checks that listed files exist in `public/`, parses any YouTube
  link to an ID, cover images via `image()` relative to the yaml). Course page tabs are `#anchor` links:
  stacked sections without JS, one panel at a time with JS (`aria-current` on the active tab).
  `YouTube.astro` = thumbnail facade; iframe from youtube-nocookie.com only after click.
- Admin panel saves with `omit_empty_optional_fields`: an empty field is _left out_ of the file. Every
  optional schema field must therefore accept a missing value (`.default(...)` / preprocess), or the build breaks.
- Admin panel: Sveltia CMS, `public/admin/index.html` (version pinned) + `public/admin/config.yml`.
  Token sign-in only (`auth_methods: [token]`). Any content field added to `src/content.config.ts` or
  `profile.yaml` must also be added to `config.yml`. Uploaded paths start with `/` — schemas strip it.
  Dev: open `/admin/index.html` (Astro dev doesn't serve folder index files in `public/`).
- Uzbek converter: `npm run uz -- <path>` (`scripts/uz-new-alphabet.mjs`, tests `npm run test:uz`,
  word exceptions in `scripts/uz-new-alphabet-ignore.txt`). Run `npm run uz -- --dry-run --all <file>`
  on any Uzbek text you write — it catches old-alphabet slips.
- Home black hole: `src/scripts/blackhole/` (raw WebGL2, no library). `shaders.ts` ray-traces Schwarzschild
  null geodesics (r_s = 1, ISCO 3, disk to 7.2, g⁴ Doppler boost); `engine.ts` = renderer (DPR ≤ 1.5, fps cap,
  reduced-motion still frame, adaptive resolution, async shader compile, software-WebGL → fail);
  `worker.ts` runs it on an OffscreenCanvas (main thread never blocked); `index.ts` picks worker or
  main thread and forwards size/visibility/pointer. Loaded by Home.astro only at ≥ 768px after `load` +
  idle; the CSS `BlackHole.astro` stays until the first WebGL frame (`.orbit.is-webgl`) and is the fallback.
- Notes: `/notes/` + `/notes/<slug>/` (Markdown/MDX, math via remark-math + rehype-katex configured with the
  `unified()` processor in astro.config.mjs; KaTeX CSS linked only when a note has `$…$`). Drafts show only in dev;
  `example-note.md` / `example-talk.yaml` are draft templates. Talks: `/research/talks/` grouped by year.
- SEO: OG/Twitter meta in BaseLayout; OG PNGs generated at build (`src/lib/og.ts`, satori + sharp, site fonts)
  at `/og/<lang>/<route>.png` — every new route must appear in `ogEntries()`. JSON-LD: Person (Home, About),
  ScholarlyArticle (publications with DOI), BlogPosting (notes). Sitemap via @astrojs/sitemap (i18n),
  robots.txt endpoint, analytics switch in `src/config/site.ts` (GoatCounter, off).
- Interactive tools (`/research/tools`): physics in `src/physics/` (pure TS, Vitest: `npm test`), data in
  `src/data/eht-constraints.json` and `src/data/qpo-sources.json` (values copied from the cited papers —
  never from memory), UI `src/views/Tools.astro` + `src/scripts/tools/` (first view rendered at build time;
  `app.ts` loaded when visible; uPlot loaded only for the QPO chart). Custom metric slot: `custom` in
  `metrics.ts` (`visible: false` until filled). BlackPy cross-check: `scripts/compare-blackpy.md`.

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
- Uzbek UI strings from SITE_SPEC §3 are fixed, except that "Bosh sahifa"/"Nashrlar" were
  converted to "Boş sahifa"/"Naşrlar" (owner confirmed); other Uzbek text is translated from English
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
