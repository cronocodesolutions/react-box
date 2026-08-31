/* eslint-disable @typescript-eslint/no-explicit-any */
import IdentityFactory from '@cronocode/identity-factory';
import { BoxStyleProps, BoxStyles, PseudoClassesType } from '../../types';
import ObjectUtils from '../../utils/object/objectUtils';
import {
  breakpoints,
  cssStyles as defaultCssStyles,
  mediaCondition,
  mediaFeatures,
  mediaKeys,
  pseudo1,
  pseudo2,
  pseudoClassesByWeight,
  pseudoClassesWeight,
  pseudoGroupClasses,
  pseudoSelector,
  themeGroupClass,
} from '../boxStyles';
import { BoxStyle, BoxStyleValue } from '../coreTypes';
import defaultBoxComponents, { BoxComponent, Components } from '../extends/boxComponents';
import { resolveComponentStyles } from '../extends/useComponents';
import { stableHash } from '../hash';
import Variables from '../variables';
import { createFlushCoordinator, FlushScheduler, microtaskScheduler } from './flushScheduler';
import { createSink, RULE_PRECEDENCE, SinkMode, SortedRule, StyleElementDescriptor, StyleSink } from './styleSink';

/** Explicit engine configuration — replaces the previous NODE_ENV-based sniffing. */
export interface StylesConfiguration {
  /**
   * How generated class names are emitted.
   * - `'hashed'` (default): names go through the identity factory (short, stable hashes).
   * - `'readable'`: the descriptive name is kept as-is (useful for tests and debugging).
   * - `'stable'`: the descriptive name is hashed, so identical props produce the same class name in
   *   every process — the default in element mode, where a class generated in a Server Component
   *   has to match the one the client bundle generates for the same props.
   */
  classNames?: 'hashed' | 'readable' | 'stable';
  /**
   * Where generated rules are written. Defaults to the environment: a stylesheet in the browser,
   * a string on the server — so server rendering needs no DOM at all.
   * - `'cssom'`: `CSSStyleSheet.insertRule` (falls back to rule text when the element has no stylesheet).
   * - `'textContent'`: the style element's text (readable in tests and DevTools).
   * - `'string'`: kept in memory only, read back with `getStyles()` — the server-rendering sink.
   * - `'element'`: nowhere. Rules come back from `resolveClassNames()` as style-element
   *   descriptors for the adapter to render — `<style href precedence>`, which React 19 hoists
   *   into `<head>` and dedupes. This is the mode that works in Server Components and streaming
   *   SSR, where no effect ever runs. Rules are wrapped in cascade layers, so the order React
   *   happens to insert the elements in cannot change the cascade.
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
  /**
   * When pending rules reach the sink. Defaults to a microtask — see `FlushScheduler` for the
   * contract and what each adapter passes. `flushSync()` works regardless of this.
   */
  scheduler?: FlushScheduler;
}

/**
 * An isolated styling engine: its own class-name cache, rule registry, identity factory,
 * variables, prop registry (`Box.extend`) and component registry (`Box.components`).
 * Everything the library used to keep in module scope lives on an instance of this.
 */
export interface StyleEngine {
  /** The id of the `<style>` element this engine writes to. */
  readonly styleElementId: string;
  /**
   * Resolve (and cache) the class list for a Box's props. `signature` is null when the props could
   * not be serialized. `styleElements` is set in element mode only: the hoistable `<style>`
   * elements this Box's classes need, the engine's base element first.
   */
  resolveClassNames(
    props: BoxStyleProps<any>,
    isSvg: boolean,
  ): { classNames: string[]; signature: string | null; styleElements?: StyleElementDescriptor[] };
  /**
   * The class list for a set of Box props as a `class` attribute value — the whole API a
   * non-React adapter needs: `el.className = engine.classNames({ p: 4, bgColor: 'blue-500' })`.
   * The CSS those classes need is written to this engine's sink on its own schedule, so there is
   * nothing to flush; call `flushSync()` first only when reading computed styles in the same tick.
   *
   * Throws in element mode, where the rules go to no sink at all and the caller has to render the
   * `styleElements` that `resolveClassNames` returns instead.
   */
  classNames(props: BoxStyleProps<any>, options?: { svg?: boolean }): string;
  /**
   * Register rules that target a root selector (e.g. `html`) rather than a generated class.
   * Returns the style elements they need in element mode, exactly like `resolveClassNames`.
   */
  addGlobalStyles(props: BoxStyleProps<any>, selector: string): StyleElementDescriptor[] | undefined;
  /** Write every pending rule to this engine's sink, now. */
  flushSync(): void;
  /**
   * Say that rules are pending and let this engine's `FlushScheduler` decide when they are
   * written; many calls in one turn produce one flush. The engine calls this itself whenever it
   * queues something, so nothing is ever left unflushed — an adapter needs it only for rules it
   * queued behind the engine's back.
   */
  scheduleFlush(): void;
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

/**
 * A prop value as the text its class name and its rule key are built from.
 *
 * A record — the `vars` prop, whose declarations are named by its own value — is written out as its
 * `name-value` pairs in the order they were declared, which is the order the declarations are
 * emitted in too, so a class name and the rule behind it are built from the same reading of a value.
 */
function serializeValue(value: unknown): string {
  if (Array.isArray(value)) return value.join('_');
  if (ObjectUtils.isObject(value)) {
    return Object.entries(value)
      .map(([name, entry]) => `${name}-${entry}`)
      .join('_');
  }

  return String(value);
}

// `normal` first, then the breakpoints in ascending order, then the accessibility media features:
// the major half of the cascade order, so a responsive rule always overrides the base one and a
// user preference always overrides both.
const mediaRank: Record<string, number> = mediaKeys.reduce<Record<string, number>>((acc, key, index) => {
  acc[key] = index;

  return acc;
}, {});

/** The layer the base rules live in — the reset has to lose against every generated rule. */
const BASE_LAYER = 'rb';

/** The cascade layer of one generated rule: media-major, then prop declaration order. */
function layerName(media: string, sortIndex: number): string {
  return `${BASE_LAYER}${mediaRank[media] ?? 0}${sortIndex.toString(36)}`;
}

/** What the class-name cache holds per style signature. `elements` is null outside element mode. */
interface ResolvedStyles {
  classNames: string[];
  elements: StyleElementDescriptor[] | null;
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

  // Undefined means "follow the sink": counter-hashed names normally, content-hashed in element
  // mode, where a class name resolved in one process has to match the one another resolves.
  let classNamesMode: StylesConfiguration['classNames'] = options.classNames;
  // Undefined means "follow the environment" — resolved when the sink is first needed, not at
  // construction, so importing the library still touches no DOM.
  let sinkMode: SinkMode | undefined = options.sink;
  let sink: StyleSink | undefined;

  function getSink(): StyleSink {
    if (!sink) sink = createSink(styleElementId, sinkMode);

    return sink;
  }

  /**
   * Element mode: rules are handed to the adapter as `<style>` descriptors instead of being
   * written anywhere. It also turns on cascade layers and content-hashed class names, because a
   * hoisted element's position in `<head>` is render order, not cascade order.
   */
  function isElementMode(): boolean {
    return sinkMode === 'element';
  }

  function namingMode(): NonNullable<StylesConfiguration['classNames']> {
    return classNamesMode ?? (isElementMode() ? 'stable' : 'hashed');
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
  const styleCache = new Map<string, ResolvedStyles>();
  // Track already generated CSS rules to avoid re-generating
  const generatedRules = new Set<string>();
  // Element mode: the descriptor of every rule generated so far, by rule key. A Box that renders
  // a rule some earlier Box already generated still has to render its `<style>` element — React
  // dedupes them by href — so descriptors are kept, not consumed.
  const ruleElements = new Map<string, StyleElementDescriptor>();
  // The descriptors the resolve currently in progress walked over. Non-null only for the duration
  // of one resolveClassNames/addGlobalStyles call, and only in element mode.
  let collecting: StyleElementDescriptor[] | null = null;
  // Rule keys that matched no value definition. Remembered because `generatedRules` short-circuits
  // the second occurrence of a prop/value pair: without this, the first Box would (correctly) get
  // no class name and every later one would get a class with no rule behind it.
  const unsupportedRules = new Set<string>();
  // Pending rules to be flushed: [sortIndex, mediaOrder, rule]
  const pendingRules: [number, number, string][] = [];
  let requireFlush = true;
  let isInitialized = false;

  const boxClassName = '_b';
  const svgClassName = '_s';

  // Whether a prop key affects the class list — i.e. one of the keys `addClassNames` dispatches
  // on (style props + pseudo/media/group wrappers). Checked live (not snapshotted) because
  // `extend()` adds keys to this engine's registry at runtime; mirrors addClassNames exactly.
  function isStyleKey(key: string): boolean {
    return (
      ObjectUtils.isKeyOf(key, cssStyles) ||
      ObjectUtils.isKeyOf(key, pseudo1) ||
      ObjectUtils.isKeyOf(key, pseudo2) ||
      ObjectUtils.isKeyOf(key, breakpoints) ||
      ObjectUtils.isKeyOf(key, mediaFeatures) ||
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
    media?: string,
    pseudoClassParentName?: string,
    rootSelector?: string,
  ) {
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (ObjectUtils.isKeyOf(key, cssStyles)) {
        addClassName(key, value, classNames, currentPseudoClasses, media, pseudoClassParentName, rootSelector);
      } else if (ObjectUtils.isKeyOf(key, pseudo1)) {
        addClassNames(value as BoxStyleProps, classNames, [...currentPseudoClasses, key], media, pseudoClassParentName, rootSelector);
      } else if (ObjectUtils.isKeyOf(key, pseudo2)) {
        if (Array.isArray(value)) {
          const [_, styles] = value as [unknown, BoxStyleProps];
          addClassNames(styles, classNames, [...currentPseudoClasses, key], media, pseudoClassParentName, rootSelector);
        }
        if (ObjectUtils.isObject(value)) {
          addClassNames(value as BoxStyleProps, classNames, [...currentPseudoClasses, key], media, pseudoClassParentName, rootSelector);
        }
      } else if (ObjectUtils.isKeyOf(key, breakpoints) || ObjectUtils.isKeyOf(key, mediaFeatures)) {
        // Both fill the same slot — one `@media` block per rule. The types offer neither inside the
        // other, so the last one to arrive winning is a shape TypeScript already refuses.
        addClassNames(value as BoxStyleProps, classNames, currentPseudoClasses, key, pseudoClassParentName, rootSelector);
      } else if (ObjectUtils.isKeyOf(key, pseudoGroupClasses)) {
        Object.entries(value).forEach(([name, pseudoClassProps]) => {
          addClassNames(
            pseudoClassProps as BoxStyles,
            classNames,
            [...currentPseudoClasses, pseudoGroupClasses[key]],
            media,
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
                  media,
                  // Use | as separator to distinguish theme from group name
                  `${name}|${groupName}`,
                  rootSelector,
                );
              });
            } else {
              addClassNames({ [themeKey]: themeValue } as BoxStyles, classNames, themePseudoClasses, media, name, rootSelector);
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
    media: string = 'normal',
    pseudoClassParentName?: string,
    rootSelector?: string,
  ) {
    if (value === undefined || value === null) return;

    const weight = currentPseudoClasses.reduce((sum, pseudoClass) => sum + pseudoClassesWeight[pseudoClass], 0);
    const className = createClassName(key, value, weight, media, pseudoClassParentName);

    // Create a unique key to track if this rule has been generated
    const serializedValue = serializeValue(value);
    const ruleKey = `${media}-${weight}-${key}-${serializedValue}-${pseudoClassParentName ?? ''}-${rootSelector ?? ''}`;

    // Only generate rule if it hasn't been generated before
    if (!generatedRules.has(ruleKey)) {
      generatedRules.add(ruleKey);

      const result = generateRule(key, value as BoxStyleValue, weight, media, pseudoClassParentName, rootSelector);
      if (result) {
        pendingRules.push([result.sortIndex, result.mediaOrder, result.rule]);
        requireFlush = true;
        if (isElementMode()) {
          ruleElements.set(ruleKey, {
            href: `${RULE_PRECEDENCE}-${stableHash(result.rule)}`,
            css: result.rule,
            precedence: RULE_PRECEDENCE,
            sortKey: sortKeyOf(result.sortIndex, result.mediaOrder),
          });
        }
        // The engine, not the caller, owns "something is pending" — an adapter that never flushes
        // (vanilla DOM, a framework with no commit phase) still gets its CSS.
        scheduleFlush();
      } else {
        unsupportedRules.add(ruleKey);
      }
    }

    // A value the prop does not declare produces no rule, so it must not produce a class either —
    // an unmatched value used to leave a dangling class name in the markup.
    if (unsupportedRules.has(ruleKey)) return;

    if (collecting) {
      const element = ruleElements.get(ruleKey);
      if (element) collecting.push(element);
    }

    classNames.push(className);
  }

  /**
   * The body of one rule: the declarations a definition writes for a value.
   *
   * Normally that is its `styleName` (or names) with the formatted value, and the definition that
   * declares its own `declarations` is the exception the `vars` prop needs — the property names are
   * in the value, so no `styleName` could hold them.
   */
  function declarations(itemValue: BoxStyle, key: string, value: BoxStyleValue) {
    if (itemValue.declarations) return itemValue.declarations(value, variables.getVariableValue);

    const styleName = Array.isArray(itemValue.styleName) ? itemValue.styleName : [itemValue.styleName ?? key];

    return styleName.map((s) => `${s}:${(itemValue.valueFormat as any)?.(value, variables.getVariableValue, s) ?? value}`).join(';');
  }

  function generateRule(
    key: string,
    value: BoxStyleValue,
    weight: number,
    media: string,
    pseudoClassParentName?: string,
    rootSelector?: string,
  ): { rule: string; sortIndex: number; mediaOrder: number } | null {
    const item = cssStyles[key as keyof typeof cssStyles] as BoxStyle[];

    let itemValue = item.find((x) => {
      // A definition that names the values it accepts is judged by that alone: the `typeof` tests
      // below cannot tell `url(#sky)` from a typo, and a scalar `values` would take both.
      if (x.match) return x.match(value);

      if (Array.isArray(x.values)) {
        if (Array.isArray(value)) {
          // Tuple definition: x.values is a tuple of allowed-value arrays; each position must contain value[i]
          if (x.values.length > 0 && Array.isArray(x.values[0])) {
            return x.values.length === value.length && (x.values as unknown[][]).every((allowed, i) => allowed.includes(value[i]));
          }
          return x.values.length === value.length && x.values.every((v, i) => typeof v === typeof value[i]);
        }
        return (x.values as readonly unknown[]).includes(value);
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
    const mediaOrder = mediaRank[media] ?? 0;
    const condition = mediaCondition(media);

    /**
     * The finished rule: wrapped in its media query, and in element mode in its cascade layer.
     *
     * The space after `@media` matters: browsers accept `@media(...)` but the CSS parsers in
     * happy-dom and jsdom reject the rule outright, so without it every media rule silently
     * vanishes from a consumer's test DOM.
     */
    function finish(rule: string) {
      const wrapped = condition === null ? rule : `@media ${condition}{${rule}}`;

      return {
        rule: isElementMode() ? `@layer ${layerName(media, sortIndex)}{${wrapped}}` : wrapped,
        sortIndex,
        mediaOrder,
      };
    }

    const className = escapeClassName(
      createClassName(key as keyof BoxStyles, value as BoxStyles[keyof BoxStyles], weight, media, pseudoClassParentName),
    );

    if (pseudoClassParentName) {
      const pseudoClassList = pseudoClassesByWeight[weight];
      const hasTheme = pseudoClassList.includes('theme');
      const otherPseudoClasses = hasTheme ? pseudoClassList.filter((p) => p !== 'theme') : pseudoClassList;
      const pseudoClassesToUse = pseudoSelector(otherPseudoClasses);

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

      return finish(`${selector}{${declarations(itemValue, key, value)}}`);
    } else {
      const pseudoClassesToUse = pseudoSelector(pseudoClassesByWeight[weight]);
      const baseSelector = rootSelector ?? `.${className}`;
      const selector = itemValue.selector?.(baseSelector, pseudoClassesToUse) ?? `${baseSelector}${pseudoClassesToUse}`;

      return finish(`${selector}{${declarations(itemValue, key, value)}}`);
    }
  }

  function createClassName<TKey extends keyof BoxStyles, TValue extends BoxStyles[TKey]>(
    key: TKey,
    value: TValue,
    weight: number,
    media: string,
    pseudoClassParentName?: string,
  ) {
    const pseudoClassList = pseudoClassesByWeight[weight];
    const serializedValue = serializeValue(value);

    const className = `${media === 'normal' ? '' : `${media}-`}${pseudoClassList.map((p) => `${p}-`).join('')}${pseudoClassParentName ? `${pseudoClassParentName}-` : ''}${key}-${serializedValue}`;

    switch (namingMode()) {
      case 'readable':
        // A value can carry a space (`strokeDasharray='8 4'`). Escaping it would keep the *selector*
        // legal, but the class attribute would split into two class names and the rule would match
        // neither, so the space becomes an underscore here instead — the same separator a tuple
        // value already uses. Hashed and stable names are alphanumeric and need nothing.
        return className.replace(/\s+/g, '_');
      case 'stable':
        return `_${stableHash(className)}`;
      default:
        return identity.getIdentity(className);
    }
  }

  /**
   * Every cascade layer, in cascade order, declared in one statement.
   *
   * Element mode gives up control of where a rule lands in `<head>`: React hoists the elements in
   * the order it discovers them, which is render order — a Box that only uses `md={{ p: 4 }}` can
   * put its rule in front of the `p={2}` rule another Box already needed, and a plain reading of
   * the cascade would then apply them the wrong way round. One layer per (media, prop) makes
   * element order irrelevant: this statement, which travels with the base element and therefore
   * reaches the document first, is what fixes the order.
   *
   * Props registered by `Box.extend()` after the first render are the one gap — CSS appends layers
   * it meets for the first time after every layer already named, so an extended prop's layer ends
   * up after the built-in ones. Declare extended props before the first render (which is where
   * they belong anyway) and the order is exact.
   */
  function layerOrder(): string {
    const names = [BASE_LAYER];

    for (const media of Object.keys(mediaRank)) {
      for (let index = 0; index < Object.keys(cssStyles).length; index++) {
        names.push(layerName(media, index));
      }
    }

    return `@layer ${names.join(',')};`;
  }

  /** The reset + `:root` block every engine writes before its first generated rule. */
  function baseRules(): string[] {
    // Variables used before the first flush. Skipped entirely when there are none — an empty
    // `:root{}` is valid CSS but it is noise in every SSR payload and every base style element.
    const usedVariables = variables.generateVariables();

    const rules = [
      ...(usedVariables ? [`:root{${usedVariables}}`] : []),
      `:root{--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;}`,
      // Every Box transitions on these two variables, so zeroing them is the whole default: a user
      // who asked for less motion gets a library that does not animate, with nothing to opt into.
      // A component that still wants movement here declares it under `motionReduce`, which lands in
      // the same media query and later in the cascade.
      `@media (prefers-reduced-motion: reduce){:root{--transitionTime: 0s;--svgTransitionTime: 0s;}}`,
      `#crono-box {position: absolute;top: 0;left: 0;height: 0;z-index:99999;}`,
      `html{font-size: 16px;font-family: Arial, sans-serif;}`,
      `body{margin: 0;line-height: var(--lineHeight);font-size: var(--fontSize);}`,
      `a,ul{all: unset;}`,
      `button{color: inherit;}`,
      `input[type="number"]{-moz-appearance: textfield;}`,
      `input[type="number"]::-webkit-outer-spin-button,input[type="number"]::-webkit-inner-spin-button{-webkit-appearance: none;margin: 0;}`,
      `.${boxClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;background-color: initial;transition: all var(--transitionTime);box-sizing: border-box;font-family: inherit;font-size: inherit;}`,
      `.${svgClassName}{display: block;border: 0 solid var(--borderColor);outline: 0px solid var(--outlineColor);margin: 0;padding: 0;transition: all var(--svgTransitionTime);}`,
      // The shapes inside an <svg> transition on their own variable. The list is explicit rather
      // than `*` so the rule cannot reach a <foreignObject>'s HTML; ellipse, polygon, polyline and
      // text joined it with the SVG geometry props, whose whole point is that a shape can move
      // with no JavaScript — an <ellipse> that cannot transition `rx` would snap instead.
      `.${svgClassName} path,.${svgClassName} circle,.${svgClassName} ellipse,.${svgClassName} rect,.${svgClassName} line,.${svgClassName} polygon,.${svgClassName} polyline,.${svgClassName} text {transition: all var(--svgTransitionTime);}`,
    ];

    if (!isElementMode()) return rules;

    // Unlayered CSS beats every layer, so the moment generated rules are layered the reset has to
    // be as well — otherwise `._b{padding:0}` would win against `.p-4{padding:1rem}`.
    return [layerOrder(), `@layer ${BASE_LAYER}{${rules.join('')}}`];
  }

  /** A rule's position in the cascade: media first, then prop declaration order. */
  function sortKeyOf(sortIndex: number, mediaOrder: number): number {
    return mediaOrder * 100000 + sortIndex;
  }

  /**
   * Empty the pending queue into a sorted batch. Pure rule bookkeeping — no sink, no DOM: the
   * sort key (media first, then prop declaration order) is the cascade position a rule must
   * end up at, whichever flush it happens to arrive in.
   */
  function drainPendingRules(): SortedRule[] {
    if (pendingRules.length === 0) return [];

    pendingRules.sort((a, b) => a[1] - b[1] || a[0] - b[0]);

    const drained = pendingRules.map(([sortIndex, mediaOrder, rule]) => ({ sortKey: sortKeyOf(sortIndex, mediaOrder), rule }));
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

  const scheduleFlush = createFlushCoordinator(flush, options.scheduler ?? microtaskScheduler);

  /**
   * Run a class-name walk and collect the style elements the rules it touched need. Returns null
   * outside element mode: nothing would render them there, so nothing pays for building the list.
   */
  function collect(walk: () => void): StyleElementDescriptor[] | null {
    if (!isElementMode()) {
      walk();

      return null;
    }

    const elements: StyleElementDescriptor[] = [];
    collecting = elements;

    try {
      walk();
    } finally {
      collecting = null;
    }

    // Deduped, because a Box can reach the same rule twice (a component default and its own prop
    // resolving to the same value), and kept in cascade order so the list reads like a stylesheet.
    const seen = new Set<string>();
    const unique = elements.filter((element) => {
      if (seen.has(element.href)) return false;

      seen.add(element.href);

      return true;
    });

    return unique.sort((a, b) => a.sortKey - b.sortKey);
  }

  /**
   * A Box's elements with the engine's base element in front. The base block — the reset, `:root`,
   * the cascade-layer order — belongs to no single Box, so every Box carries it: whichever one
   * React renders first establishes the layer order, and every copy after that is deduped by href.
   */
  function withBaseElement(elements: StyleElementDescriptor[]): StyleElementDescriptor[] {
    // Nothing else would move the base rules — or a variable resolved a moment ago — out of the
    // pending queue: in element mode there is no effect, and on a server there is no commit.
    flush();
    const base = getSink().baseElement?.() ?? null;

    return base ? [base, ...elements] : elements;
  }

  /** Forget everything emitted so far, in the sink and in the engine's own bookkeeping. */
  function clear() {
    generatedRules.clear();
    unsupportedRules.clear();
    ruleElements.clear();
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

  function resolveClassNames(props: BoxStyleProps<any>, isSvg: boolean) {
    const signature = computeSignature(props, isSvg);

    let resolved = signature !== null ? styleCache.get(signature) : undefined;

    if (!resolved) {
      const componentStyles = resolveComponentStyles(props, componentsStyles) as BoxStyleProps;
      const propsToUse = componentStyles ? ObjectUtils.mergeDeep(componentStyles, props) : props;

      const classNames = [isSvg ? svgClassName : boxClassName];
      resolved = { classNames, elements: collect(() => addClassNames(propsToUse, classNames, [])) };

      if (signature !== null) styleCache.set(signature, resolved);
    }

    const { classNames, elements } = resolved;

    return elements ? { classNames, signature, styleElements: withBaseElement(elements) } : { classNames, signature };
  }

  return {
    styleElementId,

    resolveClassNames,

    classNames(props: BoxStyleProps<any>, options?: { svg?: boolean }) {
      if (isElementMode()) {
        throw new Error(
          '[react-box] classNames() has nowhere to put its CSS in element mode: the rules come back from resolveClassNames() as style elements for the adapter to render.',
        );
      }

      return resolveClassNames(props, options?.svg ?? false).classNames.join(' ');
    },

    addGlobalStyles(props: BoxStyleProps<any>, selector: string) {
      const throwawayClassNames: string[] = [];
      const elements = collect(() => addClassNames(props, throwawayClassNames, [], undefined, undefined, selector));

      return elements ? withBaseElement(elements) : undefined;
    },

    flushSync: flush,

    scheduleFlush,

    getStyles() {
      // A server render is synchronous and finishes before any scheduled flush can run, so the
      // queue is still full at this point — draining it here is what makes the CSS complete.
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

    getVariableValue(name: string) {
      const value = variables.getVariableValue(name);
      // Reading a variable is enough to make it pending: it has to reach `:root` even when no
      // rule was generated alongside it.
      scheduleFlush();

      return value;
    },
  };
}
