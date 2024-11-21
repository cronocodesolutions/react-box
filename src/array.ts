export {};

declare global {
  interface Array<T> {
    removeBy(predicate: (value: T) => boolean): Array<T>;
  }
}

if (!Array.prototype.removeBy) {
  Array.prototype.removeBy = function <T>(this: T[], predicate: (value: T) => boolean): T[] {
    return this.filter(predicate);
  };
}
