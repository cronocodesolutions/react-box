/**
 * *When* pending rules reach the sink. The engine only says that something is pending; the moment the queue
 * drains is framework policy, so a `FlushScheduler` decides it — before the browser paints the markup
 * those rules describe, and synchronously is always correct. React flushes from `useInsertionEffect`
 * (ahead of every layout effect, so the microtask default is only a safety net), Vue uses `syncScheduler`,
 * a server runs none at all (`getStyles()` flushes itself), and tests use `manualScheduler`.
 */
export type FlushScheduler = (flush: () => void) => void;
/** The default: one flush at the end of the current task, holding everything queued in it. */
export declare const microtaskScheduler: FlushScheduler;
/** Flush on the spot, in the call that queued the rule. */
export declare const syncScheduler: FlushScheduler;
/** Never flush on its own — the caller drives it with `flushSync()`. */
export declare const manualScheduler: FlushScheduler;
/**
 * Coalescing wrapper: any number of `scheduleFlush()` calls in one turn produce a single `flush`. The
 * scheduled flush releases the latch, so a `flushSync()` in between costs one flush that finds nothing.
 */
export declare function createFlushCoordinator(flush: () => void, schedule: FlushScheduler): () => void;
