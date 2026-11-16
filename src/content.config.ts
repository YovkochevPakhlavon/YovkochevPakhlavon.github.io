/**
 * Content collections: every editable text on the site lives in src/content/.
 * A typo or a missing field stops the build with a message naming the file and field.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
  schema: z.object({
    order: z.number().int().default(100),
    title: bilingual('title'),
    level: bilingual('level'),
    /** Language the course is taught in. */
    language: z.enum(['uz', 'en']),
    semester: bilingual('semester'),
    hours: text('hours'),
    syllabus: publicFile('syllabus'),
  }),
});

const courseText = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '*/{en,uz}.md' }),
  schema: z.object({}),
});

export const collections = { about, pages, research, projects, courses, courseText };
