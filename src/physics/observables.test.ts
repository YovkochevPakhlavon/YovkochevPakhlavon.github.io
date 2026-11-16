import { describe, expect, it } from 'vitest';
import { reissnerNordstrom, schwarzschild, type Metric } from './metrics';
import {
  frequencies,
  horizon,
  isco,
  L_SUN_KM,
  omegaPhi2,
  omegaR2,
  photonSphere,
  resonanceRadius,
  shadowRadius,
  T_SUN,
} from './observables';

const close = (a: number | null, b: number, digits = 6) => expect(a).toBeCloseTo(b, digits);

describe('Schwarzschild (M = 1)', () => {
  it('horizon r_h = 2M', () => close(horizon(schwarzschild), 2));
  it('photon sphere r_ph = 3M', () => close(photonSphere(schwarzschild), 3));
  it('shadow radius R_sh = 3√3 M', () => close(shadowRadius(schwarzschild), 3 * Math.sqrt(3)));
  it('ISCO = 6M', () => close(isco(schwarzschild), 6, 5));
  it('Ω_φ² = 1/r³ and Ω_r² = Ω_φ² (1 − 6/r)', () => {
    for (const r of [6.5, 8, 12, 30]) {
      close(omegaPhi2(schwarzschild, r), 1 / r ** 3, 10);
      close(omegaR2(schwarzschild, r), (1 - 6 / r) / r ** 3, 10);
    }
  });
  it('3:2 radius ν_φ : ν_r at r = 10.8M', () => close(resonanceRadius(schwarzschild), 10.8, 4));
});

describe('Reissner–Nordström', () => {
  for (const Q of [0.3, 0.5, 0.8]) {
    it(`Q = ${Q}: r_h and r_ph match the closed forms`, () => {
      close(horizon(reissnerNordstrom, { Q }), 1 + Math.sqrt(1 - Q * Q));
      const rph = (3 + Math.sqrt(9 - 8 * Q * Q)) / 2;
      close(photonSphere(reissnerNordstrom, { Q }), rph);
      close(
        shadowRadius(reissnerNordstrom, { Q }),
        rph / Math.sqrt(1 - 2 / rph + (Q * Q) / rph ** 2),
      );
    });
  }
  it('Q = 0 reduces to Schwarzschild', () => {
    close(shadowRadius(reissnerNordstrom, { Q: 0 }), 3 * Math.sqrt(3));
    close(isco(reissnerNordstrom, { Q: 0 }), 6, 5);
  });
  it('extremal Q = 1: r_ph = 2M, R_sh = 4M, ISCO = 4M', () => {
    close(photonSphere(reissnerNordstrom, { Q: 1 }), 2, 4);
    close(shadowRadius(reissnerNordstrom, { Q: 1 }), 4, 3);
    close(isco(reissnerNordstrom, { Q: 1 }), 4, 4);
  });
  it('charge shrinks the shadow', () => {
    expect(shadowRadius(reissnerNordstrom, { Q: 0.5 })!).toBeLessThan(3 * Math.sqrt(3));
  });
});

describe('numerical derivatives (metrics without df/d2f)', () => {
  const plain: Metric = { ...schwarzschild, id: 'plain', df: undefined, d2f: undefined };
  it('give the same results as the analytic ones', () => {
    close(photonSphere(plain), 3, 5);
    close(shadowRadius(plain), 3 * Math.sqrt(3), 5);
    close(isco(plain), 6, 3);
  });
});

describe('physical units', () => {
  it('GM☉/c³ ≈ 4.925 µs and GM☉/c² ≈ 1.4766 km', () => {
    expect(T_SUN).toBeCloseTo(4.92549e-6, 10);
    expect(L_SUN_KM).toBeCloseTo(1.476625, 5);
  });
  it('Keplerian frequency at the ISCO of a 10 M☉ black hole ≈ 219.9 Hz', () => {
    const { nuPhi, nuR } = frequencies(schwarzschild, 6, 10);
    expect(nuPhi).toBeCloseTo(219.86, 1);
    expect(nuR).toBeCloseTo(0, 6);
  });
  it('frequencies scale as 1/M', () => {
    const a = frequencies(schwarzschild, 10, 5).nuPhi;
    const b = frequencies(schwarzschild, 10, 10).nuPhi;
    expect(a / b).toBeCloseTo(2, 10);
  });
});
