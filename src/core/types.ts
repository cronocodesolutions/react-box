import { StyleItem, boxStyles } from './boxStyles';
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

type BoxNormalStyles = BoxStyles<typeof boxStyles> & Augmented.BoxProps;

interface BoxPseudoClasses2 {
  disabled?: boolean | [boolean, BoxNormalStyles];
  hover?: boolean | [boolean, BoxNormalStyles] | BoxNormalStyles;
  focus?: boolean | [boolean, BoxNormalStyles] | BoxNormalStyles;
  active?: BoxNormalStyles;
}

interface BoxThemePseudoClassProps {
  hover?: BoxNormalStyles;
  focus?: BoxNormalStyles;
  active?: BoxNormalStyles;
  disabled?: BoxNormalStyles;
  indeterminate?: BoxNormalStyles;
  checked?: BoxNormalStyles;
}
export type BoxThemeProps = BoxNormalStyles & BoxThemePseudoClassProps;

export type BoxStyleProps = BoxNormalStyles & BoxPseudoClasses2 & ThemeComponentProps;

interface SvgNormalStyles {
  rotate?: BoxNormalStyles['rotate'];
  flip?: BoxNormalStyles['flip'];
  transitionDuration?: BoxNormalStyles['transitionDuration'];
  // hover?: boolean | [boolean, BoxNormalStyles];
}
export type BoxSvgStyles = SvgNormalStyles & ThemeComponentProps & Augmented.SvgProps;
