/**
 * *When* pending rules reach the sink.
 *
 * The engine resolves class names during render and queues the rules those names need; the moment
 * the queue is drained is framework policy, not engine logic. So the engine only ever says that
 * something is pending (`scheduleFlush()`) and a `FlushScheduler` decides when `flush` runs — the
 * last piece of the pipeline that used to be React's alone.
 *
 * What a scheduler has to honour:
 * - run `flush` before the browser paints the markup those rules describe (unstyled paint is the
 *   failure mode), and before anything reads layout from it;
 * - running it synchronously is always correct — coalescing is an optimization, not a requirement.
 *
 * The adapters:
 * - **React** (`useStyles`): flushes synchronously from `useInsertionEffect`, React's own
 *   recommendation for injecting CSS-in-JS. Insertion effects run during the commit, ahead of
 *   every layout effect, so the scheduled microtask is only a safety net for rules queued outside
 *   a commit.
 * - **Vanilla DOM / anything without a commit phase**: the default microtask scheduler is enough —
 *   `el.className = ...` cannot be painted before the microtask queue drains.
 * - **Vue**: `syncScheduler`. There is no concurrent rendering to interleave with, so flushing
 *   inside `setup()`/`computed` is safe and needs no queue at all.
 * - **Server rendering**: no scheduler runs in time; `getStyles()` flushes itself (see `ssg.ts`).
 * - **Tests, or a caller that wants full control**: `manualScheduler` plus `flushSync()`.
 */
export type FlushScheduler = (flush: () => void) => void;

/** The default: one flush at the end of the current task, holding everything queued in it. */
export const microtaskScheduler: FlushScheduler = (flush) => queueMicrotask(flush);

/** Flush on the spot, in the call that queued the rule. */
export const syncScheduler: FlushScheduler = (flush) => flush();

/** Never flush on its own — the caller drives it with `flushSync()`. */
export const manualScheduler: FlushScheduler = () => {};

/**
 * Coalescing wrapper around a scheduler: any number of `scheduleFlush()` calls in one turn produce
 * a single `flush`. The latch is released by the scheduled flush itself, so an explicit
 * `flushSync()` in between costs at most one extra flush that finds nothing to do.
 */
export function createFlushCoordinator(flush: () => void, schedule: FlushScheduler): () => void {
  let scheduled = false;

  return function scheduleFlush() {
    if (scheduled) return;

    scheduled = true;
    schedule(() => {
      scheduled = false;
      flush();
    });
  };
}
