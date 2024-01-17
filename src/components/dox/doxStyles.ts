export interface StyleValues {
  values: Readonly<Array<string | number | boolean>>;
  formatClassName?: (key: string, value: string | number | boolean) => string;
  formatValue?: (key: string, value: string | number | boolean) => string;
}

export interface StyleItem {
  cssName?: string;
  cssNames?: string[];
  values1: StyleValues;
  values2: StyleValues;
  values3: StyleValues;
}
const positiveSizes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52,
  54, 56, 58, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100,
] as const;
const negativeSizes = [
  -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, -20, -22, -24, -26, -28, -30, -32, -34, -36, -38,
  -40, -44, -48, -52, -56, -60, -64, -68, -72, -76, -80, -84, -88, -92, -96, -100,
] as const;
const sizes = [...positiveSizes, ...negativeSizes] as const;
const borderAndOutlineStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'] as const;
const overflows = ['auto', 'hidden', 'scroll', 'visible'] as const;

namespace ValueFormatters {
  export function rem(_key: string, value: string | number | boolean) {
    return `${(value as number) / 4}rem`;
  }
  export function px(_key: string, value: string | number | boolean) {
    return `${value}px`;
  }
  export function fraction(_key: string, value: string | number | boolean) {
    const [a, b] = (value as string).split('/');
    return `${(+a / +b) * 100}%`;
  }
  export function heightWidth(key: string, value: string | number | boolean) {
    switch (value) {
      case 'fit':
        return '100%';
      case 'fit-screen':
        return key.toLocaleLowerCase().includes('height') ? '100vh' : '100vw';
      default:
        return value as string;
    }
  }
}

namespace ClassNameFormatters {
  export function fraction(key: string, value: string | number | boolean) {
    return `${key}${(value as string).replace('/', '-')}`;
  }
}

export const doxStyles = {
  display: {
    values1: { values: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'contents'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  boxSizing: {
    cssName: 'box-sizing',
    values1: { values: ['border-box', 'content-box'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  width: {
    cssName: 'width',
    values1: {
      values: ['fit', 'fit-screen', 'auto', 'fit-content', 'max-content', 'min-content'] as const,
      formatValue: ValueFormatters.heightWidth,
    },
    values2: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values3: {
      values: [
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
      ] as const,
      formatValue: ValueFormatters.fraction,
      formatClassName: ClassNameFormatters.fraction,
    },
  },
  position: {
    values1: { values: ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  top: {
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  right: {
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  bottom: {
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  left: {
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  inset: {
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  margin: {
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginHorizontal: {
    cssName: 'margin-inline',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginVertical: {
    cssName: 'margin-block',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginTop: {
    cssName: 'margin-top',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginRight: {
    cssName: 'margin-right',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginBottom: {
    cssName: 'margin-bottom',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  marginLeft: {
    cssName: 'margin-left',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: ['auto'] as const },
    values3: { values: [] as const },
  },
  padding: {
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingHorizontal: {
    cssName: 'padding-inline',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingVertical: {
    cssName: 'padding-block',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingTop: {
    cssName: 'padding-top',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingRight: {
    cssName: 'padding-right',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingBottom: {
    cssName: 'padding-bottom',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  paddingLeft: {
    cssName: 'padding-left',
    values1: { values: sizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  border: {
    cssName: 'border-width',
    values1: { values: positiveSizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderHorizontal: {
    cssName: 'border-inline-width',
    values1: { values: sizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderVertical: {
    cssName: 'border-block-width',
    values1: { values: sizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderTop: {
    cssName: 'border-top-width',
    values1: { values: sizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRight: {
    cssName: 'border-right-width',
    values1: { values: sizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderBottom: {
    cssName: 'border-bottom-width',
    values1: { values: sizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderLeft: {
    cssName: 'border-left-width',
    values1: { values: sizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderStyle: {
    cssName: 'border-style',
    values1: { values: borderAndOutlineStyles },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadius: {
    cssName: 'border-radius',
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTop: {
    cssNames: ['border-top-left-radius', 'border-top-right-radius'],
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusRight: {
    cssNames: ['border-top-right-radius', 'border-bottom-right-radius'],
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottom: {
    cssNames: ['border-bottom-left-radius', 'border-bottom-right-radius'],
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusLeft: {
    cssNames: ['border-top-left-radius', 'border-bottom-left-radius'],
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTopLeft: {
    cssName: 'border-top-left-radius',
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusTopRight: {
    cssName: 'border-top-right-radius',
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottomLeft: {
    cssName: 'border-bottom-left-radius',
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  borderRadiusBottomRight: {
    cssName: 'border-bottom-right-radius',
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  cursor: {
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
    cssName: 'z-index',
    values1: {
      values: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 100, 101, 102, 103, 104, 105, 1000, 1001, 1002, 1003, 1004, 1005] as const,
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflow: {
    values1: { values: overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflowX: {
    cssName: 'overflow-x',
    values1: { values: overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  overflowY: {
    cssName: 'overflow-y',
    values1: { values: overflows },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  opacity: {
    values1: { values: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  fontSize: {
    cssName: 'font-size',
    values1: { values: positiveSizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  fontStyle: {
    cssName: 'font-style',
    values1: { values: ['italic', 'normal', 'oblique'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  fontWeight: {
    cssName: 'font-weight',
    values1: { values: [100, 200, 300, 400, 500, 600, 700, 800, 900] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  letterSpacing: {
    cssName: 'letter-spacing',
    values1: { values: positiveSizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  lineHeight: {
    cssName: 'line-height',
    values1: { values: positiveSizes, formatValue: ValueFormatters.px },
    values2: { values: ['font-size'] as const, formatValue: () => '1' },
    values3: { values: [] as const },
  },
  textDecoration: {
    cssName: 'text-decoration',
    values1: { values: ['none', 'underline', 'overline', 'line-through'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  textTransform: {
    cssName: 'text-transform',
    values1: { values: ['none', 'capitalize', 'lowercase', 'uppercase'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  textAlign: {
    cssName: 'text-align',
    values1: { values: ['left', 'right', 'center', 'justify'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexWrap: {
    cssName: 'flex-wrap',
    values1: { values: ['nowrap', 'wrap', 'wrap-reverse'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  justifyContent: {
    cssName: 'justify-content',
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
    cssName: 'align-items',
    values1: {
      values: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'start', 'end', 'self-start', 'self-end'] as const,
    },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  alignContent: {
    cssName: 'align-content',
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
    cssName: 'flex',
    values1: { values: [true] as const, formatValue: () => '1' },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexDirection: {
    cssName: 'flex-direction',
    values1: { values: ['row', 'row-reverse', 'column', 'column-reverse'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  gap: {
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  rowGap: {
    cssName: 'row-gap',
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  columnGap: {
    cssName: 'column-gap',
    values1: { values: positiveSizes, formatValue: ValueFormatters.rem },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  order: {
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexGrow: {
    cssName: 'flex-grow',
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexShrink: {
    cssName: 'flex-shrink',
    values1: { values: positiveSizes },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  flexSelf: {
    cssName: 'align-self',
    values1: { values: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  justifySelf: {
    cssName: 'justify-self',
    values1: { values: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  gridColumns: {
    cssName: 'grid-template-columns',
    values1: { values: positiveSizes, formatValue: (key, value) => `repeat(${value},minmax(0,1fr))` },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  colSpan: {
    cssName: 'grid-column',
    values1: { values: positiveSizes, formatValue: (key, value) => `span ${value}/span ${value}` },
    values2: { values: ['full-row'] as const, formatValue: (key, value) => '1/-1' },
    values3: { values: [] as const },
  },
  colStart: {
    cssName: 'grid-column-start',
    values1: { values: positiveSizes, formatValue: (key, value) => `${value}` },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  colEnd: {
    cssName: 'grid-column-end',
    values1: { values: positiveSizes, formatValue: (key, value) => `${value}` },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outline: {
    cssName: 'outline-width',
    values1: { values: positiveSizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outlineStyle: {
    cssName: 'outline-style',
    values1: { values: borderAndOutlineStyles },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  outlineOffset: {
    cssName: 'outline-offset',
    values1: { values: positiveSizes, formatValue: ValueFormatters.px },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  transition: {
    values1: { values: ['none'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  userSelect: {
    cssName: 'user-select',
    values1: { values: ['none', 'auto', 'text', 'all'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  appearance: {
    values1: { values: ['none'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  pointerEvents: {
    cssName: 'pointer-events',
    values1: { values: ['none', 'auto', 'all'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  whiteSpace: {
    cssName: 'white-space',
    values1: { values: ['break-spaces', 'normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
  textOverflow: {
    cssName: 'text-overflow',
    values1: { values: ['clip', 'ellipsis'] as const },
    values2: { values: [] as const },
    values3: { values: [] as const },
  },
} satisfies Record<string, StyleItem>;

type Styles<T extends Record<string, StyleItem>> = {
  [K in keyof T]?: T[K]['values1']['values'][number] | T[K]['values2']['values'][number] | T[K]['values3']['values'][number];
};

export type StyleKey = keyof typeof doxStyles;
export type DoxStyleProps = Styles<typeof doxStyles>;
