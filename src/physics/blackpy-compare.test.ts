/**
 * Cross-check against BlackPy. Runs only if src/physics/blackpy-reference.json exists
 * (export it from BlackPy as described in scripts/compare-blackpy.md), then: npm test
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { METRICS } from './metrics';
import { frequencies, isco, photonSphere, shadowRadius } from './observables';

interface Case {
  metric: string;
  params?: Record<string, number>;
  r_ph?: number;
  r_sh?: number;
  isco?: number;
  frequencies?: { r: number; nu_phi?: number; nu_r?: number }[];
}
interface Reference {
  mass_sun: number;
  tolerance?: number; // relative, default 1e-4
  cases: Case[];
}

const file = fileURLToPath(new URL('./blackpy-reference.json', import.meta.url));
const ref: Reference | null = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;

describe.skipIf(!ref)('BlackPy reference values', () => {
  const tol = ref?.tolerance ?? 1e-4;
  const near = (got: number | null, want: number, what: string) => {
    expect(got, what).not.toBeNull();
    expect(Math.abs((got! - want) / want), `${what}: site ${got}, BlackPy ${want}`).toBeLessThan(
      tol,
    );
  };
  for (const c of ref?.cases ?? []) {
    const label = `${c.metric} ${JSON.stringify(c.params ?? {})}`;
    it(label, () => {
      const m = METRICS.find((x) => x.id === c.metric);
      expect(m, `unknown metric id "${c.metric}" (see src/physics/metrics.ts)`).toBeDefined();
      const p = c.params ?? {};
      if (c.r_ph !== undefined) near(photonSphere(m!, p), c.r_ph, 'r_ph');
      if (c.r_sh !== undefined) near(shadowRadius(m!, p), c.r_sh, 'R_sh');
      if (c.isco !== undefined) near(isco(m!, p), c.isco, 'ISCO');
      for (const f of c.frequencies ?? []) {
        const got = frequencies(m!, f.r, ref!.mass_sun, p);
        if (f.nu_phi !== undefined) near(got.nuPhi, f.nu_phi, `ν_φ at r = ${f.r}`);
        if (f.nu_r !== undefined) near(got.nuR, f.nu_r, `ν_r at r = ${f.r}`);
      }
    });
  }
});
