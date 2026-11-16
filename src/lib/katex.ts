/**
 * KaTeX stylesheet URL. Pages link it only when they contain math, so other pages
 * never download it. Vite processes the CSS (fonts are emitted and rewritten).
 */
import katexCss from 'katex/dist/katex.min.css?url';

export const KATEX_CSS = katexCss;

/** True if Markdown text contains $…$ or $$…$$ math. */
export const hasMath = (body: string | undefined) =>
  !!body && /\$\$[\s\S]+?\$\$|\$[^\s$][^$\n]*\$/.test(body);
