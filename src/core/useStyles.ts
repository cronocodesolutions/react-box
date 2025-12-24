/* eslint-disable @typescript-eslint/no-explicit-any */
import IdentityFactory from '@cronocode/identity-factory';
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
  themeGroupClass,
} from './boxStyles';
import { BoxStyle } from './coreTypes';
import useComponents from './extends/useComponents';
import Variables from './variables';

const identity = new IdentityFactory();

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isTestEnv = typeof process === 'object' && process.env?.NODE_ENV === 'test';

const useEff = isBrowser && !isTestEnv ? useLayoutEffect : useEffect;

const boxClassName = '_b';
const svgClassName = '_s';

export default function useStyles(props: BoxStyleProps<any>, isSvg: boolean) {
  const componentsStyles = useComponents(props) as BoxStyleProps;

  const propsToUse = useMemo(() => {
    return componentsStyles ? ObjectUtils.mergeDeep(componentsStyles, props) : props;
  }, [props, componentsStyles]);

  // Generate classNames on every render to ensure all styles are registered
  const classNames: string[] = [isSvg ? svgClassName : boxClassName];
  StylesContextImpl.addClassNames(propsToUse, classNames, []);

  // Use useLayoutEffect to flush after DOM is ready
  // Empty dependency array would only run once, so we use propsToUse to trigger on changes
  useEff(() => {
    StylesContextImpl.flush();
  }, [propsToUse]);

  return classNames;
}

namespace StylesContextImpl {
  let requireFlush = true;
  let isInitialized = false;

  // Track already generated CSS rules to avoid re-generating
  const generatedRules = new Set<string>();
  // Pending rules to be flushed: [sortIndex, breakpointOrder, rule]
  const pendingRules: [number, number, string][] = [];
  // Track the sort keys of rules already in the stylesheet for insertion ordering
  const insertedRuleSortKeys: number[] = [];
  // Number of default/base rules at the start of the stylesheet
  let baseRulesCount = 0;

  // Pre-compute cssStyles index for sorting
  const cssStylesIndex: Record<string, number> = Object.keys(cssStyles).reduce<Record<string, number>>((acc, key, index) => {
    acc[key] = index;
    return acc;
  }, {});

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
    props: BoxStyleProps<any>,
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
        Object.entries(value).forEach(([name, pseudoClassProps]) => {
          addClassNames(pseudoClassProps as BoxStyles, classNames, [...currentPseudoClasses, pseudoGroupClasses[key]], breakpoint, name);
        });
      } else if (ObjectUtils.isKeyOf(key, themeGroupClass)) {
        Object.entries(value).forEach(([name, themeProps]) => {
          const themePseudoClasses = [...currentPseudoClasses, themeGroupClass[key]];
          // Handle nested pseudoGroupClasses inside theme
          Object.entries(themeProps as BoxStyleProps).forEach(([themeKey, themeValue]) => {
            if (ObjectUtils.isKeyOf(themeKey, pseudoGroupClasses)) {
              Object.entries(themeValue).forEach(([groupName, groupProps]) => {
                addClassNames(
                  groupProps as BoxStyles,
                  classNames,
                  [...themePseudoClasses, pseudoGroupClasses[themeKey]],
                  breakpoint,
                  // Use | as separator to distinguish theme from group name
                  `${name}|${groupName}`,
                );
              });
            } else {
              addClassNames({ [themeKey]: themeValue } as BoxStyles, classNames, themePseudoClasses, breakpoint, name);
            }
          });
        });
      }
    });
  }

  export function flush() {
    const hasPendingVars = Variables.hasPendingVariables();
    if (!requireFlush && !hasPendingVars) return;

    console.debug('\x1b[36m%s\x1b[0m', '[react-box]: flush');

    const el = getElement();
    const stylesheet = el.sheet as CSSStyleSheet | null;

    // Initialize base styles only once
    if (!isInitialized) {
      const defaultRules = [
        `:root{${Variables.generateVariables()}}`,
        `:root{--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;}`,
        `#crono-box {position: absolute;top: 0;left: 0;height: 0;z-index:99999;}`,
        `html{font-size: 16px;font-family: Arial, sans-serif;}`,
        `body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}`,
        `a,ul{all: unset;}`,
        `button{color: inherit;}`,
        `input[type="number"]{-moz-appearance: textfield;}`,
        `input[type="number"]::-webkit-outer-spin-button,input[type="number"]::-webkit-inner-spin-button{-webkit-appearance: none;margin: 0;}`,
        `.${boxClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;background-color: initial;transition: all var(--transitionTime);box-sizing: border-box;font-family: inherit;font-size: inherit;}`,
        `.${svgClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;transition: all var(--svgTransitionTime);}`,
        `.${svgClassName} path,.${svgClassName} circle,.${svgClassName} rect,.${svgClassName} line {transition: all var(--svgTransitionTime);}`,
      ];

      if (stylesheet && !isTestEnv) {
        // Insert default rules at the beginning of the stylesheet
        for (const rule of defaultRules) {
          try {
            stylesheet.insertRule(rule, baseRulesCount);
            baseRulesCount++;
          } catch {
            // Skip invalid rules
          }
        }
      } else {
        el.textContent = defaultRules.join('\n');
      }

      isInitialized = true;
    } else if (Variables.hasPendingVariables()) {
      // Add new variables that were used after initialization
      const pendingVars = Variables.getPendingVariables();
      const varsRule = `:root{${Object.entries(pendingVars)
        .map(([key, val]) => `--${key}: ${val};`)
        .join('')}}`;

      if (stylesheet && !isTestEnv) {
        try {
          // Insert new variables rule at the start (after existing base rules)
          stylesheet.insertRule(varsRule, 0);
          baseRulesCount++;
        } catch {
          // Skip if invalid
        }
      } else {
        el.textContent = varsRule + '\n' + el.textContent;
      }
    }

    // Process only pending rules (new styles that haven't been generated yet)
    if (pendingRules.length > 0) {
      // Sort pending rules by breakpoint order first, then by cssStyles index
      pendingRules.sort((a, b) => a[1] - b[1] || a[0] - b[0]);

      // Use insertRule in browser for correct ordering, textContent in tests
      if (stylesheet && !isTestEnv) {
        for (const [sortIndex, breakpointOrder, rule] of pendingRules) {
          const sortKey = breakpointOrder * 100000 + sortIndex;

          // Find the correct insertion index among dynamic rules
          let insertIndex = insertedRuleSortKeys.length;
          for (let i = 0; i < insertedRuleSortKeys.length; i++) {
            if (sortKey < insertedRuleSortKeys[i]) {
              insertIndex = i;
              break;
            }
          }

          try {
            // Offset by baseRulesCount to insert after default rules
            stylesheet.insertRule(rule, baseRulesCount + insertIndex);
            insertedRuleSortKeys.splice(insertIndex, 0, sortKey);
          } catch {
            // Fallback: append if insertRule fails
            stylesheet.insertRule(rule, stylesheet.cssRules.length);
            insertedRuleSortKeys.push(sortKey);
          }
        }
      } else {
        // Test environment or no sheet access: use textContent (already sorted)
        el.textContent += pendingRules.map((r) => r[2]).join('');
      }

      pendingRules.length = 0;
    }

    requireFlush = false;
  }

  function generateRule(
    key: string,
    value: string | number | boolean,
    weight: number,
    breakpoint: string,
    pseudoClassParentName?: string,
  ): { rule: string; sortIndex: number; breakpointOrder: number } | null {
    const item = cssStyles[key as keyof typeof cssStyles] as BoxStyle[];

    const itemValue = item.find((x) => {
      if (Array.isArray(x.values)) {
        return x.values.includes(value);
      }
      return typeof value === typeof x.values;
    });

    if (!itemValue) return null;

    const sortIndex = cssStylesIndex[key] ?? 0;
    const breakpointOrder = breakpoints[breakpoint as keyof typeof breakpoints] ?? 0;

    const className = createClassName(
      key as keyof BoxStyles,
      value as BoxStyles[keyof BoxStyles],
      weight,
      breakpoint,
      pseudoClassParentName,
    );

    if (pseudoClassParentName) {
      const pseudoClassList = pseudoClassesByWeight[weight];
      const hasTheme = pseudoClassList.includes('theme');
      const otherPseudoClasses = hasTheme ? pseudoClassList.filter((p) => p !== 'theme') : pseudoClassList;
      const pseudoClassesToUse = otherPseudoClasses.map((p) => pseudoClasses[p]).join('');

      // Check if pseudoClassParentName contains both theme and group (format: themeName|groupName)
      const hasThemeAndGroup = pseudoClassParentName.includes('|');
      let defaultSelector: string;

      if (hasThemeAndGroup) {
        // Combined theme + group: .themeName .groupName:hover .className
        const [themeName, groupName] = pseudoClassParentName.split('|');
        defaultSelector = `.${themeName} .${groupName}${pseudoClassesToUse} .${className}`;
      } else if (hasTheme) {
        // Theme only: .themeName .className:hover
        defaultSelector = `.${pseudoClassParentName} .${className}${pseudoClassesToUse}`;
      } else {
        // Group only: .groupName:hover .className
        defaultSelector = `.${pseudoClassParentName}${pseudoClassesToUse} .${className}`;
      }
      const selector = itemValue.selector?.(defaultSelector, '') ?? defaultSelector;

      const styleName = Array.isArray(itemValue.styleName) ? itemValue.styleName : [itemValue.styleName ?? key];
      const styleValue = itemValue.valueFormat?.(value as never, Variables.getVariableValue) ?? value;

      const rule = `${selector}{${styleName.map((s) => `${s}:${styleValue}`).join(';')}}`;

      // Wrap in media query if needed
      if (breakpoint !== 'normal') {
        return { rule: `@media(min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px){${rule}}`, sortIndex, breakpointOrder };
      }
      return { rule, sortIndex, breakpointOrder };
    } else {
      const pseudoClassesToUse = pseudoClassesByWeight[weight].map((p) => pseudoClasses[p]).join('');
      const selector = itemValue.selector?.(`.${className}`, pseudoClassesToUse) ?? `.${className}${pseudoClassesToUse}`;

      const styleName = Array.isArray(itemValue.styleName) ? itemValue.styleName : [itemValue.styleName ?? key];
      const styleValue = itemValue.valueFormat?.(value as never, Variables.getVariableValue) ?? value;

      const rule = `${selector}{${styleName.map((s) => `${s}:${styleValue}`).join(';')}}`;

      // Wrap in media query if needed
      if (breakpoint !== 'normal') {
        return { rule: `@media(min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px){${rule}}`, sortIndex, breakpointOrder };
      }
      return { rule, sortIndex, breakpointOrder };
    }
  }

  export function clear() {
    stylesToGenerate = {};
    generatedRules.clear();
    pendingRules.length = 0;
    insertedRuleSortKeys.length = 0;
    baseRulesCount = 0;
    isInitialized = false;
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
    const className = createClassName(key, value, weight, breakpoint, pseudoClassParentName);

    // Create a unique key to track if this rule has been generated
    const ruleKey = `${breakpoint}-${weight}-${key}-${value}-${pseudoClassParentName ?? ''}`;

    // Only generate rule if it hasn't been generated before
    if (!generatedRules.has(ruleKey)) {
      generatedRules.add(ruleKey);

      const result = generateRule(key, value as string | number | boolean, weight, breakpoint, pseudoClassParentName);
      if (result) {
        pendingRules.push([result.sortIndex, result.breakpointOrder, result.rule]);
        requireFlush = true;
      }

      // Still maintain stylesToGenerate for backward compatibility (tests, etc.)
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
        stylesToGenerate[breakpoint][weight].__parents![pseudoClassParentName][key].add(value);
      } else {
        stylesToGenerate[breakpoint][weight][key].add(value);
      }
    }

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
    let stylesElement = document.getElementById(cronoStylesElementId) as HTMLStyleElement | null;

    if (!stylesElement) {
      document.createElement('style');
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
