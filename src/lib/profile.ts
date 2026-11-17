/**
 * Loads src/data/profile.yaml and checks it. A mistake in the file stops the build
 * with a message that says which field is wrong.
 */
import { parse } from 'yaml';
import { z } from 'zod';
import raw from '../data/profile.yaml?raw';

const FILE = 'src/data/profile.yaml';

const text = (field: string) =>
  z
    .string({ error: `"${field}" must be text` })
    .trim()
    .min(1, `"${field}" cannot be empty`);

const bilingual = (field: string) =>
  z.object(
    { en: text(`${field}.en`), uz: text(`${field}.uz`) },
    { error: `"${field}" needs an "en:" and a "uz:" line` },
  );

const isUrl = (s: string) => {
  try {
    return ['https:', 'http:'].includes(new URL(s).protocol);
  } catch {
    return false;
  }
};
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/**
 * Optional text: a missing value (the admin panel leaves empty fields out of the file)
 * or '' means "not set"; anything else must pass the check.
 */
const optional = (field: string, check: (s: string) => boolean, expected: string) =>
  z.preprocess(
    (v) => (v === undefined || v === null ? '' : v),
    z
      .string({ error: `"${field}" must be ${expected} or empty` })
      .trim()
      .refine((v) => v === '' || check(v), {
        error: `"${field}" must be ${expected} or empty`,
      }),
  );
const optionalUrl = (field: string) =>
  optional(`links.${field}`, isUrl, 'a full URL starting with https://');

const ProfileSchema = z.object({
  name: bilingual('name'),
  shortName: bilingual('shortName'),
  position: bilingual('position'),
  department: bilingual('department'),
  institution: bilingual('institution'),
  location: bilingual('location'),
  degree: bilingual('degree'),
  bibtexNames: z
    .array(text('bibtexNames item'))
    .min(1, '"bibtexNames" needs at least one family name, e.g. Yovkochev'),
  /** File name (or path) of the portrait inside src/assets/; '' = placeholder. */
  portrait: z
    .string()
    .trim()
    .default('')
    .transform((p) => p.split('/').pop() ?? ''),
  /** CV PDF inside public/, e.g. files/cv.pdf (a leading "/" is removed). */
  cv: z
    .string()
    .trim()
    .default('files/cv.pdf')
    .transform((p) => p.replace(/^\/+/, '').replace(/^public\//, '')),
  email: optional('email', isEmail, 'an email address like name@example.com'),
  links: z.preprocess(
    (v) => v ?? {},
    z.object({
      orcid: optionalUrl('orcid'),
      scholar: optionalUrl('scholar'),
      arxiv: optionalUrl('arxiv'),
      researchgate: optionalUrl('researchgate'),
      scopus: optionalUrl('scopus'),
      github: optionalUrl('github'),
    }),
  ),
  formEndpoint: optional('formEndpoint', isUrl, 'a full URL starting with https://'),
});

export type Profile = z.infer<typeof ProfileSchema>;

function load(): Profile {
  let data: unknown;
  try {
    data = parse(raw);
  } catch (err) {
    throw new Error(`${FILE} is not valid YAML: ${(err as Error).message}`);
  }
  const result = ProfileSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`${FILE} has a problem:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const profile: Profile = load();
