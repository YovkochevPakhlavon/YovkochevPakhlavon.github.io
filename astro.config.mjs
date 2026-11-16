// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/config/site.ts';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE_URL,
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  // Astro 7 defaults to 'jsx', which removes spaces between inline elements.
  // Keep normal HTML whitespace so text edited in content files renders as written.
  compressHTML: true,
  i18n: {
    locales: ['en', 'uz'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
