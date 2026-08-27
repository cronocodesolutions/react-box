import { describe, expect, it, vi } from 'vitest';
import { generatedRulesOf, makeEngine, rulesOf } from '../../../dev/engineHarness';
import { createFlushCoordinator, manualScheduler, syncScheduler } from './flushScheduler';

/**
 * Flushing used to be React's job: the only thing that ever drained the pending queue was the
 * layout effect in `useStyles`. These tests pin the engine's own half of that contract — it asks
 * for a flush whenever it queues something, and a scheduler decides when — so an adapter with no
 * effects at all (vanilla DOM, another framework) still gets every rule its class names refer to.
 */

/** Resolve after the microtask queue has drained, i.e. after the default scheduler has flushed. */
function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function countOccurrences(text: string, needle: string): number {
  return text.split(needle).length - 1;
}

describe('createFlushCoordinator', () => {
  it('coalesces every call in a turn into one flush, then latches again', () => {
    const flush = vi.fn();
    const scheduled: (() => void)[] = [];
    const scheduleFlush = createFlushCoordinator(flush, (run) => scheduled.push(run));

    scheduleFlush();
    scheduleFlush();
    scheduleFlush();

    expect(scheduled).toHaveLength(1);
    expect(flush).not.toHaveBeenCalled();

    scheduled[0]();
    expect(flush).toHaveBeenCalledTimes(1);

    // The latch is released by the flush it scheduled, so the next turn gets its own.
    scheduleFlush();
    expect(scheduled).toHaveLength(2);
  });

  it('flushes inside the call with the sync scheduler and never with the manual one', () => {
    const syncFlush = vi.fn();
    createFlushCoordinator(syncFlush, syncScheduler)();
    expect(syncFlush).toHaveBeenCalledTimes(1);

    const manualFlush = vi.fn();
    createFlushCoordinator(manualFlush, manualScheduler)();
    expect(manualFlush).not.toHaveBeenCalled();
  });
});

describe('engine flush scheduling', () => {
  it('writes the rules it queued on a microtask, with nothing asking it to', async () => {
    const engine = makeEngine('sched-microtask');

    engine.resolveClassNames({ p: 4 }, false);
    // Resolving only queues: the class name is usable, the rule is not in the sheet yet.
    expect(generatedRulesOf(engine)).toBe('');

    await tick();

    expect(generatedRulesOf(engine)).toContain('.p-4{padding:1rem}');
  });

  it('declares a variable read on its own, with no rule behind it', async () => {
    const engine = makeEngine('sched-variable');

    // `Box.getVariableValue()` hands out `var(--gray-500)` without generating any rule — the
    // declaration still has to reach `:root`, so reading one has to schedule a flush too.
    expect(engine.getVariableValue('gray-500')).toBe('var(--gray-500)');

    await tick();

    expect(rulesOf(engine)).toContain('--gray-500:');
  });

  it('leaves everything to flushSync when the scheduler is manual', async () => {
    const engine = makeEngine('sched-manual', { scheduler: manualScheduler });

    engine.resolveClassNames({ p: 5 }, false);
    await tick();
    expect(generatedRulesOf(engine)).toBe('');

    engine.flushSync();
    expect(generatedRulesOf(engine)).toContain('.p-5{padding:1.25rem}');
  });

  it('needs no flush at all when the scheduler is synchronous', () => {
    // The contract a Vue-style adapter would use: no commit phase, no queue, no effect.
    const engine = makeEngine('sched-sync', { scheduler: syncScheduler });

    engine.resolveClassNames({ p: 6 }, false);

    expect(generatedRulesOf(engine)).toContain('.p-6{padding:1.5rem}');
  });

  it('does not write a rule twice when flushSync beats the scheduled flush to it', async () => {
    const engine = makeEngine('sched-flush-sync-first');

    engine.resolveClassNames({ p: 7 }, false);
    engine.flushSync();
    await tick();

    expect(countOccurrences(generatedRulesOf(engine), '.p-7{padding:1.75rem}')).toBe(1);
  });

  it('re-schedules after clear(), and writes the base rules exactly once', async () => {
    const engine = makeEngine('sched-after-clear');

    engine.resolveClassNames({ p: 8 }, false);
    await tick();
    expect(generatedRulesOf(engine)).toContain('.p-8{padding:2rem}');

    // An SSR request boundary: everything emitted is dropped, and the next render has to bring
    // both the base rules and its own back — on its own, without an explicit flush.
    engine.clear();
    expect(rulesOf(engine)).toBe('');

    engine.resolveClassNames({ p: 8 }, false);
    await tick();

    const css = rulesOf(engine);
    expect(css).toContain('.p-8{padding:2rem}');
    expect(countOccurrences(css, 'box-sizing: border-box')).toBe(1);
  });
});
