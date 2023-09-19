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

  export function buildProps<T extends { props?: Object }, TKey extends keyof T>(
    props: T,
    keys: Readonly<TKey[]>,
    themeStyles?: BoxStyles,
  ) {
    const newProps = { ...themeStyles, ...props };
    const tagProps = { ...props.props } as Record<TKey, T[TKey]>;

    keys.forEach((key) => {
      if (key in newProps) {
        tagProps[key] = newProps[key];
        delete newProps[key];
      }
    });

    newProps.props = tagProps;

    return newProps;
  }
}

export default ObjectUtils;
