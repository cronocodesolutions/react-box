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
   * How class names are emitted: `'hashed'` (default, through the identity factory), `'readable'`
   * (kept as-is, for tests) or `'stable'` (content-hashed, so two processes agree — element mode's default).
   */
  classNames?: 'hashed' | 'readable' | 'stable';
  /**
   * Where rules are written: `'cssom'` (`insertRule`), `'textContent'`, `'string'` (in memory, for
   * `getStyles()`) or `'element'` (nowhere — they come back as `<style href precedence>` descriptors,
   * which is what works in a Server Component). Defaults to the environment; changing it re-emits everything.
   */
  sink?: SinkMode;
}

export interface StyleEngineOptions extends StylesConfiguration {
  /** The id of the `<style>` element this engine owns, so two engines cannot corrupt each other's rule order. */
  styleElementId?: string;
  /** When pending rules reach the sink — see `FlushScheduler`. `flushSync()` works regardless. */
  scheduler?: FlushScheduler;
}

/**
 * An isolated styling engine: its own class-name cache, rule registry, identity factory, variables,
 * prop registry (`Box.extend`) and component registry (`Box.components`) — nothing in module scope.
 */
export interface StyleEngine {
  /** The id of the `<style>` element this engine writes to. */
  readonly styleElementId: string;
  /**
   * The class list for a Box's props, cached. `signature` is null when the props would not serialize;
   * `styleElements` is element mode only, the base element first.
   */
  resolveClassNames(
    props: BoxStyleProps<any>,
    isSvg: boolean,
  ): { classNames: string[]; signature: string | null; styleElements?: StyleElementDescriptor[] };
  /**
   * The class list as a `class` attribute value — the whole API a non-React adapter needs. The CSS
   * follows on the engine's own schedule; throws in element mode, where `resolveClassNames` is the way in.
   */
  classNames(props: BoxStyleProps<any>, options?: { svg?: boolean }): string;
  /** Rules targeting a root selector (`html`) rather than a class. Returns style elements like `resolveClassNames`. */
  addGlobalStyles(props: BoxStyleProps<any>, selector: string): StyleElementDescriptor[] | undefined;
  /** Write every pending rule to this engine's sink, now. */
  flushSync(): void;
  /**
   * Say that rules are pending and let the `FlushScheduler` pick the moment, so many calls in one turn
   * produce one flush. The engine calls it itself; an adapter needs it only for rules it queued alone.
   */
  scheduleFlush(): void;
  /** The CSS emitted so far, as text. Flushes first, so a server render — where no effect runs — is complete. */
  getStyles(): string;
  /**
   * Drop everything emitted: rules, cached class lists, the name counter, resolved variables, the sink.
   * Registration (extended props, components, declared variables) survives. Call it between SSR requests.
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

// The value lists that hold variable-backed tokens. A `Box.extend({ variables })` token is accepted
// wherever one of them is declared.
const variableBackedValues: ReadonlySet<unknown> = new Set([Variables.colorValues, Variables.bgImageValues, Variables.shadowValues]);

// An id sequence for engines the caller did not name, not engine state.
let engineSequence = 0;

// Characters a CSS identifier cannot hold. A readable name for `1/2` or `50%` would otherwise build a
// selector the parser rejects; hashed names are alphanumeric, so this is a no-op there.
const invalidInCssIdentifier = /[^\w\u00A0-\uFFFF-]/g;

/** A class name escaped for use inside a CSS selector: `width-1/2` becomes `width-1\/2`. */
function escapeClassName(className: string): string {
  return className.replace(invalidInCssIdentifier, (char) => `\\${char}`);
}

/**
 * A prop value as the text its class name and rule key are built from. A record (`vars`) becomes its
 * `name-value` pairs in declaration order — the order its declarations are emitted in too.
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

// `normal`, then the breakpoints ascending, then the preference features: the major half of the cascade
// order, so a responsive rule beats the base one and a preference beats both.
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

  // Recreated by clear(): names come from a counter, so request 2 would otherwise differ from request 1.
  let identity = new IdentityFactory();
  const variables = Variables.createRegistry();

  // Undefined means "follow the sink": counter-hashed normally, content-hashed in element mode.
  let classNamesMode: StylesConfiguration['classNames'] = options.classNames;
  // Undefined means "follow the environment", resolved when first needed so importing touches no DOM.
  let sinkMode: SinkMode | undefined = options.sink;
  let sink: StyleSink | undefined;

  function getSink(): StyleSink {
    if (!sink) sink = createSink(styleElementId, sinkMode);

    return sink;
  }

  /**
   * Element mode: rules go to the adapter as `<style>` descriptors. It also turns on cascade layers and
   * content-hashed names, because a hoisted element's position in `<head>` is render order.
   */
  function isElementMode(): boolean {
    return sinkMode === 'element';
  }

  function namingMode(): NonNullable<StylesConfiguration['classNames']> {
    return classNamesMode ?? (isElementMode() ? 'stable' : 'hashed');
  }

  // The prop registry. Copied per engine so `extend()` on one engine cannot leak into another.
  const cssStyles = { ...defaultCssStyles };
  // Rule sort order, from prop declaration order. Rebuilt by `extend()` so new props sort after the built-ins.
  let cssStylesIndex: Record<string, number> = {};

  function rebuildCssStylesIndex() {
    cssStylesIndex = Object.keys(cssStyles).reduce<Record<string, number>>((acc, key, index) => {
      acc[key] = index;
      return acc;
    }, {});
  }

  rebuildCssStylesIndex();

  let componentsStyles: Components = defaultBoxComponents;

  // style signature → resolved class names. A Box's list is fully determined by its inputs, so
  // structurally identical Boxes (every DataGrid cell) collapse to one lookup. Rules dedupe separately.
  const styleCache = new Map<string, ResolvedStyles>();
  const generatedRules = new Set<string>();
  // Element mode: every rule's descriptor by rule key. A Box whose rule someone else generated still has
  // to render its `<style>`, so these are kept rather than consumed (React dedupes by href).
  const ruleElements = new Map<string, StyleElementDescriptor>();
  // The descriptors the resolve in progress walked over. Non-null for one call, in element mode only.
  let collecting: StyleElementDescriptor[] | null = null;
  // Rule keys that matched no definition. `generatedRules` short-circuits the second occurrence, so
  // without this the first Box would get no class and every later one a class with no rule.
  const unsupportedRules = new Set<string>();
  // Pending rules to be flushed: [sortIndex, mediaOrder, rule]
  const pendingRules: [number, number, string][] = [];
  let requireFlush = true;
  let isInitialized = false;

  const boxClassName = '_b';
  const svgClassName = '_s';

  // Whether a prop key affects the class list. Checked live rather than snapshotted, because `extend()`
  // adds keys at runtime; mirrors `addClassNames` exactly.
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
   * A stable cache key for the inputs that decide a class list. Values go through JSON so `p={4}` and
   * `p="4"` cannot collide; null when something will not serialize, and the caller falls back.
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
        // Both fill the same slot — one `@media` block per rule — and the types already refuse the nesting.
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

    const serializedValue = serializeValue(value);
    const ruleKey = `${media}-${weight}-${key}-${serializedValue}-${pseudoClassParentName ?? ''}-${rootSelector ?? ''}`;

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
        // The engine owns "something is pending", so an adapter that never flushes still gets its CSS.
        scheduleFlush();
      } else {
        unsupportedRules.add(ruleKey);
      }
    }

    // No rule means no class name either — an unmatched value used to leave a dangling class behind.
    if (unsupportedRules.has(ruleKey)) return;

    if (collecting) {
      const element = ruleElements.get(ruleKey);
      if (element) collecting.push(element);
    }

    classNames.push(className);
  }

  /**
   * The body of one rule: normally the definition's `styleName`s with the formatted value, and for a
   * definition that declares its own `declarations` (`vars`) the property names come from the value.
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
      // A definition that names its values judges them itself: `typeof` cannot tell `url(#sky)` from a typo.
      if (x.match) return x.match(value);

      if (Array.isArray(x.values)) {
        if (Array.isArray(value)) {
          // Tuple definition: each position must accept the value at that position.
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
      // `Box.extend({ variables })` tokens are accepted on the props whose values resolve to `var(--token)`.
      itemValue = item.find((x) => variableBackedValues.has(x.values));
    }

    if (!itemValue) return null;

    const sortIndex = cssStylesIndex[key] ?? 0;
    const mediaOrder = mediaRank[media] ?? 0;
    const condition = mediaCondition(media);

    /**
     * The finished rule: in its media query, and in element mode in its cascade layer. The space after
     * `@media` matters — the CSS parsers in happy-dom and jsdom drop `@media(...)` rules outright.
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
        // Global mode targets the root selector directly, where a group selector means nothing.
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
        // A value can carry a space (`strokeDasharray='8 4'`); escaping keeps the selector legal but splits the
        // class attribute in two, so the space becomes an underscore — the separator a tuple value already uses.
        return className.replace(/\s+/g, '_');
      case 'stable':
        return `_${stableHash(className)}`;
      default:
        return identity.getIdentity(className);
    }
  }

  /**
   * Every cascade layer, in cascade order, in one statement. Element mode gives up control of where a rule
   * lands in `<head>` (React hoists in render order), so one layer per (media, prop) makes element order
   * irrelevant. A prop `extend()` registers after the first render lands after every layer named here.
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
    // Skipped when there are none: an empty `:root{}` is valid CSS but noise in every SSR payload.
    const usedVariables = variables.generateVariables();

    const rules = [
      ...(usedVariables ? [`:root{${usedVariables}}`] : []),
      `:root{--borderColor: black;--outlineColor: black;--lineHeight: 1.2;--fontSize: 14px;--transitionTime: 0.25s;--svgTransitionTime: 0.3s;}`,
      // Every Box transitions on these two, so zeroing them is the whole reduced-motion default. A component
      // that still wants movement declares it under `motionReduce`, later in the cascade.
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
      // The shapes inside an <svg> transition on their own variable. Listed explicitly rather than `*`, so the
      // rule cannot reach a <foreignObject>'s HTML.
      `.${svgClassName} path,.${svgClassName} circle,.${svgClassName} ellipse,.${svgClassName} rect,.${svgClassName} line,.${svgClassName} polygon,.${svgClassName} polyline,.${svgClassName} text {transition: all var(--svgTransitionTime);}`,
    ];

    if (!isElementMode()) return rules;

    // Unlayered CSS beats every layer, so once generated rules are layered the reset has to be too.
    return [layerOrder(), `@layer ${BASE_LAYER}{${rules.join('')}}`];
  }

  /** A rule's position in the cascade: media first, then prop declaration order. */
  function sortKeyOf(sortIndex: number, mediaOrder: number): number {
    return mediaOrder * 100000 + sortIndex;
  }

  /**
   * Empty the pending queue into a sorted batch. The sort key is the cascade position a rule must end up
   * at, whichever flush it happens to arrive in.
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
      // The base block already carries every variable used so far, so drop them from the pending queue.
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
   * A class-name walk plus the style elements its rules need. Null outside element mode, where nothing
   * would render them anyway.
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

    // Deduped (a Box can reach one rule twice) and in cascade order, so the list reads like a stylesheet.
    const seen = new Set<string>();
    const unique = elements.filter((element) => {
      if (seen.has(element.href)) return false;

      seen.add(element.href);

      return true;
    });

    return unique.sort((a, b) => a.sortKey - b.sortKey);
  }

  /**
   * A Box's elements with the engine's base element in front: the base block belongs to no single Box, so
   * every Box carries it and React dedupes the copies by href.
   */
  function withBaseElement(elements: StyleElementDescriptor[]): StyleElementDescriptor[] {
    // Nothing else would move the base rules out of the queue: no effect in element mode, no commit on a server.
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
    // Cached class lists must be recomputed and re-registered, or SSG drops styles.
    styleCache.clear();
    // Names come from a counter and variables accumulate into `:root`, so without this request N of a
    // long-lived server differs from request 1. Registered user variables survive — they are configuration.
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
      // A server render finishes before any scheduled flush, so draining here is what completes the CSS.
      flush();

      return getSink().getStyles();
    },

    clear,

    configure(config: StylesConfiguration) {
      if (config.classNames) classNamesMode = config.classNames;

      if (config.sink && config.sink !== (sink?.mode ?? sinkMode)) {
        // Rules already written live in the old sink, so the engine forgets them too — otherwise every rule
        // rendered so far would be missing with no way back. Nothing is written yet on the first configure.
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

      // New props change both what counts as a style key and the sort order, and new variables can turn a
      // value that matched nothing into a supported one.
      rebuildCssStylesIndex();
      unsupportedRules.forEach((ruleKey) => generatedRules.delete(ruleKey));
      unsupportedRules.clear();
      styleCache.clear();

      return { extendedProps, extendedPropTypes };
    },

    components(components) {
      // Merge into what this engine holds, not the defaults: sequential calls used to drop earlier ones.
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
      // Reading a variable makes it pending: it has to reach `:root` even with no rule beside it.
      scheduleFlush();

      return value;
    },
  };
}
