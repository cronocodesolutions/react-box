import { useEffect, useLayoutEffect, useMemo } from 'react';
import { BoxStyleProps, BoxStyles, PseudoClassesType } from '../types';
import ObjectUtils from '../utils/object/objectUtils';
import {
  breakpoints,
  cssStyles,
  pseudo1,
  pseudo2,
  pseudoClasses,
  pseudoClassesByWeight,
  pseudoClassesWeight,
  pseudoGroupClasses,
} from './boxStyles';
import IdentityFactory from '@cronocode/identity-factory';
import BoxExtends from './boxExtends';
import { BoxStyle } from './coreTypes';
import { useTheme } from './useTheme';

const identity = new IdentityFactory();

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isTestEnv = typeof process === 'object' && process.env?.NODE_ENV === 'test';

const useEff = isBrowser && !isTestEnv ? useLayoutEffect : useEffect;

const boxClassName = '_b';
const svgClassName = '_s';

export default function useStyles(props: BoxStyleProps, isSvg: boolean) {
  useEff(StylesContextImpl.flush, [props]);

  const theme = useTheme(props);

  return useMemo(() => {
    const classNames: string[] = [isSvg ? svgClassName : boxClassName];

    if ((props as any).props?.name === 'Clean') {
      const a = 1;
    }

    const propsToUse = theme ? ObjectUtils.mergeDeep<BoxStyleProps>(theme, props) : props;

    StylesContextImpl.addClassNames(propsToUse, classNames, []);

    return classNames;
  }, [props, isSvg, theme]);
}

namespace StylesContextImpl {
  let requireFlush = true;

  let stylesToGenerate: {
    // key = breakpoint name
    [key: string]: {
      // key = weight of pseudo classes
      [key: number]: {
        // key = css style (box props)
        [key: string]: Set<string | number | boolean>;
      } & {
        __parents?: {
          // key = parent name
          [key: string]: {
            // key = css style (box props)
            [key: string]: Set<string | number | boolean>;
          };
        };
      };
    };
  } = {};

  export function addClassNames(
    props: BoxStyleProps,
    classNames: string[],
    currentPseudoClasses: PseudoClassesType[],
    breakpoint?: string,
    pseudoClassParentName?: string,
  ) {
    Object.entries(props).forEach(([key, value]) => {
      if (ObjectUtils.isKeyOf(key, cssStyles)) {
        addClassName(key, value, classNames, currentPseudoClasses, breakpoint, pseudoClassParentName);
      } else if (ObjectUtils.isKeyOf(key, pseudo1)) {
        addClassNames(value as BoxStyleProps, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName);
      } else if (ObjectUtils.isKeyOf(key, pseudo2)) {
        if (Array.isArray(value)) {
          const [_, styles] = value as [unknown, BoxStyleProps];
          addClassNames(styles, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName);
        }
        if (ObjectUtils.isObject(value)) {
          addClassNames(value as BoxStyleProps, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName);
        }
      } else if (ObjectUtils.isKeyOf(key, breakpoints)) {
        addClassNames(value as BoxStyleProps, classNames, currentPseudoClasses, key, pseudoClassParentName);
      } else if (ObjectUtils.isKeyOf(key, pseudoGroupClasses)) {
        if (typeof value === 'string') {
          classNames.push(`${pseudoGroupClasses[key]}-${value}`);
        } else {
          Object.entries(value).forEach(([name, pseudoClassProps]) => {
            addClassNames(pseudoClassProps as BoxStyles, classNames, [...currentPseudoClasses, pseudoGroupClasses[key]], breakpoint, name);
          });
        }
      }
    });
  }

  export function flush() {
    if (!requireFlush) return;

    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: flush');

    const cssStylesIndex: Record<string, number> = Object.entries(cssStyles).reduce<Record<string, number>>((acc, [key], index) => {
      acc[key] = index;
      return acc;
    }, {});

    const defaultStyles = `:root{${BoxExtends.getVariables()}--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;}#crono-box {position: absolute;top: 0;left: 0;height: 0;}
html{font-size: 16px;font-family: Arial, sans-serif;}
body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}
a,ul{all: unset;}
.${boxClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;background-color: initial;transition: all var(--transitionTime);box-sizing: border-box;font-family: inherit;font-size: inherit;}
.${svgClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;transition: all var(--svgTransitionTime);}.${svgClassName} path,.${svgClassName} circle,.${svgClassName} rect,.${svgClassName} line {transition: all var(--svgTransitionTime);}
`;
    const stylesToGenerateEntries = Object.entries(stylesToGenerate);

    stylesToGenerateEntries.sort(
      ([a], [b]) => (breakpoints[a as keyof typeof breakpoints] ?? 0) - (breakpoints[b as keyof typeof breakpoints] ?? 0),
    );

    const styleItems = stylesToGenerateEntries.reduce<string[]>(
      (acc, [breakpoint, weights]) => {
        if (breakpoint !== 'normal') {
          acc.push(`@media(min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px){`);
        }

        Object.entries(weights).forEach(([weight, boxStyles]) => {
          const { __parents, ...styles } = boxStyles;

          const stylesToUse = Object.entries(styles);
          stylesToUse.sort(([a], [b]) => cssStylesIndex[a] - cssStylesIndex[b]);

          stylesToUse.forEach(([key, values]) => {
            values.forEach((value) => {
              const item = cssStyles[key as keyof typeof cssStyles] as BoxStyle[];

              const itemValue = item.find((x) => {
                if (Array.isArray(x.values)) {
                  return x.values.includes(value);
                }

                return typeof value === typeof x.values;
              });

              if (!itemValue) return;

              const className = createClassName(key as keyof BoxStyles, value as BoxStyles[keyof BoxStyles], +weight, breakpoint);
              const pseudoClassesToUse = pseudoClassesByWeight[+weight].map((p) => pseudoClasses[p]).join('');
              const selector = itemValue.selector?.(`.${className}`, pseudoClassesToUse) ?? `.${className}${pseudoClassesToUse}`;

              const styleName = Array.isArray(itemValue.styleName) ? itemValue.styleName : [itemValue.styleName ?? key];
              const styleValue = itemValue.valueFormat?.(value as never) ?? value;

              acc.push(`${selector}{${styleName.map((s) => `${s}:${styleValue}`).join(';')}}`);
            });
          });

          if (__parents) {
            Object.entries(__parents).forEach(([name, styles]) => {
              const stylesToUse = Object.entries(styles);
              stylesToUse.sort(([a], [b]) => cssStylesIndex[a] - cssStylesIndex[b]);

              stylesToUse.forEach(([key, values]) => {
                values.forEach((value) => {
                  const item = cssStyles[key as keyof typeof cssStyles] as BoxStyle[];

                  const itemValue = item.find((x) => {
                    if (Array.isArray(x.values)) {
                      return x.values.includes(value);
                    }

                    return typeof value === typeof x.values;
                  });

                  if (!itemValue) return;

                  const className = createClassName(key as keyof BoxStyles, value as BoxStyles[keyof BoxStyles], +weight, breakpoint, name);
                  const [pseudoClass] = pseudoClassesByWeight[+weight];

                  const selector =
                    itemValue.selector?.(`.${pseudoClass}-${name}:${pseudoClass} .${className}`, '') ??
                    `.${pseudoClass}-${name}:${pseudoClass} .${className}`;

                  const styleName = Array.isArray(itemValue.styleName) ? itemValue.styleName : [itemValue.styleName ?? key];
                  const styleValue = itemValue.valueFormat?.(value as never) ?? value;

                  acc.push(`${selector}{${styleName.map((s) => `${s}:${styleValue}`).join(';')}}`);
                });
              });
            });
          }
        });

        if (breakpoint !== 'normal') {
          acc.push('}');
        }

        return acc;
      },
      [defaultStyles],
    );

    const el = getElement();

    el.innerHTML = styleItems.join('');

    requireFlush = false;
  }

  export function clear() {
    stylesToGenerate = {};
  }

  function addClassName<TKey extends keyof BoxStyles, TValue extends BoxStyles[TKey]>(
    key: TKey,
    value: TValue | undefined | null,
    classNames: string[],
    currentPseudoClasses: PseudoClassesType[],
    breakpoint: string = 'normal',
    pseudoClassParentName?: string,
  ) {
    if (value === undefined || value === null) return;

    const weight = currentPseudoClasses.reduce((sum, pseudoClass) => sum + pseudoClassesWeight[pseudoClass], 0);

    if (!stylesToGenerate[breakpoint]) {
      stylesToGenerate[breakpoint] = { [weight]: { [key]: new Set() } };
    } else if (!stylesToGenerate[breakpoint][weight]) {
      stylesToGenerate[breakpoint][weight] = { [key]: new Set() };
    } else if (!stylesToGenerate[breakpoint][weight][key]) {
      stylesToGenerate[breakpoint][weight][key] = new Set();
    }

    if (pseudoClassParentName) {
      if (!stylesToGenerate[breakpoint][weight].__parents) {
        stylesToGenerate[breakpoint][weight].__parents = { [pseudoClassParentName]: { [key]: new Set() } };
      } else if (!stylesToGenerate[breakpoint][weight].__parents![pseudoClassParentName]) {
        stylesToGenerate[breakpoint][weight].__parents![pseudoClassParentName] = { [key]: new Set() };
      } else if (!stylesToGenerate[breakpoint][weight].__parents![pseudoClassParentName][key]) {
        stylesToGenerate[breakpoint][weight].__parents![pseudoClassParentName][key] = new Set();
      }

      if (!stylesToGenerate[breakpoint][weight].__parents![pseudoClassParentName][key].has(value)) {
        stylesToGenerate[breakpoint][weight].__parents![pseudoClassParentName][key].add(value);
        requireFlush = true;
      }
    } else {
      if (!stylesToGenerate[breakpoint][weight][key].has(value)) {
        stylesToGenerate[breakpoint][weight][key].add(value);
        requireFlush = true;
      }
    }

    const className = createClassName(key, value, weight, breakpoint, pseudoClassParentName);

    classNames.push(className);
  }

  function createClassName<TKey extends keyof BoxStyles, TValue extends BoxStyles[TKey]>(
    key: TKey,
    value: TValue,
    weight: number,
    breakpoint: string,
    pseudoClassParentName?: string,
  ) {
    const pseudoClasses = pseudoClassesByWeight[weight];

    const className = `${breakpoint === 'normal' ? '' : `${breakpoint}-`}${pseudoClasses.map((p) => `${p}-`).join('')}${pseudoClassParentName ? `${pseudoClassParentName}-` : ''}${key}-${value}`;

    return isTestEnv ? className : identity.getIdentity(className);
  }

  const cronoStylesElementId = 'crono-styles';

  function getElement() {
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

export namespace StylesContext {
  export const flush = StylesContextImpl.flush;
  export const clear = StylesContextImpl.clear;
}
