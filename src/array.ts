export {};

declare global {
  interface Array<T> {
    take(count: number, skip?: number): Array<T>;
    add(...items: T[]): Array<T>;
    removeBy(predicate: (value: T) => boolean): Array<T>;
    sumBy(fn: (value: T) => number): number;
    sortBy(fn: (value: T) => number): Array<T>;
    maxBy(fn: (value: T) => number): number;
  }
}

if (!Array.prototype.removeBy) {
  Array.prototype.removeBy = function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    if (this.find(predicate)) {
      return this.filter((x) => !predicate(x));
    }

    return this;
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
  Array.prototype.sortBy = function <T>(this: T[], fn: (value: T) => number): T[] {
    const arr = [...this];

    return arr.sort((a, b) => fn(a) - fn(b));
  };
}

if (!Array.prototype.maxBy) {
  Array.prototype.maxBy = function <T>(this: T[], fn: (value: T) => number): number {
    return Math.max(...this.map(fn));
  };
}
