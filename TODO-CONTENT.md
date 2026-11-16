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

- [ ] Portrait photo → `src/assets/portrait.jpg` (or .png/.webp; used on Home and About)
- [ ] CV PDF → `public/files/cv.pdf` (until then the CV buttons show `[cv.pdf]`)

## About — `src/content/about/en.md` and `uz.md`

- [ ] One or two sentences about yourself (last paragraph of the bio)
- [ ] MSc — field, university and year (timeline)
- [ ] BSc — field, university and year (timeline)
- [ ] "Beyond research" — two more interests
- [ ] Achievements — year BlackPy v0.2 was released (the mockup said 2026; not confirmed)
- [ ] Achievements — awards, grants or fellowships (with years)

## Publications (Phase 3) — `src/data/publications.bib`

- [ ] Co-authors and year of "Quasi-periodic oscillations of anisotropic black holes" (Annals of Physics, under revision)
- [ ] Co-authors, journal and year of "Constraining Dark Matter Halo Effects on Rotating Black Hole Shadows with EHT Observations" (submitted)

## Projects — `src/content/projects/`

- [ ] BlackPy `repo` and `docs` URLs (`blackpy.yaml`)
- [ ] BlackPy install command (see question above)
- [ ] Other projects — one `.yaml` file each (name, description, language, licence, repository)

## Teaching — `src/content/courses/fundamentals-of-scientific-research/` and `src/content/pages/teaching/`

- [ ] Course description (`en.md`, `uz.md`)
- [ ] Semester and hours (`course.yaml`)
- [ ] Syllabus PDF → `public/files/…`, then set `syllabus:` in `course.yaml`
- [ ] Other courses (one folder each), or remove the "[Another course]" card
- [ ] "Teaching approach" text (`approach:` in `pages/teaching/en.md` and `uz.md`)

## Uzbek text written by Claude — please check

UI strings in `src/i18n/uz.ts` marked `// REVIEW` (menu labels, buttons, headings not in the SITE_SPEC
dictionary), plus all Uzbek page texts translated from English:

- `src/content/about/uz.md` — bio, timeline, interests, achievements
- `src/content/pages/*/uz.md` — page intros, Home statement and chips, Research methods and cards
- `src/content/research/uz/*.md` — theme descriptions (titles are from SITE_SPEC)
- `src/content/projects/blackpy.yaml` — `uz:` description and roadmap
- `src/content/courses/*/uz.md`

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
