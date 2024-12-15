export {};

declare global {
  interface Array<T> {
    removeBy(predicate: (value: T) => boolean): Array<T>;
    take(count: number, skip?: number): Array<T>;
    add(...items: T[]): Array<T>;
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
    this.push(...items);

    return [...this];
  };
}
