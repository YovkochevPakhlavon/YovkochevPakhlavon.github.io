/**
 * Pure rendering helpers for the interactive tools, used both at build time (first paint,
 * works without JavaScript) and in the browser (updates). No DOM access here.
 */
import { L_SUN_KM } from '../../physics/observables';

export interface Constraint {
  id: string;
  name: string;
  sigma1: [number, number];
  sigma2: [number, number] | null;
}

export type Strings = Record<string, string>;

const SCHW = 3 * Math.sqrt(3);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** "5.196" with a fixed number of decimals, or "—". */
export function fmt(x: number | null | undefined, digits = 3): string {
  return x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(digits);
}

/** Readout line: "5.196 M · 76.73 km". */
export function withKm(x: number | null, massSun: number): string {
  if (x === null || !Number.isFinite(x)) return '—';
  return `${fmt(x)} M · ${fmt(x * massSun * L_SUN_KM, 1)} km`;
}

/** Shadow picture: the selected metric's shadow vs. the Schwarzschild one. */
export function shadowSvg(rsh: number | null, t: Strings): string {
  const size = 320;
  const c = size / 2;
  const scale = 21; // px per M
  const schw = SCHW * scale;
  const r = rsh !== null && Number.isFinite(rsh) ? Math.min(rsh * scale, c - 6) : 0;
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(
    `${t['shadow.radius']}: ${fmt(rsh)} M; ${t['shadow.schw']}`,
  )}">
  <defs>
    <radialGradient id="bh-glow" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="#F2A541" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#F2A541" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${r ? `<circle cx="${c}" cy="${c}" r="${r * 1.35}" fill="url(#bh-glow)"/>` : ''}
  ${r ? `<circle cx="${c}" cy="${c}" r="${r}" fill="#000" stroke="#F2A541" stroke-width="2"/>` : ''}
  <circle cx="${c}" cy="${c}" r="${schw}" fill="none" stroke="#C5CAD6" stroke-width="1.2" stroke-dasharray="5 5"/>
</svg>`;
}

/** Horizontal ruler with the EHT bands, the Schwarzschild value and the current R_sh. */
export function rulerSvg(rsh: number | null, constraints: Constraint[], t: Strings): string {
  const w = 320;
  const lo = 3.8;
  const hi = 6.4;
  const left = 58; // label column
  const x = (v: number) => left + ((v - lo) / (hi - lo)) * (w - left - 12);
  const rowH = 26;
  const top = 8;
  const rows = constraints
    .map((k, i) => {
      const y = top + i * rowH;
      const color = k.id === 'm87' ? '#A9BBFF' : '#F2A541';
      const s2 = k.sigma2
        ? `<rect x="${x(k.sigma2[0])}" y="${y + 6}" width="${x(k.sigma2[1]) - x(k.sigma2[0])}" height="10" rx="5" fill="${color}" fill-opacity="0.22"/>`
        : '';
      return `${s2}<rect x="${x(k.sigma1[0])}" y="${y + 6}" width="${x(k.sigma1[1]) - x(k.sigma1[0])}" height="10" rx="5" fill="${color}" fill-opacity="0.6"/>
      <text x="0" y="${y + 15}" fill="#C5CAD6" font-size="11">${esc(k.name)}</text>`;
    })
    .join('');
  const axisY = top + constraints.length * rowH + 4;
  const ticks = [4, 4.5, 5, 5.5, 6]
    .map(
      (v) =>
        `<line x1="${x(v)}" x2="${x(v)}" y1="${axisY}" y2="${axisY + 4}" stroke="#3A4152"/><text x="${x(v)}" y="${axisY + 15}" text-anchor="middle" fill="#9AA3B2" font-size="10">${v}</text>`,
    )
    .join('');
  const cur =
    rsh !== null && Number.isFinite(rsh) && rsh >= lo && rsh <= hi
      ? `<line x1="${x(rsh)}" x2="${x(rsh)}" y1="${top}" y2="${axisY}" stroke="#FFFFFF" stroke-width="2"/><circle cx="${x(rsh)}" cy="${top}" r="3.5" fill="#FFFFFF"/>`
      : '';
  return `<svg viewBox="0 0 ${w} ${axisY + 22}" role="img" aria-label="${esc(t['shadow.constraints'])}">
  ${rows}
  <line x1="${left}" x2="${w - 12}" y1="${axisY}" y2="${axisY}" stroke="#3A4152"/>
  <text x="0" y="${axisY + 15}" fill="#9AA3B2" font-size="10">R_sh/M</text>
  ${ticks}
  <line x1="${x(SCHW)}" x2="${x(SCHW)}" y1="${top}" y2="${axisY}" stroke="#C5CAD6" stroke-dasharray="3 3"/>
  ${cur}
</svg>`;
}

/** "within 1σ" / "within 2σ" / "outside" for each constraint. */
export function verdicts(rsh: number | null, constraints: Constraint[], t: Strings) {
  return constraints.map((k) => {
    let label = t['shadow.outside']!;
    let ok = false;
    if (rsh !== null && Number.isFinite(rsh)) {
      if (rsh >= k.sigma1[0] && rsh <= k.sigma1[1]) {
        label = t['shadow.within1']!;
        ok = true;
      } else if (k.sigma2 && rsh >= k.sigma2[0] && rsh <= k.sigma2[1]) {
        label = t['shadow.within2']!;
        ok = true;
      }
    }
    return { id: k.id, name: k.name, label, ok };
  });
}
