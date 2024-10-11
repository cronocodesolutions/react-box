import { breakpoints, cssStyles, pseudo1, pseudo2, pseudoClasses, pseudoGroupClasses } from './core/boxStyles';
import { BoxStyle, BoxStylesType, ExtractKeys } from './core/coreTypes';

export namespace Augmented {
  export interface BoxProps {}
  export interface BoxPropTypes {}
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
export type BooleanPseudoClassesValue = boolean | [boolean, BoxStylesWithPseudoClasses];

type BoxPseudoClassesStyles1 = ExtractKeys<typeof pseudo1, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2Nested = ExtractKeys<typeof pseudo2, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2TopLevel = ExtractKeys<typeof pseudo2, BooleanPseudoClassesValue>;
interface BoxStylesWithPseudoClasses extends BoxStyles, BoxPseudoClassesStyles1, BoxPseudoClassesStyles2Nested {}

type BoxPseudoGroupClassesStyles = ExtractKeys<typeof pseudoGroupClasses, string | Record<string, BoxStyles>>;
type BoxBreakpointsStyles = ExtractKeys<typeof breakpoints, BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles>;

export interface ThemeProps {
  clean?: boolean;
  component?: string;
  theme?: string;
}

export type BoxStyleProps = BoxStyles &
  BoxPseudoClassesStyles1 &
  BoxPseudoClassesStyles2TopLevel &
  BoxPseudoGroupClassesStyles &
  BoxBreakpointsStyles &
  ThemeProps;
export type BoxThemeStyles = BoxStylesWithPseudoClasses & BoxBreakpointsStyles;
