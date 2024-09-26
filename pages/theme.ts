import Box2 from '../src/box2';
import Theme from '../src/core/theme';

export const themeProps = {
  colors: {
    white: '#fff',
    black: '#07071b',
    black1: '#1e293b',
    violet: '#988bee',
    violetLight: '#e8edfd',
    violetLighter: '#f6f8fe',
    violetDark: '#5f3e66', // '#4a324f',
    gray1: '#94a3b833',
    gray2: '#94a3b8',
    dark: '#272822',
    red: 'red',
  },
  backgrounds: {
    stripes: 'linear-gradient(135deg,var(--colorviolet) 10%,#0000 0,#0000 50%,var(--colorviolet) 0,var(--colorviolet) 60%,#0000 0,#0000);',
    bg: 'url(img/bg.jpg)',
    bg2: 'background: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(img/bg.jpg)',
  },
  backgroundImages: {
    bg: 'linear-gradient(19deg, white 80%, rgba(183, 33, 255, 0.05) 94%)',
    check:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 10l3 3l6-6'/%3e%3c/svg%3e\")",
    radio:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3ccircle fill='%23FFF' cx='10' cy='10' r='5'/%3e%3c/svg%3e\")",
    radio2:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3ccircle fill='%23FFF' cx='10' cy='10' r='5'/%3e%3c/svg%3e\")",
    indeterminate:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3cline stroke='%23988bee' x1='4' y1='10' x2='16' y2='10' stroke-width='1' /%3e%3c/svg%3e\")",
  },
};

Theme.setup({
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
      hasInvalid: {
        color: 'red',
        transition: 'none',
      },
    },
  },
  components: {
    mycomponent: {
      styles: {
        p: 3,
        b: 1,
      },
      children: {
        item1: {
          styles: {
            textTransform: 'uppercase',
          },
        },
        item2: {
          styles: {
            textDecoration: 'underline',
          },
        },
      },
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

export const extendedProps = Box2.extend(
  {
    white: '#fff',
    black: '#07071b',
    black1: '#1e293b',
    violet: '#988bee',
    violetLight: '#e8edfd',
    violetLighter: '#f6f8fe',
    violetDark: '#5f3e66',
    gray1: '#94a3b833',
    gray2: '#94a3b8',
    dark: '#272822',
    red: 'red',
  },
  {
    color: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
      },
    ],
    bgColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
        styleName: 'background-color',
      },
    ],
    borderColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
        styleName: 'border-color',
      },
    ],
    outlineColor: [
      {
        values: colors,
        valueFormat: (value: string) => `var(--${value})`,
        styleName: 'outline-color',
      },
    ],
  },
);
