import { PseudoClassSuffix, StyleItem, boxStyles } from './boxStyles';
import { ThemeComponentProps } from './useTheme';

export type ExtractElementType<T> =
  T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : T extends React.SVGProps<infer E> ? E : never;

export type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;

export type PseudoClass<T, TSuffix extends PseudoClassSuffix> = {
  [K in keyof T as K extends string ? `${K}${TSuffix}` : never]: T[K];
};

export namespace Augmented {
  export interface BoxProps {}
  export interface SvgProps {}
}

type BoxStyles<T extends Record<string, StyleItem>> = {
  [K in keyof T]?: T[K]['values1']['values'][number] | T[K]['values2']['values'][number] | T[K]['values3']['values'][number];
};

type BoxNormalStyles = BoxStyles<typeof boxStyles> & Augmented.BoxProps;
interface BoxPseudoClasses {
  hover?: boolean;
  focus?: boolean;
}
interface BoxPseudoClasses2 {
  disabled?: boolean | [boolean, BoxNormalStyles];
}

type BoxPseudoClassStyles = PseudoClass<BoxNormalStyles, 'H'> & PseudoClass<BoxNormalStyles, 'F'> & PseudoClass<BoxNormalStyles, 'A'>;

interface BoxThemePseudoClassProps {
  disabled?: BoxNormalStyles;
  indeterminate?: BoxNormalStyles;
  checked?: BoxNormalStyles;
}
export type BoxThemeProps = BoxNormalStyles & BoxThemePseudoClassProps & BoxPseudoClassStyles;

export type BoxStyleProps = BoxNormalStyles & BoxPseudoClasses & BoxPseudoClasses2 & BoxPseudoClassStyles & ThemeComponentProps;

interface SvgNormalStyles {
  rotate?: BoxNormalStyles['rotate'];
  flip?: BoxNormalStyles['flip'];
  transitionDuration?: BoxNormalStyles['transitionDuration'];
}
export type BoxSvgStyles = SvgNormalStyles &
  PseudoClass<SvgNormalStyles, 'H'> &
  PseudoClass<SvgNormalStyles, 'F'> &
  PseudoClass<SvgNormalStyles, 'A'> &
  ThemeComponentProps &
  Augmented.SvgProps;
