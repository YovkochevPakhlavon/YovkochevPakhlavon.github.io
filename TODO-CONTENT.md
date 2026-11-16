# TODO-CONTENT — things only you can fill in

Every placeholder on the site is listed here. Tick an item when it is done.
Claude adds new items in each phase; nothing here is ever guessed.

## Profile — `src/data/profile.yaml`

- [ ] `email` — professional email address
- [ ] `links.orcid` — ORCID profile URL
- [ ] `links.scholar` — Google Scholar profile URL
- [ ] `links.arxiv` — arXiv author page URL
- [ ] `links.researchgate` — ResearchGate profile URL
- [ ] `links.scopus` — Scopus author page URL
- [ ] `formEndpoint` — contact form endpoint (e.g. Formspree); empty = mailto button

## Files

- [ ] Portrait photo (will go in `src/assets/`)
- [ ] CV PDF → `public/files/cv.pdf`

## Uzbek UI strings written by Claude — please check (`src/i18n/uz.ts`, marked `// REVIEW`)

| Key                   | Uzbek                                                                  | English                                            |
| --------------------- | ---------------------------------------------------------------------- | -------------------------------------------------- |
| `nav.label`           | Asosiy menyu                                                           | Main (navigation label for screen readers)         |
| `nav.sections`        | Bölimlar                                                               | Sections                                           |
| `nav.menu`            | Menyu                                                                  | Menu                                               |
| `nav.close`           | Menyuni yopiş                                                          | Close menu                                         |
| `lang.label`          | Til                                                                    | Language                                           |
| `lang.en` / `lang.uz` | Inglizça / Özbekça                                                     | English / Uzbek                                    |
| `a11y.skip`           | Asosiy mazmunga öting                                                  | Skip to content                                    |
| `footer.license`      | Kod: MIT litsenziyasi · Kontent ©                                      | Code: MIT licence · Content ©                      |
| `fallback.english`    | (inglizça)                                                             | (English) — shown when a page has no Uzbek version |
| `page.wip`            | Bu sahifa tayyorlanmoqda. Mazmun keyingi bosqiçda qöşiladi.            | Temporary text for Phase 1                         |
| `site.description`    | anizotrop modda maydonlari bilan öralgan qora öralar, … nazariy fizik. | Site description for search engines                |
| `notFound.title`      | Voqealar gorizonti ortida adaşib qoldingiz                             | Lost beyond the event horizon                      |
| `notFound.text`       | Bu sahifa mavjud emas yoki boşqa joyga köçirilgan.                     | This page does not exist or has moved.             |
| `notFound.home`       | Bosh sahifaga qaytiş                                                   | Back to Home                                       |

Question: for "event horizon" do you prefer _voqealar gorizonti_ or _hodisalar gorizonti_?

## Coming in Phase 2 (from SITE_SPEC and the mockups)

These will appear on the pages as visible placeholders:

- [ ] About: one or two sentences about yourself (background, what drew you to physics)
- [ ] About: MSc — university and year
- [ ] About: BSc — university and year
- [ ] About: "Beyond research" interests
- [ ] About: other achievements (awards, grants, fellowships) with years
- [ ] Papers: co-authors of "Quasi-periodic oscillations of anisotropic black holes"
- [ ] Papers: co-authors and journal of "Constraining Dark Matter Halo Effects on Rotating Black Hole Shadows with EHT Observations"
- [ ] Projects: BlackPy repository and documentation URLs
- [ ] Projects: other projects (name, description, language, licence, repository)
- [ ] Teaching: course description, semester, hours, syllabus PDF
- [ ] Teaching: "Teaching approach" text
