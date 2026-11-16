/** /publications/bib/<key>.bib — one entry, website fields removed. */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublications } from '../../../lib/publications';

export const getStaticPaths = (async () => {
  const pubs = await getPublications();
  return pubs.map((p) => ({ params: { key: p.key }, props: { bibtex: p.bibtex } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(props.bibtex as string, {
    headers: { 'Content-Type': 'application/x-bibtex; charset=utf-8' },
  });
