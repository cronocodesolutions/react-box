export interface Memo<T> {
  value: T;
  clear(): void;
}

/** Sentinel for "not computed yet" so that a legitimately `undefined` result still caches. */
const UNSET = Symbol('memo.unset');

class MemoNode<T> implements Memo<T> {
  private cache: T | typeof UNSET = UNSET;
  private readonly dependents = new Set<MemoNode<unknown>>();
  private wired = false;

  constructor(
    private readonly action: () => T,
    private readonly deps: () => Memo<unknown>[],
  ) {}

  /**
   * Register this node as a dependent of each upstream dep so that clearing a dep
   * cascades down to this node. Done lazily on first access so class-field
   * declaration order never matters.
   */
  private wire(): void {
    if (this.wired) return;
    this.wired = true;
    for (const dep of this.deps() as MemoNode<unknown>[]) {
      dep.dependents.add(this as MemoNode<unknown>);
    }
  }

  get value(): T {
    this.wire();
    if (this.cache === UNSET) {
      this.cache = this.action();
    }
    return this.cache as T;
  }

  clear(): void {
    this.wire();
    // Invariant: a cached node implies its ancestors are cached (reading a node
    // forces its deps to compute). So if this node is already UNSET, every
    // dependent is UNSET too — nothing to cascade. This also guards against cycles.
    if (this.cache === UNSET) return;
    this.cache = UNSET;
    for (const dependent of this.dependents) {
      dependent.clear();
    }
  }
}

/**
 * Lazily-computed cached value with explicit dependency edges.
 *
 * Pass upstream memos via `deps` (a thunk, so it can reference sibling fields
 * regardless of declaration order). Clearing any dep cascades to this memo, so
 * mutations only need to clear the single root that changed.
 */
export default function memo<T>(action: () => T, deps: () => Memo<unknown>[] = () => []): Memo<T> {
  return new MemoNode(action, deps);
}
