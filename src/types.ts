/* eslint-disable @typescript-eslint/no-empty-object-type */
import { breakpoints, cssStyles, pseudo1, pseudo2, pseudoClasses, pseudoGroupClasses, themeGroupClass } from './core/boxStyles';
import { ClassNameType } from './core/classNames';
import { BoxStyle, BoxStylesType, ExtractKeys, ExtractTupleValues } from './core/coreTypes';
import boxComponents from './core/extends/boxComponents';

export type ArrayType<T> = T extends (infer U)[] ? U : T;

export namespace Augmented {
  export interface BoxProps {}
  export interface BoxPropTypes {}
  export interface ComponentsTypes {}
}

type ExtractBoxStyleValue<T> = T extends { tuple: true; values: infer V }
  ? ExtractTupleValues<V>
  : T extends { values: infer V }
    ? BoxStylesType<V>
    : never;

type ExtractBoxStylesInternal<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: K extends keyof Augmented.BoxPropTypes
    ? ExtractBoxStyleValue<ArrayType<T[K]>> | Augmented.BoxPropTypes[K]
    : ExtractBoxStyleValue<ArrayType<T[K]>>;
};
export type ExtractBoxStyles<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: ExtractBoxStyleValue<ArrayType<T[K]>>;
};

export type PseudoClassesType = keyof typeof pseudoClasses;
export type BoxStyles = ExtractBoxStylesInternal<typeof cssStyles> & Augmented.BoxProps;

type BoxPseudoClassesStyles1 = ExtractKeys<typeof pseudo1, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2Nested = ExtractKeys<typeof pseudo2, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2TopLevel = ExtractKeys<typeof pseudo2, boolean | [boolean, BoxStylesWithPseudoClasses]>;
export interface BoxStylesWithPseudoClasses extends BoxStyles, BoxPseudoClassesStyles1, BoxPseudoClassesStyles2Nested {}

type BoxPseudoGroupClassesStyles = ExtractKeys<typeof pseudoGroupClasses, Record<string, BoxStylesWithPseudoClasses>>;
type BoxThemeGroupClassStyles = ExtractKeys<
  typeof themeGroupClass,
  Record<string, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles>
>;
type BoxBreakpointsStyles = ExtractKeys<
  typeof breakpoints,
  BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles & BoxThemeGroupClassStyles
>;

type ExtractVariants<T> = T extends { variants?: infer Variants }
  ? keyof Variants extends never
    ? never
    : Extract<keyof Variants, string>
  : never;

type ExtractChildrenVariants<T> = T extends { children?: infer Children }
  ? {
      [K in keyof Children & string]: ExtractVariants<Children[K]> | ExtractChildrenVariants<Children[K]>;
    }[keyof Children & string]
  : never;

type ExtractChildrenNames<T, Prefix extends string = ''> = T extends { children?: infer Children }
  ? {
      [K in keyof Children & string]:
        `${Prefix}${Prefix extends '' ? '' : '.'}${K}` | ExtractChildrenNames<Children[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K}`>;
    }[keyof Children & string]
  : never;

export type ExtractComponentsAndVariants<T> = {
  [K in keyof T & string]: ExtractVariants<T[K]> | ExtractChildrenVariants<T[K]>;
} & {
  [K in keyof T & string as ExtractChildrenNames<T[K], K>]: ExtractChildrenVariants<T[K]>;
};

type MergeUnion<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K] // Merge both values into a union
      : T[K]
    : K extends keyof U
      ? U[K]
      : never;
};
type Simplify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export type ComponentsAndVariants = Simplify<MergeUnion<ExtractComponentsAndVariants<typeof boxComponents>, Augmented.ComponentsTypes>>;

export interface ComponentProps<TKey extends keyof ComponentsAndVariants = never> {
  clean?: boolean;
  component?: TKey;
  variant?: ClassNameType<ComponentsAndVariants[TKey]>;
}

export type BoxStyleProps<TKey extends keyof ComponentsAndVariants = never> = Simplify<
  BoxStyles &
    BoxPseudoClassesStyles1 &
    BoxPseudoClassesStyles2TopLevel &
    BoxPseudoGroupClassesStyles &
    BoxThemeGroupClassStyles &
    BoxBreakpointsStyles &
    ComponentProps<TKey>
>;
export type BoxComponentStyles = Simplify<
  BoxStylesWithPseudoClasses & BoxBreakpointsStyles & BoxPseudoGroupClassesStyles & BoxThemeGroupClassStyles
>;
