import { breakpoints, cssStyles, pseudo1, pseudo2, pseudoGroupClasses } from './core/boxStyles2';
import {
  ArrayType,
  BoxStyle,
  BoxStylesType,
  ExtractBoxBreakpointsStyles,
  ExtractBoxPseudoClassesStyles1,
  ExtractBoxPseudoClassesStyles2,
  ExtractBoxPseudoGroupClassesStyles,
} from './core/coreTypes';

export type ExtractBoxStyles<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: BoxStylesType<ArrayType<T[K]>['values']>;
};

export namespace Augmented {
  export interface BoxProps {}
  export interface SvgProps {}
}

export type BoxStyles = ExtractBoxStyles<typeof cssStyles> & Augmented.BoxProps;
// export type SvgStyles = ExtractBoxStyles<typeof cssStyles> & Augmented.SvgProps;

type BoxPseudoClassesStyles1 = ExtractBoxPseudoClassesStyles1<typeof pseudo1, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2 = ExtractBoxPseudoClassesStyles2<typeof pseudo2, BoxStylesWithPseudoClasses>;
export interface BoxStylesWithPseudoClasses extends BoxStyles, BoxPseudoClassesStyles1, BoxPseudoClassesStyles2 {}

type BoxPseudoGroupClassesStyles = ExtractBoxPseudoGroupClassesStyles<typeof pseudoGroupClasses, BoxStyles>;
export type BoxStylesWithPseudoClassesAndPseudoGroups = BoxStylesWithPseudoClasses & BoxPseudoGroupClassesStyles;

type BoxBreakpointsStyles = ExtractBoxBreakpointsStyles<typeof breakpoints, BoxStylesWithPseudoClassesAndPseudoGroups>;

export interface ThemeProps {
  clean?: boolean;
  component?: string;
  theme?: string;
}

export type BoxAllStyles = BoxStylesWithPseudoClassesAndPseudoGroups & BoxBreakpointsStyles & ThemeProps;
export type BoxThemeStyles = BoxStylesWithPseudoClasses & BoxBreakpointsStyles;
