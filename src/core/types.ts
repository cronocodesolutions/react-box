import { PseudoClassSuffix, StyleItem, aliases, boxStyles } from './boxStyles';
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

type BoxNormalStyles = BoxStyles<typeof boxStyles> & BoxStyles<typeof aliases>;
interface BoxPseudoClasses {
  hover?: boolean;
  focus?: boolean;
}
export type BoxStyleProps = BoxNormalStyles &
  BoxPseudoClasses &
  PseudoClass<BoxNormalStyles, 'H'> &
  PseudoClass<BoxNormalStyles, 'F'> &
  PseudoClass<BoxNormalStyles, 'A'> &
  PseudoClass<BoxNormalStyles, 'Checked'> &
  PseudoClass<BoxNormalStyles, 'Indeterminate'> &
  PseudoClass<BoxNormalStyles, 'Valid'> &
  PseudoClass<BoxNormalStyles, 'Invalid'> &
  PseudoClass<BoxNormalStyles, 'Required'> &
  PseudoClass<BoxNormalStyles, 'Optional'> &
  ThemeComponentProps &
  Augmented.BoxProps;

interface SvgNormalStyles {
  rotate?: BoxNormalStyles['rotate'];
  flip?: BoxNormalStyles['flip'];
  transitionDuration?: BoxNormalStyles['transitionDuration'];
}
export type BoxSvgStyles = SvgNormalStyles &
  PseudoClass<SvgNormalStyles, 'H'> &
  PseudoClass<SvgNormalStyles, 'F'> &
  PseudoClass<SvgNormalStyles, 'A'> &
  PseudoClass<SvgNormalStyles, 'Checked'> &
  PseudoClass<SvgNormalStyles, 'Indeterminate'> &
  PseudoClass<SvgNormalStyles, 'Valid'> &
  PseudoClass<SvgNormalStyles, 'Invalid'> &
  PseudoClass<SvgNormalStyles, 'Required'> &
  PseudoClass<SvgNormalStyles, 'Optional'> &
  ThemeComponentProps &
  Augmented.SvgProps;
