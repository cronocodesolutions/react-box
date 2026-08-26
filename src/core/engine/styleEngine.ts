/* eslint-disable @typescript-eslint/no-explicit-any */
import IdentityFactory from '@cronocode/identity-factory';
import { BoxStyleProps, BoxStyles, PseudoClassesType } from '../../types';
import ObjectUtils from '../../utils/object/objectUtils';
import {
  breakpoints,
  cssStyles as defaultCssStyles,
  pseudo1,
  pseudo2,
  pseudoClasses,
  pseudoClassesByWeight,
  pseudoClassesWeight,
  pseudoGroupClasses,
  themeGroupClass,
} from '../boxStyles';
import { BoxStyle } from '../coreTypes';
import defaultBoxComponents, { BoxComponent, Components } from '../extends/boxComponents';
import { resolveComponentStyles } from '../extends/useComponents';
import Variables from '../variables';

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

export interface StyleEngineOptions extends StylesConfiguration {
  /**
   * The id of the `<style>` element this engine owns. Each engine writes to its own element so
   * instances never corrupt each other's rule ordering. Defaults to a unique id per engine.
   */
  styleElementId?: string;
}

/**
 * An isolated styling engine: its own class-name cache, rule registry, identity factory,
 * variables, prop registry (`Box.extend`) and component registry (`Box.components`).
 * Everything the library used to keep in module scope lives on an instance of this.
 */
export interface StyleEngine {
  /** The id of the `<style>` element this engine writes to. */
  readonly styleElementId: string;
  /** Resolve (and cache) the class list for a Box's props. `signature` is null when the props could not be serialized. */
  resolveClassNames(props: BoxStyleProps<any>, isSvg: boolean): { classNames: string[]; signature: string | null };
  /** Register rules that target a root selector (e.g. `html`) rather than a generated class. */
  addGlobalStyles(props: BoxStyleProps<any>, selector: string): void;
  /** Write every pending rule to this engine's style element. */
  flush(): void;
  /** Drop all generated rules and cached class lists (used between SSG renders). */
  clear(): void;
  /** Apply explicit configuration. Cached class names are dropped when the configuration changes. */
  configure(config: StylesConfiguration): void;
  extend<TProps extends Record<string, BoxStyle[]>, TPropTypes extends Record<string, BoxStyle[]>>(
    variables: Record<string, string>,
    extendedProps: TProps,
    extendedPropTypes: TPropTypes,
  ): { extendedProps: TProps; extendedPropTypes: TPropTypes };
  components<T extends Components>(components: T): T;
  getComponentsStyles(): Components;
  getVariableValue(name: string): string;
}

export const DEFAULT_STYLE_ELEMENT_ID = 'crono-styles';

// The `values` arrays that hold variable-backed tokens (colours, background images, shadows).
// A value declared through `Box.extend({ variables })` is accepted wherever one of these lists
// is declared, so a user token works on every prop that resolves its value to `var(--token)`.
const variableBackedValues: ReadonlySet<unknown> = new Set([Variables.colorValues, Variables.bgImageValues, Variables.shadowValues]);

// Only used to give engines distinct style elements when the caller does not name one. This is
// an id sequence, not engine state — instances share nothing else.
let engineSequence = 0;

function resolveExtends(components: Components): Components {
  const resolved = { ...components };

  for (const [name, component] of Object.entries(resolved)) {
    if (!component.extends) continue;

    const baseComponent = resolved[component.extends];
    if (!baseComponent) continue;

    const { extends: _, ...override } = component;
    resolved[name] = ObjectUtils.mergeDeep<BoxComponent>({}, baseComponent, override);
  }

  return resolved;
}

export function createStyleEngine(options: StyleEngineOptions = {}): StyleEngine {
  const styleElementId = options.styleElementId ?? `${DEFAULT_STYLE_ELEMENT_ID}-${++engineSequence}`;

  const identity = new IdentityFactory();
  const variables = Variables.createRegistry();

  let classNamesMode: NonNullable<StylesConfiguration['classNames']> = options.classNames ?? 'hashed';
  let sinkMode: NonNullable<StylesConfiguration['sink']> = options.sink ?? 'cssom';

  // The prop registry. Copied per engine so `extend()` on one engine cannot leak into another.
  const cssStyles = { ...defaultCssStyles };
  // Sort order for generated rules, derived from prop declaration order. Rebuilt whenever
  // `extend()` adds a prop so extended props sort after the built-ins instead of all sharing 0.
  let cssStylesIndex: Record<string, number> = {};

  function rebuildCssStylesIndex() {
    cssStylesIndex = Object.keys(cssStyles).reduce<Record<string, number>>((acc, key, index) => {
      acc[key] = index;
      return acc;
    }, {});
  }

  rebuildCssStylesIndex();

  let componentsStyles: Components = defaultBoxComponents;

  // Maps a style-signature → the resolved class names. A Box's class list is fully determined
  // by isSvg/clean/component/variant + its recognized style props, so structurally-identical
  // Boxes (e.g. every DataGrid cell) collapse to a single map lookup instead of re-running the
  // merge + walk + identity work. Rule generation is still deduped separately by `generatedRules`.
  const styleCache = new Map<string, string[]>();
  // Track already generated CSS rules to avoid re-generating
  const generatedRules = new Set<string>();
  // Rule keys that matched no value definition. Remembered because `generatedRules` short-circuits
  // the second occurrence of a prop/value pair: without this, the first Box would (correctly) get
  // no class name and every later one would get a class with no rule behind it.
  const unsupportedRules = new Set<string>();
  // Pending rules to be flushed: [sortIndex, breakpointOrder, rule]
  const pendingRules: [number, number, string][] = [];
  // Track the sort keys of rules already in the stylesheet for insertion ordering
  const insertedRuleSortKeys: number[] = [];
  // Number of default/base rules at the start of the stylesheet
  let baseRulesCount = 0;
  let requireFlush = true;
  let isInitialized = false;

  const boxClassName = '_b';
  const svgClassName = '_s';

  // Whether a prop key affects the class list — i.e. one of the keys `addClassNames` dispatches
  // on (style props + pseudo/breakpoint/group wrappers). Checked live (not snapshotted) because
  // `extend()` adds keys to this engine's registry at runtime; mirrors addClassNames exactly.
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

  function addClassNames(
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
      } else {
        unsupportedRules.add(ruleKey);
      }
    }

    // A value the prop does not declare produces no rule, so it must not produce a class either —
    // an unmatched value used to leave a dangling class name in the markup.
    if (unsupportedRules.has(ruleKey)) return;

    classNames.push(className);
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

    let itemValue = item.find((x) => {
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

    if (!itemValue && typeof value === 'string' && variables.isUserVariable(value)) {
      // `Box.extend({ variables })` declares tokens the built-in value lists cannot know about.
      // Accept them on the props whose values are resolved through `var(--token)` anyway.
      itemValue = item.find((x) => variableBackedValues.has(x.values));
    }

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
          const styleValue = (itemValue.valueFormat as any)?.(value, variables.getVariableValue, s) ?? value;
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
          const styleValue = (itemValue.valueFormat as any)?.(value, variables.getVariableValue, s) ?? value;
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

  function createClassName<TKey extends keyof BoxStyles, TValue extends BoxStyles[TKey]>(
    key: TKey,
    value: TValue,
    weight: number,
    breakpoint: string,
    pseudoClassParentName?: string,
  ) {
    const pseudoClassList = pseudoClassesByWeight[weight];
    const serializedValue = Array.isArray(value) ? value.join('_') : value;

    const className = `${breakpoint === 'normal' ? '' : `${breakpoint}-`}${pseudoClassList.map((p) => `${p}-`).join('')}${pseudoClassParentName ? `${pseudoClassParentName}-` : ''}${key}-${serializedValue}`;

    return classNamesMode === 'readable' ? className : identity.getIdentity(className);
  }

  function getElement() {
    let stylesElement = document.getElementById(styleElementId) as HTMLStyleElement | null;

    if (!stylesElement) {
      stylesElement = document.createElement('style');
      stylesElement.setAttribute('id', styleElementId);
      stylesElement.setAttribute('type', 'text/css');
      document.head.insertBefore(stylesElement, document.head.firstChild);
    }

    return stylesElement;
  }

  function flush() {
    const hasPendingVars = variables.hasPendingVariables();
    if (!requireFlush && !hasPendingVars) return;

    const el = getElement();
    const stylesheet = sinkMode === 'cssom' ? (el.sheet as CSSStyleSheet | null) : null;

    // Initialize base styles only once
    if (!isInitialized) {
      const defaultRules = [
        `:root{${variables.generateVariables()}}`,
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

      // The base `:root` block above already carries every variable used so far; dropping them
      // from the pending queue keeps the next flush from emitting a second, identical block.
      variables.getPendingVariables();
      isInitialized = true;
    } else if (variables.hasPendingVariables()) {
      // Add new variables that were used after initialization
      const pendingVars = variables.getPendingVariables();
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

  return {
    styleElementId,

    resolveClassNames(props: BoxStyleProps<any>, isSvg: boolean) {
      const signature = computeSignature(props, isSvg);

      let classNames = signature !== null ? styleCache.get(signature) : undefined;

      if (!classNames) {
        const componentStyles = resolveComponentStyles(props, componentsStyles) as BoxStyleProps;
        const propsToUse = componentStyles ? ObjectUtils.mergeDeep(componentStyles, props) : props;

        classNames = [isSvg ? svgClassName : boxClassName];
        addClassNames(propsToUse, classNames, []);

        if (signature !== null) styleCache.set(signature, classNames);
      }

      return { classNames, signature };
    },

    addGlobalStyles(props: BoxStyleProps<any>, selector: string) {
      const throwawayClassNames: string[] = [];
      addClassNames(props, throwawayClassNames, [], undefined, undefined, selector);
    },

    flush,

    clear() {
      generatedRules.clear();
      unsupportedRules.clear();
      pendingRules.length = 0;
      insertedRuleSortKeys.length = 0;
      baseRulesCount = 0;
      isInitialized = false;
      // Reset the per-Box class cache too: rules were cleared, so cached class lists must be
      // recomputed (and re-registered) on the next render — otherwise SSG would drop styles.
      styleCache.clear();
    },

    configure(config: StylesConfiguration) {
      if (config.classNames) classNamesMode = config.classNames;
      if (config.sink) sinkMode = config.sink;
      // Cached class lists may have been resolved under a different naming mode.
      styleCache.clear();
    },

    extend(variablesToSet, extendedProps, extendedPropTypes) {
      variables.setUserVariables(variablesToSet);

      Object.entries(extendedProps).forEach(([key, val]) => {
        (cssStyles as Record<string, BoxStyle[]>)[key] = val;
      });

      Object.entries(extendedPropTypes).forEach(([key, val]) => {
        const prev = cssStyles[key as keyof typeof cssStyles];
        (cssStyles as Record<string, BoxStyle[]>)[key] = prev ? [...val, ...prev] : val;
      });

      // New props change both what counts as a style key and the rule sort order, so the
      // signature cache and the derived index are no longer valid. New variables can likewise
      // turn a value that matched nothing into a supported one.
      rebuildCssStylesIndex();
      unsupportedRules.forEach((ruleKey) => generatedRules.delete(ruleKey));
      unsupportedRules.clear();
      styleCache.clear();

      return { extendedProps, extendedPropTypes };
    },

    components(components) {
      // Merge into what this engine already holds, not into the pristine defaults: sequential
      // calls (one per feature module, say) used to drop every component registered before them.
      componentsStyles = resolveExtends(ObjectUtils.mergeDeep<Components>(componentsStyles, components));
      // Cached class lists were resolved against the previous component defaults.
      styleCache.clear();

      return components;
    },

    getComponentsStyles() {
      return componentsStyles;
    },

    getVariableValue: variables.getVariableValue,
  };
}
