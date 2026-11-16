/** /publications/all.bib — every entry of publications.bib, website fields removed. */
import type { APIRoute } from 'astro';
import { allBibtex } from '../../lib/publications';

export const GET: APIRoute = async () =>
  new Response(await allBibtex(), {
    headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
  });
