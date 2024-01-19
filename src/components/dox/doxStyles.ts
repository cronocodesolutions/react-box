import { ThemeComponentProps } from '../../theme';
import { Augmented } from '../../types';
import { DoxStylesFormatters } from './doxStylesFormatters';

type Hovered<T> = {
  [K in keyof T as K extends string ? `${K}H` : never]: T[K];
};

type Focused<T> = {
  [K in keyof T as K extends string ? `${K}F` : never]: T[K];
};

type Activated<T> = {
  [K in keyof T as K extends string ? `${K}A` : never]: T[K];
};

export interface StyleValues {
  values: Readonly<Array<string | number | boolean>>;
  formatClassName?: (key: string, value: string | number | boolean) => string;
  formatSelector?: (selector: string) => string[];
  formatValue?: (key: string, value: string | number | boolean) => string;
}

export interface ThemeItem {
  cssNames: string[];
  formatClassName?: (key: string, value: string | number | boolean) => string;
  formatSelector?: (selector: string) => string[];
  formatValue?: (key: string, value: string | number | boolean) => string;
}

export const pseudoClassSuffixes = ['H', 'F', 'A'] as const;
export type PseudoClassSuffix = (typeof pseudoClassSuffixes)[number];

export interface StyleItem {
  cssNames: string[];
  values1: StyleValues;
  values2: StyleValues;
  values3: StyleValues;
  pseudoSuffix?: PseudoClassSuffix;
  isThemeStyle?: boolean;
}

namespace Values {
  export const positiveSizes = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50,
    52, 54, 56, 58, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100,
  ] as const;
  export const negativeSizes = [
    -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -22, -24, -26, -28, -30, -32, -34, -36, -38,
    -40, -44, -48, -52, -56, -60, -64, -68, -72, -76, -80, -84, -88, -92, -96, -100,
  ] as const;
  export const sizes = [...Values.positiveSizes, ...negativeSizes] as const;
  export const borderAndOutlineStyles = [
    'solid',
    'dashed',
    'dotted',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
    'none',
    'hidden',
  ] as const;
  export const overflows = ['auto', 'hidden', 'scroll', 'visible'] as const;
  export const widthHeightFractions = [
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
  export const widthHeightValues = ['fit', 'fit-screen', 'auto', 'fit-content', 'max-content', 'min-content'] as const;
  export const alignSelf = ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const;
}

export const doxThemeStyles = {
  shadow: { cssNames: ['box-shadow'], formatValue: DoxStylesFormatters.Value.variables('shadow') },
  background: { cssNames: ['background'], formatValue: DoxStylesFormatters.Value.variables('background') },
  color: { cssNames: ['color'], formatValue: DoxStylesFormatters.Value.variables('color') },
  bgColor: { cssNames: ['background-color'], formatValue: DoxStylesFormatters.Value.variables('color') },
  borderColor: { cssNames: ['border-color'], formatValue: DoxStylesFormatters.Value.variables('color') },
  outlineColor: { cssNames: ['outline-color'], formatValue: DoxStylesFormatters.Value.variables('color') },
} satisfies Record<string, ThemeItem>;

export const svgThemeStyles = {
  fill: {
    cssNames: ['fill'],
    formatValue: DoxStylesFormatters.Value.svgVariables('color'),
    formatSelector: DoxStylesFormatters.ClassName.svg,
  },
  stroke: {
    cssNames: ['stroke'],
    formatValue: DoxStylesFormatters.Value.svgVariables('color'),
    formatSelector: DoxStylesFormatters.ClassName.svg,
  },
} satisfies Record<string, ThemeItem>;

export interface PseudoClassStyleType {
  className: string;
}
export const pseudoClassStyles = {
  hover: { className: '_h' },
  focus: { className: '_f' },
} satisfies Record<string, PseudoClassStyleType>;
export type PseudoClassType = keyof typeof pseudoClassStyles;

export const doxStyles = {
  display: {
    cssNames: ['display'],
    values1: { values: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'contents'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  inline: {
    cssNames: ['display'],
    values1: { values: [true] as const, formatValue: () => `inline-block` },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  boxSizing: {
    cssNames: ['box-sizing'],
    values1: { values: ['border-box', 'content-box'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  width: {
    cssNames: ['width'],
    values1: { values: Values.widthHeightValues, formatValue: DoxStylesFormatters.Value.widthHeight },
    values2: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values3: {
      values: Values.widthHeightFractions,
      formatValue: DoxStylesFormatters.Value.fraction,
      // formatClassName: DoxStylesFormatters.ClassName.fraction,
    },
  },
  minWidth: {
    cssNames: ['min-width'],
    values1: { values: Values.widthHeightValues, formatValue: DoxStylesFormatters.Value.widthHeight },
    values2: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values3: {
      values: Values.widthHeightFractions,
      formatValue: DoxStylesFormatters.Value.fraction,
      // formatClassName: DoxStylesFormatters.ClassName.fraction,
    },
  },
  maxWidth: {
    cssNames: ['max-width'],
    values1: { values: Values.widthHeightValues, formatValue: DoxStylesFormatters.Value.widthHeight },
    values2: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values3: {
      values: Values.widthHeightFractions,
      formatValue: DoxStylesFormatters.Value.fraction,
      // formatClassName: DoxStylesFormatters.ClassName.fraction,
    },
  },
  height: {
    cssNames: ['height'],
    values1: { values: Values.widthHeightValues, formatValue: DoxStylesFormatters.Value.widthHeight },
    values2: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values3: {
      values: Values.widthHeightFractions,
      formatValue: DoxStylesFormatters.Value.fraction,
      // formatClassName: DoxStylesFormatters.ClassName.fraction,
    },
  },
  minHeight: {
    cssNames: ['min-height'],
    values1: { values: Values.widthHeightValues, formatValue: DoxStylesFormatters.Value.widthHeight },
    values2: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values3: {
      values: Values.widthHeightFractions,
      formatValue: DoxStylesFormatters.Value.fraction,
      // formatClassName: DoxStylesFormatters.ClassName.fraction,
    },
  },
  maxHeight: {
    cssNames: ['max-height'],
    values1: { values: Values.widthHeightValues, formatValue: DoxStylesFormatters.Value.widthHeight },
    values2: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values3: {
      values: Values.widthHeightFractions,
      formatValue: DoxStylesFormatters.Value.fraction,
      // formatClassName: DoxStylesFormatters.ClassName.fraction,
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
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  right: {
    cssNames: ['right'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  bottom: {
    cssNames: ['bottom'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  left: {
    cssNames: ['left'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  inset: {
    cssNames: ['inset'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  margin: {
    cssNames: ['margin'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginHorizontal: {
    cssNames: ['margin-inline'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginVertical: {
    cssNames: ['margin-block'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginTop: {
    cssNames: ['margin-top'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginRight: {
    cssNames: ['margin-right'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginBottom: {
    cssNames: ['margin-bottom'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginLeft: {
    cssNames: ['margin-left'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  padding: {
    cssNames: ['padding'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingHorizontal: {
    cssNames: ['padding-inline'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingVertical: {
    cssNames: ['padding-block'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingTop: {
    cssNames: ['padding-top'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingRight: {
    cssNames: ['padding-right'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingBottom: {
    cssNames: ['padding-bottom'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingLeft: {
    cssNames: ['padding-left'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  border: {
    cssNames: ['border-width'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderHorizontal: {
    cssNames: ['border-inline-width'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderVertical: {
    cssNames: ['border-block-width'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderTop: {
    cssNames: ['border-top-width'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRight: {
    cssNames: ['border-right-width'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderBottom: {
    cssNames: ['border-bottom-width'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderLeft: {
    cssNames: ['border-left-width'],
    values1: { values: Values.sizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderStyle: {
    cssNames: ['border-style'],
    values1: { values: Values.borderAndOutlineStyles },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadius: {
    cssNames: ['border-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTop: {
    cssNames: ['border-top-left-radius', 'border-top-right-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusRight: {
    cssNames: ['border-top-right-radius', 'border-bottom-right-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottom: {
    cssNames: ['border-bottom-left-radius', 'border-bottom-right-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusLeft: {
    cssNames: ['border-top-left-radius', 'border-bottom-left-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTopLeft: {
    cssNames: ['border-top-left-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTopRight: {
    cssNames: ['border-top-right-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottomLeft: {
    cssNames: ['border-bottom-left-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottomRight: {
    cssNames: ['border-bottom-right-radius'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
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
    values1: { values: Values.overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflowX: {
    cssNames: ['overflow-x'],
    values1: { values: Values.overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflowY: {
    cssNames: ['overflow-y'],
    values1: { values: Values.overflows },
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
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.px },
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
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  lineHeight: {
    cssNames: ['line-height'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.px },
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
  justifyContent: {
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
  alignItems: {
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
  flexDirection: {
    cssNames: ['flex-direction'],
    values1: { values: ['row', 'row-reverse', 'column', 'column-reverse'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  gap: {
    cssNames: ['gap'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  rowGap: {
    cssNames: ['row-gap'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  columnGap: {
    cssNames: ['column-gap'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  order: {
    cssNames: ['order'],
    values1: { values: Values.positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexGrow: {
    cssNames: ['flex-grow'],
    values1: { values: Values.positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexShrink: {
    cssNames: ['flex-shrink'],
    values1: { values: Values.positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  alignSelf: {
    cssNames: ['align-self'],
    values1: { values: Values.alignSelf },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  justifySelf: {
    cssNames: ['justify-self'],
    values1: { values: Values.alignSelf },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  gridColumns: {
    cssNames: ['grid-template-columns'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.gridColumns },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  colSpan: {
    cssNames: ['grid-column'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.gridColumn },
    values2: { values: ['full-row'] as const, formatValue: DoxStylesFormatters.Value.gridColumn },
    values3: { values: [] as const },
  },
  colStart: {
    cssNames: ['grid-column-start'],
    values1: { values: Values.positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  colEnd: {
    cssNames: ['grid-column-end'],
    values1: { values: Values.positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outline: {
    cssNames: ['outline-width'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outlineStyle: {
    cssNames: ['outline-style'],
    values1: { values: Values.borderAndOutlineStyles },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outlineOffset: {
    cssNames: ['outline-offset'],
    values1: { values: Values.positiveSizes, formatValue: DoxStylesFormatters.Value.px },
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
      formatValue: DoxStylesFormatters.Value.ms,
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
} satisfies Record<string, StyleItem>;

export const svgStyles = {
  rotate: {
    cssNames: ['rotate'],
    values1: { values: [0, 90, 180, 270, -90, -180, -270] as const, formatValue: DoxStylesFormatters.Value.rotate },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flip: {
    cssNames: ['scale'],
    values1: { values: ['xAxis', 'yAxis'] as const, formatValue: DoxStylesFormatters.Value.flip },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
} satisfies Record<string, StyleItem>;

Object.keys(svgStyles).forEach((key) => {
  // @ts-ignore
  doxStyles[key] = svgStyles[key];
});

Object.keys(doxThemeStyles).forEach((key) => {
  // @ts-ignore
  doxStyles[key as StyleKey] = doxThemeStyles[key];
  (doxStyles[key as StyleKey] as StyleItem).isThemeStyle = true;
});

Object.keys(svgThemeStyles).forEach((key) => {
  // @ts-ignore
  doxStyles[key as StyleKey] = svgThemeStyles[key];
  (doxStyles[key as StyleKey] as StyleItem).isThemeStyle = true;
});

type AliasType = { key: StyleKey };
export const aliases = {
  w: { ...doxStyles.width, key: 'width' },
  h: { ...doxStyles.height, key: 'height' },
  m: { ...doxStyles.margin, key: 'margin' },
  mx: { ...doxStyles.marginHorizontal, key: 'marginHorizontal' },
  my: { ...doxStyles.marginVertical, key: 'marginVertical' },
  mt: { ...doxStyles.marginTop, key: 'marginTop' },
  mr: { ...doxStyles.marginRight, key: 'marginRight' },
  mb: { ...doxStyles.marginBottom, key: 'marginBottom' },
  ml: { ...doxStyles.marginLeft, key: 'marginLeft' },
  p: { ...doxStyles.padding, key: 'padding' },
  px: { ...doxStyles.paddingHorizontal, key: 'paddingHorizontal' },
  py: { ...doxStyles.paddingVertical, key: 'paddingVertical' },
  pt: { ...doxStyles.paddingTop, key: 'paddingTop' },
  pr: { ...doxStyles.paddingRight, key: 'paddingRight' },
  pb: { ...doxStyles.paddingBottom, key: 'paddingBottom' },
  pl: { ...doxStyles.paddingLeft, key: 'paddingLeft' },
  b: { ...doxStyles.border, key: 'border' },
  bx: { ...doxStyles.borderHorizontal, key: 'borderHorizontal' },
  by: { ...doxStyles.borderVertical, key: 'borderVertical' },
  bt: { ...doxStyles.borderTop, key: 'borderTop' },
  br: { ...doxStyles.borderRight, key: 'borderRight' },
  bb: { ...doxStyles.borderBottom, key: 'borderBottom' },
  bl: { ...doxStyles.borderLeft, key: 'borderLeft' },
  jc: { ...doxStyles.justifyContent, key: 'justifyContent' },
  ai: { ...doxStyles.alignItems, key: 'alignItems' },
  ac: { ...doxStyles.alignContent, key: 'alignContent' },
  d: { ...doxStyles.flexDirection, key: 'flexDirection' },
} satisfies Record<string, AliasType>;

const doxStylesKeys = Object.keys(doxStyles);
const aliasKeys = Object.keys(aliases);
pseudoClassSuffixes.forEach((pseudoSuffix) => {
  doxStylesKeys.forEach((key) => {
    // @ts-ignore
    doxStyles[`${key}${pseudoSuffix}` as StyleKey] = { ...doxStyles[key as StyleKey] };
    (doxStyles[`${key}${pseudoSuffix}` as StyleKey] as StyleItem).pseudoSuffix = pseudoSuffix;
  });

  aliasKeys.forEach((key) => {
    // @ts-ignore
    aliases[`${key}${pseudoSuffix}` as AliasKey] = { ...aliases[key as AliasKey], key: `${aliases[key as AliasKey].key}${pseudoSuffix}` };
    (aliases[`${key}${pseudoSuffix}` as AliasKey] as StyleItem).pseudoSuffix = pseudoSuffix;
  });
});

type Styles<T extends Record<string, StyleItem>> = {
  [K in keyof T]?: T[K]['values1']['values'][number] | T[K]['values2']['values'][number] | T[K]['values3']['values'][number];
};

export type StyleKey = keyof typeof doxStyles;
export type AliasKey = keyof typeof aliases;

type DoxNormalStyles = Styles<typeof doxStyles> & Styles<typeof aliases> & ThemeComponentProps;
interface DoxPseudoClasses {
  hover?: boolean;
  focus?: boolean;
}
export type DoxStyleProps = DoxNormalStyles &
  DoxPseudoClasses &
  Hovered<DoxNormalStyles> &
  Focused<DoxNormalStyles> &
  Activated<DoxNormalStyles> &
  Augmented.BoxProps;

type SvgNormalStyles = Styles<typeof svgStyles> & ThemeComponentProps;
export type DoxSvgStyles = SvgNormalStyles &
  Hovered<SvgNormalStyles> &
  Focused<SvgNormalStyles> &
  Activated<SvgNormalStyles> &
  Augmented.SvgProps;
