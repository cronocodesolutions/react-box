import { breakpoints, cssStyles, pseudo1, pseudo2, pseudoClasses, pseudoGroupClasses } from './core/boxStyles';
import { BoxStyle, BoxStylesType, ExtractKeys } from './core/coreTypes';
import boxComponents from './core/extends/boxComponents';

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

type BoxPseudoGroupClassesStyles = ExtractKeys<typeof pseudoGroupClasses, string | Record<string, BoxStyles>>;
type BoxBreakpointsStyles = ExtractKeys<typeof breakpoints, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles>;

type ExtractVariants<T> = T extends { variants?: infer Variants }
  ? keyof Variants extends never
    ? never
    : Extract<keyof Variants, string>
  : never;

type ExtractChildrenVariants<T> = T extends { children?: infer Children } ? ExtractVariants<Children[keyof Children]> : never;
type ExtractChildrenNames<T, Prefix extends string> = T extends { children?: infer Children }
  ? `${Prefix}.${keyof Children & string}`
  : never;

export type ExtractComponentsAndVariants<T> = {
  [K in keyof T as K extends string ? K : never]: ExtractVariants<T[K]>;
} & {
  [K in keyof T as ExtractChildrenNames<T[K], `${K & string}`>]: ExtractChildrenVariants<T[K]>;
} & {
  [K in keyof T as T[K] extends { children?: infer Children }
    ? ExtractChildrenNames<Children[keyof Children], `${K & string}.${keyof Children & string}`>
    : never]: T[K] extends {
    children?: infer Children;
  }
    ? ExtractChildrenVariants<Children[keyof Children]>
    : never;
} & {
  [K in keyof T as T[K] extends { children?: infer Children }
    ? Children[keyof Children] extends { children?: infer Children2 }
      ? ExtractChildrenNames<Children2[keyof Children2], `${K & string}.${keyof Children & string}.${keyof Children2 & string}`>
      : never
    : never]: T[K] extends {
    children?: infer Children;
  }
    ? Children[keyof Children] extends { children?: infer Children2 }
      ? ExtractChildrenVariants<Children2[keyof Children2]>
      : never
    : never;
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

export type ComponentsAndVariants = MergeUnion<
  Simplify<ExtractComponentsAndVariants<typeof boxComponents>>,
  Simplify<Augmented.ComponentsTypes>
>;

export interface ComponentProps<TKey extends keyof ComponentsAndVariants = never> {
  clean?: boolean;
  component?: TKey;
  variant?: ComponentsAndVariants[TKey];
}

export type BoxStyleProps<TKey extends keyof ComponentsAndVariants = never> = Simplify<
  BoxStyles &
    BoxPseudoClassesStyles1 &
    BoxPseudoClassesStyles2TopLevel &
    BoxPseudoGroupClassesStyles &
    BoxBreakpointsStyles &
    ComponentProps<TKey>
>;
export type BoxComponentStyles = BoxStylesWithPseudoClasses & BoxBreakpointsStyles;
