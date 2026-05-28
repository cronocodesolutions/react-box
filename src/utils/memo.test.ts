import { describe, expect, it, vi } from 'vitest';
import memo, { Memo } from './memo';

describe('memo', () => {
  it('computes lazily and caches the result', () => {
    const fn = vi.fn(() => 42);
    const m = memo(fn);

    expect(fn).not.toHaveBeenCalled(); // lazy
    expect(m.value).toBe(42);
    expect(m.value).toBe(42);
    expect(fn).toHaveBeenCalledTimes(1); // cached
  });

  it('recomputes after clear()', () => {
    let n = 0;
    const m = memo(() => ++n);

    expect(m.value).toBe(1);
    m.clear();
    expect(m.value).toBe(2);
  });

  it('caches an undefined result (sentinel, not value-based)', () => {
    const fn = vi.fn(() => undefined);
    const m = memo(fn);

    expect(m.value).toBeUndefined();
    expect(m.value).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1); // would be 2 with the old `cache === undefined` bug
  });

  describe('dependency cascade', () => {
    it('clearing a dependency cascades to dependents', () => {
      let a = 0;
      const root = memo(() => ++a);
      const childFn = vi.fn(() => root.value * 10);
      const child = memo(childFn, () => [root]);

      expect(child.value).toBe(10); // root=1
      expect(child.value).toBe(10); // cached
      expect(childFn).toHaveBeenCalledTimes(1);

      root.clear(); // cascades to child
      expect(child.value).toBe(20); // root recomputed to 2
      expect(childFn).toHaveBeenCalledTimes(2);
    });

    it('cascades through a multi-level chain', () => {
      let a = 0;
      const root = memo(() => ++a);
      const mid = memo(
        () => root.value,
        () => [root],
      );
      const leaf = memo(
        () => mid.value,
        () => [mid],
      );

      expect(leaf.value).toBe(1);
      root.clear(); // root → mid → leaf
      expect(leaf.value).toBe(2);
    });

    it('clearing an already-cleared node does not recompute dependents (stops cascade)', () => {
      const root = memo(() => 1);
      const childFn = vi.fn(() => root.value);
      const child = memo(childFn, () => [root]);

      expect(child.value).toBe(1); // prime
      expect(childFn).toHaveBeenCalledTimes(1);

      root.clear(); // root was cached → cascades, clears child
      root.clear(); // root now UNSET → early return, no further cascade
      expect(childFn).toHaveBeenCalledTimes(1); // child not recomputed until read
    });

    it('supports a diamond (dependent of two deps) without double-recompute', () => {
      const left = memo(() => 1);
      const right = memo(() => 2);
      const sinkFn = vi.fn(() => left.value + right.value);
      const sink = memo(sinkFn, () => [left, right]);

      expect(sink.value).toBe(3);
      left.clear();
      expect(sink.value).toBe(3);
      expect(sinkFn).toHaveBeenCalledTimes(2);
    });

    it('wires lazily so declaration order does not matter', () => {
      // `dependent` is created before `root` exists; the dep thunk resolves lazily on first use.
      const refs: { root: Memo<number> | null } = { root: null };
      const dependent = memo(
        () => (refs.root?.value ?? 0) + 1,
        () => (refs.root ? [refs.root] : []),
      );
      refs.root = memo(() => 10);

      expect(dependent.value).toBe(11);
      refs.root.clear();
      // re-reading dependent must reflect the cleared root
      expect(dependent.value).toBe(11);
    });
  });
});
