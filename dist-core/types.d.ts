import { breakpoints, cssStyles, mediaFeatures, pseudo1, pseudo2, pseudoClasses, pseudoElements, pseudoGroupClasses, startingStyleKey, themeGroupClass } from './core/boxStyles';
import { ClassNameType } from './core/classNames';
import { default as Containers } from './core/containers';
import { BoxStyle, BoxStylesType, ExtractKeys, ExtractTupleValues } from './core/coreTypes';
import { default as boxComponents } from './core/extends/boxComponents';
import { default as Groups } from './core/groups';
import { default as Variants } from './core/variants';
export type ArrayType<T> = T extends (infer U)[] ? U : T;
export declare namespace Augmented {
    interface BoxProps {
    }
    interface BoxPropTypes {
    }
    interface ComponentsTypes {
    }
}
type ExtractBoxStyleValue<T> = T extends {
    tuple: true;
    values: infer V;
} ? ExtractTupleValues<V> : T extends {
    values: infer V;
} ? BoxStylesType<V> : never;
type ExtractBoxStylesInternal<T extends Record<string, BoxStyle[]>> = {
    [K in keyof T]?: K extends keyof Augmented.BoxPropTypes ? ExtractBoxStyleValue<ArrayType<T[K]>> | Augmented.BoxPropTypes[K] : ExtractBoxStyleValue<ArrayType<T[K]>>;
};
export type ExtractBoxStyles<T extends Record<string, BoxStyle[]>> = {
    [K in keyof T]?: ExtractBoxStyleValue<ArrayType<T[K]>>;
};
export type PseudoClassesType = keyof typeof pseudoClasses;
export type BoxStyles = ExtractBoxStylesInternal<typeof cssStyles> & Augmented.BoxProps;
/**
 * The nesting keys, as one generic each, because there are two families of them: what a Box takes, and
 * what a *pseudo-element* block takes — the same thing minus a second pseudo-element, since a compound
 * selector holds one and CSS puts it last.
 */
type BoxPseudoClassesNesting<T> = ExtractKeys<typeof pseudo1, T> & ExtractKeys<typeof pseudo2, T>;
/**
 * The record key is the selector, so only the two attribute keys take a free string: `not` is keyed by
 * the shared state vocabulary and `nth` by a position, both typed so a typo is a compile error rather
 * than a block the grammar silently drops.
 */
type BoxVariantNesting<T> = ExtractKeys<Omit<typeof Variants.variantKeys, 'not' | 'nth'>, Record<string, T>> & ExtractKeys<Pick<typeof Variants.variantKeys, 'not'>, Partial<Record<Variants.StateKey, T>>> & ExtractKeys<Pick<typeof Variants.variantKeys, 'nth'>, Partial<Record<Variants.NthKey, T>>>;
type BoxPseudoElementNesting<T> = ExtractKeys<typeof pseudoElements, T>;
type BoxPseudoClassesStyles1 = ExtractKeys<typeof pseudo1, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2TopLevel = ExtractKeys<typeof pseudo2, boolean | [boolean, BoxStylesWithPseudoClasses]>;
/**
 * `startingStyle` takes plain props and nothing else: the block wraps a finished rule, so a breakpoint or
 * a pseudo-class belongs *around* it (`md: { startingStyle: … }`), where the rule can still carry both.
 */
type BoxStartingStyles = ExtractKeys<typeof startingStyleKey, BoxStyles>;
/**
 * The nesting keys that hang off the element's own selector. The record *key* is the selector —
 * `dataAttr={{ 'state=open': … }}` — and a key the grammar rejects is dropped whole, the way an
 * unmatched prop value is. `not` and `nth` are keyed by a closed set instead, so they stay typed.
 */
export interface BoxVariantStyles extends BoxVariantNesting<BoxStylesWithPseudoClasses> {
}
/**
 * What a pseudo-element block takes: plain props, pseudo-classes, variants and `startingStyle` — the
 * element is appended to whatever they build, so all of it still resolves to one compound selector.
 * A second pseudo-element is not offered: `::before::after` matches nothing at all.
 */
export interface BoxPseudoElementStyles extends BoxStyles, BoxStartingStyles, BoxPseudoClassesNesting<BoxPseudoElementStyles>, BoxVariantNesting<BoxPseudoElementStyles> {
}
export interface BoxStylesWithPseudoClasses extends BoxStyles, BoxStartingStyles, BoxPseudoClassesNesting<BoxStylesWithPseudoClasses>, BoxVariantNesting<BoxStylesWithPseudoClasses>, BoxPseudoElementNesting<BoxPseudoElementStyles> {
}
type BoxPseudoGroupClassesStyles = ExtractKeys<typeof pseudoGroupClasses, Record<string, BoxStylesWithPseudoClasses>>;
/**
 * `group`/`peer`: what an *ancestor* or a preceding *sibling* is doing, keyed by a state — on the default
 * class (`hover`) or on a named one (`'card/hover'`). The state vocabulary is `not`'s, so a pseudo-class
 * name is typed and a `data-`/`aria-` attribute is written out.
 */
type BoxGroupStyles = ExtractKeys<typeof Groups.groupKeys, Partial<Record<Groups.ParentKey, BoxStylesWithPseudoClasses>>>;
type BoxThemeGroupClassStyles = ExtractKeys<typeof themeGroupClass, Record<string, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles & BoxGroupStyles>>;
type BoxBreakpointsStyles = ExtractKeys<typeof breakpoints, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles & BoxGroupStyles & BoxThemeGroupClassStyles>;
/**
 * The device and accessibility-preference media features (`pointerCoarse`/`pointerFine`, `motionReduce`,
 * `forcedColors`, `contrastMore`). Deliberately the same shape as a breakpoint and, like a breakpoint,
 * not offered inside one: a rule lives in one `@media` block, so nesting two would drop half the ask.
 */
type BoxMediaFeatureStyles = ExtractKeys<typeof mediaFeatures, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles & BoxGroupStyles & BoxThemeGroupClassStyles>;
/**
 * `cq`: the same value shape a breakpoint takes, keyed by a container-query size instead — `md`, its
 * complement `maxMd`, or either against a named container (`'sidebar/md'`). Not offered inside a
 * breakpoint or in another `cq`, for the reason a breakpoint is not: a rule lives in one at-rule block.
 */
type BoxContainerQueryStyles = ExtractKeys<typeof Containers.containerQueryKey, Partial<Record<Containers.QueryKey, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles & BoxGroupStyles & BoxThemeGroupClassStyles>>>;
type ExtractVariants<T> = T extends {
    variants?: infer Variants;
} ? keyof Variants extends never ? never : Extract<keyof Variants, string> : never;
type ExtractChildrenVariants<T> = T extends {
    children?: infer Children;
} ? {
    [K in keyof Children & string]: ExtractVariants<Children[K]> | ExtractChildrenVariants<Children[K]>;
}[keyof Children & string] : never;
type ExtractChildrenNames<T, Prefix extends string = ''> = T extends {
    children?: infer Children;
} ? {
    [K in keyof Children & string]: `${Prefix}${Prefix extends '' ? '' : '.'}${K}` | ExtractChildrenNames<Children[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K}`>;
}[keyof Children & string] : never;
export type ExtractComponentsAndVariants<T> = {
    [K in keyof T & string]: ExtractVariants<T[K]> | ExtractChildrenVariants<T[K]>;
} & {
    [K in keyof T & string as ExtractChildrenNames<T[K], K>]: ExtractChildrenVariants<T[K]>;
};
type MergeUnion<T, U> = {
    [K in keyof T | keyof U]: K extends keyof T ? K extends keyof U ? T[K] | U[K] : T[K] : K extends keyof U ? U[K] : never;
};
type Simplify<T> = T extends infer U ? {
    [K in keyof U]: U[K];
} : never;
export type ComponentsAndVariants = Simplify<MergeUnion<ExtractComponentsAndVariants<typeof boxComponents>, Augmented.ComponentsTypes>>;
export interface ComponentProps<TKey extends keyof ComponentsAndVariants = never> {
    clean?: boolean;
    component?: TKey;
    variant?: ClassNameType<ComponentsAndVariants[TKey]>;
}
export type BoxStyleProps<TKey extends keyof ComponentsAndVariants = never> = Simplify<BoxStyles & BoxStartingStyles & BoxVariantStyles & BoxPseudoClassesStyles1 & BoxPseudoElementNesting<BoxPseudoElementStyles> & BoxPseudoClassesStyles2TopLevel & BoxPseudoGroupClassesStyles & BoxGroupStyles & BoxThemeGroupClassStyles & BoxBreakpointsStyles & BoxMediaFeatureStyles & BoxContainerQueryStyles & ComponentProps<TKey>>;
export type BoxComponentStyles = Simplify<BoxStylesWithPseudoClasses & BoxBreakpointsStyles & BoxMediaFeatureStyles & BoxContainerQueryStyles & BoxPseudoGroupClassesStyles & BoxGroupStyles & BoxThemeGroupClassStyles>;
export {};
