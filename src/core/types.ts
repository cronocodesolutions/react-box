import { StyleItem, aliases, boxStyles } from './boxStyles';
import { ThemeComponentProps } from './useTheme';

export type ExtractElementType<T> =
  T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : T extends React.SVGProps<infer E> ? E : never;

export type ExtractElementFromTag<T extends keyof React.JSX.IntrinsicElements> = ExtractElementType<React.JSX.IntrinsicElements[T]>;

export type Hovered<T> = {
  [K in keyof T as K extends string ? `${K}H` : never]: T[K];
};

export type Focused<T> = {
  [K in keyof T as K extends string ? `${K}F` : never]: T[K];
};

export type Activated<T> = {
  [K in keyof T as K extends string ? `${K}A` : never]: T[K];
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
  Hovered<BoxNormalStyles> &
  Focused<BoxNormalStyles> &
  Activated<BoxNormalStyles> &
  ThemeComponentProps &
  Augmented.BoxProps;

interface SvgNormalStyles {
  rotate?: BoxNormalStyles['rotate'];
  flip?: BoxNormalStyles['flip'];
  transitionDuration?: BoxNormalStyles['transitionDuration'];
}
export type BoxSvgStyles = SvgNormalStyles &
  Hovered<SvgNormalStyles> &
  Focused<SvgNormalStyles> &
  Activated<SvgNormalStyles> &
  ThemeComponentProps &
  Augmented.SvgProps;
