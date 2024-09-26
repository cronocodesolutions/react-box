import { useEffect, useLayoutEffect, useMemo } from 'react';
import { BoxAllStyles, BoxStyles, BoxStylesWithPseudoClasses, BoxStylesWithPseudoClassesAndPseudoGroups } from '../types';
import { useTheme } from './theme2';
import ObjectUtils from '../utils/object/objectUtils';
import { breakpoints, cssStyles, pseudo1, pseudo2, pseudoClasses, pseudoClassesByWeight, pseudoGroupClasses } from './boxStyles2';
import IdentityFactory from '@cronocode/identity-factory';
import BoxExtends from './boxExtends';
import { BoxStyle } from './coreTypes';

const identity = new IdentityFactory();

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const useEff = isBrowser ? useLayoutEffect : useEffect;

const boxClassName = '_b';
const svgClassName = '_s';

export function useStyles2(props: BoxAllStyles, isSvg: boolean) {
  useEff(StylesContext.flush, [props]);

  const theme = useTheme(props);

  return useMemo(() => {
    const classNames: string[] = [isSvg ? svgClassName : boxClassName];

    const propsToUse = theme ? ObjectUtils.mergeDeep(theme, props) : props;

    StylesContext.addClassNames(propsToUse, classNames, []);

    return classNames;
  }, [props, isSvg, theme]);
}

namespace StylesContext {
  let requireFlush = true;

  const stylesToGenerate: {
    // key = breakpoint name
    [key: string]: {
      // key = weight of pseudo classes
      [key: number]: {
        // key = css style (box props)
        [key: string]: Set<unknown>;
      } & {
        __parents?: {
          // key = parent name
          [key: string]: {
            // key = css style (box props)
            [key: string]: Set<unknown>;
          };
        };
      };
    };
  } = {};

  export function addClassNames(
    props: BoxAllStyles,
    classNames: string[],
    currentPseudoClasses: string[],
    breakpoint?: string,
    pseudoClassParentName?: string,
  ) {
    Object.entries(props).forEach(([key, value]) => {
      if (key in cssStyles) {
        addClassName(key as keyof BoxStyles, value, classNames, currentPseudoClasses, breakpoint, pseudoClassParentName);
      } else if (key in pseudo1) {
        addClassNames(value as BoxStylesWithPseudoClasses, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName);
      } else if (key in pseudo2) {
        if (Array.isArray(value)) {
          const [_, styles] = value;
          addClassNames(
            styles as BoxStylesWithPseudoClasses,
            classNames,
            [...currentPseudoClasses, key],
            breakpoint,
            pseudoClassParentName,
          );
        }
      } else if (key in breakpoints) {
        addClassNames(value as BoxStylesWithPseudoClassesAndPseudoGroups, classNames, currentPseudoClasses, key, pseudoClassParentName);
      } else if (key in pseudoGroupClasses) {
        if (typeof value === 'string') {
          classNames.push(`${pseudoGroupClasses[key as keyof typeof pseudoGroupClasses]}-${value}`);
        } else {
          Object.entries(value).forEach(([name, pseudoClassProps]) => {
            addClassNames(
              pseudoClassProps as BoxStyles,
              classNames,
              [...currentPseudoClasses, pseudoGroupClasses[key as keyof typeof pseudoGroupClasses]],
              breakpoint,
              name,
            );
          });
        }
      }
    });
  }

  export function flush() {
    if (!requireFlush) return;

    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: flush');

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

        Object.entries(weights).forEach(([weight, styles]) => {
          const { __parents, ...restStyles } = styles;

          Object.entries(restStyles).forEach(([key, values]) => {
            values.forEach((value) => {
              const pseudoClasses = pseudoClassesByWeight[+weight];
              const className = createClassName(key as keyof BoxStyles, value as BoxStyles[keyof BoxStyles], +weight, breakpoint);

              const item = cssStyles[key as keyof typeof cssStyles] as BoxStyle[];

              const itemValue = item.find((x) => {
                if (Array.isArray(x.values)) {
                  return x.values.includes(value);
                }

                return typeof value === typeof x.values;
              });

              const styleName = itemValue?.styleName ?? key;
              const styleValue = itemValue?.valueFormat ? itemValue.valueFormat(value as never) : value;

              acc.push(
                `.${className}${pseudoClasses.map((p) => (p === 'disabled' ? `[${p}]` : `:${p}`)).join('')}{${styleName}:${styleValue}}`,
              );
            });
          });

          if (__parents) {
            Object.entries(__parents).forEach(([name, styles]) => {
              Object.entries(styles).forEach(([key, values]) => {
                values.forEach((value) => {
                  const pseudoClasses = pseudoClassesByWeight[+weight];
                  const className = createClassName(key as keyof BoxStyles, value as BoxStyles[keyof BoxStyles], +weight, breakpoint, name);

                  const item = cssStyles[key as keyof typeof cssStyles] as BoxStyle[];

                  const itemValue = item.find((x) => {
                    if (Array.isArray(x.values)) {
                      return x.values.includes(value);
                    }

                    return typeof value === typeof x.values;
                  });

                  const styleName = itemValue?.styleName ?? key;
                  const styleValue = itemValue?.valueFormat ? itemValue.valueFormat(value as never) : value;

                  const [pseudoClass] = pseudoClasses;

                  acc.push(`.${pseudoClass}-${name}:${pseudoClass} .${className}{${styleName}:${styleValue}}`);
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

    el.innerHTML = styleItems.join('\n');

    requireFlush = false;
  }

  function addClassName<TKey extends keyof BoxStyles, TValue extends BoxStyles[TKey]>(
    key: TKey,
    value: TValue,
    classNames: string[],
    currentPseudoClasses: string[],
    breakpoint: string = 'normal',
    pseudoClassParentName?: string,
  ) {
    const weight = currentPseudoClasses.reduce((sum, pseudoClass) => sum + pseudoClasses[pseudoClass as keyof typeof pseudoClasses], 0);

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

    return `${breakpoint === 'normal' ? '' : `${breakpoint}-`}${pseudoClasses.map((p) => `${p}-`).join('')}${pseudoClassParentName ? `${pseudoClassParentName}-` : ''}${key}-${value as string}`;
  }

  const cronoStylesElementId = 'crono-styles2';

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
