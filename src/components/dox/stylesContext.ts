import {
  doxStyles,
  pseudoClassStyles,
  PseudoClassSuffix,
  PseudoClassType,
  StyleItem,
  StyleKey,
  StyleValues,
  themeStyles,
} from './doxStyles';
import IdentityFactory from '@cronocode/identity-factory';

export namespace StylesContext {
  export const doxClassName = '_dox';
  export const svgClassName = '_svg';
  const defaultStyles = `:root{--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;#crono-box {position: absolute;top: 0;left: 0;height: 0;}}
html{font-size: 16px;font-family: Arial, sans-serif;}
body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}
a,ul{all: unset;}
.${doxClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;background-color: initial;transition: all var(--transitionTime);box-sizing: border-box;font-family: inherit;font-size: inherit;}
.${svgClassName}{width: 1.5rem;transition: all var(--svgTransitionTime);path,circle,rect,line {transition: all var(--svgTransitionTime);}}
`;
  const identity = new IdentityFactory();

  const propKeys = [...Object.keys(doxStyles), ...Object.keys(themeStyles)] as StyleKey[];
  const el = getElement();

  let requireFlush = false;

  const styles = propKeys.reduce((acc, key) => {
    acc[key] = new Set();

    return acc;
  }, {} as Record<StyleKey, Set<string | number | boolean>>);

  export function get(key: string, value: string | number | boolean) {
    if (key in doxStyles) {
      return getClassName(key as StyleKey, value);
    }

    if (key in pseudoClassStyles) {
      return pseudoClassStyles[key as PseudoClassType].className;
    }
  }

  export function flush() {
    if (requireFlush) {
      console.info('%c💬Flush Dox Styles', 'color: #00ffff');

      let items = generateStyles([defaultStyles]);
      items = generateStyles(items, 'H');
      items = generateStyles(items, 'F');
      items = generateStyles(items, 'A');

      el.innerHTML = items.join('');

      requireFlush = false;
    }
  }

  function getClassName(styleKey: StyleKey, value: string | number | boolean) {
    if (!styles[styleKey].has(value)) {
      requireFlush = true;
      styles[styleKey].add(value);
    }

    const valueItem: StyleValues = getValueItem(styleKey as StyleKey, value);
    const className = valueItem.formatClassName?.(styleKey as StyleKey, value) ?? `${styleKey}${value}`;

    return `-${identity.getIdentity(className)}`;
  }

  function generateStyles(classes: string[], pseudoSuffix?: PseudoClassSuffix) {
    return Object.entries(styles)
      .filter(([key]) => (doxStyles[key as StyleKey] as StyleItem)?.pseudoSuffix === pseudoSuffix)
      .reduce((acc, [key, values]) => {
        values.forEach((value) => {
          let className = getClassName(key as StyleKey, value);
          if (pseudoSuffix === 'H') className = `${className}:hover,.${pseudoClassStyles.hover.className}:hover>.${className}`;
          if (pseudoSuffix === 'F')
            className = `${className}:focus-within,.${pseudoClassStyles.focus.className}:focus-within>.${className}`;
          if (pseudoSuffix === 'A') className = `${className}:active`;

          const valueItem: StyleValues = getValueItem(key as StyleKey, value);
          const cssValue = valueItem.formatValue?.(key as StyleKey, value) ?? value;
          const cssNames = (doxStyles[key as StyleKey] as StyleItem).cssNames;
          const styles = cssNames.map((cssName) => `${cssName}:${cssValue};`).join('');

          acc.push(`.${className}{${styles}}`);
        });
        return acc;
      }, classes);
  }

  function getValueItem(key: StyleKey, value: string | number | boolean): StyleValues {
    const item = doxStyles[key];

    if ((item as StyleItem).isThemeStyle) {
      return item as unknown as StyleValues;
    }

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
