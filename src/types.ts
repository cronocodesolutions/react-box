export type Hovered<T> = {
  [K in keyof T as K extends string ? `${K}H` : never]: T[K];
};

export type Focused<T> = {
  [K in keyof T as K extends string ? `${K}F` : never]: T[K];
};

export type Activated<T> = {
  [K in keyof T as K extends string ? `${K}A` : never]: T[K];
};

export const styleVariables = {
  display: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'contents'] as const,
  boxSizing: ['border-box', 'content-box'] as const,
  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const,
  sizeSpecialValues: ['fit', 'fit-screen', 'auto', 'fit-content', 'max-content', 'min-content'] as const,
  borderAndOutlineStyles: ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'] as const,
  overflows: ['auto', 'hidden', 'scroll', 'visible'] as const,
  textDecoration: ['none', 'underline'] as const,
  textTransform: ['none', 'capitalize', 'lowercase', 'uppercase'] as const,
  textAlign: ['left', 'right', 'center', 'justify'] as const,
  opacity: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const,
  cursors: [
    'auto',
    'default',
    'none',
    'context-menu',
    'help',
    'pointer',
    'progress',
    'wait',
    'cell',
    'crosshair',
    'text',
    'vertical-text',
    'alias',
    'copy',
    'move',
    'no-drop',
    'not-allowed',
    'e-resize',
    'n-resize',
    'ne-resize',
    'nw-resize',
    's-resize',
    'se-resize',
    'sw-resize',
    'w-resize',
    'ew-resize',
    'ns-resize',
    'nesw-resize',
    'nwse-resize',
    'col-resize',
    'row-resize',
    'all-scroll',
    'zoom-in',
    'zoom-out',
    'grab',
    'grabbing',
  ] as const,
  positiveSizes: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50,
    52, 54, 56, 58, 60, 64, 68, 72, 76, 80, 88, 96, 100,
  ] as const,
  negativeSizes: [
    -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -20, -24, -28, -32, -36, -40, -44, -48, -52, -56, -60, -68, -76,
    -84, -92, -100,
  ] as const,
  sizeMultiplier: 0.25,
  borderSizes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
  fontSizes: [
    6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 64, 70, 78, 86, 96,
  ] as const,
  fontStyle: ['italic', 'normal', 'oblique'] as const,
  fontWeight: [100, 200, 300, 400, 500, 600, 700, 800, 900] as const,
  zIndexSizes: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 100, 101, 102, 103, 104, 105, 1000, 1001, 1002, 1003, 1004, 1005] as const,
  justifyContent: [
    'start',
    'end',
    'flex-start',
    'flex-end',
    'center',
    'left',
    'right',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
  ] as const,
  alignItems: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'start', 'end', 'self-start', 'self-end'] as const,
  alignContent: [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch',
    'start',
    'end',
    'baseline',
  ] as const,
  flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'] as const,
  gap: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
  order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const,
  flexWrap: ['nowrap', 'wrap', 'wrap-reverse'] as const,
  flexGrow: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
  flexShrink: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
  flexSelf: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const,
  outlineOffset: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
  transition: ['none'] as const,
  background: ['none'] as const,
  userSelect: ['none', 'auto', 'text', 'all'] as const,
  appearance: ['none'] as const,
  pointerEvents: ['none', 'auto', 'all'] as const,
  whiteSpace: ['break-spaces', 'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'] as const,
  textOverflow: ['clip', 'ellipsis'] as const,
  gridColumns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const,
};
export const sizes = [...styleVariables.positiveSizes, ...styleVariables.negativeSizes] as const;

type GapType = (typeof styleVariables.gap)[number];
type BoxSizeValue = (typeof styleVariables.sizeSpecialValues)[number];
type BorderSizeType = (typeof styleVariables.borderSizes)[number];
type SizeType = (typeof sizes)[number];
type CursorType = (typeof styleVariables.cursors)[number];
type OverflowType = (typeof styleVariables.overflows)[number];
type FontSizeType = (typeof styleVariables.fontSizes)[number];
type FontStyleType = (typeof styleVariables.fontStyle)[number];
type FontWeightType = (typeof styleVariables.fontWeight)[number];
type ZIndexSizeType = (typeof styleVariables.zIndexSizes)[number];
type OpacitySizeType = (typeof styleVariables.opacity)[number];
type TextDecorationType = (typeof styleVariables.textDecoration)[number];
type TextTransformType = (typeof styleVariables.textTransform)[number];
type TextAlignType = (typeof styleVariables.textAlign)[number];
type BorderAndOutlineStyleType = (typeof styleVariables.borderAndOutlineStyles)[number];
type TransitionType = (typeof styleVariables.transition)[number];
type UserSelectType = (typeof styleVariables.userSelect)[number];
type AppearanceType = (typeof styleVariables.appearance)[number];
type PointerEventsType = (typeof styleVariables.pointerEvents)[number];
type WhiteSpaceType = (typeof styleVariables.whiteSpace)[number];
type TextOverflowType = (typeof styleVariables.textOverflow)[number];

interface BoxPseudoClasses {
  hover?: boolean;
  focus?: boolean;
}

interface BoxDisplay {
  display?: (typeof styleVariables.display)[number];
  inline?: boolean;
}

interface BoxSizing {
  boxSizing?: (typeof styleVariables.boxSizing)[number];
}

export interface BoxPosition {
  position?: (typeof styleVariables.position)[number];
  inset?: (typeof styleVariables.positiveSizes)[number];
  top?: SizeType;
  right?: SizeType;
  bottom?: SizeType;
  left?: SizeType;
}

export interface BoxSize {
  width?: BoxSizeValue;
  height?: BoxSizeValue;
  minWidth?: BoxSizeValue;
  minHeight?: BoxSizeValue;
  maxWidth?: BoxSizeValue;
  maxHeight?: BoxSizeValue;
}

interface BoxMargin {
  margin?: (typeof styleVariables.positiveSizes)[number] | 'auto';
  m?: (typeof styleVariables.positiveSizes)[number] | 'auto';
  marginHorizontal?: (typeof styleVariables.positiveSizes)[number] | 'auto';
  mx?: (typeof styleVariables.positiveSizes)[number] | 'auto';
  marginVertical?: (typeof styleVariables.positiveSizes)[number] | 'auto';
  my?: (typeof styleVariables.positiveSizes)[number] | 'auto';
  marginTop?: SizeType | 'auto';
  mt?: SizeType | 'auto';
  marginRight?: SizeType | 'auto';
  mr?: SizeType | 'auto';
  marginBottom?: SizeType | 'auto';
  mb?: SizeType | 'auto';
  marginLeft?: SizeType | 'auto';
  ml?: SizeType | 'auto';
}

interface BoxPadding {
  padding?: (typeof styleVariables.positiveSizes)[number];
  p?: (typeof styleVariables.positiveSizes)[number];
  paddingHorizontal?: (typeof styleVariables.positiveSizes)[number];
  px?: (typeof styleVariables.positiveSizes)[number];
  paddingVertical?: (typeof styleVariables.positiveSizes)[number];
  py?: (typeof styleVariables.positiveSizes)[number];
  paddingTop?: SizeType;
  pt?: SizeType;
  paddingRight?: SizeType;
  pr?: SizeType;
  paddingBottom?: SizeType;
  pb?: SizeType;
  paddingLeft?: SizeType;
  pl?: SizeType;
}

interface BoxOutline {
  outline?: BorderSizeType;
  outlineStyle?: BorderAndOutlineStyleType;
  outlineOffset?: (typeof styleVariables.outlineOffset)[number];
}

interface BoxBorder {
  border?: BorderSizeType;
  b?: BorderSizeType;
  borderHorizontal?: BorderSizeType;
  bx?: BorderSizeType;
  borderVertical?: BorderSizeType;
  by?: BorderSizeType;
  borderTop?: BorderSizeType;
  bt?: BorderSizeType;
  borderRight?: BorderSizeType;
  br?: BorderSizeType;
  borderBottom?: BorderSizeType;
  bb?: BorderSizeType;
  borderLeft?: BorderSizeType;
  bl?: BorderSizeType;
  borderStyle?: BorderAndOutlineStyleType;
  borderRadius?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusTop?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusRight?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusBottom?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusLeft?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusTopLeft?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusTopRight?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusBottomLeft?: (typeof styleVariables.positiveSizes)[number];
  borderRadiusBottomRight?: (typeof styleVariables.positiveSizes)[number];
}

interface BoxCursor {
  cursor?: CursorType;
}

interface BoxZIndex {
  zIndex?: ZIndexSizeType;
}

interface BoxOverflow {
  overflow?: OverflowType;
  overflowX?: OverflowType;
  overflowY?: OverflowType;
}

interface BoxOpacity {
  opacity?: OpacitySizeType;
}

interface BoxFont {
  fontSize?: FontSizeType;
  lineHeight?: FontSizeType | 'font-size';
  fontWeight?: FontWeightType;
  letterSpacing?: SizeType;
  fontStyle?: FontStyleType;
}

interface BoxText {
  textDecoration?: TextDecorationType;
  textTransform?: TextTransformType;
  textAlign?: TextAlignType;
  whiteSpace?: WhiteSpaceType;
  textOverflow?: TextOverflowType;
}

interface BoxFlex {
  flexWrap?: (typeof styleVariables.flexWrap)[number];
  justifyContent?: (typeof styleVariables.justifyContent)[number];
  jc?: (typeof styleVariables.justifyContent)[number];
  alignItems?: (typeof styleVariables.alignItems)[number];
  ai?: (typeof styleVariables.alignItems)[number];
  alignContent?: (typeof styleVariables.alignContent)[number];
  ac?: (typeof styleVariables.alignContent)[number];
  flex1?: boolean;
  flexDirection?: (typeof styleVariables.flexDirection)[number];
  d?: (typeof styleVariables.flexDirection)[number];
  gap?: GapType;
  rowGap?: GapType;
  columnGap?: GapType;
  order?: (typeof styleVariables.order)[number];
  flexGrow?: (typeof styleVariables.flexGrow)[number];
  flexShrink?: (typeof styleVariables.flexShrink)[number];
  alignSelf?: (typeof styleVariables.flexSelf)[number];
  justifySelf?: (typeof styleVariables.flexSelf)[number];
}

interface BoxGrid {
  gridColumns?: (typeof styleVariables.gridColumns)[number];
  colSpan?: (typeof styleVariables.gridColumns)[number] | 'full-row';
  colStart?: (typeof styleVariables.gridColumns)[number];
  colEnd?: (typeof styleVariables.gridColumns)[number];
}

interface BoxTransition {
  transition?: TransitionType;
}

interface BoxUserSelect {
  userSelect?: UserSelectType;
}

interface BoxAppearance {
  appearance?: AppearanceType;
}

interface BoxPointerEvents {
  pointerEvents?: PointerEventsType;
}

type BoxNormalStyles = BoxPseudoClasses &
  BoxDisplay &
  BoxSizing &
  BoxPosition &
  BoxSize &
  BoxMargin &
  BoxPadding &
  BoxBorder &
  BoxCursor &
  BoxZIndex &
  BoxOverflow &
  BoxOpacity &
  BoxFont &
  BoxText &
  BoxFlex &
  BoxOutline &
  BoxTransition &
  BoxUserSelect &
  BoxAppearance &
  BoxPointerEvents &
  BoxGrid;

export namespace Augmented {
  export interface BoxProps {}
  export interface SvgProps {}
}

export type BoxStyles = BoxNormalStyles &
  Hovered<BoxNormalStyles> &
  Focused<BoxNormalStyles> &
  Activated<BoxNormalStyles> &
  Augmented.BoxProps;

export const themeClasses: Partial<Record<string, string>> = {
  hover: '_h',
  focus: '_f',
  shadow: 'shadow_',
  shadowH: 'shadow_h_',
  shadowF: 'shadow_f_',
  shadowA: 'shadow_a_',
  background: 'bg_',
  backgroundH: 'bg_h_',
  backgroundF: 'bg_f_',
  backgroundA: 'bg_a_',
  bg: 'bg_',
  bgH: 'bg_h_',
  bgF: 'bg_f_',
  bgA: 'bg_a_',
  color: 'color_',
  colorH: 'color_h_',
  colorF: 'color_f_',
  colorA: 'color_a_',
  backgroundColor: 'bgColor_',
  backgroundColorH: 'bgColor_h_',
  backgroundColorF: 'bgColor_f_',
  backgroundColorA: 'bgColor_a_',
  bgColor: 'bgColor_',
  bgColorH: 'bgColor_h_',
  bgColorF: 'bgColor_f_',
  bgColorA: 'bgColor_a_',
  borderColor: 'borderColor_',
  borderColorH: 'borderColor_h_',
  borderColorF: 'borderColor_f_',
  borderColorA: 'borderColor_a_',
  outlineColor: 'outlineColor_',
  outlineColorH: 'outlineColor_h_',
  outlineColorF: 'outlineColor_f_',
  outlineColorA: 'outlineColor_a_',
};

interface SvgNormalStyles {
  rotate?: 0 | 90 | 180 | 270 | -90 | -180 | -270;
  flip?: 'xAxis' | 'yAxis';
}
export type SvgStyles = SvgNormalStyles &
  Hovered<SvgNormalStyles> &
  Focused<SvgNormalStyles> &
  Activated<SvgNormalStyles> &
  Augmented.SvgProps;

export const themeSvgClasses: Partial<Record<string, string>> = {
  fill: 'fill_',
  fillH: 'fill_h_',
  fillF: 'fill_f_',
  fillA: 'fill_a_',
  stroke: 'stroke_',
  strokeH: 'stroke_h_',
  strokeF: 'stroke_f_',
  strokeA: 'stroke_a_',
};
