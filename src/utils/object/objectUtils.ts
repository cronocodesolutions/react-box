import { BoxStyles } from '../../types';

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

  export function buildProps<T extends { props?: Object }, TKey extends keyof T>(props: T, keys: Readonly<TKey[]>, extraTagProps?: Object) {
    const newProps = { ...props };
    const tagProps = (newProps.props || {}) as Record<TKey, T[TKey]>;

    keys.forEach((key) => {
      if (key in newProps) {
        tagProps[key] = newProps[key];

        if (key === 'disabled') return;

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
}

export default ObjectUtils;
