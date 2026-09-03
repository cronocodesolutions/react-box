export interface Memo<T> {
    value: T;
    clear(): void;
}
/**
 * Lazily-computed cached value with explicit dependency edges. Upstream memos go in `deps` as a thunk, so
 * they can reference siblings whatever the declaration order; clearing a dep cascades, so a mutation only
 * has to clear the root that changed.
 */
export default function memo<T>(action: () => T, deps?: () => Memo<unknown>[]): Memo<T>;
