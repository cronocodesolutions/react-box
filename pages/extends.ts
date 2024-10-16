import Box from '../src/box';

const colors = [
  'primary',
  'black1',
  'violet',
  'violetLight',
  'violetLighter',
  'violetDark',
  'gray1',
  'gray2',
  'dark',
  'red',
  'none',
] as const;

export const { extendedProps, extendedPropTypes } = Box.extend(
  {
    colorprimary: '#988bee',
    colorblack1: '#1e293b',
    colorviolet: '#988bee',
    colorvioletLight: '#e8edfd',
    colorvioletLighter: '#f6f8fe',
    colorvioletDark: '#5f3e66',
    colorgray1: '#94a3b833',
    colorgray2: '#94a3b8',
    colordark: '#272822',
    colorred: 'red',
    shadownone: 'none',
    backgroundstripes:
      'linear-gradient(135deg,var(--colorviolet) 10%,#0000 0,#0000 50%,var(--colorviolet) 0,var(--colorviolet) 60%,#0000 0,#0000)',
    backgroundbg: 'url(img/bg.jpg)',
    backgroundbg2: 'background: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(img/bg.jpg)',
    backgroundnone: 'none',
    backgroundImagebg: 'linear-gradient(19deg, white 80%, rgba(183, 33, 255, 0.05) 94%)',
    backgroundImagecheck:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 10l3 3l6-6'/%3e%3c/svg%3e\")",
    backgroundImageradio:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3ccircle fill='%23FFF' cx='10' cy='10' r='5'/%3e%3c/svg%3e\")",
    backgroundImageradio2:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3ccircle fill='%23FFF' cx='10' cy='10' r='5'/%3e%3c/svg%3e\")",
    backgroundImageindeterminate:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3cline stroke='%23988bee' x1='4' y1='10' x2='16' y2='10' stroke-width='1' /%3e%3c/svg%3e\")",
    backgroundImagenone: 'none',
  },
  {
    background: [
      {
        values: ['none', 'stripes'] as const,
        valueFormat: (value, getVariableValue) => getVariableValue(`background${value}`),
      },
    ],
    backgroundImage: [
      {
        values: ['bg', 'check', 'radio', 'radio2', 'indeterminate'] as const,
        valueFormat: (value, getVariableValue) => getVariableValue(`backgroundImage${value}`),
        styleName: 'background-image',
      },
    ],
    fill: [
      {
        values: colors,
        valueFormat: (value, getVariableValue) => getVariableValue(`color${value}`),
        selector: (className, pseudoClass) => ['path', 'circle', 'rect', 'line'].map((x) => `${className}${pseudoClass} ${x}`).join(','),
      },
    ],
    stroke: [
      {
        values: colors,
        valueFormat: (value, getVariableValue) => getVariableValue(`color${value}`),
        selector: (className, pseudoClass) => ['path', 'circle', 'rect', 'line'].map((x) => `${className}${pseudoClass} ${x}`).join(','),
      },
    ],
    shadow: [
      {
        values: ['none', 'box'] as const,
        valueFormat: (value: string) => `var(--shadow${value})`,
        styleName: 'box-shadow',
      },
    ],
  },
  {
    color: [
      {
        values: colors,
        valueFormat: (value, getVariableValue) => getVariableValue(`color${value}`),
      },
    ],
    bgColor: [
      {
        values: colors,
        valueFormat: (value, getVariableValue) => getVariableValue(`color${value}`),
        styleName: 'background-color',
      },
    ],
    borderColor: [
      {
        values: colors,
        valueFormat: (value, getVariableValue) => getVariableValue(`color${value}`),
        styleName: 'border-color',
      },
    ],
    outlineColor: [
      {
        values: colors,
        valueFormat: (value, getVariableValue) => getVariableValue(`color${value}`),
        styleName: 'outline-color',
      },
    ],
  },
);
