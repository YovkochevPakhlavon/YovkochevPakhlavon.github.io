/**
 * Live WebGL2 black hole for the Home page (physics in shaders.ts, rendering in engine.ts).
 *
 * - Loaded lazily by Home.astro after the page has loaded and the browser is idle.
 * - Renders in a Web Worker on an OffscreenCanvas when the browser supports it, so the
 *   page's main thread is never blocked; otherwise on the main thread.
 * - Device pixel ratio capped at 1.5; ~30 fps on touch devices, 60 fps otherwise.
 * - Pauses when the canvas is off-screen or the tab is hidden.
 * - prefers-reduced-motion: renders one still frame (redrawn only on resize).
 * - Lowers its resolution automatically if frames take too long.
 * - No WebGL2, software-only WebGL, a shader error or a lost context → onFail, and the
 *   CSS black hole underneath simply stays visible.
 */
import { createEngine, type EngineState } from './engine';

interface Options {
  /** Called after the first frame is on screen. */
  onReady: () => void;
  /** Called if WebGL is unavailable or the context is lost. */
  onFail: () => void;
}

const MAX_DPR = 1.5;

export function mountBlackHole(
  canvas: HTMLCanvasElement,
  { onReady, onFail }: Options,
): () => void {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  let visible = true;
  let destroyed = false;

  const state = (): EngineState => ({
    cssW: canvas.clientWidth,
    cssH: canvas.clientHeight,
    dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR),
    running: visible && !document.hidden,
    reduced: reduced.matches,
    fps: coarse.matches ? 30 : 60,
    target,
  });
  const target = { x: 0, y: 0 };

  // ------------------------------------------------------------ engine: worker or main
  let send: (s: Partial<EngineState>) => void;
  let stopEngine: () => void;
  const failed = () => {
    if (destroyed) return;
    destroy();
    onFail();
  };

  if ('transferControlToOffscreen' in canvas && typeof Worker === 'function') {
    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<{ type: 'ready' | 'fail'; reason?: string }>) => {
      if (e.data.type === 'ready') onReady();
      else {
        console.info('[black hole] CSS fallback:', e.data.reason);
        failed();
      }
    };
    worker.onerror = () => failed();
    worker.postMessage({ type: 'init', canvas: offscreen, state: state() }, [offscreen]);
    send = (s) => worker.postMessage({ type: 'state', state: s });
    stopEngine = () => worker.terminate();
  } else {
    const engine = createEngine(
      canvas,
      {
        ready: onReady,
        fail: (reason) => {
          console.info('[black hole] CSS fallback:', reason);
          failed();
        },
      },
      requestAnimationFrame.bind(window),
      cancelAnimationFrame.bind(window),
    );
    engine.update(state());
    send = (s) => engine.update(s);
    stopEngine = () => engine.destroy();
  }

  // ------------------------------------------------------------ page state → engine
  let pending = 0;
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
    target.x = Math.max(-1, Math.min(1, dx)) * 0.12; // ≈ ±7° yaw
    target.y = Math.max(-1, Math.min(1, dy)) * 0.07; // ≈ ±4° inclination
    // At most one message per frame.
    pending ||= requestAnimationFrame(() => {
      pending = 0;
      send({ target: { ...target } });
    });
  };
  const sync = () => send(state());
  const onVisibility = () => sync();
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    sync();
  });
  const ro = new ResizeObserver(() => sync());

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(pending);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    reduced.removeEventListener('change', sync);
    coarse.removeEventListener('change', sync);
    stopEngine();
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', sync);
  coarse.addEventListener('change', sync);
  io.observe(canvas);
  ro.observe(canvas);
  return destroy;
}
