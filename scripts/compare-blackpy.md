# Comparing the website tools with BlackPy

The calculators on `/research/tools` use the TypeScript functions in `src/physics/`
(`metrics.ts`, `observables.ts`). To make sure they give the same numbers as BlackPy,
export reference values from BlackPy once and let the test suite compare them.

## 1. Export reference values from BlackPy

Write `src/physics/blackpy-reference.json` with this shape (units: G = c = M = 1 for radii;
frequencies in Hz for the given mass):

```json
{
  "mass_sun": 10,
  "tolerance": 1e-4,
  "cases": [
    {
      "metric": "schwarzschild",
      "r_ph": 3.0,
      "r_sh": 5.196152422706632,
      "isco": 6.0,
      "frequencies": [{ "r": 8, "nu_phi": 0.0, "nu_r": 0.0 }]
    },
    {
      "metric": "reissner-nordstrom",
      "params": { "Q": 0.5 },
      "r_ph": 0.0,
      "r_sh": 0.0,
      "isco": 0.0
    }
  ]
}
```

- `metric` is the `id` of a metric in `src/physics/metrics.ts` (`schwarzschild`,
  `reissner-nordstrom`, or your own).
- `params` uses the same parameter names as in `metrics.ts` (e.g. `Q` in units of M).
- Every value is optional; only the values you give are compared.
- `tolerance` is the allowed relative difference (default `1e-4`).

A Python sketch — replace the `blackpy.…` calls with the actual BlackPy API:

```python
import json
import blackpy  # your package

M_SUN = 10.0
cases = []
for metric_id, params in [("schwarzschild", {}), ("reissner-nordstrom", {"Q": 0.5})]:
    bh = blackpy.Metric(metric_id, **params)          # ← adapt
    case = {
        "metric": metric_id,
        "params": params,
        "r_ph": bh.photon_sphere(),                      # ← adapt
        "r_sh": bh.shadow_radius(),                      # ← adapt
        "isco": bh.isco(),                               # ← adapt
        "frequencies": [
            {"r": r, "nu_phi": bh.nu_phi(r, M_SUN), "nu_r": bh.nu_r(r, M_SUN)}  # ← adapt
            for r in (8.0, 10.0, 15.0)
        ],
    }
    cases.append(case)

with open("src/physics/blackpy-reference.json", "w") as f:
    json.dump({"mass_sun": M_SUN, "tolerance": 1e-4, "cases": cases}, f, indent=2)
```

## 2. Run the comparison

```bash
npm test
```

`src/physics/blackpy-compare.test.ts` runs only when the JSON file exists. A mismatch is
reported with both numbers, e.g. `R_sh: site 4.97, BlackPy 4.98`.

## Conventions used on the site (check that BlackPy matches)

| Quantity          | Definition                                                                    |
| ----------------- | ----------------------------------------------------------------------------- |
| Metric            | ds² = −f(r) dt² + dr²/f(r) + r² dΩ², G = c = M = 1                            |
| Photon sphere     | outermost root of 2f = r f'                                                   |
| Shadow radius     | R_sh = r_ph / √f(r_ph) (observer at infinity)                                 |
| Orbital frequency | Ω_φ² = f'/(2r); ν_θ = ν_φ for spherical symmetry                              |
| Radial epicyclic  | Ω_r² = ¼(2f − r f')[f'' + L²(f''/r² − 4f'/r³ + 6f/r⁴)], L² = r³f'/(2f − r f') |
| ISCO              | outermost root of Ω_r² = 0                                                    |
| Hz                | ν = Ω / (2π · GM/c³), GM☉ = 1.3271244 × 10²⁰ m³ s⁻² (IAU 2015 nominal)        |

Frequencies are measured in coordinate time (by a distant observer), as is usual for QPO
models. If BlackPy uses proper time or a different solar-mass constant, convert first.

## Later: running BlackPy in the browser

The tools could run BlackPy itself in the browser with Pyodide, so the website and the paper
use literally the same code. That is not done yet (Pyodide adds several MB to the page).
