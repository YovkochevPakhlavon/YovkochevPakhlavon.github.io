/**
 * Web Worker: renders the black hole on an OffscreenCanvas, so context creation,
 * shader compilation and every frame happen off the page's main thread.
 */
import { createEngine, type EngineState } from './engine';

type Msg =
  | { type: 'init'; canvas: OffscreenCanvas; state: EngineState }
  | { type: 'state'; state: Partial<EngineState> }
  | { type: 'destroy' };

// Minimal typing of the worker global (the project's TS lib is DOM, not WebWorker).
interface WorkerScope {
  postMessage(message: unknown): void;
  onmessage: ((e: MessageEvent<Msg>) => void) | null;
  requestAnimationFrame?: (cb: (t: number) => void) => number;
  cancelAnimationFrame?: (id: number) => void;
}
const scope = self as unknown as WorkerScope;
const raf =
  typeof scope.requestAnimationFrame === 'function'
    ? scope.requestAnimationFrame.bind(scope)
    : (cb: (t: number) => void) => setTimeout(() => cb(performance.now()), 16) as unknown as number;
const caf =
  typeof scope.cancelAnimationFrame === 'function'
    ? scope.cancelAnimationFrame.bind(scope)
    : (id: number) => clearTimeout(id);

let engine: ReturnType<typeof createEngine> | null = null;

scope.onmessage = (e: MessageEvent<Msg>) => {
  const m = e.data;
  if (m.type === 'init') {
    engine = createEngine(
      m.canvas,
      {
        ready: () => scope.postMessage({ type: 'ready' }),
        fail: (reason) => scope.postMessage({ type: 'fail', reason }),
      },
      raf,
      caf,
    );
    engine.update(m.state);
  } else if (m.type === 'state') {
    engine?.update(m.state);
  } else {
    engine?.destroy();
    engine = null;
  }
};
