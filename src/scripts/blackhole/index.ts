/**
 * Live WebGL2 black hole for the Home page (see shaders.ts for the physics).
 *
 * - Loaded lazily by Home.astro after the page has loaded and the browser is idle.
 * - Device pixel ratio capped at 1.5; ~30 fps on touch devices, 60 fps otherwise.
 * - Pauses when the canvas is off-screen or the tab is hidden.
 * - prefers-reduced-motion: renders one still frame (redrawn only on resize).
 * - Lowers its resolution automatically if frames take too long.
 * - Any failure (no WebGL2, shader error, lost context) calls onFail, and the CSS
 *   black hole underneath simply stays visible.
 */
import { FRAGMENT, VERTEX } from './shaders';

interface Options {
  /** Called after the first frame is on screen. */
  onReady: () => void;
  /** Called if WebGL is unavailable or the context is lost. */
  onFail: () => void;
}

const MAX_DPR = 1.5;
const STILL_TIME = 14; // animation time used for the reduced-motion frame
const QUALITY = [
  { scale: 1.0, steps: 150 },
  { scale: 0.85, steps: 130 },
  { scale: 0.7, steps: 115 },
  { scale: 0.55, steps: 100 },
];

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? 'shader compile error');
  }
  return s;
}

export function mountBlackHole(
  canvas: HTMLCanvasElement,
  { onReady, onFail }: Options,
): () => void {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'default',
  });
  if (!gl) {
    onFail();
    return () => {};
  }

  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'link error');
    }
  } catch (err) {
    console.warn('[black hole] WebGL disabled:', err);
    onFail();
    return () => {};
  }

  // One triangle covering the screen.
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);
  const uRes = gl.getUniformLocation(program, 'uRes');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uTilt = gl.getUniformLocation(program, 'uTilt');
  const uSteps = gl.getUniformLocation(program, 'uSteps');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  const frameInterval = () => (coarse.matches ? 1000 / 30 : 1000 / 60);

  let quality = 0;
  let visible = true;
  let pageVisible = !document.hidden;
  let raf = 0;
  let last = 0;
  let simTime = 0;
  let ready = false;
  let dead = false;
  let slowFrames = 0;
  const tilt = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR) * QUALITY[quality]!.scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl!.viewport(0, 0, w, h);
  }

  function draw(time: number) {
    resize();
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.uniform1f(uTime, time);
    gl!.uniform2f(uTilt, tilt.x, tilt.y);
    gl!.uniform1i(uSteps, QUALITY[quality]!.steps);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    if (!ready) {
      ready = true;
      requestAnimationFrame(() => onReady());
    }
  }

  const running = () => !dead && visible && pageVisible && !reduced.matches;

  function frame(now: number) {
    raf = 0;
    if (!running()) return;
    raf = requestAnimationFrame(frame);
    const elapsed = now - last;
    const interval = frameInterval();
    if (elapsed < interval - 2) return; // frame cap
    // Adaptive quality: many slow frames in a row → lower resolution.
    if (last && elapsed > interval * 1.8) {
      if (++slowFrames > 20 && quality < QUALITY.length - 1) {
        quality++;
        slowFrames = 0;
      }
    } else {
      slowFrames = Math.max(0, slowFrames - 1);
    }
    simTime += Math.min(elapsed, 100) / 1000;
    last = now;
    tilt.x += (target.x - tilt.x) * 0.06;
    tilt.y += (target.y - tilt.y) * 0.06;
    draw(simTime);
  }

  function update() {
    if (dead) return;
    if (reduced.matches) {
      cancelAnimationFrame(raf);
      raf = 0;
      tilt.x = tilt.y = 0;
      draw(STILL_TIME);
      return;
    }
    if (running() && !raf) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = canvas.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
    target.x = Math.max(-1, Math.min(1, dx)) * 0.12; // ≈ ±7° yaw
    target.y = Math.max(-1, Math.min(1, dy)) * 0.07; // ≈ ±4° inclination
  };
  const onVisibility = () => {
    pageVisible = !document.hidden;
    update();
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    update();
  });
  const ro = new ResizeObserver(() => {
    if (reduced.matches) draw(STILL_TIME);
  });
  const onLost = (e: Event) => {
    e.preventDefault();
    destroy();
    onFail();
  };

  function destroy() {
    dead = true;
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    reduced.removeEventListener('change', update);
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  reduced.addEventListener('change', update);
  io.observe(canvas);
  ro.observe(canvas);

  // First frame right away (with reduced motion, update() draws the only still frame).
  if (!reduced.matches) draw(0);
  update();
  return destroy;
}
