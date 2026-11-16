# yovkochevpakhlavon.github.io

Personal academic website of **Pakhlavon Yovkochev**, Assistant at the Department of
Physics, Samarkand State Pedagogical Institute. English at `/`, Uzbek at `/uz/`.

Built with [Astro](https://astro.build) as a static site and hosted on GitHub Pages at
<https://yovkochevpakhlavon.github.io/>.

## Run locally

Requires Node.js 26 LTS (see `.nvmrc`) and npm.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Local dev server with live reload           |
| `npm run check`   | Type/content check + Uzbek font glyph check |
| `npm run build`   | Build the site into `dist/`                 |
| `npm run preview` | Serve the built `dist/` locally             |
| `npm run format`  | Format all files with Prettier              |

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: it checks and builds the site,
then publishes it to GitHub Pages. One-time setup: in the repository on GitHub, open
**Settings → Pages** and set **Source** to **GitHub Actions**.

The public URL is set in one place, `src/config/site.ts`.

## Editing content

Everyday content lives in plain files (`src/data/profile.yaml` for names and links;
more content folders arrive in later phases). An Uzbek step-by-step guide (`EDITING.md`)
and a browser admin panel at `/admin` will be added in a later phase.

## License

- Code: [MIT](LICENSE).
- Content (texts, photos, CV, papers, lecture materials): © Pakhlavon Yovkochev, all rights reserved.
