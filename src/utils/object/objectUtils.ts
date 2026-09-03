/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Object helpers that know nothing about the prop registry — which is what lets both packages import
 * this file. `mergeDeep` used to live here and does not any more: it reads `pseudo2`, so it belongs in
 * `src/core/mergeDeep.ts` (see the note there).
 */
namespace ObjectUtils {
  export function buildProps<T extends { props?: object }, TKey extends keyof T>(props: T, keys: Readonly<TKey[]>, extraTagProps?: object) {
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
    return !!value && typeof value === 'object';
  }

  export function isKeyOf<T extends object>(key: any, obj: T): key is keyof T {
    return key in obj;
  }
}

export default ObjectUtils;
