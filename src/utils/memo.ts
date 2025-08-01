export interface Memo<T> {
  value: T;
  clear(): void;
}

export default function memo<T>(action: () => T): Memo<T> {
  let cache: T | undefined;

  const obj = {
    clear() {
      cache = undefined;
    },
  } as Memo<T>;

  return Object.defineProperty(obj, 'value', {
    get: () => {
      if (cache === undefined) {
        cache = action();
      }

      return cache;
    },
  });
}
