// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { SITE_URL } from './src/config/site.ts';

// /cv and /uz/cv redirect to the CV named in src/data/profile.yaml.
const profile = parse(readFileSync(new URL('./src/data/profile.yaml', import.meta.url), 'utf8'));
const cv = `/${String(profile?.cv || 'files/cv.pdf')
  .replace(/^\/+/, '')
  .replace(/^public\//, '')}`;

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE_URL,
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  // Astro 7 defaults to 'jsx', which removes spaces between inline elements.
  // Keep normal HTML whitespace so text edited in content files renders as written.
  compressHTML: true,
  // Page CSS is small (a few kB): inline it so nothing blocks the first paint.
  build: { inlineStylesheets: 'always' },
  redirects: {
    '/cv': cv,
    '/uz/cv': cv,
  },
  // Markdown and MDX: math with $…$ and $$…$$, rendered by KaTeX at build time.
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { output: 'htmlAndMathml', throwOnError: false }]],
    }),
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', uz: 'uz' } },
      filter: (page) => !/\/(cv|404)\/?$/.test(new URL(page).pathname),
    }),
  ],
  i18n: {
    locales: ['en', 'uz'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
