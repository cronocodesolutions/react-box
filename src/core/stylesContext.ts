import {
  BoxBreakpointsType,
  PseudoClassSuffix,
  StyleItem,
  StyleKey,
  StyleValues,
  addCustomPseudoClassProps,
  boxBreakpoints,
  boxBreakpointsMinWidth,
  boxStyles,
  pseudoClassSuffixes,
  rebuildBoxStyles,
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
.${svgClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;transition: all var(--svgTransitionTime);}.${svgClassName} path,.${svgClassName} circle,.${svgClassName} rect,.${svgClassName} line {transition: all var(--svgTransitionTime);}
`;
  const identity = new IdentityFactory();
  let requireFlush = true;

  let styles = {} as Record<StyleKey, Set<unknown>>;
  clear();

  export function get(key: string, value: unknown, breakpoint?: BoxBreakpointsType) {
    if (key in boxStyles) {
      return getClassName(key as StyleKey, value, breakpoint);
    }

    if (['disabledGroup', 'hoverGroup', 'focusGroup', 'activeGroup'].includes(key)) {
      return key + value;
    }
  }

  export function flush() {
    if (requireFlush) {
      let items = generateStyles([defaultStyles]);

      pseudoClassSuffixes.forEach((pseudoClassSuffix) => {
        items = generateStyles(items, pseudoClassSuffix);
      });

      boxBreakpoints.forEach((breakpoint) => {
        items.push(`@media(min-width: ${boxBreakpointsMinWidth[breakpoint]}px){`);

        items = generateStyles(items, undefined, breakpoint);
        pseudoClassSuffixes.forEach((pseudoClassSuffix) => {
          items = generateStyles(items, pseudoClassSuffix, breakpoint);
        });

        items.push('}');
      });

      const el = getElement();

      el.innerHTML = items.join('');

      requireFlush = false;
    }
  }

  export function clear() {
    rebuildBoxStyles();

    const propKeys = Object.keys(boxStyles) as StyleKey[];

    styles = propKeys.reduce(
      (acc, key) => {
        acc[key] = new Set();

        return acc;
      },
      {} as Record<StyleKey, Set<unknown>>,
    );
  }

  export function addCustomPseudoClass(suffix: PseudoClassSuffix, customName: string, parentKey: string) {
    const newKeys = addCustomPseudoClassProps(suffix, customName, parentKey);

    newKeys.forEach((newKey) => {
      styles[newKey as StyleKey] = new Set();
    });
  }

  function getClassName(styleKey: StyleKey, value: unknown, breakpoint?: BoxBreakpointsType) {
    const key = ((breakpoint ?? '') + styleKey) as StyleKey;

    if (!styles[key].has(value)) {
      requireFlush = true;
      styles[key].add(value);
    }

    const className = `${key}${value}`;

    if (process.env.NODE_ENV === 'test') {
      return className;
    }

    return identity.getIdentity(className);
  }

  function generateStyles(classes: string[], pseudoSuffix?: PseudoClassSuffix, breakpoint?: BoxBreakpointsType) {
    return Object.entries(styles)
      .filter(
        ([key, values]) =>
          (boxStyles[key as StyleKey] as StyleItem)?.pseudoSuffix === pseudoSuffix &&
          (boxStyles[key as StyleKey] as StyleItem)?.breakpoint === breakpoint &&
          values.size > 0,
      )
      .reduce((acc, [key, values]) => {
        values.forEach((value) => {
          const styleItem = boxStyles[key as StyleKey] as StyleItem;
          const valueItem = getValueItem(styleItem, value);

          const selector = `.${getClassName(key as StyleKey, value)}`;
          let selectors: string[] = [];

          if (!pseudoSuffix) {
            selectors = formatSelector(selector, styleItem, valueItem);
          } else if (pseudoSuffix === 'Hover') {
            selectors = formatSelector(selector, styleItem, valueItem, 'hover');
          } else if (pseudoSuffix === 'Focus') {
            selectors = formatSelector(selector, styleItem, valueItem, 'focus-within');
          } else if (pseudoSuffix === 'Active') {
            selectors = formatSelector(selector, styleItem, valueItem, 'active');
          } else if (pseudoSuffix === 'Checked') {
            selectors = formatSelector(selector, styleItem, valueItem, 'checked');
          } else if (pseudoSuffix === 'Indeterminate') {
            selectors = formatSelector(selector, styleItem, valueItem, 'indeterminate');
          } else if (pseudoSuffix === 'Valid') {
            selectors = formatSelector(selector, styleItem, valueItem, 'valid');
          } else if (pseudoSuffix === 'Invalid') {
            selectors = formatSelector(selector, styleItem, valueItem, 'invalid');
          } else if (pseudoSuffix === 'Required') {
            selectors = formatSelector(selector, styleItem, valueItem, 'required');
          } else if (pseudoSuffix === 'Optional') {
            selectors = formatSelector(selector, styleItem, valueItem, 'optional');
          } else if (pseudoSuffix === 'Disabled') {
            selectors = formatSelector(selector, styleItem, valueItem, 'disabled');
          }

          const cssValue = valueItem.formatValue?.(key as StyleKey, value) ?? value;
          const cssNames = boxStyles[key as StyleKey].cssNames;
          const styles = cssNames.map((cssName) => `${cssName}:${cssValue};`).join('');

          acc.push(`${selectors.join(',')}{${styles}}`);
        });
        return acc;
      }, classes);

    function formatSelector(selector: string, styleItem: StyleItem, valueItem: StyleValues, pseudoSelector?: string) {
      let selectorToUse = selector;

      if (pseudoSelector) {
        selectorToUse = styleItem.customPseudoSuffix
          ? `.${styleItem.customPseudoSuffix}:${pseudoSelector} ${selector}`
          : `${selector}:${pseudoSelector}`;
      }

      return valueItem.formatSelector ? valueItem.formatSelector(selectorToUse) : [selectorToUse];
    }
  }

  function getValueItem(styleItem: StyleItem, value: unknown): StyleValues {
    if (styleItem.isThemeStyle) {
      return styleItem as unknown as StyleValues;
    }

    const valueItem: StyleValues = styleItem.values1.values.includes(value)
      ? styleItem.values1
      : styleItem.values2.values.includes(value)
        ? styleItem.values2
        : styleItem.values3;

    return valueItem as unknown as StyleItem & StyleValues;
  }

  export function getElement() {
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
