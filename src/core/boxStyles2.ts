import IdentityFactory from '@cronocode/identity-factory';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { ThemeComponentProps, useTheme } from './theme2';

// TYPINGS ====================
type ArrayType<T> = T extends (infer U)[] ? U : T;

type ExtractBoxStyleType<T> = T extends ReadonlyArray<infer U> ? T[number] : T;

interface BoxStyleArray {
  values: ReadonlyArray<string>;
  valueFormat?: (value: string) => string;
}

interface BoxStyleNumber {
  values: number;
  valueFormat?: (value: number) => string;
}

interface BoxStyleString {
  values: string;
  valueFormat?: (value: string) => string;
}

type BoxStyle = (BoxStyleArray | BoxStyleNumber | BoxStyleString) & {
  styleName?: string;
};

export type ExtractBoxStyles<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: ExtractBoxStyleType<ArrayType<T[K]>['values']>;
};

export const cssStyles = {
  display: [
    {
      values: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'contents'] as const,
    },
  ],
  width: [
    { values: 0, valueFormat: (value: number) => `${value / 4}rem` },
    {
      values: ['fit'] as const,
      valueFormat: () => '100%',
    },
    {
      values: ['fit-screen'] as const,
      valueFormat: () => '100vw',
    },
    {
      values: ['auto', 'fit-content', 'max-content', 'min-content'] as const,
    },
  ],
  b: [
    {
      values: 0,
      styleName: 'border-width',
      valueFormat: (value: number) => `${value}px`,
    },
  ],
  m: [
    {
      values: 0,
      styleName: 'margin',
      valueFormat: (value: number) => `${value / 4}rem`,
    },
  ],
} satisfies Record<string, BoxStyle[]>;

export namespace Augmented {
  export interface BoxProps {}
  export interface SvgProps {}
}

export type BoxCssStyles = ExtractBoxStyles<typeof cssStyles>;

const pseudo1 = {
  hover: 1,
  focus: 2,
  active: 4,
};

const pseudo2 = {
  checked: 8,
  disabled: 16,
};

const pseudoClasses = { ...pseudo1, ...pseudo2 };

const pseudoClassesByWeight = Object.entries(pseudoClasses).reduce(
  (acc, [key, weight]) => {
    Object.entries(acc).forEach(([prevWeight, pseudoClasses]) => {
      acc[+prevWeight + weight] = [...pseudoClasses, key];
    });

    return acc;
  },
  { 0: [] } as { [key: number]: string[] },
);

type BoxPseudoClassesStyles = {
  [K in keyof typeof pseudo1]?: BoxStylesWithPseudoClasses;
};
type BoxPseudoClassesStyles2 = {
  [K in keyof typeof pseudo2]?: boolean | [boolean, BoxStylesWithPseudoClasses];
};

const pseudoGroupClasses = {
  hoverGroup: 'hover',
  focusGroup: 'focus',
  activeGroup: 'active',
} satisfies { [key: string]: keyof typeof pseudoClasses };

type BoxPseudoGroupClassesStyles = {
  [K in keyof typeof pseudoGroupClasses]?: string | Record<string, BoxCssStyles>;
};

type BoxStylesWithPseudoClasses = BoxCssStyles &
  BoxPseudoClassesStyles &
  BoxPseudoClassesStyles2 &
  BoxPseudoGroupClassesStyles &
  Augmented.BoxProps;

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

type BoxBreakpointsStyles = {
  [K in keyof typeof breakpoints]?: BoxStylesWithPseudoClasses;
};

export type BoxThemeStyles = BoxStylesWithPseudoClasses & BoxBreakpointsStyles & Augmented.BoxProps;
export type BoxStyles = BoxStylesWithPseudoClasses & BoxBreakpointsStyles & ThemeComponentProps & Augmented.BoxProps;

// TYPINGS ====================

const identity = new IdentityFactory();
let requireFlush = true;

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const useEff = isBrowser ? useLayoutEffect : useEffect;

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
const boxClassName = '_b';
const svgClassName = '_s';

export function useStyles(props: BoxStyles, isSvg: boolean) {
  useEff(flush, [props]);

  const theme = useTheme(props);

  return useMemo(() => {
    const classNames: string[] = [isSvg ? svgClassName : boxClassName];

    const propsToUse = theme ? mergeDeep(theme, props) : props;

    addClassNames(propsToUse, classNames, []);

    return classNames;
  }, [props, isSvg, theme]);
}

function addClassNames(
  props: BoxCssStyles,
  classNames: string[],
  currentPseudoClasses: string[],
  breakpoint?: string,
  pseudoClassParentName?: string,
) {
  Object.entries(props).forEach(([key, value]) => {
    if (key in cssStyles) {
      addClassName(key as keyof BoxCssStyles, value, classNames, currentPseudoClasses, breakpoint, pseudoClassParentName);
    } else if (key in pseudo1) {
      addClassNames(value as BoxCssStyles, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName);
    } else if (key in pseudo2) {
      if (Array.isArray(value)) {
        const [_, styles] = value;
        addClassNames(styles as BoxCssStyles, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName);
      }
    } else if (key in breakpoints) {
      addClassNames(value as BoxCssStyles, classNames, currentPseudoClasses, key, pseudoClassParentName);
    } else if (key in pseudoGroupClasses) {
      if (typeof value === 'string') {
        classNames.push(`${pseudoGroupClasses[key as keyof typeof pseudoGroupClasses]}-${value}`);
      } else {
        Object.entries(value).forEach(([name, pseudoClassProps]) => {
          addClassNames(
            pseudoClassProps as BoxCssStyles,
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

function addClassName<TKey extends keyof BoxCssStyles>(
  key: TKey,
  value: BoxCssStyles[TKey],
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

function flush() {
  if (!requireFlush) return;

  console.debug('\x1b[36m%s\x1b[0m', '[react-box]: flush');

  const defaultStyles = `:root{${BoxInternal.getVariables()}--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;}#crono-box {position: absolute;top: 0;left: 0;height: 0;}
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
            const className = createClassName(key as keyof BoxCssStyles, value as BoxCssStyles[keyof BoxCssStyles], +weight, breakpoint);

            const item = cssStyles[key as keyof BoxCssStyles];

            const itemValue = (item as BoxStyle[]).find((x) => {
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
                const className = createClassName(
                  key as keyof BoxCssStyles,
                  value as BoxCssStyles[keyof BoxCssStyles],
                  +weight,
                  breakpoint,
                  name,
                );

                const item = cssStyles[key as keyof BoxCssStyles];

                const itemValue = (item as BoxStyle[]).find((x) => {
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

function createClassName<TKey extends keyof BoxCssStyles>(
  key: TKey,
  value: BoxCssStyles[TKey],
  weight: number,
  breakpoint: string,
  pseudoClassParentName?: string,
) {
  const pseudoClasses = pseudoClassesByWeight[weight];

  return `${breakpoint === 'normal' ? '' : `${breakpoint}-`}${pseudoClasses.map((p) => `${p}-`).join('')}${pseudoClassParentName ? `${pseudoClassParentName}-` : ''}${key}-${value as string}`;
}

export const cronoStylesElementId = 'crono-styles2';

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

function mergeDeep(...objects: object[]) {
  const isObject = (obj?: unknown) => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = (prev as any)[key];
      const oVal = (obj as any)[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        (prev as any)[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        (prev as any)[key] = mergeDeep(pVal, oVal);
      } else {
        (prev as any)[key] = oVal;
      }
    });

    return prev;
  }, {});
}

namespace BoxInternal {
  let _variables: string = '';

  export function setVariables(variables: Record<string, string>) {
    _variables = Object.entries(variables)
      .map(([key, val]) => `--${key}: ${val};`)
      .join('');
  }

  export function getVariables() {
    return _variables;
  }

  export function setProps(props: Record<string, BoxStyle[]>) {
    Object.entries(props).forEach(([key, val]) => {
      (cssStyles as Record<string, BoxStyle[]>)[key] = val;
    });
  }
}

namespace Box2 {
  export function extend<TVar extends string, TProps extends Record<string, BoxStyle[]>>(variables: Record<string, string>, props: TProps) {
    BoxInternal.setVariables(variables);
    BoxInternal.setProps(props);

    return props;
  }
}

export type ExtendedProps<T extends Record<string, ReadonlyArray<string>>> = {
  [K in keyof T]?: T[K][number];
};

const colors = [
  'white',
  'black',
  'black1',
  'violet',
  'violetLight',
  'violetLighter',
  'violetDark',
  'gray1',
  'gray2',
  'dark',
  'red',
] as const;

export const extendedProps = Box2.extend(
  {
    white: '#fff',
    black: '#07071b',
    black1: '#1e293b',
    violet: '#988bee',
    violetLight: '#e8edfd',
    violetLighter: '#f6f8fe',
    violetDark: '#5f3e66',
    gray1: '#94a3b833',
    gray2: '#94a3b8',
    dark: '#272822',
    red: 'red',
  },
  {
    color: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
      },
    ],
    bgColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
        styleName: 'background-color',
      },
    ],
    borderColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
        styleName: 'border-color',
      },
    ],
    outlineColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
        styleName: 'outline-color',
      },
    ],
  },
);
