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

const optionalUrl = (field: string) =>
  z.union([
    z.literal(''),
    z.url({ error: `"links.${field}" must be a full URL (https://…) or ''` }),
  ]);

const ProfileSchema = z.object({
  name: bilingual('name'),
  shortName: bilingual('shortName'),
  position: bilingual('position'),
  institution: bilingual('institution'),
  location: bilingual('location'),
  degree: bilingual('degree'),
  email: z.union([z.literal(''), z.email({ error: '"email" must be an email address or \'\'' })]),
  links: z.object({
    orcid: optionalUrl('orcid'),
    scholar: optionalUrl('scholar'),
    arxiv: optionalUrl('arxiv'),
    researchgate: optionalUrl('researchgate'),
    scopus: optionalUrl('scopus'),
    github: optionalUrl('github'),
  }),
  formEndpoint: z.union([
    z.literal(''),
    z.url({ error: '"formEndpoint" must be a full URL (https://…) or \'\'' }),
  ]),
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
