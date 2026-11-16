/**
 * Content collections: every editable text on the site lives in src/content/.
 * A typo or a missing field stops the build with a message naming the file and field.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Text that may contain a visible placeholder like "[MSc university]". */
const text = (what: string) =>
  z.string({ error: `${what} must be text (put it in quotes if it starts with [ )` }).trim();

const bilingual = (what: string) =>
  z.object(
    { en: text(`${what}.en`), uz: text(`${what}.uz`) },
    { error: `${what} needs an "en:" and a "uz:" line` },
  );

/** A full URL, or '' when not known yet. */
const urlOrEmpty = (what: string) =>
  z
    .union([z.literal(''), z.url({ error: `${what} must be a full URL (https://…) or ''` })])
    .default('');

/** A file in public/, written without "public/", e.g. "files/syllabus.pdf"; or ''. */
const publicFile = (what: string) =>
  z
    .string()
    .trim()
    .regex(/^(|[^/].*)$/, `${what}: write the path without a leading "/", e.g. files/name.pdf`)
    .default('');

/** Like publicFile, but the file must already exist in public/ (catches typos). */
const existingFile = (what: string) =>
  publicFile(what).superRefine((path, ctx) => {
    if (path && !existsSync(join(process.cwd(), 'public', path))) {
      ctx.addIssue({
        code: 'custom',
        message: `${what}: file not found: public/${path} (upload it to public/files/ or fix the path)`,
      });
    }
  });

/** Either one text for both languages, or { en, uz }. Always becomes { en, uz }. */
const localText = (what: string) =>
  z
    .union([text(what), bilingual(what)], {
      error: `${what} must be text, or have "en:" and "uz:" lines`,
    })
    .transform((v) => (typeof v === 'string' ? { en: v, uz: v } : v));

/** A YouTube video ID or any YouTube link; stored as the 11-character video ID. */
const youtube = (what: string) =>
  z.string().transform((value, ctx) => {
    const v = value.trim();
    const m =
      v.match(/^[\w-]{11}$/) ??
      v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    const id = m?.[1] ?? m?.[0];
    if (!id) {
      ctx.addIssue({
        code: 'custom',
        message: `${what}: "${v}" is not a YouTube link or video ID (e.g. https://youtu.be/abcdefghijk)`,
      });
      return z.NEVER;
    }
    return id;
  });

// ---------- About: src/content/about/{en,uz}.md ----------
const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '{en,uz}.md' }),
  schema: z.object({
    title: text('title'),
    description: text('description'),
    timeline: z
      .array(
        z.object({
          when: text('timeline.when'),
          title: text('timeline.title'),
          place: text('timeline.place').default(''),
        }),
      )
      .min(1, 'timeline needs at least one item'),
    interests: z.array(text('interests item')),
    beyond: z.array(text('beyond item')),
    achievements: z.array(
      z.object({
        year: text('achievements.year'),
        title: text('achievements.title'),
        text: text('achievements.text').default(''),
      }),
    ),
  }),
});

// ---------- Page intros: src/content/pages/<page>/{en,uz}.md ----------
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '*/{en,uz}.md' }),
  schema: z.object({
    title: text('title'),
    description: text('description'),
    /** Home only */
    statement: text('statement').optional(),
    chips: z.array(text('chips item')).optional(),
    /** Research only */
    methods: z.array(text('methods item')).optional(),
    cards: z
      .array(
        z.object({
          route: text('cards.route'),
          label: text('cards.label'),
          title: text('cards.title'),
          text: text('cards.text'),
        }),
      )
      .optional(),
    /** Teaching only */
    approach: text('approach').optional(),
  }),
});

// ---------- Research themes: src/content/research/{en,uz}/NN-name.md ----------
const research = defineCollection({
  loader: glob({ base: './src/content/research', pattern: '{en,uz}/*.md' }),
  schema: z.object({
    order: z.number({ error: 'order must be a number (1, 2, 3…)' }).int(),
    title: text('title'),
    /** Theme tag used in publications.bib (`themes = {...}`) for "Related papers". */
    tag: z.string().regex(/^[a-z0-9-]+$/, 'tag must be lowercase letters, digits or "-", e.g. qpo'),
  }),
});

// ---------- Projects: src/content/projects/<name>.yaml ----------
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.yaml' }),
  schema: z.object({
    name: text('name'),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),
    language: text('language').default(''),
    license: text('license').default(''),
    status: bilingual('status').optional(),
    description: bilingual('description'),
    repo: urlOrEmpty('repo'),
    docs: urlOrEmpty('docs'),
    tags: z.array(text('tags item')).default([]),
    roadmap: z
      .array(
        z.object({
          version: text('roadmap.version'),
          state: z.enum(['done', 'in-progress', 'planned'], {
            error: 'roadmap.state must be done, in-progress or planned',
          }),
          text: bilingual('roadmap.text'),
        }),
      )
      .default([]),
    /** Lines shown in the terminal block of a featured project. */
    terminal: z.array(z.string()).default([]),
  }),
});

// ---------- Courses: src/content/courses/<slug>/course.yaml + {en,uz}.md ----------
const courses = defineCollection({
  loader: glob({
    base: './src/content/courses',
    pattern: '*/course.yaml',
    generateId: ({ entry }) => entry.split('/')[0]!,
  }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int().default(100),
      title: bilingual('title'),
      level: bilingual('level'),
      /** Language the course is taught in. */
      language: z.enum(['uz', 'en']),
      semester: bilingual('semester'),
      hours: text('hours'),
      syllabus: existingFile('syllabus'),
      lectures: z
        .array(
          z.object({
            title: localText('lectures → title'),
            pdf: existingFile('lectures → pdf'),
            slides: existingFile('lectures → slides'),
            video: youtube('lectures → video').optional(),
          }),
        )
        .default([]),
      textbooks: z
        .array(
          z.object({
            title: text('textbooks → title'),
            authors: text('textbooks → authors').default(''),
            publisher: text('textbooks → publisher').default(''),
            year: z.union([z.number().int(), text('textbooks → year')]).optional(),
            kind: localText('textbooks → kind').optional(),
            /** Image next to course.yaml, e.g. ./covers/book.jpg */
            cover: image().optional(),
            pdf: existingFile('textbooks → pdf'),
            url: urlOrEmpty('textbooks → url'),
          }),
        )
        .default([]),
      videos: z
        .array(
          z.object({
            title: localText('videos → title'),
            youtube: youtube('videos → youtube'),
            duration: text('videos → duration').default(''),
          }),
        )
        .default([]),
      assignments: z
        .array(
          z.object({
            title: localText('assignments → title'),
            due: z.coerce
              .date({ error: 'assignments → due must be a date like 2026-12-01' })
              .optional(),
            file: existingFile('assignments → file'),
            text: localText('assignments → text').optional(),
          }),
        )
        .default([]),
    }),
});

const courseText = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '*/{en,uz}.md' }),
  schema: z.object({}),
});

export const collections = { about, pages, research, projects, courses, courseText };
