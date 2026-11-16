# Saytni öz domeningizga ötkaziş

Hozir sayt `https://yovkochevpakhlavon.github.io/` manzilida işlaydi. Bu qöllanma uni öz
domeningizga (masalan, `yovkochev.uz` yoki `www.yovkochev.uz`) ötkazişni tuşuntiradi.
Kodda faqat **bitta qator** özgaradi; qolgani — domen va GitHub sozlamalari.

> Manba: GitHub Pages hujjatlari — "Managing a custom domain for your GitHub Pages site"
> (<https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>).

---

## 0. Kerakli narsalar

- Sotib olingan domen (masalan, `.uz` domeni — uz-registratorlardan biri orqali).
- Domenning **DNS sozlamalari** sahifasiga kiriş (registrator saytida).
- GitHub repozitoriysiga kiriş huquqi (Settings).

Qaysi variantni tanlaysiz?

- **Asosiy domen** (`yovkochev.uz`) — qisqaroq; bunda `www.yovkochev.uz` ham ulanadi.
- **Faqat subdomen** (`www.yovkochev.uz`) — DNSda bitta yozuv yetarli.

Quyida ikkalasi ham körsatilgan.

---

## 1. Domenni GitHubda tasdiqlaş (tavsiya etiladi)

GitHub domenni avval tasdiqlaşni tavsiya qiladi — bu boşqa odam domeningizni öz saytiga
ulab olişining oldini oladi.

1. GitHub → öng yuqoridagi rasmingiz → **Settings** → **Pages**.
2. **Add a domain** → domenni yozing (`yovkochev.uz`) → **Add domain**.
3. GitHub körsatgan **TXT** yozuvni DNS sozlamalariga qöşing (nomi `_github-pages-challenge-YovkochevPakhlavon` kabi böladi).
4. Biroz kutib, GitHubda **Verify** tugmasini bosing.

---

## 2. DNS yozuvlarini qöşiş

Registrator saytida domeningizning **DNS** bölimini oçing va quyidagilarni qöşing.

### Asosiy domen (`yovkochev.uz`) uçun

Törtta **A** yozuv (nomi: `@` yoki böş):

| Turi | Nomi | Qiymati         |
| ---- | ---- | --------------- |
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |

IPv6 uçun törtta **AAAA** yozuv (ixtiyoriy, lekin tavsiya etiladi):

| Turi | Nomi | Qiymati             |
| ---- | ---- | ------------------- |
| AAAA | @    | 2606:50c0:8000::153 |
| AAAA | @    | 2606:50c0:8001::153 |
| AAAA | @    | 2606:50c0:8002::153 |
| AAAA | @    | 2606:50c0:8003::153 |

### `www` subdomeni uçun

| Turi  | Nomi | Qiymati                      |
| ----- | ---- | ---------------------------- |
| CNAME | www  | yovkochevpakhlavon.github.io |

> Eski A/AAAA/CNAME yozuvlari (masalan, registratorning "parking" sahifasi) bölsa, ularni
> öçiring. DNS özgarişlari 1 soatdan 24 soatgaça vaqt olişi mumkin.

---

## 3. GitHubda domenni ulaş

1. Repozitoriy → **Settings** → **Pages**.
2. **Custom domain** maydoniga domenni yozing (`yovkochev.uz` yoki `www.yovkochev.uz`) → **Save**.
3. GitHub DNSni tekşiradi ("DNS check successful" yozuvi çiqişi kerak).
4. **Enforce HTTPS** ni belgilang. Bu imkoniyat paydo bölişi uçun 24 soatgaça vaqt ketişi mumkin.

> Bizning sayt GitHub Actions orqali çiqariladi. Bunda `CNAME` fayli **kerak emas** —
> domen faqat şu Settings → Pages sahifasida saqlanadi. (Xohlasangiz `public/CNAME`
> fayliga domenni yozib qöyişingiz mumkin, lekin GitHub uni hisobga olmaydi.)

---

## 4. Saytdagi manzilni özgartiriş (bitta qator)

`src/config/site.ts` faylini oçing va `SITE_URL` ni yangi manzilga özgartiring:

```ts
export const SITE_URL = 'https://yovkochev.uz';
```

Bu qiymat avtomatik işlatiladi: kanonik havolalar, `hreflang`, `sitemap.xml`,
`robots.txt`, ijtimoiy tarmoq kartalari (Open Graph rasmlari), JSON-LD.
Saytdagi barça içki havolalar nisbiy (`/about/`, `/uz/...`), ularni özgartiriş kerak emas.

Agar admin paneldan foydalansangiz, `public/admin/config.yml` dagi `site_url` va
`display_url` qatorlarini ham yangilang (bu faqat paneldagi "saytni köriş" havolasi uçun).

Özgarişni saqlang va GitHubga yuboring (yoki admin panel orqali tahrirlang) — sayt
2 daqiqada qayta quriladi.

---

## 5. Tekşiriş

- `https://yovkochev.uz/` oçilyaptimi va qulf belgisi (HTTPS) bormi?
- `https://yovkochevpakhlavon.github.io/` endi yangi domenga yönaltiradimi? (GitHub buni özi qiladi.)
- `https://yovkochev.uz/sitemap-index.xml` da yangi manzillar turibdimi?
- Google Search Console'da yangi domenni qöşing va sitemapni yuboring (ixtiyoriy).

---

## Agar biror narsa işlamasa

| Muammo                              | Yeçim                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| "DNS check unsuccessful"            | DNS yozuvlari hali tarqalmagan — bir neça soat kuting; yozuvlarni qayta tekşiring   |
| "Enforce HTTPS" faol emas           | Sertifikat tayyorlanmoqda — 24 soatgaça kuting                                      |
| Sayt oçiladi, lekin dizayn buzilgan | `SITE_URL` özgartirilmagan yoki sayt qayta qurilmagan — Actions yorliğini tekşiring |
| Eski manzil Googleʼda çiqyapti      | Vaqt bilan yangilanadi; Search Console'da yangi sitemapni yuboring                  |
