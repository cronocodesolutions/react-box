import { pseudo2 } from '../../core/boxStyles';

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
    return !!value && typeof value === 'object';
  }

  export function mergeDeep<T>(...objects: T[]) {
    return objects.reduce((prev, obj) => {
      Object.keys(obj ?? {}).forEach((key) => {
        const pVal = (prev as any)[key];
        const oVal = (obj as any)[key];

        if (isObject(oVal) && 'clean' in oVal && oVal.clean) {
          (prev as any)[key] = oVal;
        } else if (key in pseudo2 && typeof oVal === 'boolean') {
          // skip overriding object of styles with a boolean
        } else if (key in pseudo2 && Array.isArray(oVal)) {
          (prev as any)[key] = mergeDeep(pVal, oVal[1] ?? {});
        } else if (Array.isArray(pVal) && Array.isArray(oVal)) {
          (prev as any)[key] = pVal.concat(...oVal);
        } else if (isObject(pVal) && isObject(oVal)) {
          (prev as any)[key] = mergeDeep(pVal, oVal);
        } else {
          (prev as any)[key] = oVal;
        }
      });

      return prev;
    }, {} as T);
  }

  export function isKeyOf<T extends object>(key: any, obj: T): key is keyof T {
    return key in obj;
  }
}

export default ObjectUtils;
