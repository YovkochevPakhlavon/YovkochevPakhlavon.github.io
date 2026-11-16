# TODO-CONTENT — things only you can fill in

Every placeholder on the site is listed here. Tick an item when it is done.
Claude adds new items in each phase; nothing here is ever guessed.
On the site, placeholders look like `[this]` and are shown in grey or with a dashed border.

## Questions for you

- [ ] **BlackPy install command.** The mockup's terminal shows `pip install blackpy`. Is BlackPy
      published on PyPI under that name? Until confirmed the terminal shows `$ [install command]`
      (`src/content/projects/blackpy.yaml`, `terminal:`).

## Profile — `src/data/profile.yaml`

- [ ] `email` — professional email address
- [ ] `links.orcid` — ORCID profile URL
- [ ] `links.scholar` — Google Scholar profile URL
- [ ] `links.arxiv` — arXiv author page URL
- [ ] `links.researchgate` — ResearchGate profile URL
- [ ] `links.scopus` — Scopus author page URL
- [ ] `formEndpoint` — contact form endpoint (e.g. Formspree); empty = "Write me an email" button

## Files

- [ ] Portrait photo — admin panel: Profile → Portrait photo (or put it in `src/assets/` and set `portrait:`)
- [ ] CV PDF — admin panel: Profile → CV (or `public/files/cv.pdf`); until then the CV buttons show `[cv.pdf]`
- [ ] One-time: create the GitHub token for the admin panel (EDITING.md, section 1)

## About — `src/content/about/en.md` and `uz.md`

- [ ] One or two sentences about yourself (last paragraph of the bio)
- [ ] MSc — field, university and year (timeline)
- [ ] BSc — field, university and year (timeline)
- [ ] "Beyond research" — two more interests
- [ ] Achievements — year BlackPy v0.2 was released (the mockup said 2026; not confirmed)
- [ ] Achievements — awards, grants or fellowships (with years)

## Publications — `src/data/publications.bib`

- [ ] "Quasi-periodic oscillations of anisotropic black holes" (Annals of Physics, under revision):
      full author list **in the correct order** (currently `Yovkochev, Pakhlavon and {[co-authors]}`) and year
- [ ] "Constraining Dark Matter Halo Effects on Rotating Black Hole Shadows with EHT Observations" (submitted):
      full author list in order, journal and year
- [ ] arXiv IDs (`eprint = {…}` + `archiveprefix = {arXiv}`) and DOIs, once they exist
- [ ] Thesis: check `school` — written as "Scientific Council, Institute of Fundamental and Applied Research (TIIAME)"
- [ ] Check the theme tags Claude assigned from the titles: QPO paper → `qpo, anisotropic`;
      EHT paper → `shadows, cosmology`; thesis → `anisotropic`
- [ ] Other papers, preprints and textbooks (paste their BibTeX into `src/data/publications.bib`)
- [ ] Optional: thesis abstract PDF (`pdf = {files/…}`) — the mockup showed an "Abstract PDF" button

## Projects — `src/content/projects/`

- [ ] BlackPy `repo` and `docs` URLs (`blackpy.yaml`)
- [ ] BlackPy install command (see question above)
- [ ] Other projects — one `.yaml` file each (name, description, language, licence, repository)

## Teaching — `src/content/courses/fundamentals-of-scientific-research/` and `src/content/pages/teaching/`

- [ ] Course description (`description:` in `course.yaml`)
- [ ] Semester and hours (`course.yaml`)
- [ ] Syllabus PDF → `public/files/…`, then set `syllabus:` in `course.yaml`
- [ ] Lectures, textbooks, video lessons and assignments — add them at the bottom of `course.yaml`
      (commented examples there; files go in `public/files/`, covers next to `course.yaml`)
- [ ] Other courses (one folder each), or remove the "[Another course]" card
- [ ] "Teaching approach" text (`approach:` in `pages/teaching/en.md` and `uz.md`)

## Interactive tools — `/research/tools`

- [ ] Your own metrics (anisotropic fluid, dark-matter halo): fill the `custom` slot in
      `src/physics/metrics.ts` and set `visible: true` (instructions at the top of the file)
- [ ] Check the EHT bands in `src/data/eht-constraints.json` (M87*: Kocherlakota et al. 2021 Eq. 14;
      Sgr A*: Vagnozzi et al. 2023 Eqs. 7–8) — or replace them with the numbers you prefer to cite
- [ ] Check / extend the QPO sources in `src/data/qpo-sources.json` (Remillard & McClintock 2006)
- [ ] Optional: export BlackPy reference values (`scripts/compare-blackpy.md`) and run `npm test`
- [ ] Confirm the note "Formulas follow BlackPy" (it is shown on the page, as the spec asked)

## Notes, talks, launch

- [ ] First notes: copy `src/content/notes/en/example-note.md` (and `uz/`), or Notes → New Note in the admin panel
- [ ] Talks and posters: copy `src/content/talks/example-talk.yaml` (one file per talk), or Talks → New Talk
- [ ] Optional: turn on GoatCounter analytics in `src/config/site.ts`
- [ ] After the first deploy: add the site to Google Search Console and submit `sitemap-index.xml`
- [ ] Later: own domain — DOMAIN.md

## Uzbek text written by Claude — please check

UI strings in `src/i18n/uz.ts` marked `// REVIEW` (menu labels, buttons, headings not in the SITE_SPEC
dictionary), plus all Uzbek page texts translated from English:

- `src/content/about/uz.md` — bio, timeline, interests, achievements
- `src/content/pages/*/uz.md` — page intros, Home statement and chips, Research methods and cards
- `src/content/research/uz/*.md` — theme descriptions (titles are from SITE_SPEC)
- `src/content/projects/blackpy.yaml` — `uz:` description and roadmap
- `EDITING.md` (the whole editing guide) and `DOMAIN.md`
- `src/content/notes/uz/example-note.md` and the notes/talks strings in `src/i18n/uz.ts`
- `src/content/pages/tools/uz.md` and the tools strings in `src/i18n/uz.ts` (`tools.*`, `shadow.*`, `qpo.*`)

Points to check in particular:

| Where              | Uzbek                                                                                 | English                                                                              |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| About timeline     | Fundamental va amaliy tadqiqotlar instituti (TIIAME) huzuridagi ilmiy kengaş, Toşkent | Scientific Council, Institute of Fundamental and Applied Research (TIIAME), Tashkent |
| About timeline     | Magistratura / Bakalavriat                                                            | MSc / BSc                                                                            |
| Home statement     | … rentgen kuzatuvlari maʼlumotlari bilan …                                            | … X-ray timing data                                                                  |
| `research.talks`   | Çiqişlar va konferensiyalar                                                           | Talks & conferences                                                                  |
| `teachLang.uz`     | Özbek tilida                                                                          | Uzbek (course language badge)                                                        |
| `fallback.english` | (inglizça)                                                                            | (English) — shown when a text has no Uzbek version                                   |
| `notFound.title`   | Hodisalar gorizonti ortida adaşib qoldingiz                                           | Lost beyond the event horizon                                                        |

"Event horizon" = _hodisalar gorizonti_ (confirmed).
Dictionary words converted to the new alphabet (confirmed): Boş sahifa, Naşrlar, Naşrlarni köriş.
