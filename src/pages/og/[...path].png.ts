/** Open Graph images: /og/<lang>/<route>.png (see src/lib/og.ts). */
import type { APIRoute, GetStaticPaths } from 'astro';
import { ogEntries, renderOg, type OgEntry } from '../../lib/og';

export const getStaticPaths = (async () => {
  const entries = await ogEntries();
  return entries.map((e) => ({
    params: { path: `${e.lang}/${e.route || 'home'}` },
    props: { entry: e },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOg(props.entry as OgEntry)), {
    headers: { 'Content-Type': 'image/png' },
  });
