/* eslint-disable @typescript-eslint/no-explicit-any */
import IdentityFactory from '@cronocode/identity-factory';
import { useEffect, useLayoutEffect } from 'react';
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
import { resolveComponentStyles } from './extends/useComponents';
import Variables from './variables';

const identity = new IdentityFactory();

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const useEff = isBrowser ? useLayoutEffect : useEffect;

/** Explicit engine configuration — replaces the previous NODE_ENV-based sniffing. */
export interface StylesConfiguration {
  /**
   * How generated class names are emitted.
   * - `'hashed'` (default): names go through the identity factory (short, stable hashes).
   * - `'readable'`: the descriptive name is kept as-is (useful for tests and debugging).
   */
  classNames?: 'hashed' | 'readable';
  /**
   * How generated rules reach the document.
   * - `'cssom'` (default): `CSSStyleSheet.insertRule` when a stylesheet is available.
   * - `'textContent'`: rule text is appended to the style element (readable in tests; always used when no stylesheet exists, e.g. SSR).
   */
  sink?: 'cssom' | 'textContent';
}

const boxClassName = '_b';
const svgClassName = '_s';

// Whether a prop key affects the class list — i.e. one of the keys `addClassNames` dispatches
// on (style props + pseudo/breakpoint/group wrappers). Checked live (not snapshotted) because
// `Box.extend()` adds keys to these maps at runtime; mirrors addClassNames exactly.
function isStyleKey(key: string): boolean {
  return (
    ObjectUtils.isKeyOf(key, cssStyles) ||
    ObjectUtils.isKeyOf(key, pseudo1) ||
    ObjectUtils.isKeyOf(key, pseudo2) ||
    ObjectUtils.isKeyOf(key, breakpoints) ||
    ObjectUtils.isKeyOf(key, pseudoGroupClasses) ||
    ObjectUtils.isKeyOf(key, themeGroupClass)
  );
}

// Maps a style-signature → the resolved class names. A Box's class list is fully determined
// by isSvg/clean/component/variant + its recognized style props, so structurally-identical
// Boxes (e.g. every DataGrid cell) collapse to a single map lookup instead of re-running the
// merge + walk + identity work. Rule generation is still deduped separately by `generatedRules`.
const styleCache = new Map<string, string[]>();

/**
 * Build a stable cache key from the inputs that determine a Box's class list. Component
 * defaults are keyed via component/variant/clean (they are immutable per name), and JSON is
 * used for values so e.g. `p={4}` and `p="4"` never collide. Returns null if a value can't be
 * serialized, in which case the caller falls back to the uncached path (today's behavior).
 */
function computeSignature(props: BoxStyleProps<any>, isSvg: boolean): string | null {
  try {
    let sig = `${isSvg ? 's' : 'b'}|${props.clean ? 'c' : ''}|${props.component ?? ''}|`;
    if (props.variant !== undefined) sig += JSON.stringify(props.variant);
    sig += '|';

    for (const key in props) {
      if (key === 'clean' || key === 'component' || key === 'variant') continue;
      const value = (props as Record<string, unknown>)[key];
      // Mirror addClassName's early return on null/undefined so they don't affect the key.
      if (value === undefined || value === null) continue;
      if (isStyleKey(key)) {
        sig += `${key}:${JSON.stringify(value)};`;
      }
    }

    return sig;
  } catch {
    return null;
  }
}

export default function useStyles(props: BoxStyleProps<any>, isSvg: boolean) {
  const sig = computeSignature(props, isSvg);

  let classNames = sig !== null ? styleCache.get(sig) : undefined;

  if (!classNames) {
    const componentsStyles = resolveComponentStyles(props) as BoxStyleProps;
    const propsToUse = componentsStyles ? ObjectUtils.mergeDeep(componentsStyles, props) : props;

    classNames = [isSvg ? svgClassName : boxClassName];
    StylesContextImpl.addClassNames(propsToUse, classNames, []);

    if (sig !== null) styleCache.set(sig, classNames);
  }

  // Flush after DOM is ready. Keyed on the stable signature so it only re-runs when the class
  // list changes; a cache hit added no rules, and a miss (new signature) fires the effect and
  // flush() drains all pending rules globally. Falls back to `props` when the signature is null.
  useEff(() => {
    StylesContextImpl.flush();
  }, [sig ?? props]);

  return classNames;
}

export function useGlobalStyles(props: BoxStyleProps<any> | undefined, selector: string) {
  if (props) {
    const throwawayClassNames: string[] = [];
    StylesContextImpl.addClassNames(props, throwawayClassNames, [], undefined, undefined, selector);
  }

  useEff(() => {
    StylesContextImpl.flush();
  }, [props, selector]);
}

namespace StylesContextImpl {
  let requireFlush = true;
  let isInitialized = false;

  let classNamesMode: NonNullable<StylesConfiguration['classNames']> = 'hashed';
  let sinkMode: NonNullable<StylesConfiguration['sink']> = 'cssom';

  /** Apply explicit engine configuration. Call before the first render — cached class names are dropped when the configuration changes. */
  export function configure(config: StylesConfiguration) {
    if (config.classNames) classNamesMode = config.classNames;
    if (config.sink) sinkMode = config.sink;
    // Cached class lists may have been resolved under a different naming mode.
    styleCache.clear();
  }

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
        [key: string]: Set<string | number | boolean | readonly (string | number | boolean)[]>;
      } & {
        __parents?: {
          // key = parent name
          [key: string]: {
            // key = css style (box props)
            [key: string]: Set<string | number | boolean | readonly (string | number | boolean)[]>;
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
    rootSelector?: string,
  ) {
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (ObjectUtils.isKeyOf(key, cssStyles)) {
        addClassName(key, value, classNames, currentPseudoClasses, breakpoint, pseudoClassParentName, rootSelector);
      } else if (ObjectUtils.isKeyOf(key, pseudo1)) {
        addClassNames(value as BoxStyleProps, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName, rootSelector);
      } else if (ObjectUtils.isKeyOf(key, pseudo2)) {
        if (Array.isArray(value)) {
          const [_, styles] = value as [unknown, BoxStyleProps];
          addClassNames(styles, classNames, [...currentPseudoClasses, key], breakpoint, pseudoClassParentName, rootSelector);
        }
        if (ObjectUtils.isObject(value)) {
          addClassNames(
            value as BoxStyleProps,
            classNames,
            [...currentPseudoClasses, key],
            breakpoint,
            pseudoClassParentName,
            rootSelector,
          );
        }
      } else if (ObjectUtils.isKeyOf(key, breakpoints)) {
        addClassNames(value as BoxStyleProps, classNames, currentPseudoClasses, key, pseudoClassParentName, rootSelector);
      } else if (ObjectUtils.isKeyOf(key, pseudoGroupClasses)) {
        Object.entries(value).forEach(([name, pseudoClassProps]) => {
          addClassNames(
            pseudoClassProps as BoxStyles,
            classNames,
            [...currentPseudoClasses, pseudoGroupClasses[key]],
            breakpoint,
            name,
            rootSelector,
          );
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
                  rootSelector,
                );
              });
            } else {
              addClassNames({ [themeKey]: themeValue } as BoxStyles, classNames, themePseudoClasses, breakpoint, name, rootSelector);
            }
          });
        });
      }
    });
  }

  export function flush() {
    const hasPendingVars = Variables.hasPendingVariables();
    if (!requireFlush && !hasPendingVars) return;

    const el = getElement();
    const stylesheet = sinkMode === 'cssom' ? (el.sheet as CSSStyleSheet | null) : null;

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

      if (stylesheet) {
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

      if (stylesheet) {
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

      // Use insertRule in browser for correct ordering, textContent otherwise
      if (stylesheet) {
        for (const [sortIndex, breakpointOrder, rule] of pendingRules) {
          const sortKey = breakpointOrder * 100000 + sortIndex;

          // Find the insertion index among dynamic rules. insertedRuleSortKeys stays sorted
          // ascending, so binary-search for the first key strictly greater than sortKey
          // (O(log n) instead of a linear scan — matters on heavy pages with many rules).
          let lo = 0;
          let hi = insertedRuleSortKeys.length;
          while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (sortKey < insertedRuleSortKeys[mid]) {
              hi = mid;
            } else {
              lo = mid + 1;
            }
          }
          const insertIndex = lo;

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
        // textContent sink or no sheet access: append rule text (already sorted)
        el.textContent += pendingRules.map((r) => r[2]).join('');
      }

      pendingRules.length = 0;
    }

    requireFlush = false;
  }

  function generateRule(
    key: string,
    value: string | number | boolean | readonly (string | number | boolean)[],
    weight: number,
    breakpoint: string,
    pseudoClassParentName?: string,
    rootSelector?: string,
  ): { rule: string; sortIndex: number; breakpointOrder: number } | null {
    const item = cssStyles[key as keyof typeof cssStyles] as BoxStyle[];

    const itemValue = item.find((x) => {
      if (Array.isArray(x.values)) {
        if (Array.isArray(value)) {
          // Tuple definition: x.values is a tuple of allowed-value arrays; each position must contain value[i]
          if (x.values.length > 0 && Array.isArray(x.values[0])) {
            return x.values.length === value.length && (x.values as unknown[][]).every((allowed, i) => allowed.includes(value[i]));
          }
          return x.values.length === value.length && x.values.every((v, i) => typeof v === typeof value[i]);
        }
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

      if (rootSelector) {
        // Global mode: rules target the root selector (e.g. `html`) directly.
        // Group selectors are not meaningful for the document root — skip them.
        if (hasThemeAndGroup) return null;
        if (hasTheme) {
          // Theme on same element as rootSelector → compound selector
          defaultSelector = `${rootSelector}.${pseudoClassParentName}${pseudoClassesToUse}`;
        } else {
          return null;
        }
      } else if (hasThemeAndGroup) {
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

      const rule = `${selector}{${styleName
        .map((s) => {
          const styleValue = (itemValue.valueFormat as any)?.(value, Variables.getVariableValue, s) ?? value;
          return `${s}:${styleValue}`;
        })
        .join(';')}}`;

      // Wrap in media query if needed
      if (breakpoint !== 'normal') {
        return { rule: `@media(min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px){${rule}}`, sortIndex, breakpointOrder };
      }
      return { rule, sortIndex, breakpointOrder };
    } else {
      const pseudoClassesToUse = pseudoClassesByWeight[weight].map((p) => pseudoClasses[p]).join('');
      const baseSelector = rootSelector ?? `.${className}`;
      const selector = itemValue.selector?.(baseSelector, pseudoClassesToUse) ?? `${baseSelector}${pseudoClassesToUse}`;

      const styleName = Array.isArray(itemValue.styleName) ? itemValue.styleName : [itemValue.styleName ?? key];

      const rule = `${selector}{${styleName
        .map((s) => {
          const styleValue = (itemValue.valueFormat as any)?.(value, Variables.getVariableValue, s) ?? value;
          return `${s}:${styleValue}`;
        })
        .join(';')}}`;

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
    // Reset the per-Box class cache too: rules were cleared, so cached class lists must be
    // recomputed (and re-registered) on the next render — otherwise SSG would drop styles.
    styleCache.clear();
  }

  function addClassName<TKey extends keyof BoxStyles, TValue extends BoxStyles[TKey]>(
    key: TKey,
    value: TValue | undefined | null,
    classNames: string[],
    currentPseudoClasses: PseudoClassesType[],
    breakpoint: string = 'normal',
    pseudoClassParentName?: string,
    rootSelector?: string,
  ) {
    if (value === undefined || value === null) return;

    const weight = currentPseudoClasses.reduce((sum, pseudoClass) => sum + pseudoClassesWeight[pseudoClass], 0);
    const className = createClassName(key, value, weight, breakpoint, pseudoClassParentName);

    // Create a unique key to track if this rule has been generated
    const serializedValue = Array.isArray(value) ? value.join('_') : value;
    const ruleKey = `${breakpoint}-${weight}-${key}-${serializedValue}-${pseudoClassParentName ?? ''}-${rootSelector ?? ''}`;

    // Only generate rule if it hasn't been generated before
    if (!generatedRules.has(ruleKey)) {
      generatedRules.add(ruleKey);

      const result = generateRule(
        key,
        value as string | number | boolean | readonly (string | number | boolean)[],
        weight,
        breakpoint,
        pseudoClassParentName,
        rootSelector,
      );
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
    const serializedValue = Array.isArray(value) ? value.join('_') : value;

    const className = `${breakpoint === 'normal' ? '' : `${breakpoint}-`}${pseudoClasses.map((p) => `${p}-`).join('')}${pseudoClassParentName ? `${pseudoClassParentName}-` : ''}${key}-${serializedValue}`;

    return classNamesMode === 'readable' ? className : identity.getIdentity(className);
  }

  const cronoStylesElementId = 'crono-styles';

  function getElement() {
    let stylesElement = document.getElementById(cronoStylesElementId) as HTMLStyleElement | null;

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
  export const configure = StylesContextImpl.configure;
}
