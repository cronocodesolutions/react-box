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
import { createSink, SinkMode, SortedRule, StyleSink } from './styleSink';

/** Explicit engine configuration — replaces the previous NODE_ENV-based sniffing. */
export interface StylesConfiguration {
  /**
   * How generated class names are emitted.
   * - `'hashed'` (default): names go through the identity factory (short, stable hashes).
   * - `'readable'`: the descriptive name is kept as-is (useful for tests and debugging).
   */
  classNames?: 'hashed' | 'readable';
  /**
   * Where generated rules are written. Defaults to the environment: a stylesheet in the browser,
   * a string on the server — so server rendering needs no DOM at all.
   * - `'cssom'`: `CSSStyleSheet.insertRule` (falls back to rule text when the element has no stylesheet).
   * - `'textContent'`: the style element's text (readable in tests and DevTools).
   * - `'string'`: kept in memory only, read back with `getStyles()` — the server-rendering sink.
   *
   * Changing the sink of an engine that has already emitted CSS starts a fresh stylesheet: those
   * rules live in the old sink, so the engine forgets them and re-emits them on the next render.
   */
  sink?: SinkMode;
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
  /** Write every pending rule to this engine's sink. */
  flush(): void;
  /**
   * The CSS this engine has emitted, as text. Flushes first, so a server render — where no effect
   * ever runs — still gets every rule its markup refers to.
   */
  getStyles(): string;
  /**
   * Drop everything this engine has emitted: generated rules, cached class lists, the class-name
   * counter, the variables it has resolved, and the contents of its sink. What survives is
   * registration — extended props, components and declared variables. Call it between SSR requests.
   */
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

// Every character a CSS identifier cannot hold. Class names are used verbatim as selectors, so a
// readable name for a value like `1/2`, `50%` or `1.5` would otherwise build a selector the CSS
// parser rejects (`.width-1/2`) and the rule would be dropped. Hashed names are alphanumeric, so
// escaping is a no-op in the default mode. Non-ASCII is legal in an identifier and stays as-is.
const invalidInCssIdentifier = /[^\w\u00A0-\uFFFF-]/g;

/** A class name escaped for use inside a CSS selector: `width-1/2` becomes `width-1\/2`. */
function escapeClassName(className: string): string {
  return className.replace(invalidInCssIdentifier, (char) => `\\${char}`);
}

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

  // Recreated by clear(): class names are derived from a counter, so a long-lived server would
  // otherwise hand request 2 different names than request 1 for the very same props.
  let identity = new IdentityFactory();
  const variables = Variables.createRegistry();

  let classNamesMode: NonNullable<StylesConfiguration['classNames']> = options.classNames ?? 'hashed';
  // Undefined means "follow the environment" — resolved when the sink is first needed, not at
  // construction, so importing the library still touches no DOM.
  let sinkMode: SinkMode | undefined = options.sink;
  let sink: StyleSink | undefined;

  function getSink(): StyleSink {
    if (!sink) sink = createSink(styleElementId, sinkMode);

    return sink;
  }

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

    const className = escapeClassName(
      createClassName(key as keyof BoxStyles, value as BoxStyles[keyof BoxStyles], weight, breakpoint, pseudoClassParentName),
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
          defaultSelector = `${rootSelector}.${escapeClassName(pseudoClassParentName)}${pseudoClassesToUse}`;
        } else {
          return null;
        }
      } else if (hasThemeAndGroup) {
        // Combined theme + group: .themeName .groupName:hover .className
        const [themeName, groupName] = pseudoClassParentName.split('|');
        defaultSelector = `.${escapeClassName(themeName)} .${escapeClassName(groupName)}${pseudoClassesToUse} .${className}`;
      } else if (hasTheme) {
        // Theme only: .themeName .className:hover
        defaultSelector = `.${escapeClassName(pseudoClassParentName)} .${className}${pseudoClassesToUse}`;
      } else {
        // Group only: .groupName:hover .className
        defaultSelector = `.${escapeClassName(pseudoClassParentName)}${pseudoClassesToUse} .${className}`;
      }
      const selector = itemValue.selector?.(defaultSelector, '') ?? defaultSelector;

      const styleName = Array.isArray(itemValue.styleName) ? itemValue.styleName : [itemValue.styleName ?? key];

      const rule = `${selector}{${styleName
        .map((s) => {
          const styleValue = (itemValue.valueFormat as any)?.(value, variables.getVariableValue, s) ?? value;
          return `${s}:${styleValue}`;
        })
        .join(';')}}`;

      // Wrap in media query if needed. The space after `@media` matters: browsers accept
      // `@media(...)` but the CSS parsers in happy-dom and jsdom reject the rule outright, so
      // without it every breakpoint rule silently vanishes from a consumer's test DOM.
      if (breakpoint !== 'normal') {
        return {
          rule: `@media (min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px){${rule}}`,
          sortIndex,
          breakpointOrder,
        };
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

      // Wrap in media query if needed. The space after `@media` matters: browsers accept
      // `@media(...)` but the CSS parsers in happy-dom and jsdom reject the rule outright, so
      // without it every breakpoint rule silently vanishes from a consumer's test DOM.
      if (breakpoint !== 'normal') {
        return {
          rule: `@media (min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px){${rule}}`,
          sortIndex,
          breakpointOrder,
        };
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

  /** The reset + `:root` block every engine writes before its first generated rule. */
  function baseRules(): string[] {
    return [
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
  }

  /**
   * Empty the pending queue into a sorted batch. Pure rule bookkeeping — no sink, no DOM: the
   * sort key (breakpoint first, then prop declaration order) is the cascade position a rule must
   * end up at, whichever flush it happens to arrive in.
   */
  function drainPendingRules(): SortedRule[] {
    if (pendingRules.length === 0) return [];

    pendingRules.sort((a, b) => a[1] - b[1] || a[0] - b[0]);

    const drained = pendingRules.map(([sortIndex, breakpointOrder, rule]) => ({ sortKey: breakpointOrder * 100000 + sortIndex, rule }));
    pendingRules.length = 0;

    return drained;
  }

  function flush() {
    const hasPendingVars = variables.hasPendingVariables();
    if (!requireFlush && !hasPendingVars) return;

    const target = getSink();

    if (!isInitialized) {
      target.writeBase(baseRules());
      // The base `:root` block above already carries every variable used so far; dropping them
      // from the pending queue keeps the next flush from emitting a second, identical block.
      variables.getPendingVariables();
      isInitialized = true;
    } else if (hasPendingVars) {
      const pendingVars = variables.getPendingVariables();
      target.writeVariables(
        `:root{${Object.entries(pendingVars)
          .map(([key, val]) => `--${key}: ${val};`)
          .join('')}}`,
      );
    }

    const drained = drainPendingRules();
    if (drained.length > 0) target.writeRules(drained);

    requireFlush = false;
  }

  /** Forget everything emitted so far, in the sink and in the engine's own bookkeeping. */
  function clear() {
    generatedRules.clear();
    unsupportedRules.clear();
    pendingRules.length = 0;
    isInitialized = false;
    // The next flush has to write the base rules again — the sink no longer holds them.
    requireFlush = true;
    // Reset the per-Box class cache too: rules were cleared, so cached class lists must be
    // recomputed (and re-registered) on the next render — otherwise SSG would drop styles.
    styleCache.clear();
    // Class names come from a counter and variables accumulate into `:root`. Without resetting
    // both, request N of a long-lived server gets different names and a fatter `:root` block than
    // request 1 for identical markup. Registered user variables survive — they are configuration.
    identity = new IdentityFactory();
    variables.reset();
    sink?.reset();
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

    getStyles() {
      // A server render leaves everything pending — nothing schedules a flush without effects.
      flush();

      return getSink().getStyles();
    },

    clear,

    configure(config: StylesConfiguration) {
      if (config.classNames) classNamesMode = config.classNames;

      if (config.sink && config.sink !== (sink?.mode ?? sinkMode)) {
        // Rules already written live in the old sink. The new one starts empty, so the engine has
        // to forget them as well — otherwise every rule rendered so far would be missing with no
        // way to get it back. Nothing has been written yet on the first configure, the common case.
        if (sink) clear();
        sink = undefined;
        sinkMode = config.sink;
      }

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
