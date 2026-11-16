/** Build-time checks for files you upload to public/ (CV, syllabi, PDFs). */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { profile } from './profile';

/** `path` is relative to public/, e.g. "files/cv.pdf". */
export function publicFileExists(path: string): boolean {
  if (!path) return false;
  return existsSync(join(process.cwd(), 'public', path.replace(/^\/+/, '')));
}

/** URL of a file in public/, respecting the site base. */
export function publicUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

/** CV location, from profile.yaml (`cv`). */
export const CV_PATH = profile.cv;
