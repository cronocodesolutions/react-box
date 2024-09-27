import { breakpoints, cssStyles, pseudo1, pseudo2, pseudoGroupClasses } from './core/boxStyles';
import { ArrayType, BoxStyle, BoxStylesType, ExtractKeys } from './core/coreTypes';

export type ExtractBoxStyles<T extends Record<string, BoxStyle[]>> = {
  [K in keyof T]?: BoxStylesType<ArrayType<T[K]>['values']>;
};

export namespace Augmented {
  export interface BoxProps {}
}

export type BoxStyles = ExtractBoxStyles<typeof cssStyles> & Augmented.BoxProps;

type BoxPseudoClassesStyles1 = ExtractKeys<typeof pseudo1, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2Nested = ExtractKeys<typeof pseudo2, BoxStylesWithPseudoClasses>;
type BoxPseudoClassesStyles2TopLevel = ExtractKeys<typeof pseudo2, boolean | [boolean, BoxStylesWithPseudoClasses]>;
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
