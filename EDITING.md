# Saytni tahrirlaş qöllanmasi

Bu qöllanma saytdagi matn, maqola, maʼruza, video va fayllarni **kod yozmasdan** yangilaşni
tuşuntiradi. Har bir vazifa ikki usulda körsatilgan:

- **A. Admin panel orqali** — brauzerda, `https://yovkochevpakhlavon.github.io/admin/` sahifasida.
- **B. Fayl orqali** — kompyuterda faylni tahrirlab, keyin GitHubga yuborib.

Har qanday özgarişdan keyin sayt **taxminan 2 daqiqada** özi qayta quriladi va yangilanadi.

> Muhim: barça özbekça matnlar **yangi lotin alifbosida** yoziladi:
> **Ö ö, Ğ ğ, Ş ş, Ç ç**; "ng" — oddiy **n + g**; tutuq belgisi — **ʼ** (maʼno, sanʼat).
> Eski alifbodagi matnni avtomatik öğiriş uçun 8-bölimga qarang.

---

## Mundarija

1. [Admin panelga kiriş (bir marta sozlaş)](#1-admin-panelga-kiriş)
2. [Yangi maqola qöşiş](#2-yangi-maqola-qöşiş)
3. [Maʼruza qöşiş](#3-maʼruza-qöşiş)
4. [Video qöşiş](#4-video-qöşiş)
5. [Suratni almaştiriş](#5-suratni-almaştiriş)
6. [CV yangilaş](#6-cv-yangilaş)
7. [Yangilik yoki eslatma yoziş](#7-yangilik-yoki-eslatma-yoziş)
8. [Matnni yangi alifboga öğiriş](#8-matnni-yangi-alifboga-öğiriş)
9. [Saytni lokal işga tuşiriş](#9-saytni-lokal-işga-tuşiriş)
10. [Domen ulaş](#10-domen-ulaş)
11. [Agar sayt yangilanmasa (xatolar)](#11-agar-sayt-yangilanmasa)
12. [Qaysi fayl nima uçun](#12-qaysi-fayl-nima-uçun)

---

## 1. Admin panelga kiriş

Admin panel — **Sveltia CMS**. U alohida server talab qilmaydi: siz GitHub **tokeni**
(maxfiy kalit) bilan kirasiz. Tokenni bir marta yaratasiz, keyin brauzer uni eslab qoladi.

> Admin panel sayt GitHubga yuklangandan va GitHub Pages yoqilgandan keyin işlaydi
> (README.md, "Deploy" bölimi).

### 1.1. Token yaratiş (bir marta)

1. GitHubga kiring: <https://github.com>.
2. Öng yuqoridagi rasmingiz → **Settings** → eng pastda **Developer settings** →
   **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
3. Töldiring:
   - **Token name:** `Sayt admin paneli`
   - **Expiration:** masalan, 1 yil (muddat tugaganda yangisini yaratasiz).
   - **Repository access:** **Only select repositories** → `YovkochevPakhlavon.github.io`.
   - **Permissions → Repository permissions → Contents:** **Read and write**.
4. **Generate token** tugmasini bosing va tokenni nusxalang (u faqat bir marta körinadi).

### 1.2. Kiriş

1. `https://yovkochevpakhlavon.github.io/admin/` sahifasini oçing.
2. **Sign In Using Access Token** tugmasini bosing, tokenni qöying.
3. Çap tomonda bölimlar körinadi: **Profile**, **Publications**, **Pages**,
   **Research themes**, **Projects**, **Courses**, **Talks & conferences**, **Notes**.

Özbekça va inglizça matnlar yonma-yon körsatiladi: tepada **English** va **Uzbek** tugmalari bor.

**Saqlaş:** öng yuqoridagi **Save** tugmasi. Har bir saqlaş GitHubga yoziladi va sayt
2 daqiqadan keyin yangilanadi.

> Xavfsizlik: tokenni heç kimga bermang. Agar u begona qölga tuşgan bölsa, GitHubda
> (Fine-grained tokens röyxatida) uni öçiring va yangisini yarating. Boşqa kompyuterda
> kiriş uçun tokenni qayta qöyasiz.

---

## 2. Yangi maqola qöşiş

Barça naşrlar bitta faylda: `src/data/publications.bib` (BibTeX formati).

### A. Admin panel orqali

1. **Publications** → **publications.bib** ni oçing.
2. Faylning oxiriga maqolaning BibTeX yozuvini qöying (uni Google Scholar, arXiv yoki
   jurnal saytidan nusxalaş mumkin: "Cite → BibTeX").
3. Sayt uçun qöşimça maydonlarni qöşing (pastdagi namunaga qarang) va **Save**.

### B. Fayl orqali

`src/data/publications.bib` faylini oçing va oxiriga qöşing.

### Namuna

```bibtex
@article{yovkochev2027shadows,
  author   = {Yovkochev, Pakhlavon and Abdujabbarov, Ahmadjon},
  title    = {Shadows of Black Holes in Anisotropic Fluids},
  journal  = {Physical Review D},
  volume   = {115},
  pages    = {044012},
  year     = {2027},
  doi      = {10.1103/PhysRevD.115.044012},
  eprint   = {2701.01234},
  archiveprefix = {arXiv},
  pubtype  = {journal},
  status   = {published},
  themes   = {shadows, anisotropic},
}
```

Sayt uçun maydonlar (yuklab olinadigan BibTeX'dan avtomatik olib taşlanadi):

| Maydon       | Qiymatlar                                                      | Maʼnosi                                                           |
| ------------ | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `pubtype`    | `journal`, `preprint`, `thesis`, `textbook`                    | Turi (majburiy)                                                   |
| `status`     | `under-revision`, `submitted`, `accepted`, `published`         | Holati                                                            |
| `themes`     | `anisotropic`, `shadows`, `qpo`, `thermodynamics`, `cosmology` | Tadqiqot mavzulari ("Tegişli maqolalar" havolasi uçun)            |
| `pdf`        | `files/maqola.pdf`                                             | Öz PDF faylingiz (faqat preprint/öz nusxangiz, naşriyot PDF emas) |
| `titleuz`    | matn                                                           | Özbekça sarlavha (özbekça sahifada körsatiladi)                   |
| `supervisor` | `Familiya, Ism`                                                | Dissertatsiya uçun ilmiy rahbar                                   |

- Yilni bilmasangiz: `year = {[year]}`. Hammualliflarni bilmasangiz: `{[co-authors]}`.
- Sizning familiyangiz avtomatik **qalin** körsatiladi.
- Xato bölsa (masalan, `pubtype = {article}`), sayt yangilanmaydi va xabarda qaysi
  yozuv va qaysi maydon xato ekani yoziladi (11-bölim).

---

## 3. Maʼruza qöşiş

Har bir kursning barça maʼlumotlari bitta faylda:
`src/content/courses/<kurs-nomi>/course.yaml`.

### A. Admin panel orqali

1. **Courses** → kursni tanlang.
2. **Lectures** bölimida **Add Lecture** tugmasini bosing.
3. **Title** — maʼruza nomi; **PDF** va **Slides** — faylni yuklang; **YouTube link** — ixtiyoriy.
4. **Save**.

### B. Fayl orqali

PDF faylni `public/files/courses/` papkasiga qöying va `course.yaml` dagi
`lectures:` röyxatiga 3 qator qöşing:

```yaml
lectures:
  - title: Ilmiy tadqiqot nima?
    pdf: files/courses/lecture-01.pdf
    slides: files/courses/lecture-01-slides.pdf
```

Ikki tilda nom beriş uçun: `title: { en: What is research?, uz: Ilmiy tadqiqot nima? }`.

**Darslik** (`textbooks`) va **topşiriq** (`assignments`) xuddi şunday qöşiladi —
`course.yaml` faylining oxirida tayyor namunalar bor. Darslik muqovasi (rasm)
`course.yaml` bilan bir papkaga qöyiladi.

> Agar fayl nomida xato bölsa yoki fayl yuklanmagan bölsa, sayt yangilanmaydi va xabarda
> aniq qaysi qator xato ekani körsatiladi — saytda "buzilgan havola" paydo bölmaydi.

---

## 4. Video qöşiş

Videolar YouTube'ga yuklanadi, saytga esa faqat havola qöşiladi. Saytda avval faqat rasm
va "play" tugmasi körinadi; video faqat bosilganda yuklanadi (sahifa tez oçiladi).

### A. Admin panel orqali

**Courses** → kurs → **Video lessons** → **Add Video** → **Title** va **YouTube link** → **Save**.

### B. Fayl orqali

```yaml
videos:
  - title: Kirish
    youtube: https://youtu.be/VIDEO_ID
    duration: '12:30'
```

Istalgan YouTube havolasi işlaydi: `youtu.be/…`, `youtube.com/watch?v=…`, `/shorts/…`
yoki faqat 11 belgili video ID.

---

## 5. Suratni almaştiriş

### A. Admin panel orqali

**Profile** → **Profile — names, links, photo, CV** → **Portrait photo** → yangi rasmni
yuklang → **Save**. Kamida 700 piksel kenglikdagi JPG yoki PNG tavsiya etiladi. Sayt
rasmning kiçik va tez yuklanadigan nusxalarini özi tayyorlaydi.

### B. Fayl orqali

1. Rasmni `src/assets/` papkasiga qöying, masalan `src/assets/portrait.jpg`.
2. `src/data/profile.yaml` faylida: `portrait: portrait.jpg`.

---

## 6. CV yangilaş

### A. Admin panel orqali

**Profile** → **CV (PDF)** → yangi PDF faylni yuklang → **Save**. Barça "CV yuklab oliş"
tugmalari va `…/cv` havolasi avtomatik yangi faylga körsatadi.

### B. Fayl orqali

Yangi faylni `public/files/cv.pdf` nomi bilan almaştiring (yoki boşqa nom bilan qöyib,
`src/data/profile.yaml` dagi `cv:` qatorini özgartiring).

---

## 7. Yangilik yoki eslatma yoziş

"Qaydlar" (Notes) — ilmiy va öquv eslatmalari uçun kiçik blog. Ular saytda keyingi
bosqiçda (8-bosqiç) körinadi; hozirdan yozib qöyiş mumkin.

### A. Admin panel orqali

**Notes** → **New Note** → **Title**, **Date**, matn (**Text**). Özbekça va inglizça
variantlarni **Uzbek** / **English** tugmalari bilan almaştirib yozasiz. Agar özbekça variant
yozilmasa, saytda inglizçasi "(inglizça)" belgisi bilan körsatiladi. **Draft** belgilansa,
eslatma saytda körinmaydi. **Save**.

### B. Fayl orqali

`src/content/notes/uz/mening-eslatmam.md` (va inglizçasi `src/content/notes/en/…`):

```markdown
---
title: Qora öra soyasi qanday ölçanadi
date: 2026-12-01
tags: [soya, EHT]
---

Matn shu yerda. Formula: $R_{sh} = 3\sqrt{3}\,M$.
```

**Çiqişlar va konferensiyalar** (**Talks & conferences**) ham xuddi şunday qöşiladi:
sarlavha, tadbir, şahar, sana, slaydlar/poster PDF va video havolasi.

---

## 8. Matnni yangi alifboga öğiriş

Eski alifbodagi matnni (`oʻ`, `gʻ`, `sh`, `ch`) yangi alifboga (ö, ğ, ş, ç) öğiruvçi dastur bor.
U avval **özgarişlarni körsatadi**, keyin rozilik söraydi — heç narsa sizdan sörovsiz
yozilmaydi.

```bash
npm run uz -- src/content/about/uz.md
```

Butun papka uçun:

```bash
npm run uz -- src/content
```

Faqat köriş uçun (heç narsa yozmaydi):

```bash
npm run uz -- --dry-run src/content
```

Dastur nimalarni özgartirmaydi:

- inglizça söz va ismlar (`Schwarzschild`, `research`, `Yovkochev` …),
- havolalar (URL), e-poçta, DOI, fayl yöllari, kod (`…`),
- YAML va BibTeX kalitlari; `.yaml` fayllarda faqat `uz:` qiymatlari, `.bib` faylda
  faqat `titleuz` kabi maydonlar özgartiriladi;
- inglizça fayllar (`en.md`, `en/` papkasi) umuman tegilmaydi.

Agar dastur biror inglizça sözni notöğri özgartirsa, uni
`scripts/uz-new-alphabet-ignore.txt` fayliga qöşing.

---

## 9. Saytni lokal işga tuşiriş

Kompyuteringizda saytni internetga çiqarmasdan köriş uçun.

1. **Node.js 26 (LTS)** örnating: <https://nodejs.org> (macOS'da: `brew install node`).
2. Terminalda sayt papkasiga kiring va bir marta:

   ```bash
   npm install
   ```

3. Saytni işga tuşiring:

   ```bash
   npm run dev
   ```

4. Brauzerda oçing: <http://localhost:4321>. Fayllarni özgartirsangiz, sahifa özi yangilanadi.
5. Töxtatiş: terminalda `Ctrl + C`.

Foydali buyruqlar:

| Buyruq                 | Nima qiladi                          |
| ---------------------- | ------------------------------------ |
| `npm run check`        | Barça fayllarni xatoga tekşiradi     |
| `npm run build`        | Saytni tayyorlaydi (`dist/` papkasi) |
| `npm run uz -- <fayl>` | Matnni yangi alifboga öğiradi        |

**Admin panel lokal rejimda:** `npm run dev` işlab turganda
<http://localhost:4321/admin/index.html> ni **Chrome** yoki **Edge** brauzerida oçing va
**Work with Local Repository** → sayt papkasini tanlang. Bu rejimda token kerak emas,
özgarişlar töğridan-töğri kompyuteringizdagi fayllarga yoziladi
(keyin ularni `git` bilan GitHubga yuborasiz).

---

## 10. Domen ulaş

Hozir sayt `https://yovkochevpakhlavon.github.io/` manzilida. Öz domeningizga
(masalan, `yovkochev.uz`) ötkaziş qisqaça:

1. `src/config/site.ts` faylida `SITE_URL` ni yangi manzilga özgartiring.
2. `public/CNAME` faylini yarating, içiga faqat domen: `yovkochev.uz`.
3. Domen sotuvçisining DNS sozlamalarida GitHub Pages yozuvlarini qöşing
   (asosiy domen uçun A/AAAA, `www` uçun CNAME).
4. GitHubda: repozitoriy → **Settings → Pages** → **Custom domain** va **Enforce HTTPS**.

Batafsil, qadam-baqadam qöllanma `DOMAIN.md` faylida böladi (keyingi bosqiçda qöşiladi).

---

## 11. Agar sayt yangilanmasa

Har bir özgarişdan keyin GitHub saytni tekşiradi va quradi. Agar biror maydonda xato bölsa,
sayt **eski holatida qoladi** (buzilmaydi) va GitHub sizga e-poçta yuboradi.

1. GitHubda repozitoriyni oçing → **Actions** yorliği → qizil ❌ belgili oxirgi işga tuşiriş.
2. Xabarda fayl va maydon yozilgan böladi, masalan:

   ```
   src/data/publications.bib: entry "yovkochev2027shadows": pubtype must be one of
   journal, preprint, thesis, textbook (found "article")
   ```

3. Şu faylni tuzating (admin panelda yoki faylda) — sayt avtomatik qayta quriladi.

Köp uçraydigan xatolar:

| Xabar                            | Sabab                                 |
| -------------------------------- | ------------------------------------- |
| `file not found: public/files/…` | Fayl yuklanmagan yoki nomida xato bor |
| `is not a YouTube link`          | Video havolasi YouTube emas           |
| `must be a date like 2026-12-01` | Sana notöğri yozilgan                 |
| `is not a research theme tag`    | `themes` da nomaʼlum mavzu            |

---

## 12. Qaysi fayl nima uçun

| Nima                                          | Qayerda                                     |
| --------------------------------------------- | ------------------------------------------- |
| Ism, lavozim, havolalar, e-poçta, surat, CV   | `src/data/profile.yaml`                     |
| Barça maqolalar                               | `src/data/publications.bib`                 |
| "Men haqimda" sahifasi                        | `src/content/about/uz.md`, `en.md`          |
| Sahifalar kirişi (Boş sahifa, Tadqiqotlar, …) | `src/content/pages/<sahifa>/uz.md`, `en.md` |
| Tadqiqot mavzulari                            | `src/content/research/uz/`, `en/`           |
| Loyihalar                                     | `src/content/projects/<nom>.yaml`           |
| Kurslar (maʼruza, darslik, video, topşiriq)   | `src/content/courses/<kurs>/course.yaml`    |
| Çiqişlar va konferensiyalar                   | `src/content/talks/`                        |
| Qaydlar (eslatmalar)                          | `src/content/notes/uz/`, `en/`              |
| PDF va boşqa fayllar                          | `public/files/`                             |
| Saytdagi tugma va menyu yozuvlari             | `src/i18n/uz.ts`, `en.ts`                   |
| Hali töldirilmagan joylar röyxati             | `TODO-CONTENT.md`                           |
