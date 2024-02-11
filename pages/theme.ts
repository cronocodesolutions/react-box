import Theme from '../src/core/theme';

export const themeProps = {
  colors: {
    none: 'none',
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
    none: 'none',
    stripes: 'linear-gradient(135deg,var(--colorviolet) 10%,#0000 0,#0000 50%,var(--colorviolet) 0,var(--colorviolet) 60%,#0000 0,#0000);',
  },
  backgroundImages: {
    check:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 10l3 3l6-6'/%3e%3c/svg%3e\")",
    radio:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3ccircle fill='%23FFF' cx='10' cy='10' r='5'/%3e%3c/svg%3e\")",
    indeterminate:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'%3e%3cline stroke='%23988bee' x1='4' y1='10' x2='16' y2='10' stroke-width='1' /%3e%3c/svg%3e\")",
  },
  shadows: {
    none: 'none',
  },
};

Theme.setup({
  button: {
    styles: {
      display: 'inline-flex',
      padding: 3,
      color: 'white',
      bgColor: 'violet',
      colorH: 'violetDark',
      bgColorH: 'violetLight',
      borderColor: 'violetLighter',
      borderColorH: 'violet',
    },
    disabled: {
      cursor: 'not-allowed',
      bgColor: 'violetLight',
      bgColorH: 'violetLight',
      color: 'gray2',
      colorH: 'gray2',
      borderColor: 'violetLighter',
      borderColorH: 'violetLighter',
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
      bgColorChecked: 'violet',
      bgColorH: 'violetLight',
      backgroundImageChecked: 'check',
      backgroundImageIndeterminate: 'indeterminate',
    },
    disabled: {
      cursor: 'not-allowed',
      bgColor: 'violetLight',
      bgColorH: 'violetLight',
      bgColorChecked: 'violetLight',
      borderColor: 'violetLighter',
      borderColorH: 'violetLighter',
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
      bgColorChecked: 'violet',
      bgColorH: 'violetLight',
      backgroundImageChecked: 'radio',
    },
    disabled: {
      cursor: 'not-allowed',
      bgColor: 'violetLight',
      bgColorH: 'violetLight',
      bgColorChecked: 'violetLight',
      borderColor: 'violetLighter',
      borderColorH: 'violetLighter',
    },
  },
  textbox: {
    styles: {
      p: 2,
      b: 1,
      borderColor: 'violet',
      bgColorH: 'violetLighter',
      bgColorF: 'violetLighter',
      color: 'violetDark',
    },
    disabled: {
      cursor: 'not-allowed',
      borderColor: 'violetLighter',
      bgColor: 'violetLight',
      bgColorH: 'violetLight',
      color: 'gray2',
    },
  },
  textarea: {
    styles: {
      p: 2,
      b: 1,
      borderColor: 'violet',
      bgColorH: 'violetLighter',
      bgColorF: 'violetLighter',
      color: 'violetDark',
    },
    disabled: {
      cursor: 'not-allowed',
      borderColor: 'violetLighter',
      bgColor: 'violetLight',
      bgColorH: 'violetLight',
      color: 'gray2',
    },
  },
  components: {
    mycomponent: {
      styles: {
        padding: 3,
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
