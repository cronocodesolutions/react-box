export {};

declare global {
  interface Array<T> {
    removeBy(predicate: (value: T) => boolean): Array<T>;
    take(count: number, skip?: number): Array<T>;
  }
}

if (!Array.prototype.removeBy) {
  Array.prototype.removeBy = function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    return this.filter(predicate);
  };
}

if (!Array.prototype.take) {
  Array.prototype.take = function <T>(this: T[], count: number, skip = 0): T[] {
    return this.slice(skip, skip + count);
  };
}
