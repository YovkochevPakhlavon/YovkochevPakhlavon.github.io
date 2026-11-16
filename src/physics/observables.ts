/**
 * Observables of static, spherically symmetric black holes, f(r) metrics.
 * Units: G = c = M = 1 (radii in M, frequencies in 1/M) unless a function says otherwise.
 * Formulas follow BlackPy (see scripts/compare-blackpy.md for a cross-check).
 *
 *   photon sphere      2 f(r) = r f'(r)                       (outermost root)
 *   shadow radius      R_sh = r_ph / √f(r_ph)                  (observer at infinity)
 *   Keplerian          Ω_φ² = f'(r) / (2r)
 *   vertical           Ω_θ = Ω_φ                               (spherical symmetry)
 *   radial epicyclic   Ω_r² = ¼ (2f − r f') [f'' + L² (f''/r² − 4f'/r³ + 6f/r⁴)],
 *                      L² = r³ f' / (2f − r f')               (coordinate-time frequencies)
 *   ISCO               outermost r with Ω_r² = 0
 * Schwarzschild check: r_h = 2, r_ph = 3, R_sh = 3√3, Ω_r² = Ω_φ² (1 − 6/r), ISCO = 6.
 */
import type { Metric, Params } from './metrics';

// ---------------------------------------------------------------- constants (SI)
/** Nominal solar mass parameter GM☉ (IAU 2015 Resolution B3), m³ s⁻². */
export const GM_SUN = 1.3271244e20;
/** Speed of light, m s⁻¹. */
export const C = 299_792_458;
/** GM☉/c³ in seconds (time unit for M = 1 M☉). */
export const T_SUN = GM_SUN / C ** 3;
/** GM☉/c² in kilometres (length unit for M = 1 M☉). */
export const L_SUN_KM = GM_SUN / C ** 2 / 1000;

// ---------------------------------------------------------------- derivatives
function d1(m: Metric, r: number, p: Params): number {
  if (m.df) return m.df(r, p);
  const h = 1e-5 * Math.max(1, r);
  return (m.f(r + h, p) - m.f(r - h, p)) / (2 * h);
}

function d2(m: Metric, r: number, p: Params): number {
  if (m.d2f) return m.d2f(r, p);
  const h = 1e-4 * Math.max(1, r);
  return (m.f(r + h, p) - 2 * m.f(r, p) + m.f(r - h, p)) / (h * h);
}

/**
 * Outermost root of g on (lo, hi): scans inward from hi until g changes sign,
 * then bisects. Returns null if there is no root.
 */
function outermostRoot(
  g: (r: number) => number,
  lo: number,
  hi: number,
  step = 0.002,
): number | null {
  let b = hi;
  let gb = g(b);
  for (let a = hi - step; a > lo; a -= step) {
    const ga = g(a);
    if (!Number.isFinite(ga)) break;
    if (Math.sign(ga) !== Math.sign(gb) && ga !== 0) {
      let x0 = a;
      let x1 = b;
      let g0 = ga;
      for (let i = 0; i < 80; i++) {
        const mid = (x0 + x1) / 2;
        const gm = g(mid);
        if (Math.sign(gm) === Math.sign(g0)) {
          x0 = mid;
          g0 = gm;
        } else x1 = mid;
      }
      return (x0 + x1) / 2;
    }
    if (ga === 0) return a;
    b = a;
    gb = ga;
  }
  return null;
}

// ---------------------------------------------------------------- observables
/** Event horizon: outermost root of f(r) = 0, or null (no horizon). */
export function horizon(m: Metric, p: Params = {}): number | null {
  return outermostRoot((r) => m.f(r, p), 0.01, 60);
}

/** Photon-sphere radius: outermost root of 2f − r f' outside the horizon. */
export function photonSphere(m: Metric, p: Params = {}): number | null {
  const rh = horizon(m, p) ?? 0.01;
  return outermostRoot((r) => 2 * m.f(r, p) - r * d1(m, r, p), rh, 60);
}

/** Shadow radius seen from infinity, R_sh = r_ph / √f(r_ph). */
export function shadowRadius(m: Metric, p: Params = {}): number | null {
  const rph = photonSphere(m, p);
  if (rph === null) return null;
  const f = m.f(rph, p);
  return f > 0 ? rph / Math.sqrt(f) : null;
}

/** Keplerian (= vertical epicyclic) angular frequency squared, Ω_φ² = f'/(2r). */
export function omegaPhi2(m: Metric, r: number, p: Params = {}): number {
  return d1(m, r, p) / (2 * r);
}

/** Radial epicyclic angular frequency squared (coordinate time). */
export function omegaR2(m: Metric, r: number, p: Params = {}): number {
  const f = m.f(r, p);
  const fp = d1(m, r, p);
  const fpp = d2(m, r, p);
  const denom = 2 * f - r * fp;
  if (denom <= 0) return Number.NaN; // inside the photon sphere: no circular orbits
  const L2 = (r ** 3 * fp) / denom;
  return 0.25 * denom * (fpp + L2 * (fpp / r ** 2 - (4 * fp) / r ** 3 + (6 * f) / r ** 4));
}

/** Innermost stable circular orbit: outermost root of Ω_r² = 0. */
export function isco(m: Metric, p: Params = {}): number | null {
  const rph = photonSphere(m, p) ?? horizon(m, p) ?? 0.5;
  return outermostRoot((r) => omegaR2(m, r, p), rph * 1.0001, 100, 0.005);
}

/** Converts an angular frequency Ω in units of 1/M to a frequency in Hz for mass M (M☉). */
export function toHz(omega: number, massSun: number): number {
  return omega / (2 * Math.PI * T_SUN * massSun);
}

export interface Frequencies {
  r: number;
  /** Orbital (= vertical) frequency, Hz. */
  nuPhi: number;
  /** Radial epicyclic frequency, Hz (NaN inside the ISCO). */
  nuR: number;
}

/** ν_φ = ν_θ and ν_r in Hz at radius r (units of M) for mass M in M☉. */
export function frequencies(m: Metric, r: number, massSun: number, p: Params = {}): Frequencies {
  const op2 = omegaPhi2(m, r, p);
  const or2 = omegaR2(m, r, p);
  return {
    r,
    nuPhi: op2 > 0 ? toHz(Math.sqrt(op2), massSun) : Number.NaN,
    // Tiny negative values at the ISCO are rounding noise: treat them as 0.
    nuR: or2 > -1e-12 ? toHz(Math.sqrt(Math.max(or2, 0)), massSun) : Number.NaN,
  };
}

/** Radius where ν_φ : ν_r = 3 : 2 (outside the ISCO), or null. */
export function resonanceRadius(m: Metric, p: Params = {}, ratio = 1.5): number | null {
  const ri = isco(m, p);
  if (ri === null) return null;
  return outermostRoot(
    (r) => Math.sqrt(omegaPhi2(m, r, p)) - ratio * Math.sqrt(Math.max(omegaR2(m, r, p), 0)),
    ri * 1.0001,
    100,
    0.005,
  );
}

/** Everything the calculators show, in one call. */
export function summary(m: Metric, p: Params = {}) {
  const rh = horizon(m, p);
  const rph = photonSphere(m, p);
  const rsh = shadowRadius(m, p);
  const ri = isco(m, p);
  return { horizon: rh, photonSphere: rph, shadow: rsh, isco: ri };
}
