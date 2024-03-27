import { BoxStylesFormatters } from './boxStylesFormatters';

export interface StyleValues {
  values: Readonly<Array<unknown>>;
  formatSelector?: (selector: string) => string[];
  formatValue?: (key: string, value: any) => string;
}

export interface ThemeItem {
  cssNames: string[];
  formatSelector?: (selector: string) => string[];
  formatValue?: (key: string, value: any) => string;
}

export interface StyleItem {
  cssNames: string[];
  values1: StyleValues;
  values2: StyleValues;
  values3: StyleValues;
  pseudoSuffix?: PseudoClassSuffix;
  breakpoint?: BoxBreakpointsType;
  isThemeStyle?: boolean;
}

const positiveSizes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52,
  54, 56, 58, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 120, 140, 160, 180, 200, 250, 300,
] as const;
const negativeSizes = [
  -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -22, -24, -26, -28, -30, -32, -34, -36, -38,
  -40, -44, -48, -52, -56, -60, -64, -68, -72, -76, -80, -84, -88, -92, -96, -100,
] as const;
const sizes = [...positiveSizes, ...negativeSizes] as const;
const borderAndOutlineStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'] as const;
const overflows = ['auto', 'hidden', 'scroll', 'visible'] as const;
const widthHeightFractions = [
  '1/2',
  '1/3',
  '2/3',
  '1/4',
  '2/4',
  '3/4',
  '1/5',
  '2/5',
  '3/5',
  '4/5',
  '1/6',
  '2/6',
  '3/6',
  '4/6',
  '5/6',
  '1/12',
  '2/12',
  '3/12',
  '4/12',
  '5/12',
  '6/12',
  '7/12',
  '8/12',
  '9/12',
  '10/12',
  '11/12',
] as const;
const widthHeightValues = ['fit', 'fit-screen', 'auto', 'fit-content', 'max-content', 'min-content'] as const;
const alignSelf = ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const;

export const boxStyles = {
  /** The `display` CSS property sets whether an element is treated as a block or inline box and the layout used for its children, such as flow layout, grid or flex. */
  display: {
    cssNames: ['display'],
    values1: { values: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'contents'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  /** The `inline` property is a shortcut to transform `block`, `flex` and `grid` value to `inline-block`, `inline-flex` and `inline-grid` respectively. */
  inline: {
    cssNames: ['display'],
    values1: { values: [true] as const, formatValue: () => 'inline-block' },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  /** The `box-sizing` CSS property sets how the total width and height of an element is calculated. */
  boxSizing: {
    cssNames: ['box-sizing'],
    values1: { values: ['border-box', 'content-box'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  width: {
    cssNames: ['width'],
    values1: { values: widthHeightValues, formatValue: BoxStylesFormatters.Value.widthHeight },
    values2: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values3: {
      values: widthHeightFractions,
      formatValue: BoxStylesFormatters.Value.fraction,
      // formatClassName: BoxStylesFormatters.ClassName.fraction,
    },
  },
  minWidth: {
    cssNames: ['min-width'],
    values1: { values: widthHeightValues, formatValue: BoxStylesFormatters.Value.widthHeight },
    values2: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values3: {
      values: widthHeightFractions,
      formatValue: BoxStylesFormatters.Value.fraction,
      // formatClassName: BoxStylesFormatters.ClassName.fraction,
    },
  },
  maxWidth: {
    cssNames: ['max-width'],
    values1: { values: widthHeightValues, formatValue: BoxStylesFormatters.Value.widthHeight },
    values2: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values3: {
      values: widthHeightFractions,
      formatValue: BoxStylesFormatters.Value.fraction,
      // formatClassName: BoxStylesFormatters.ClassName.fraction,
    },
  },
  height: {
    cssNames: ['height'],
    values1: { values: widthHeightValues, formatValue: BoxStylesFormatters.Value.widthHeight },
    values2: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values3: {
      values: widthHeightFractions,
      formatValue: BoxStylesFormatters.Value.fraction,
      // formatClassName: BoxStylesFormatters.ClassName.fraction,
    },
  },
  minHeight: {
    cssNames: ['min-height'],
    values1: { values: widthHeightValues, formatValue: BoxStylesFormatters.Value.widthHeight },
    values2: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values3: {
      values: widthHeightFractions,
      formatValue: BoxStylesFormatters.Value.fraction,
      // formatClassName: BoxStylesFormatters.ClassName.fraction,
    },
  },
  maxHeight: {
    cssNames: ['max-height'],
    values1: { values: widthHeightValues, formatValue: BoxStylesFormatters.Value.widthHeight },
    values2: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values3: {
      values: widthHeightFractions,
      formatValue: BoxStylesFormatters.Value.fraction,
      // formatClassName: BoxStylesFormatters.ClassName.fraction,
    },
  },
  position: {
    cssNames: ['position'],
    values1: { values: ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  top: {
    cssNames: ['top'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  right: {
    cssNames: ['right'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  bottom: {
    cssNames: ['bottom'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  left: {
    cssNames: ['left'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  inset: {
    cssNames: ['inset'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  m: {
    cssNames: ['margin'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  mx: {
    cssNames: ['margin-inline'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  my: {
    cssNames: ['margin-block'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  mt: {
    cssNames: ['margin-top'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  mr: {
    cssNames: ['margin-right'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  mb: {
    cssNames: ['margin-bottom'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  ml: {
    cssNames: ['margin-left'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  p: {
    cssNames: ['padding'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  px: {
    cssNames: ['padding-inline'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  py: {
    cssNames: ['padding-block'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  pt: {
    cssNames: ['padding-top'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  pr: {
    cssNames: ['padding-right'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  pb: {
    cssNames: ['padding-bottom'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  pl: {
    cssNames: ['padding-left'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  b: {
    cssNames: ['border-width'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  bx: {
    cssNames: ['border-inline-width'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  by: {
    cssNames: ['border-block-width'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  bt: {
    cssNames: ['border-top-width'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  br: {
    cssNames: ['border-right-width'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  bb: {
    cssNames: ['border-bottom-width'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  bl: {
    cssNames: ['border-left-width'],
    values1: { values: sizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderStyle: {
    cssNames: ['border-style'],
    values1: { values: borderAndOutlineStyles },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadius: {
    cssNames: ['border-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTop: {
    cssNames: ['border-top-left-radius', 'border-top-right-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusRight: {
    cssNames: ['border-top-right-radius', 'border-bottom-right-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottom: {
    cssNames: ['border-bottom-left-radius', 'border-bottom-right-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusLeft: {
    cssNames: ['border-top-left-radius', 'border-bottom-left-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTopLeft: {
    cssNames: ['border-top-left-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTopRight: {
    cssNames: ['border-top-right-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottomLeft: {
    cssNames: ['border-bottom-left-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottomRight: {
    cssNames: ['border-bottom-right-radius'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  cursor: {
    cssNames: ['cursor'],
    values1: {
      values: [
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
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  zIndex: {
    cssNames: ['z-index'],
    values1: {
      values: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 100, 101, 102, 103, 104, 105, 1000, 1001, 1002, 1003, 1004, 1005] as const,
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflow: {
    cssNames: ['overflow'],
    values1: { values: overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflowX: {
    cssNames: ['overflow-x'],
    values1: { values: overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflowY: {
    cssNames: ['overflow-y'],
    values1: { values: overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  opacity: {
    cssNames: ['opacity'],
    values1: { values: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  fontSize: {
    cssNames: ['font-size'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: ['inherit'] as const },
    values3: { values: [] as const },
  },
  fontStyle: {
    cssNames: ['font-style'],
    values1: { values: ['italic', 'normal', 'oblique'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  fontWeight: {
    cssNames: ['font-weight'],
    values1: { values: [100, 200, 300, 400, 500, 600, 700, 800, 900] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  letterSpacing: {
    cssNames: ['letter-spacing'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  lineHeight: {
    cssNames: ['line-height'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: ['font-size'] as const, formatValue: () => '1' },
    values3: { values: [] as const },
  },
  textDecoration: {
    cssNames: ['text-decoration'],
    values1: { values: ['none', 'underline', 'overline', 'line-through'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  textTransform: {
    cssNames: ['text-transform'],
    values1: { values: ['none', 'capitalize', 'lowercase', 'uppercase'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  textAlign: {
    cssNames: ['text-align'],
    values1: { values: ['left', 'right', 'center', 'justify'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexWrap: {
    cssNames: ['flex-wrap'],
    values1: { values: ['nowrap', 'wrap', 'wrap-reverse'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  jc: {
    cssNames: ['justify-content'],
    values1: {
      values: [
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
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  ai: {
    cssNames: ['align-items'],
    values1: {
      values: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'start', 'end', 'self-start', 'self-end'] as const,
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  alignContent: {
    cssNames: ['align-content'],
    values1: {
      values: [
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
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flex1: {
    cssNames: ['flex'],
    values1: { values: [true] as const, formatValue: () => '1' },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  d: {
    cssNames: ['flex-direction'],
    values1: { values: ['row', 'row-reverse', 'column', 'column-reverse'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  gap: {
    cssNames: ['gap'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  rowGap: {
    cssNames: ['row-gap'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  columnGap: {
    cssNames: ['column-gap'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  order: {
    cssNames: ['order'],
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexGrow: {
    cssNames: ['flex-grow'],
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexShrink: {
    cssNames: ['flex-shrink'],
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  alignSelf: {
    cssNames: ['align-self'],
    values1: { values: alignSelf },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  justifySelf: {
    cssNames: ['justify-self'],
    values1: { values: alignSelf },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  gridColumns: {
    cssNames: ['grid-template-columns'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.gridColumns },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  colSpan: {
    cssNames: ['grid-column'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.gridColumn },
    values2: { values: ['full-row'] as const, formatValue: BoxStylesFormatters.Value.gridColumn },
    values3: { values: [] as const },
  },
  colStart: {
    cssNames: ['grid-column-start'],
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  colEnd: {
    cssNames: ['grid-column-end'],
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outline: {
    cssNames: ['outline-width'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outlineStyle: {
    cssNames: ['outline-style'],
    values1: { values: borderAndOutlineStyles },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outlineOffset: {
    cssNames: ['outline-offset'],
    values1: { values: positiveSizes, formatValue: BoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  transition: {
    cssNames: ['transition-property'],
    values1: { values: ['none', 'all'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  transitionDuration: {
    cssNames: ['transition-duration'],
    values1: {
      values: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000] as const,
      formatValue: BoxStylesFormatters.Value.ms,
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  userSelect: {
    cssNames: ['user-select'],
    values1: { values: ['none', 'auto', 'text', 'all'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  appearance: {
    cssNames: ['appearance'],
    values1: { values: ['none'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  pointerEvents: {
    cssNames: ['pointer-events'],
    values1: { values: ['none', 'auto', 'all'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  whiteSpace: {
    cssNames: ['white-space'],
    values1: { values: ['break-spaces', 'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  textOverflow: {
    cssNames: ['text-overflow'],
    values1: { values: ['clip', 'ellipsis'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  rotate: {
    cssNames: ['rotate'],
    values1: { values: [0, 90, 180, 270, -90, -180, -270] as const, formatValue: BoxStylesFormatters.Value.rotate },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flip: {
    cssNames: ['scale'],
    values1: { values: ['xAxis', 'yAxis'] as const, formatValue: BoxStylesFormatters.Value.flip },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
} satisfies Record<string, StyleItem>;

export const boxThemeStyles = {
  shadow: { cssNames: ['box-shadow'], formatValue: BoxStylesFormatters.Value.variables('shadow') },
  background: { cssNames: ['background'], formatValue: BoxStylesFormatters.Value.variables('background') },
  backgroundImage: { cssNames: ['background-image'], formatValue: BoxStylesFormatters.Value.variables('backgroundImage') },
  color: { cssNames: ['color'], formatValue: BoxStylesFormatters.Value.variables('color') },
  bgColor: { cssNames: ['background-color'], formatValue: BoxStylesFormatters.Value.variables('color') },
  borderColor: { cssNames: ['border-color'], formatValue: BoxStylesFormatters.Value.variables('color') },
  outlineColor: { cssNames: ['outline-color'], formatValue: BoxStylesFormatters.Value.variables('color') },
} satisfies Record<string, ThemeItem>;

export const svgThemeStyles = {
  fill: {
    cssNames: ['fill'],
    formatValue: BoxStylesFormatters.Value.svgVariables('color'),
    formatSelector: BoxStylesFormatters.ClassName.svg,
  },
  stroke: {
    cssNames: ['stroke'],
    formatValue: BoxStylesFormatters.Value.svgVariables('color'),
    formatSelector: BoxStylesFormatters.ClassName.svg,
  },
} satisfies Record<string, ThemeItem>;

// :disabled
// :hover
// :active
// :focus
// :focus-visible
// :focus-within

// :checked
// :indeterminate
// :valid
// :invalid
// :required
// :optional

export const pseudoClassSuffixesExtended = [
  'Hover',
  'Focus',
  'Active',
  'Checked',
  'Indeterminate',
  'Valid',
  'Invalid',
  'Required',
  'Optional',
  'Disabled',
] as const;
export type PseudoClassSuffix = (typeof pseudoClassSuffixesExtended)[number];

export const boxBreakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'] as const;
export type BoxBreakpointsType = (typeof boxBreakpoints)[number];
export const boxBreakpointsMinWidth: Record<BoxBreakpointsType, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export const pseudoClassClassName = {
  hover: { className: '_h' },
  focus: { className: '_f' },
} satisfies Record<string, { className: string }>;
export type PseudoClassClassNameKey = keyof typeof pseudoClassClassName;

Object.keys(boxThemeStyles).forEach((key) => {
  // @ts-ignore
  boxStyles[key] = boxThemeStyles[key];
  // @ts-ignore
  boxStyles[key].isThemeStyle = true;
});

Object.keys(svgThemeStyles).forEach((key) => {
  // @ts-ignore
  boxStyles[key] = svgThemeStyles[key];
  // @ts-ignore
  boxStyles[key].isThemeStyle = true;
});

export type StyleKey = keyof typeof boxStyles;

let boxStylesKeys = Object.keys(boxStyles);
pseudoClassSuffixesExtended.forEach((pseudoSuffix) => {
  boxStylesKeys.forEach((key) => {
    (boxStyles[`${key}${pseudoSuffix}` as StyleKey] as StyleItem) = { ...boxStyles[key as StyleKey], pseudoSuffix };
  });
});

boxStylesKeys = Object.keys(boxStyles);
boxBreakpoints.forEach((breakpoint) => {
  boxStylesKeys.forEach((key) => {
    (boxStyles[`${breakpoint}${key}` as StyleKey] as StyleItem) = { ...boxStyles[key as StyleKey], breakpoint };
  });
});
