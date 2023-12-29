import Theme from '../src/theme';

export const theme = {
  colors: {
    none: 'none',
    white: '#fff',
    black: '#07071b',
    black1: '#1e293b',
    violet: '#988bee',
    violetLight: '#e8edfd',
    violetLighter: '#f6f8fe',
    gray1: '#94a3b833',
  },
  backgrounds: {
    none: 'none',
  },
  shadows: {
    none: 'none',
  },
};

Theme.setup({
  button: {
    styles: {
      padding: 3,
      color: 'white',
      bgColor: 'violet',
      colorH: 'black',
      bgColorH: 'violetLight',
      borderColor: 'violetLighter',
      borderColorH: 'violet',
    },
  },
  components: {
    code: {
      styles: {
        bgColor: 'black1',
        color: 'white',
        p: 2,
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
