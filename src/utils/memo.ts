interface Memo<T> {
  value: T;
  clear(): void;
}

export default function memo<T>(action: () => T): Memo<T> {
  let cache: Maybe<T>;

  const obj = {
    clear() {
      cache = undefined;
    },
  } as Memo<T>;

  return Object.defineProperty(obj, 'value', {
    get: () => {
      if (!cache) {
        cache = action();
      }

      return cache;
    },
  });
}
