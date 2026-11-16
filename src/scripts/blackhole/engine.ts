/**
 * WebGL2 render engine for the Home black hole (shaders in shaders.ts).
 * Works on an HTMLCanvasElement (main thread) or an OffscreenCanvas (Web Worker):
 * no DOM APIs here — the page sends size, visibility and pointer state via update().
 */
import { FRAGMENT, VERTEX } from './shaders';

export interface EngineState {
  /** Canvas size in CSS pixels and the device pixel ratio (already capped). */
  cssW: number;
  cssH: number;
  dpr: number;
  /** On screen and tab visible. */
  running: boolean;
  /** prefers-reduced-motion: one still frame. */
  reduced: boolean;
  /** Frame cap: 30 on touch devices, 60 otherwise. */
  fps: number;
  /** Pointer tilt target (radians). */
  target: { x: number; y: number };
}

interface Callbacks {
  ready: () => void;
  fail: (reason: string) => void;
}

type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;
type Raf = (cb: (t: number) => void) => number;

const STILL_TIME = 14; // animation time of the reduced-motion frame
const QUALITY = [
  { scale: 1.0, steps: 150 },
  { scale: 0.85, steps: 130 },
  { scale: 0.7, steps: 115 },
  { scale: 0.55, steps: 100 },
];

/** True for software WebGL (SwiftShader, llvmpipe…): far too slow for this shader. */
function isSoftwareRenderer(gl: WebGL2RenderingContext): boolean {
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(gl.getParameter(dbg ? dbg.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? '');
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

export function createEngine(
  canvas: AnyCanvas,
  cb: Callbacks,
  raf: Raf,
  caf: (id: number) => void,
) {
  const state: EngineState = {
    cssW: 1,
    cssH: 1,
    dpr: 1,
    running: false,
    reduced: false,
    fps: 60,
    target: { x: 0, y: 0 },
  };
  let dead = false;
  let failed = false;
  const fail = (reason: string) => {
    if (failed) return;
    failed = true;
    dead = true;
    caf(frameId);
    cb.fail(reason);
  };

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'default',
    failIfMajorPerformanceCaveat: true,
  }) as WebGL2RenderingContext | null;

  let frameId = 0;
  let draw: ((time: number) => void) | null = null;

  if (!gl) {
    queueMicrotask(() => fail('no WebGL2'));
  } else if (isSoftwareRenderer(gl)) {
    queueMicrotask(() => fail('software WebGL'));
  } else {
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      fail('context lost');
    });
    compile(gl);
  }

  // Compile in the background when KHR_parallel_shader_compile is available.
  function compile(gl: WebGL2RenderingContext) {
    const program = gl.createProgram()!;
    for (const [type, src] of [
      [gl.VERTEX_SHADER, VERTEX],
      [gl.FRAGMENT_SHADER, FRAGMENT],
    ] as const) {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      gl.attachShader(program, sh);
    }
    gl.linkProgram(program);
    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const finish = () => {
      if (dead) return;
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log =
          gl.getProgramInfoLog(program) ||
          gl
            .getAttachedShaders(program)
            ?.map((s) => gl.getShaderInfoLog(s))
            .join('\n');
        fail(`shader: ${log}`);
        return;
      }
      draw = setup(gl, program);
      apply();
    };
    const poll = () => {
      if (dead) return;
      if (gl.getProgramParameter(program, parallel!.COMPLETION_STATUS_KHR)) finish();
      else setTimeout(poll, 30);
    };
    if (parallel) poll();
    else finish();
  }

  // ------------------------------------------------------------ rendering
  let quality = 0;
  let readySent = false;
  const tilt = { x: 0, y: 0 };

  function setup(gl: WebGL2RenderingContext, program: WebGLProgram) {
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

    return (time: number) => {
      const scale = state.dpr * QUALITY[quality]!.scale;
      const w = Math.max(1, Math.round(state.cssW * scale));
      const h = Math.max(1, Math.round(state.cssH * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uTilt, tilt.x, tilt.y);
      gl.uniform1i(uSteps, QUALITY[quality]!.steps);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!readySent) {
        readySent = true;
        raf(() => cb.ready());
      }
    };
  }

  let last = 0;
  let simTime = 0;
  let slowFrames = 0;

  function frame(now: number) {
    frameId = 0;
    if (dead || !draw || !state.running || state.reduced) return;
    frameId = raf(frame);
    const elapsed = now - last;
    const interval = 1000 / state.fps;
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
    tilt.x += (state.target.x - tilt.x) * 0.06;
    tilt.y += (state.target.y - tilt.y) * 0.06;
    draw(simTime);
  }

  /** Starts, stops or redraws according to the current state. */
  function apply() {
    if (dead || !draw) return;
    if (state.reduced) {
      caf(frameId);
      frameId = 0;
      tilt.x = tilt.y = 0;
      draw(STILL_TIME);
      return;
    }
    if (!readySent) draw(0); // first frame right away
    if (state.running && !frameId) {
      last = 0;
      frameId = raf(frame);
    } else if (!state.running && frameId) {
      caf(frameId);
      frameId = 0;
    }
  }

  return {
    update(next: Partial<EngineState>) {
      const resized =
        next.cssW !== undefined && (next.cssW !== state.cssW || next.cssH !== state.cssH);
      Object.assign(state, next);
      if (resized && state.reduced && draw) draw(STILL_TIME);
      else apply();
    },
    destroy() {
      dead = true;
      caf(frameId);
    },
  };
}
