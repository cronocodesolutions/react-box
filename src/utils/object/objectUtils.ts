namespace ObjectUtils {
  export function moveToTagProps<T extends Object, TKey extends keyof T>(props: T, ...keys: TKey[]) {
    const newProps = { ...props };
    const tagProps = {} as Record<TKey, T[TKey]>;

    keys.forEach((key) => {
      if (key in newProps) {
        tagProps[key] = newProps[key];
        delete newProps[key];
      }
    });

    return [tagProps, newProps];
  }
}

export default ObjectUtils;
