namespace ObjectUtils {
  export function buildProps<T extends { props?: Object }, TKey extends keyof T>(props: T, keys: Readonly<TKey[]>, extraTagProps?: Object) {
    const newProps = { ...props };
    const tagProps = (newProps.props || {}) as Record<TKey, T[TKey]>;

    keys.forEach((key) => {
      if (key in newProps) {
        tagProps[key] = newProps[key];

        delete newProps[key];
      }
    });

    if (extraTagProps) {
      Object.entries(extraTagProps).forEach(([key, value]) => {
        tagProps[key as TKey] = value;
      });
    }

    newProps.props = tagProps;

    return newProps;
  }

  export function isObject(value: unknown): value is object {
    return typeof value === 'object' && value !== null;
  }
}

export default ObjectUtils;
