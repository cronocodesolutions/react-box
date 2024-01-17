import { doxStyles, StyleItem, StyleKey, StyleValues } from './doxStyles';
import IdentityFactory from '@cronocode/identity-factory';

export namespace StylesContext {
  const identity = new IdentityFactory();
  const propKeys = Object.keys(doxStyles) as StyleKey[];
  const el = getElement();

  let requireFlush = false;

  const styles = propKeys.reduce((acc, key) => {
    acc[key] = new Set();

    return acc;
  }, {} as Record<StyleKey, Set<string | number | boolean>>);

  export function get(key: StyleKey, value: string | number | boolean) {
    if (key in styles) {
      if (!styles[key].has(value)) {
        requireFlush = true;
        styles[key].add(value);
      }

      const valueItem: StyleValues = getValueItem(key as StyleKey, value);
      const className = valueItem.formatClassName?.(key as StyleKey, value) ?? `${key}${value}`;

      return `-${identity.getIdentity(className)}`;
    }
  }

  export function flush() {
    if (requireFlush) {
      const items = Object.entries(styles).reduce((acc, [key, values]) => {
        values.forEach((value) => {
          const valueItem: StyleValues = getValueItem(key as StyleKey, value);
          const className = valueItem.formatClassName?.(key as StyleKey, value) ?? `${key}${value}`;
          const cssValue = valueItem.formatValue?.(key as StyleKey, value) ?? value;

          const cssNames = (doxStyles[key as StyleKey] as StyleItem).cssNames ?? [(doxStyles[key as StyleKey] as StyleItem).cssName ?? key];
          const styles = cssNames.map((cssName) => `${cssName}:${cssValue};`).join('');

          acc.push(`.-${identity.getIdentity(className)}{${styles}}`);
        });
        return acc;
      }, [] as string[]);
      el.innerHTML = items.join('');

      requireFlush = false;
    }
  }

  function getValueItem(key: StyleKey, value: string | number | boolean) {
    const item = doxStyles[key];
    const valueItem: StyleValues = (item.values1.values as Readonly<Array<string | number | boolean>>).includes(value)
      ? item.values1
      : (item.values2.values as Readonly<Array<string | number | boolean>>).includes(value)
      ? item.values2
      : item.values3;

    return valueItem;
  }

  function getElement() {
    const elId = 'crono-styles';
    let portalContainer = document.getElementById(elId);

    if (!portalContainer) {
      portalContainer = document.createElement('style');
      portalContainer.setAttribute('id', elId);
      portalContainer.setAttribute('type', 'text/css');
      document.head.insertBefore(portalContainer, document.head.firstChild);
    }

    return portalContainer;
  }
}
