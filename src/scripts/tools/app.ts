/**
 * Interactive tools (browser side). Loaded by Tools.astro when the tools come into view.
 * Shadow calculator: updates SVGs and readouts. QPO explorer: uPlot chart, loaded only
 * when its panel is visible.
 */
import { VISIBLE_METRICS, defaultParams, type Metric, type Params } from '../../physics/metrics';
import { frequencies, isco, resonanceRadius, summary } from '../../physics/observables';
import type uPlotClass from 'uplot';
import {
  fmt,
  rulerSvg,
  shadowSvg,
  verdicts,
  withKm,
  type Constraint,
  type Strings,
} from './render';

interface Source {
  id: string;
  name: string;
  qpos: [number, number];
  mass: [number, number] | null;
}

interface Config {
  lang: 'en' | 'uz';
  t: Strings;
  constraints: Constraint[];
  sources: Source[];
}

type UPlotCtor = typeof uPlotClass;
type UPlotInstance = uPlotClass;

export function init(root: HTMLElement) {
  const cfg: Config = JSON.parse(root.dataset.config ?? '{}');
  const { t, lang } = cfg;
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;

  const metricSel = $<HTMLSelectElement>('[data-metric]');
  const formula = $('[data-formula]');
  const paramsBox = $('[data-params]');
  const massRange = $<HTMLInputElement>('[data-mass-range]');
  const massNum = $<HTMLInputElement>('[data-mass-number]');
  const sourceSel = $<HTMLSelectElement>('[data-source]');
  const sourceInfo = $('[data-source-info]');

  let metric: Metric = VISIBLE_METRICS[0]!;
  let params: Params = defaultParams(metric);
  let mass = Number(massNum.value) || 10;
  let source: Source | null = null;

  // ------------------------------------------------------------ controls
  function renderParams() {
    paramsBox.replaceChildren(
      ...metric.params.map((p) => {
        const id = `p-${metric.id}-${p.key}`;
        const wrap = document.createElement('div');
        wrap.className = 'field';
        wrap.innerHTML = `<label for="${id}">${p.label[lang]} <output data-out="${p.key}">${params[p.key]}</output></label>
          <input id="${id}" type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${params[p.key]}" data-param="${p.key}">`;
        return wrap;
      }),
    );
    formula.textContent = metric.formula;
  }

  paramsBox.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    const key = el.dataset.param;
    if (!key) return;
    params[key] = Number(el.value);
    paramsBox.querySelector(`[data-out="${key}"]`)!.textContent = el.value;
    update();
  });
  metricSel.addEventListener('change', () => {
    metric = VISIBLE_METRICS.find((m) => m.id === metricSel.value) ?? VISIBLE_METRICS[0]!;
    params = defaultParams(metric);
    renderParams();
    update();
  });
  const setMass = (v: number) => {
    mass = Math.min(100, Math.max(1, v));
    massRange.value = String(Math.min(Number(massRange.max), mass));
    massNum.value = String(Math.round(mass * 100) / 100);
  };
  massRange.addEventListener('input', () => {
    setMass(Number(massRange.value));
    update();
  });
  massNum.addEventListener('change', () => {
    setMass(Number(massNum.value) || 10);
    update();
  });
  sourceSel.addEventListener('change', () => {
    source = cfg.sources.find((s) => s.id === sourceSel.value) ?? null;
    if (source?.mass) setMass((source.mass[0] + source.mass[1]) / 2);
    sourceInfo.textContent = source
      ? `${source.qpos[0]} : ${source.qpos[1]} Hz · ${
          source.mass
            ? `${t['qpo.massRange']} ${source.mass[0]}–${source.mass[1]} M☉`
            : t['qpo.noMass']
        }`
      : '';
    update();
  });

  // ------------------------------------------------------------ shadow panel
  const set = (sel: string, text: string) => {
    const el = root.querySelector(sel);
    if (el) el.textContent = text;
  };

  function updateShadow() {
    const s = summary(metric, params);
    $('[data-shadow-svg]').innerHTML = shadowSvg(s.shadow, t);
    $('[data-ruler-svg]').innerHTML = rulerSvg(s.shadow, cfg.constraints, t);
    set(
      '[data-out-horizon]',
      s.horizon === null ? t['shadow.noHorizon']! : withKm(s.horizon, mass),
    );
    set('[data-out-photon]', withKm(s.photonSphere, mass));
    set('[data-out-shadow]', s.shadow === null ? t['shadow.none']! : withKm(s.shadow, mass));
    set('[data-out-isco]', withKm(s.isco, mass));
    set('[data-km-note]', t['shadow.kmNote']!.replace('{m}', fmt(mass, 1)));
    for (const v of verdicts(s.shadow, cfg.constraints, t)) {
      const el = root.querySelector<HTMLElement>(`[data-verdict="${v.id}"]`);
      if (el) {
        el.textContent = v.label;
        el.dataset.ok = String(v.ok);
      }
    }
  }

  // ------------------------------------------------------------ QPO panel
  const chartBox = $('[data-chart]');
  let uPlot: UPlotCtor | null = null;
  let chart: UPlotInstance | null = null;

  function qpoData() {
    const ri = isco(metric, params) ?? 6;
    const rMax = Math.max(20, ri * 3);
    const n = 240;
    const xs: number[] = [];
    const phi: number[] = [];
    const rad: number[] = [];
    const o1: (number | null)[] = [];
    const o2: (number | null)[] = [];
    for (let i = 0; i < n; i++) {
      const r = ri + ((rMax - ri) * i) / (n - 1);
      const f = frequencies(metric, r, mass, params);
      xs.push(r);
      phi.push(f.nuPhi);
      rad.push(Number.isFinite(f.nuR) ? f.nuR : 0);
      o1.push(source ? source.qpos[0] : null);
      o2.push(source ? source.qpos[1] : null);
    }
    return { ri, data: [xs, phi, rad, o1, o2] as [number[], ...(number | null)[][]] };
  }

  function updateQpoText(ri: number) {
    const atIsco = frequencies(metric, ri, mass, params);
    set('[data-out-isco-r]', `r = ${fmt(ri, 2)} M`);
    set('[data-out-isco-nu]', `ν_φ = ${fmt(atIsco.nuPhi, 1)} Hz, ν_r = 0 Hz`);
    const r32 = resonanceRadius(metric, params);
    if (r32 !== null) {
      const f = frequencies(metric, r32, mass, params);
      set('[data-out-res-r]', `r = ${fmt(r32, 2)} M`);
      set('[data-out-res-nu]', `ν_φ = ${fmt(f.nuPhi, 1)} Hz, ν_r = ${fmt(f.nuR, 1)} Hz`);
    } else {
      set('[data-out-res-r]', '—');
      set('[data-out-res-nu]', '—');
    }
    const radii = [ri, 8, 10, 12, 15, 20].filter((r, i) => i === 0 || r > ri + 0.01);
    $('[data-qpo-table]').innerHTML = radii
      .map((r) => {
        const f = frequencies(metric, r, mass, params);
        return `<tr><td>${fmt(r, 2)}</td><td>${fmt(f.nuPhi, 1)}</td><td>${fmt(f.nuR, 1)}</td></tr>`;
      })
      .join('');
  }

  function chartOptions(width: number) {
    const axis = {
      stroke: '#9AA3B2',
      grid: { stroke: '#1E2330', width: 1 },
      ticks: { stroke: '#2A3040', width: 1 },
      font: '12px "JetBrains Mono", ui-monospace, monospace',
    };
    return {
      width,
      height: Math.round(Math.min(340, Math.max(240, width * 0.62))),
      scales: { x: { time: false } },
      axes: [
        { ...axis, label: 'r / M', labelFont: '12px Inter, sans-serif' },
        { ...axis, label: t['qpo.axisNu'], labelFont: '12px Inter, sans-serif', size: 56 },
      ],
      legend: { show: true },
      cursor: { drag: { x: false, y: false } },
      series: [
        {
          label: 'r / M',
          value: (_u: unknown, v: number | null) => (v === null ? '—' : v.toFixed(2)),
        },
        {
          label: t['qpo.phi'],
          stroke: '#F2A541',
          width: 2,
          value: (_u: unknown, v: number | null) => `${fmt(v, 1)} Hz`,
        },
        {
          label: t['qpo.r'],
          stroke: '#A9BBFF',
          width: 2,
          value: (_u: unknown, v: number | null) => `${fmt(v, 1)} Hz`,
        },
        {
          label: `${t['qpo.observed']} 1`,
          stroke: '#C5CAD6',
          width: 1,
          dash: [6, 5],
          value: (_u: unknown, v: number | null) => (v ? `${v} Hz` : '—'),
        },
        {
          label: `${t['qpo.observed']} 2`,
          stroke: '#C5CAD6',
          width: 1,
          dash: [2, 4],
          value: (_u: unknown, v: number | null) => (v ? `${v} Hz` : '—'),
        },
      ],
    };
  }

  function updateQpo() {
    const { ri, data } = qpoData();
    updateQpoText(ri);
    if (!uPlot) return;
    if (!chart) {
      chartBox.replaceChildren();
      chart = new uPlot(chartOptions(chartBox.clientWidth) as never, data as never, chartBox);
      new ResizeObserver(() => {
        const opts = chartOptions(chartBox.clientWidth);
        chart?.setSize({ width: opts.width, height: opts.height });
      }).observe(chartBox);
    } else {
      chart.setData(data as never);
    }
  }

  // uPlot is ~50 kB: load it only when the QPO panel is near the viewport.
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      Promise.all([import('uplot'), import('uplot/dist/uPlot.min.css')]).then(([m]) => {
        uPlot = m.default as UPlotCtor;
        updateQpo();
      });
    },
    { rootMargin: '200px' },
  );
  io.observe(chartBox);

  // ------------------------------------------------------------ go
  function update() {
    updateShadow();
    updateQpo();
  }
  renderParams();
  update();
  root.classList.add('is-ready');
}
