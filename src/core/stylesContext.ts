import {
  PseudoClassClassNameKey,
  PseudoClassSuffixExtended,
  StyleItem,
  StyleKey,
  StyleValues,
  boxStyles,
  pseudoClassClassName,
} from './boxStyles';
import IdentityFactory from '@cronocode/identity-factory';

namespace StylesContext {
  export const boxClassName = '_box';
  export const svgClassName = '_svg';
  export const cronoStylesElementId = 'crono-styles';

  const defaultStyles = `:root{--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;#crono-box {position: absolute;top: 0;left: 0;height: 0;}}
html{font-size: 16px;font-family: Arial, sans-serif;}
body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}
a,ul{all: unset;}
.${boxClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;background-color: initial;transition: all var(--transitionTime);box-sizing: border-box;font-family: inherit;font-size: inherit;}
.${svgClassName}{transition: all var(--svgTransitionTime);}.${svgClassName} path,.${svgClassName} circle,.${svgClassName} rect,.${svgClassName} line {transition: all var(--svgTransitionTime);}
`;
  const identity = new IdentityFactory();
  const propKeys = Object.keys(boxStyles) as StyleKey[];

  let requireFlush = true;

  let styles = propKeys.reduce(
    (acc, key) => {
      acc[key] = new Set();

      return acc;
    },
    {} as Record<StyleKey, Set<unknown>>,
  );

  export function get(key: string, value: unknown) {
    if (key in boxStyles) {
      return getClassName(key as StyleKey, value);
    }

    if (key in pseudoClassClassName) {
      return pseudoClassClassName[key as PseudoClassClassNameKey].className;
    }
  }

  export function flush() {
    if (requireFlush) {
      let items = generateStyles([defaultStyles]);
      items = generateStyles(items, 'H');
      items = generateStyles(items, 'F');
      items = generateStyles(items, 'A');
      items = generateStyles(items, 'Checked');
      items = generateStyles(items, 'Indeterminate');
      items = generateStyles(items, 'Valid');
      items = generateStyles(items, 'Invalid');
      items = generateStyles(items, 'Required');
      items = generateStyles(items, 'Disabled');

      const el = getElement();

      el.innerHTML = items.join('');

      requireFlush = false;
    }
  }

  export function clear() {
    styles = propKeys.reduce(
      (acc, key) => {
        acc[key] = new Set();

        return acc;
      },
      {} as Record<StyleKey, Set<unknown>>,
    );
  }

  function getClassName(styleKey: StyleKey, value: unknown) {
    if (!styles[styleKey].has(value)) {
      requireFlush = true;
      styles[styleKey].add(value);
    }

    const valueItem: StyleValues = getValueItem(styleKey as StyleKey, value);
    const className = valueItem.formatClassName?.(styleKey as StyleKey, value) ?? `${styleKey}${value}`;

    return identity.getIdentity(className);
  }

  function generateStyles(classes: string[], pseudoSuffix?: PseudoClassSuffixExtended) {
    return Object.entries(styles)
      .filter(([key]) => (boxStyles[key as StyleKey] as StyleItem)?.pseudoSuffix === pseudoSuffix)
      .reduce((acc, [key, values]) => {
        values.forEach((value) => {
          const valueItem: StyleValues = getValueItem(key as StyleKey, value);

          const selector = `.${getClassName(key as StyleKey, value)}`;
          let selectors: string[] = [];

          if (!pseudoSuffix) {
            selectors = formatSelector(selector, valueItem);
          } else if (pseudoSuffix === 'H') {
            selectors = [
              ...formatSelector(`${selector}:hover`, valueItem),
              ...formatSelector(`.${pseudoClassClassName.hover.className}:hover>${selector}`, valueItem),
            ];
          } else if (pseudoSuffix === 'F') {
            selectors = [
              ...formatSelector(`${selector}:focus-within`, valueItem),
              ...formatSelector(`.${pseudoClassClassName.focus.className}:focus-within>${selector}`, valueItem),
            ];
          } else if (pseudoSuffix === 'A') {
            selectors = formatSelector(`${selector}:active`, valueItem);
          } else if (pseudoSuffix === 'Checked') {
            selectors = formatSelector(`${selector}:checked`, valueItem);
          } else if (pseudoSuffix === 'Indeterminate') {
            selectors = formatSelector(`${selector}:indeterminate`, valueItem);
          } else if (pseudoSuffix === 'Valid') {
            selectors = formatSelector(`${selector}:valid`, valueItem);
          } else if (pseudoSuffix === 'Invalid') {
            selectors = formatSelector(`${selector}:invalid`, valueItem);
          } else if (pseudoSuffix === 'Required') {
            selectors = formatSelector(`${selector}:required`, valueItem);
          } else if (pseudoSuffix === 'Optional') {
            selectors = formatSelector(`${selector}:optional`, valueItem);
          } else if (pseudoSuffix === 'Disabled') {
            selectors = formatSelector(`${selector}:disabled`, valueItem);
          }

          const cssValue = valueItem.formatValue?.(key as StyleKey, value) ?? value;
          const cssNames = boxStyles[key as StyleKey].cssNames;
          const styles = cssNames.map((cssName) => `${cssName}:${cssValue};`).join('');

          acc.push(`${selectors.join(',')}{${styles}}`);
        });
        return acc;
      }, classes);

    function formatSelector(selector: string, valueItem: StyleValues) {
      return valueItem.formatSelector ? valueItem.formatSelector(selector) : [selector];
    }
  }

  function getValueItem(key: StyleKey, value: unknown): StyleValues {
    const item = boxStyles[key];

    if ((item as StyleItem).isThemeStyle) {
      return item as unknown as StyleValues;
    }

    const valueItem: StyleValues = (item.values1.values as Readonly<Array<unknown>>).includes(value)
      ? item.values1
      : (item.values2.values as Readonly<Array<unknown>>).includes(value)
        ? item.values2
        : item.values3;

    return valueItem;
  }

  function getElement() {
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    const document = isBrowser ? window.document : global.document;

    let stylesElement = document.getElementById(cronoStylesElementId);

    if (!stylesElement) {
      stylesElement = document.createElement('style');
      stylesElement.setAttribute('id', cronoStylesElementId);
      stylesElement.setAttribute('type', 'text/css');
      document.head.insertBefore(stylesElement, document.head.firstChild);
    }

    return stylesElement;
  }
}

export default StylesContext;
