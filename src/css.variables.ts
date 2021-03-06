const variables = {
  sizes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const,
  sizeMultiplier: 0.5,
  colors: [
    'primary',
    'primaryLight',
    'primaryDark',
    'secondary',
    'secondaryLight',
    'secondaryDark',
    'tertiary',
    'tertiaryLight',
    'tertiaryDark',
    'blue',
    'blueLight',
    'blueDark',
    'red',
    'redLight',
    'redDark',
    'purple',
    'purpleLight',
    'purpleDark',
    'yellow',
    'yellowLight',
    'yellowDark',
    'pink',
    'pinkLight',
    'pinkDark',
    'green',
    'greenLight',
    'greenDark',
    'orange',
    'orangeLight',
    'orangeDark',
    'navy',
    'navyLight',
    'navyDark',
    'teal',
    'tealLight',
    'tealDark',
    'violet',
    'violetLight',
    'violetDark',
    'black',
    'white',
    'gray',
    'grayLight',
    'grayDark',
    'brown',
    'brownLight',
    'brownDark',
    'orange',
    'orangeLight',
    'orangeDark',
  ] as const,
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
  fontSizes: [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50] as const,
};

export type SizeType = typeof variables.sizes[number];
export type ColorType = typeof variables.colors[number];
export type CursorType = typeof variables.cursors[number];
export type FontSizeType = typeof variables.fontSizes[number];

export default variables;
