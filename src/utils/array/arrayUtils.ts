export type SortDirection = 'ASC' | 'DESC';

export interface GroupItem<TKey, T> {
  key: TKey;
  values: T[];
}

namespace ArrayUtils {
  export function take<T>(items: readonly T[], count: number, skip = 0): T[] {
    return items.slice(skip, skip + count);
  }

  export function sumBy<T>(items: readonly T[], fn: (value: T, index: number) => number, initialValue = 0): number {
    return items.reduce((acc, item, index) => acc + fn(item, index), initialValue);
  }

  export function sortBy<T, TVal>(items: readonly T[], fn: (value: T) => TVal, direction?: SortDirection): T[] {
    const arr = [...items];

    return arr.sort((a, b) => {
      const aVal = fn(a);
      const bVal = fn(b);

      if (aVal < bVal) {
        return direction === 'DESC' ? 1 : -1;
      }

      if (aVal > bVal) {
        return direction === 'DESC' ? -1 : 1;
      }

      return 0;
    });
  }

  export function maxBy<T>(items: readonly T[], fn: (value: T) => number): number {
    return Math.max(...items.map(fn));
  }

  export function findOrThrow<T>(items: readonly T[], predicate: (value: T) => boolean): T {
    const result = items.find(predicate);

    if (typeof result === 'undefined') throw new Error('No items satisfy the provided condition.');

    return result;
  }

  export function toRecord<T, K extends string | number | symbol, V>(
    items: readonly T[],
    fn: (value: T) => [K, V] | undefined,
  ): Record<K, V> {
    return items.reduce<Record<K, V>>(
      (acc, item) => {
        const result = fn(item);

        if (!result) return acc;

        const [key, value] = result;
        acc[key] = value;

        return acc;
      },
      {} as Record<K, V>,
    );
  }

  export function groupBy<T, TKey extends string | number | symbol>(
    items: readonly T[],
    keySelector: (item: T, index: number) => TKey,
  ): GroupItem<TKey, T>[] {
    const result = items.reduce((acc, item, index) => {
      const key = keySelector(item, index);

      if (acc.has(key) === false) {
        acc.set(key, []);
      }

      acc.get(key)?.push(item);

      return acc;
    }, new Map<TKey, T[]>());

    return Array.from(result, ([key, values]) => ({ key, values }));
  }
}

export default ArrayUtils;
