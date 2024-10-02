import Box from '../src/box';

Box.themeSetup({
  button: {
    styles: {
      display: 'inline-flex',
      p: 3,
      color: 'white',
      bgColor: 'violet',
      borderColor: 'violetLighter',
      hover: {
        color: 'violetDark',
        bgColor: 'violetLight',
        borderColor: 'violet',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violetLight',
        color: 'gray2',
        borderColor: 'violetLighter',
      },
    },
    themes: {
      ghost: {
        bgColor: 'dark',
        color: 'white',
        hover: {
          color: 'white',
          bgColor: 'black1',
        },
        disabled: {
          bgColor: 'gray1',
        },
        //
      },
    },
  },
  checkbox: {
    styles: {
      appearance: 'none',
      b: 1,
      borderColor: 'violet',
      borderRadius: 1,
      p: 2,
      cursor: 'pointer',
      hover: {
        bgColor: 'violetLight',
      },
      checked: {
        bgColor: 'violet',
        backgroundImage: 'check',
      },
      indeterminate: {
        backgroundImage: 'indeterminate',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violetLight',
        borderColor: 'violetLighter',
      },
    },
  },
  radioButton: {
    styles: {
      appearance: 'none',
      b: 1,
      borderColor: 'violet',
      borderRadius: 3,
      p: 2,
      cursor: 'pointer',
      hover: {
        bgColor: 'violetLight',
      },
      checked: {
        bgColor: 'violet',
        backgroundImage: 'radio',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violetLight',
        borderColor: 'violetLighter',
      },
    },
  },
  textbox: {
    styles: {
      p: 2,
      b: 1,
      borderColor: 'violet',
      color: 'violetDark',
      hover: {
        bgColor: 'violetLighter',
      },
      focus: {
        bgColor: 'violetLighter',
      },
      disabled: {
        cursor: 'not-allowed',
        borderColor: 'violetLighter',
        bgColor: 'violetLight',
        color: 'gray2',
      },
      invalid: {
        borderColor: 'red',
      },
    },
  },
  textarea: {
    styles: {
      p: 2,
      b: 1,
      borderColor: 'violet',
      color: 'violetDark',
      hover: {
        bgColor: 'violetLighter',
      },
      focus: {
        bgColor: 'violetLighter',
      },
      disabled: {
        cursor: 'not-allowed',
        borderColor: 'violetLighter',
        bgColor: 'violetLight',
        color: 'gray2',
      },
      invalid: {
        borderColor: 'red',
      },
    },
  },
  label: {
    styles: {
      // has: {
      //   invalid: {
      //     color: 'red',
      //     transition: 'none',
      //   },
      // },
    },
  },
  components: {
    mycomponent: {
      styles: {
        p: 3,
        b: 1,
      },
      // children: {
      //   item1: {
      //     styles: {
      //       textTransform: 'uppercase',
      //     },
      //   },
      //   item2: {
      //     styles: {
      //       textDecoration: 'underline',
      //     },
      //   },
      // },
    },
    code: {
      styles: {
        inline: true,
        bgColor: 'black1',
        color: 'white',
        p: 4,
        borderRadius: 1,
      },
    },
    number: {
      styles: {
        borderRadius: 10,
        bgColor: 'violetLighter',
        p: 3,
        lineHeight: 8,
        b: 1,
        borderColor: 'violet',
        color: 'violet',
      },
    },
  },
});

const colors = [
  'white',
  'black',
  'black1',
  'violet',
  'violetLight',
  'violetLighter',
  'violetDark',
  'gray1',
  'gray2',
  'dark',
  'red',
] as const;

export const extendedProps = Box.extend(
  {
    colorwhite: ' #fff',
    colorblack: ' #07071b',
    colorblack1: ' #1e293b',
    colorviolet: ' #988bee',
    colorvioletLight: ' #e8edfd',
    colorvioletLighter: ' #f6f8fe',
    colorvioletDark: ' #5f3e66',
    colorgray1: ' #94a3b833',
    colorgray2: ' #94a3b8',
    colordark: ' #272822',
    colorred: ' red',
    colornone: ' none',
    shadownone: ' none',
    backgroundstripes:
      'linear-gradient(135deg,var(--colorviolet) 10%,#0000 0,#0000 50%,var(--colorviolet) 0,var(--colorviolet) 60%,#0000 0,#0000)',
    backgroundbg: ' url(img/bg.jpg)',
    backgroundbg2: ' background: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(img/bg.jpg)',
    backgroundnone: ' none',
    backgroundImagebg: ' linear-gradient(19deg, white 80%, rgba(183, 33, 255, 0.05) 94%)',
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
    color: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--color${value})`,
      },
    ],
    bgColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--color${value})`,
        styleName: 'background-color',
      },
    ],
    borderColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--color${value})`,
        styleName: 'border-color',
      },
    ],
    outlineColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--color${value})`,
        styleName: 'outline-color',
      },
    ],
    background: [
      {
        values: ['stripes'] as const,
        valueFormat: (value: string) => `var(--background${value})`,
      },
    ],
    backgroundImage: [
      {
        values: ['bg', 'check', 'radio', 'radio2', 'indeterminate'] as const,
        valueFormat: (value: string) => `var(--backgroundImage${value})`,
        styleName: 'background-image',
      },
    ],
    fill: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--color${value})`,
        selector: (className, pseudoClass) => ['path', 'circle', 'rect', 'line'].map((x) => `${className}${pseudoClass} ${x}`).join(','),
      },
    ],
    stroke: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--color${value})`,
        selector: (className, pseudoClass) => ['path', 'circle', 'rect', 'line'].map((x) => `${className}${pseudoClass} ${x}`).join(','),
      },
    ],
  },
);
