# SITE_SPEC — Academic website of Pakhlavon Yovkochev

You are building my personal academic website. Read this whole file before writing code.
The visual design already exists as mockups in `design-reference/` (open the `.dc.html`
files and copy layout, spacing, colors and typography from their inline styles; the
`{{…}}`, `<x-dc>`, `<sc-for>`, `<sc-if>` tags belong to the mockup tool and must not be
copied). Where this spec and the mockups disagree, this spec wins.

Work in phases (see the end). Before Phase 1, show me a short plan and the folder tree,
then wait for my OK. After each phase: run the build, show me what changed, commit.
Never push to GitHub until I say so.

---

## 1. Goals

1. A professional, memorable academic site for postdoc applications, collaborators and my students.
2. **I must be able to update it myself, easily** — without touching code for everyday
   changes (new paper, new lecture, new photo, new CV, news). This is the most important
   non-visual requirement. Content lives in plain files; a browser admin panel edits them.
3. Free hosting now at `https://yovkochevpakhlavon.github.io/`; moving to my own domain later
   must take a few minutes (see §9).
4. Fast, accessible, works well on phones.

## 2. Identity and facts (use exactly)

| Field | English | Uzbek |
|---|---|---|
| Name | Pakhlavon Yovkochev | Pahlavon Yovqoçev |
| Short name / logo | Yovkochev | Yovqoçev |
| Position | Assistant, Department of Physics | Fizika kafedrasi assistenti |
| Institution | Samarkand State Pedagogical Institute | Samarqand davlat pedagogika instituti |
| Location | Samarkand, Uzbekistan | Samarqand, Özbekiston |
| Degree | PhD, 2026 (Theoretical Physics) | PhD, 2026 (Nazariy fizika) |

Keep both name spellings in ONE config value each (`src/config/profile.ts` or
`src/data/profile.yaml`) so I can change them in one place.

- GitHub username: `YovkochevPakhlavon`
- Repository: `YovkochevPakhlavon/YovkochevPakhlavon.github.io` (user site → served at root `/`)
- PhD: defended November 2026. Specialties 01.03.01 Astronomy and 01.04.02 Theoretical
  Physics. Scientific Council at the Institute of Fundamental and Applied Research (TIIAME),
  Tashkent. Supervisor: Ahmadjon Abdujabbarov.
  Thesis: "Theoretical and Observational Studies of Black Holes Surrounded by Anisotropic
  Matter Fields" / Uzbek: "Anizotrop modda maydonlari bilan öralgan qora öralarning nazariy
  va kuzatuv tadqiqotlari".
- Papers I know of (more will come via BibTeX):
  - "Quasi-periodic oscillations of anisotropic black holes" — Annals of Physics (Elsevier),
    status: under revision. Co-authors: [to fill].
  - "Constraining Dark Matter Halo Effects on Rotating Black Hole Shadows with EHT
    Observations" — status: submitted. Co-authors and journal: [to fill].
- Project: **BlackPy** — open-source Python toolkit (MIT). Metric → observables → QPO/EHT
  fits, in the spirit of CosmoMC/SimpleMC; sampler emcee or dynesty. v0.1 static spherical
  metrics ✓, v0.2 rotating metrics ✓, v0.3 in progress.
- Course: "Fundamentals of Scientific Research in Physics" / "Fizikada ilmiy tadqiqot
  asoslari", 4th-year students, taught in Uzbek.

**Never invent facts** (dates, co-authors, journals, awards, numbers). Anything unknown is
a visible placeholder like `[MSc university]`, and every placeholder is listed in
`TODO-CONTENT.md` so I can fill them in.

## 3. Languages

- Two languages: **English (default, at `/`)** and **Uzbek (at `/uz/`)**. No Russian.
- Use Astro's built-in i18n routing. Every page exists in both languages; the switcher
  (`UZ | EN`) keeps the user on the same page. Add `hreflang` alternates and `<html lang>`.
- UI strings live in one dictionary file per language (`src/i18n/en.ts`, `src/i18n/uz.ts`).
  If an Uzbek content file is missing, fall back to English and show a small
  "(English)" note — never a broken page.

### Uzbek orthography — the NEW Latin alphabet (law O'RQ-1184, Oct 2026)

All Uzbek text on the site uses the new alphabet:

| Old | New |
|---|---|
| Oʻ oʻ (also o' o‘ o`) | Ö ö |
| Gʻ gʻ (also g' g‘ g`) | Ğ ğ |
| Sh sh | Ş ş |
| Ch ch | Ç ç |

- **"ng" is written as plain `n` + `g`** — the new alphabet removes it as a separate letter;
  there is NO new character for it (do not use ñ).
- The tutuq belgisi (apostrophe) stays where it separates sounds: maʼno, sanʼat → keep the
  apostrophe, typeset as `ʼ` (U+02BC).
- Use precomposed Unicode: Ö U+00D6/ö U+00F6, Ğ U+011E/ğ U+011F, Ş U+015E/ş U+015F,
  Ç U+00C7/ç U+00E7. Fonts must include the latin-ext subset; verify these glyphs render
  in Space Grotesk, Inter and JetBrains Mono (no fallback-font boxes).
- Build a small converter `scripts/uz-new-alphabet.mjs` (old → new) that I can run on a file
  or folder, printing a diff for review before writing. Do NOT auto-convert at build time
  (English words, names, DOIs and URLs inside Uzbek files must not be touched).
  Handle uppercase (SH→Ş, Sh→Ş, CH→Ç), all apostrophe variants for oʻ/gʻ, and skip code
  spans, URLs, BibTeX keys and front-matter keys.


Uzbek UI dictionary (use these exact strings):

```
nav.home: Bosh sahifa        nav.about: Men haqimda      nav.research: Tadqiqotlar
nav.publications: Nashrlar   nav.projects: Loyihalar     nav.teaching: Öqitiş
nav.contact: Aloqa
cta.cv: CV yuklab oliş       cta.publications: Nashrlarni köriş
about.path: Akademik yöl     about.interests: Ilmiy qiziqişlar
about.beyond: Ilmdan taşqari about.achievements: Yutuqlar
research.methods: Usullar va vositalar
pubs.all: Barçasi            pubs.published: Çop etilgan  pubs.review: Körib çiqilmoqda
pubs.thesis: Dissertatsiya   pubs.textbooks: Darsliklar   pubs.bibAll: Barçasini yuklab oliş (BibTeX)
status.revision: Qayta körib çiqişda   status.submitted: Yuborilgan
course.overview: Umumiy maʼlumot  course.lectures: Maʼruzalar  course.books: Darsliklar
course.videos: Video darslar      course.tasks: Topşiriqlar    course.open: Kursni oçiş
contact.title: Boğlaniş      contact.send: Xabar yuboriş  contact.name: Ism
contact.email: Elektron poçta  contact.message: Xabar
footer.next: Keyingi         footer.home: Bosh sahifa
```

Write all other Uzbek copy (bios, research descriptions, page intros) by translating the
English, then check every word against the table above. Research themes in Uzbek:
1. Qora öralar va anizotrop modda maydonlari
2. Gravitatsion linzalaniş va qora öra soyasi
3. Kvaziperiodik tebranişlar (QPO)
4. Termodinamika va xaos
5. Kosmologiya va qoronği materiya

## 4. Tech stack

- **Astro** (latest stable), TypeScript, static output (`output: 'static'`), no server needed.
- Content: Astro content collections (Markdown/MDX + YAML/JSON) with Zod schemas, so a typo
  in front-matter fails the build with a clear message.
- Math: `remark-math` + `rehype-katex` (KaTeX CSS loaded only on pages that use math).
- Fonts: self-hosted via `@fontsource` (Space Grotesk 500/600/700, Inter 400/500/600,
  JetBrains Mono 400/500), latin + latin-ext only, `font-display: swap`.
- Interactive parts are Astro islands, loaded only where used (`client:visible`):
  the WebGL black hole on Home and the calculators on Research. Choose the lightest
  reasonable tool (raw WebGL2 or OGL preferred over full Three.js); charts with a small
  library (e.g. uPlot or Observable Plot).
- Package manager: npm. Node LTS. Formatting: Prettier. Pin versions in `package.json`.
- Before choosing any library, check its current docs/version; do not rely on memory.

## 5. Design system (from the "Event Horizon" mockups)

Dark theme only (no light theme for now).

```
--bg:        #0B0D12   page background
--surface:   #11141B   cards
--surface-2: #1A1F2B   chips
--code-bg:   #07080C   terminal blocks
--line:      #1E2330   hairlines, card borders
--line-2:    #2A3040   stronger borders
--line-3:    #3A4152   outline buttons, dashed placeholders
--text:      #E8EAF0   primary text      --heading: #FFFFFF
--text-2:    #C5CAD6   secondary text    --text-3:  #B4BBC8
--muted:     #9AA3B2   meta, mono labels
--accent:    #F2A541   amber (links, primary buttons, eyebrows)
--accent-hi: #F7C27A   hover
--info:      #A9BBFF   "Submitted" badge
```

- Type: headings Space Grotesk 600, letter-spacing −0.02em (H1 52px inner pages, 68px Home;
  H2 32–38px); body Inter 16–19px, line-height 1.6; JetBrains Mono for eyebrows
  (`01 — about`), years, metadata, tags. Use `clamp()` so headings scale down on phones.
- Radii: pills 999px; cards 14–20px; small buttons 8px. Container max-width 1200px
  (Home 1280px), side padding 32px (20px on phones). Section spacing 72–96px.
- Buttons: primary = amber fill, dark text; secondary = 1px `--line-3` outline. Min 44px tall.
- Eyebrow numbering per page: 01 about, 02 research, 03 publications, 04 projects,
  05 teaching, 06 contact.
- Logo: small SVG of a disk ellipse + ring (see mockup header) + short name.
- No emoji, no gradient washes, no stock icons; inline stroke SVG icons only.
- Accessibility: WCAG AA contrast (all pairs above pass on `--bg`), visible focus rings
  (2px amber outline, offset 2px), real `<a>`/`<button>`, `aria-current="page"` in nav,
  skip-to-content link, `prefers-reduced-motion` respected everywhere.

## 6. Pages

Global header on every page EXCEPT Home: logo (→ Home) left; nav right in this order:
**Home · About · Research · Publications · Projects · Teaching · Contact**, then `UZ | EN`.
Active item: white text + 2px amber underline. On phones the nav collapses to a menu
button with a full-screen overlay. Footer: "← Home", © year + name, "Next: <page> →".

### 6.1 Home (`/`) — only the hero, no scrolling sections
- Top bar: logo left, `UZ | EN` right. No regular nav — navigation is the orbit.
- Left column: round portrait (120px, amber ring + glow), mono line "PhD · Theoretical
  Physics / Samarkand, Uzbekistan", H1 name on two lines, position, institution, one-line
  research statement, research chips (Black holes · Anisotropic matter fields ·
  Gravitational lensing · QPOs · Cosmology), buttons **Download CV** and **View publications**.
- Right column: **orbital navigation**. A black hole with an accretion disk in the center;
  a dashed orbit circle (radius 43% of the box) with six pill links placed at angles
  −90°, −30°, 30°, 90°, 150°, 210°: About (top), Research, Publications, Projects (bottom),
  Teaching, Contact. Each pill: mono number (01–06) + label. Hover: amber border, slight glow.
- **Live black hole (WebGL)**: a fragment shader rendering a Schwarzschild-like lensed thin
  accretion disk (photon ring, Doppler-brightened approaching side, slow rotation; gentle
  camera tilt following the pointer). Requirements: lazy-load after first paint; DPR capped
  at 1.5; ~30 fps cap on phones; pause when off-screen or tab hidden; with
  `prefers-reduced-motion` render one static frame; with no WebGL, show the CSS version from
  the mockup. The pills sit on top (HTML, not canvas) so they stay accessible.
- Phones (< 768px): portrait + text first, then the orbit becomes a vertical list of the
  six links (keep the numbers), with a small static black hole above it.
- Footer strip: © + ORCID · Scholar · arXiv · GitHub.

### 6.2 About (`/about`)
Large portrait + bio (2–3 paragraphs) + Download CV. "Academic path" vertical timeline
(2026– Assistant; Nov 2026 PhD defense with council and supervisor; [MSc]; [BSc]).
Two cards: Scientific interests / Beyond research. Achievements grid (real ones: PhD
defended 2026; BlackPy v0.2 released; plus placeholder cards). All from content files.

### 6.3 Research (`/research`)
Intro paragraph; five numbered themes (01–05) as rows: title, 1–2 sentence description,
"Related papers →" (filters Publications by a theme tag). "Methods & tools" chips.
Then cards linking to:
- **Interactive tools** (`/research/tools`) — see §7.
- **Talks & Conferences** (`/research/talks`) — list by year: title, event, city, date,
  links to slides/poster/video. Content collection `talks`.
- **Notes** (`/notes`) — a small blog for research notes and teaching notes, MDX with
  KaTeX, per-language. Also linked in the footer.

### 6.4 Publications (`/publications`)
- Single source of truth: `src/data/publications.bib`. Parse at build time with a maintained
  BibTeX parser. I only edit this file (or use the admin panel) to add papers.
- Custom BibTeX fields I will use: `pubtype = {journal|preprint|thesis|textbook}`,
  `status = {under-revision|submitted|accepted|published}`, `themes = {shadows, qpo, ...}`,
  `pdf = {files/...}` (only arXiv/preprint/own PDFs — never publisher PDFs).
- Filter pills: All / Published / Under review / Thesis / Textbooks, with counts; filter
  state in the URL (`?type=thesis`, `?theme=qpo`) so links are shareable.
- Each item: year, type label, status badge, title, authors (my name bold), journal
  (italic), and buttons DOI · arXiv · PDF · BibTeX (copy-to-clipboard + download).
  "Download all (BibTeX)" and links to Google Scholar/ORCID at the top.
- Sorted newest first; group headings by year.

### 6.5 Projects (`/projects`)
BlackPy featured card (description, roadmap with ✓, tags, GitHub + Docs buttons, terminal
block). "More projects" grid from a `projects` collection (name, description, language,
license, repo, status, featured flag). Card "All repositories on GitHub" →
`https://github.com/YovkochevPakhlavon`. Optionally show GitHub stars fetched at build time
(must not fail the build if the API is unreachable).

### 6.6 Teaching (`/teaching`, `/teaching/<course-slug>`)
- List of course cards (level, language badges, title in EN + original Uzbek title).
- Course page: breadcrumb, badges, title, then tabs: **Overview · Lectures · Textbooks ·
  Video lessons · Assignments** (tabs are real links/anchors, work without JS).
  - Lectures: number, title, buttons PDF / Slides / Video.
  - Textbooks: cover image, title, authors, publisher/year, PDF download.
  - Video lessons: YouTube via a lightweight facade (thumbnail + play, loads the iframe
    only on click; `youtube-nocookie.com`).
  - Assignments: title, due date, file.
- All of it driven by one YAML/MD file per course so adding a lecture = adding 3 lines.

### 6.7 Contact (`/contact`)
Email card (address from config, lightly obfuscated against scrapers), academic profile
cards (ORCID, Google Scholar, arXiv, ResearchGate, Scopus, GitHub — each hidden if the
config value is empty), affiliation block, and a contact form that posts to a static form
service configured by ONE env/config value (e.g. Formspree endpoint); if not configured,
the form is replaced by a "Write me an email" button (mailto).

### 6.8 Other
- 404 page in the same style ("Lost beyond the event horizon" + link Home), both languages.
- `/cv` → redirect to `/files/cv.pdf` (and `/uz/cv`).

## 7. Interactive tools (`/research/tools`)

Two calculators, written in TypeScript in `src/physics/` as pure functions with unit tests
(Vitest). Units: G = c = 1 internally; show physical units in the UI.

1. **Shadow calculator** — choose a metric with f(r): Schwarzschild, Reissner–Nordström,
   and one "custom f(r)" slot whose formula lives in `src/physics/metrics.ts` so I can add
   my anisotropic-fluid and dark-matter-halo metrics later. Sliders for parameters → photon
   sphere radius r_ph (solve 2f(r) = r f'(r) numerically) and shadow radius
   R_sh = r_ph / sqrt(f(r_ph)), drawn as a circle against the Schwarzschild one, with a
   band showing the EHT M87* and Sgr A* constraints. Take the EHT numbers from the EHT
   Collaboration papers, cite them on the page, and keep them in one data file — do not
   type them from memory.
2. **QPO explorer** — for the same metrics and mass M: Keplerian ν_φ, radial ν_r and
   vertical ν_θ epicyclic frequencies vs r (Hz, M in solar masses), with the observed QPO
   pairs of a few X-ray binaries overlaid (values and references in a data file, from the
   literature, cited on the page).
- Add a test that checks Schwarzschild values (r_ph = 3M, R_sh = 3√3 M, ISCO = 6M).
- Add a note "Formulas follow BlackPy" and a `scripts/compare-blackpy.md` explaining how I
  can export reference values from BlackPy to compare. (A later option: run BlackPy itself
  in the browser with Pyodide — do not do this now.)

## 8. Easy editing (most important)

1. **Content in plain files**, one obvious place each:
   ```
   src/data/profile.yaml          names, position, links, email, form endpoint
   src/data/publications.bib      all papers
   src/content/about/{en,uz}.md   bio, timeline, interests, achievements (front-matter lists)
   src/content/research/{en,uz}/  one file per theme
   src/content/projects/          one file per project
   src/content/courses/<slug>/    course.yaml + {en,uz}.md
   src/content/talks/             one file per talk
   src/content/notes/{en,uz}/     notes / blog posts (MDX)
   public/files/                  cv.pdf, lecture PDFs, textbook PDFs
   public/images/                 portrait.jpg, covers
   ```
2. **Browser admin panel at `/admin`** that works on GitHub Pages (no server of my own):
   check the current options and pick the one that needs the least setup for a static site
   on GitHub Pages (candidates: Sveltia CMS with GitHub sign-in, Pages CMS, Decap CMS).
   Configure collections for: profile, about, research themes, projects, courses (with
   lectures/videos/assignments lists), talks, notes, and file uploads to `public/files`.
   Publications: allow editing `publications.bib` as a text file in the panel. Explain the
   one-time login setup in `EDITING.md`.
3. **`EDITING.md` written in Uzbek (new alphabet)**, step by step with examples:
   yangi maqola qöşiş, maʼruza qöşiş, video qöşiş, suratni almaştiriş, CV yangilaş,
   yangilik/eslatma yoziş, admin panelga kiriş, matnni yangi alifboga öğiriş (converter),
   saytni lokal işga tuşiriş (`npm run dev`), domen ulaş.
4. Images: put the original in `src/assets/` and let Astro optimize (AVIF/WebP, sizes).
5. Every content schema has helpful error messages. `npm run check` validates content.

## 9. Hosting, deployment, domain

- GitHub Actions workflow deploys to GitHub Pages on every push to `main`
  (official Astro deploy action). Build must pass before deploy.
- `site` URL is set in ONE place (`src/config/site.ts`, read by `astro.config.mjs`);
  `base` is `/`. All internal links use Astro helpers, never hard-coded hostnames.
- `DOMAIN.md` (Uzbek): how to move to my own domain later — change `site`, add
  `public/CNAME`, DNS records (A/AAAA for apex, CNAME for www), enable HTTPS in Pages
  settings. Nothing else in the code should need to change.

## 10. SEO, metadata, performance

- Per-page title/description in both languages; Open Graph + Twitter cards with a
  generated OG image (name + title on the dark background with the ring).
- JSON-LD `Person` (name, jobTitle, affiliation, sameAs: ORCID, Scholar, GitHub…) on Home
  and About; `ScholarlyArticle` for publications where DOI exists.
- `sitemap.xml`, `robots.txt`, canonical URLs, `hreflang`.
- Analytics: off by default; one config switch for a privacy-friendly option.
- Targets: Lighthouse ≥ 95 in all categories on mobile for every page except Home;
  Home ≥ 90 performance with the WebGL hero. No layout shift from fonts or images.

## 11. Repository extras

- `README.md` (English): what this is, how to run, how to deploy.
- `CLAUDE.md`: short conventions for future Claude Code sessions (stack, where content
  lives, Uzbek orthography rules from §3, design tokens, "never invent facts").
- `TODO-CONTENT.md`: checklist of every placeholder I still have to fill.
- License: code MIT; content © Pakhlavon Yovkochev (state this in the footer and README).

## 12. Phases

1. **Scaffold** — Astro project, design tokens, fonts (with Uzbek glyph check), base
   layout, header/footer, i18n routing + dictionaries, 404, deploy workflow, CLAUDE.md.
2. **Pages with content** — all pages from §6 with real facts and placeholders; Home with
   the CSS black hole and orbital nav; phone layouts.
3. **Publications from BibTeX** — parser, filters, BibTeX export.
4. **Teaching** — courses, tabs, video facade.
5. **Admin panel + EDITING.md + converter script.**
6. **WebGL black hole** on Home (with all fallbacks).
7. **Interactive tools** + tests.
8. **Notes, Talks, SEO, OG images, final accessibility & Lighthouse pass, DOMAIN.md.**

At the end of every phase: `npm run build` passes, list what I should look at in
`npm run dev`, commit with a clear message. Ask me before pushing.
