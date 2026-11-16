/**
 * Static, spherically symmetric metrics
 *     ds² = −f(r) dt² + dr²/f(r) + r² dΩ²
 * in units G = c = M = 1 (radii are in units of the black-hole mass M).
 *
 * To add your own metric (e.g. black hole + anisotropic fluid or dark-matter halo):
 *   1. Copy the `custom` entry below, give it an id/name, write f(r) with its parameters.
 *   2. Optional: give df/d2f (derivatives); otherwise they are computed numerically.
 *   3. Set `visible: true`. It then appears in both calculators on /research/tools.
 *   4. Add a test in observables.test.ts (e.g. a known limit) and run `npm test`.
 */

export interface MetricParam {
  key: string;
  label: { en: string; uz: string };
  min: number;
  max: number;
  step: number;
  default: number;
}

export type Params = Record<string, number>;

export interface Metric {
  id: string;
  name: { en: string; uz: string };
  /** Formula shown in the UI (plain text). */
  formula: string;
  params: MetricParam[];
  f: (r: number, p: Params) => number;
  df?: (r: number, p: Params) => number;
  d2f?: (r: number, p: Params) => number;
  /** Shown in the calculators. */
  visible: boolean;
}

export const schwarzschild: Metric = {
  id: 'schwarzschild',
  name: { en: 'Schwarzschild', uz: 'Schwarzschild' },
  formula: 'f(r) = 1 − 2M/r',
  params: [],
  f: (r) => 1 - 2 / r,
  df: (r) => 2 / (r * r),
  d2f: (r) => -4 / (r * r * r),
  visible: true,
};

export const reissnerNordstrom: Metric = {
  id: 'reissner-nordstrom',
  name: { en: 'Reissner–Nordström', uz: 'Reissner–Nordström' },
  formula: 'f(r) = 1 − 2M/r + Q²/r²',
  params: [
    {
      key: 'Q',
      label: { en: 'Charge Q/M', uz: 'Zaryad Q/M' },
      min: 0,
      max: 1,
      step: 0.01,
      default: 0.5,
    },
  ],
  f: (r, { Q = 0 }) => 1 - 2 / r + (Q * Q) / (r * r),
  df: (r, { Q = 0 }) => 2 / (r * r) - (2 * Q * Q) / (r * r * r),
  d2f: (r, { Q = 0 }) => -4 / (r * r * r) + (6 * Q * Q) / (r * r * r * r),
  visible: true,
};

/**
 * Your own metric. Replace f(r) and the parameters, then set visible: true.
 * The placeholder below is Schwarzschild with a dummy parameter, so nothing breaks.
 */
export const custom: Metric = {
  id: 'custom',
  name: { en: '[Custom metric]', uz: '[Öz metrikangiz]' },
  formula: 'f(r) = [your formula]',
  params: [
    {
      key: 'a',
      label: { en: '[parameter a]', uz: '[a parametri]' },
      min: 0,
      max: 1,
      step: 0.01,
      default: 0,
    },
  ],
  f: (r) => 1 - 2 / r,
  visible: false,
};

export const METRICS: Metric[] = [schwarzschild, reissnerNordstrom, custom];
export const VISIBLE_METRICS = METRICS.filter((m) => m.visible);

export function defaultParams(m: Metric): Params {
  return Object.fromEntries(m.params.map((p) => [p.key, p.default]));
}
