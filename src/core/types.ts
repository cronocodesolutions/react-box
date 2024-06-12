import { StyleItem, simpleBoxStyles } from './boxStyles';
import { ThemeComponentProps } from './useTheme';

export type ExtractElementType<T> =
  T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : T extends React.SVGProps<infer E> ? E : never;

export type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;

export namespace Augmented {
  export interface BoxProps {}
  export interface SvgProps {}
}

type BoxStyles<T extends Record<string, StyleItem>> = {
  [K in keyof T]?: T[K]['values1']['values'][number] | T[K]['values2']['values'][number] | T[K]['values3']['values'][number];
};

type BoxNormalStyles = BoxStyles<typeof simpleBoxStyles> & Augmented.BoxProps;
type SvgNormalStyles = BoxStyles<typeof simpleBoxStyles> & Augmented.SvgProps;

interface BoxPseudoClasses<T> {
  disabled?: boolean | [boolean, T];
  disabledGroup?: string | Record<string, T>;
  hasDisabled?: T;
  hover?: T;
  hoverGroup?: string | Record<string, T>;
  focus?: T;
  focusGroup?: string | Record<string, T>;
  active?: T;
  activeGroup?: string | Record<string, T>;
  checked?: T;
  hasChecked?: T;
  valid?: T;
  hasValid?: T;
  invalid?: T;
  hasInvalid?: T;
}

interface BoxThemePseudoClassProps {
  hover?: BoxNormalStyles;
  focus?: BoxNormalStyles;
  active?: BoxNormalStyles;
  disabled?: BoxNormalStyles;
  hasDisabled?: BoxNormalStyles;
  indeterminate?: BoxNormalStyles;
  checked?: BoxNormalStyles;
  hasChecked?: BoxNormalStyles;
  valid?: BoxNormalStyles;
  hasValid?: BoxNormalStyles;
  invalid?: BoxNormalStyles;
  hasInvalid?: BoxNormalStyles;
}

export interface BoxBreakpoints<T = BoxThemeProps> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export type BoxThemeProps = BoxNormalStyles & BoxThemePseudoClassProps & BoxBreakpoints;

export type BoxStyleProps = BoxNormalStyles & BoxPseudoClasses<BoxNormalStyles> & ThemeComponentProps & BoxBreakpoints<BoxStyleProps>;
export type BoxSvgStyles = SvgNormalStyles & BoxPseudoClasses<SvgNormalStyles> & ThemeComponentProps & BoxBreakpoints<BoxSvgStyles>;
