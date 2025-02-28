export {};

declare global {
  type SortDirection = 'ASC' | 'DESC';

  interface GroupItem<TKey, T> {
    key: TKey;
    values: T[];
  }

  interface Array<T> {
    take(count: number, skip?: number): Array<T>;
    add(...items: T[]): Array<T>;
    removeBy(predicate: (value: T) => boolean): Array<T>;
    sumBy(fn: (value: T, index: number) => number, initialValue?: number): number;
    sortBy<TVal>(fn: (value: T) => TVal, direction?: 'ASC' | 'DESC'): Array<T>;
    maxBy(fn: (value: T) => number): number;
    findOrThrow(predicate: (value: T) => boolean): T;
    toRecord<K extends string | number | symbol, V>(fn: (value: T) => [K, V]): Record<K, V>;
    groupBy<TKey extends string | number | symbol>(keySelector: (item: T, index: number) => TKey): GroupItem<TKey, T>[];
  }
}

if (!Array.prototype.removeBy) {
  Array.prototype.removeBy = function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    return this.filter((x) => !predicate(x));
  };
}

if (!Array.prototype.take) {
  Array.prototype.take = function <T>(this: T[], count: number, skip = 0): T[] {
    return this.slice(skip, skip + count);
  };
}

if (!Array.prototype.add) {
  Array.prototype.add = function <T>(this: T[], ...items: T[]): T[] {
    const arr = [...this];
    arr.push(...items);

    return arr;
  };
}

if (!Array.prototype.sumBy) {
  Array.prototype.sumBy = function <T>(this: T[], fn: (value: T, index: number) => number, initialValue = 0): number {
    return this.reduce((acc, item, index) => acc + fn(item, index), initialValue);
  };
}

if (!Array.prototype.sortBy) {
  Array.prototype.sortBy = function <T, TVal>(this: T[], fn: (value: T) => TVal, direction?: 'ASC' | 'DESC'): T[] {
    const arr = [...this];

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
  };
}

if (!Array.prototype.maxBy) {
  Array.prototype.maxBy = function <T>(this: T[], fn: (value: T) => number): number {
    return Math.max(...this.map(fn));
  };
}

if (!Array.prototype.findOrThrow) {
  Array.prototype.findOrThrow = function <T>(this: T[], predicate: (value: T) => boolean): T {
    const result = this.find(predicate);

    if (typeof result === 'undefined') throw new Error('No element satisfies the condition in predicate.');

    return result;
  };
}

if (!Array.prototype.toRecord) {
  Array.prototype.toRecord = function <T, K extends string | number | symbol, V>(
    this: T[],
    fn: (value: T) => [K, V] | undefined,
  ): Record<K, V> {
    return this.reduce<Record<K, V>>(
      (acc, item) => {
        const result = fn(item);

        if (!result) return acc;

        const [key, value] = result;
        acc[key] = value;

        return acc;
      },
      {} as Record<K, V>,
    );
  };
}

if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function <T, TKey extends string | number | symbol>(
    this: T[],
    keySelector: (item: T, index: number) => TKey,
    ignoreEmptyStringNullOrUndefinedKey = false,
  ): GroupItem<TKey, T>[] {
    const result = this.reduce(
      (acc, item, index) => {
        const key = keySelector(item, index);

        if (ignoreEmptyStringNullOrUndefinedKey && typeof key !== 'number' && !key) {
          return acc;
        }

        if (key in acc === false) {
          acc[key] = [];
        }

        acc[key].push(item);

        return acc;
      },
      {} as Record<TKey, T[]>,
    );

    return Object.entries(result).map(([key, values]) => ({ key, values: values as T[] })) as GroupItem<TKey, T>[];
  };
}
