import { breakpoints, cssStyles, pseudo1, pseudo2, pseudoClasses, pseudoGroupClasses } from './core/boxStyles';
import { ClassNameType } from './core/classNames';
import { BoxStyle, BoxStylesType, ExtractKeys } from './core/coreTypes';
import boxComponents from './core/extends/boxComponents';

export type ArrayType<T> = T extends (infer U)[] ? U : T;

export namespace Augmented {
  export interface BoxProps {}
  export interface BoxPropTypes {}
  export interface ComponentsTypes {}
}

type ExtractBoxStylesInternal<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: K extends keyof Augmented.BoxPropTypes
    ? BoxStylesType<ArrayType<T[K]>['values']> | Augmented.BoxPropTypes[K]
    : BoxStylesType<ArrayType<T[K]>['values']>;
};
export type ExtractBoxStyles<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: BoxStylesType<ArrayType<T[K]>['values']>;
};

export type PseudoClassesType = keyof typeof pseudoClasses;
export type BoxStyles = ExtractBoxStylesInternal<typeof cssStyles> & Augmented.BoxProps;

type BoxPseudoClassesStyles1 = ExtractKeys<typeof pseudo1, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2Nested = ExtractKeys<typeof pseudo2, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2TopLevel = ExtractKeys<typeof pseudo2, boolean | [boolean, BoxStylesWithPseudoClasses]>;
export interface BoxStylesWithPseudoClasses extends BoxStyles, BoxPseudoClassesStyles1, BoxPseudoClassesStyles2Nested {}

type BoxPseudoGroupClassesStyles = ExtractKeys<typeof pseudoGroupClasses, Record<string, BoxStyles>>;
type BoxBreakpointsStyles = ExtractKeys<typeof breakpoints, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles>;

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
        | `${Prefix}${Prefix extends '' ? '' : '.'}${K}`
        | ExtractChildrenNames<Children[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K}`>;
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
    BoxBreakpointsStyles &
    ComponentProps<TKey>
>;
export type BoxComponentStyles = Simplify<BoxStylesWithPseudoClasses & BoxBreakpointsStyles & BoxPseudoGroupClassesStyles>;
