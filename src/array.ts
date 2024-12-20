export {};

declare global {
  type SortDirection = 'ASC' | 'DESC';

  interface Array<T> {
    take(count: number, skip?: number): Array<T>;
    add(...items: T[]): Array<T>;
    removeBy(predicate: (value: T) => boolean): Array<T>;
    sumBy(fn: (value: T) => number): number;
    sortBy<TVal>(fn: (value: T) => TVal, direction?: 'ASC' | 'DESC'): Array<T>;
    maxBy(fn: (value: T) => number): number;
    findOrThrow(predicate: (value: T) => boolean): T;
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
  Array.prototype.sumBy = function <T>(this: T[], fn: (value: T) => number): number {
    return this.reduce((acc, item) => acc + fn(item), 0);
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
