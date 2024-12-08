import Box from '../src/box';

Box.themeSetup({
  mainTheme: {
    button: {
      styles: {},
    },
    components: {
      colorBox: {
        styles: {
          width: 15,
          height: 15,
          b: 1,
          borderRadius: 1,
          hover: { outline: 1, outlineOffset: 1 },
          transition: 'none',
        },
      },
      number: {
        styles: {
          borderRadius: 10,
          bgColor: 'violet-50',
          p: 3,
          lineHeight: 8,
          b: 1,
          borderColor: 'violet-600',
          color: 'violet-600',
        },
      },
    },
  },
  demoTheme: {
    button: {
      styles: {
        bgColor: 'blue-500',
        b: 0,
        hover: {
          bgColor: 'blue-400',
        },
      },
      themes: {
        primary: {
          bgColor: 'sky-400',
          hover: {
            bgColor: 'sky-500',
          },
        },
        secondary: {
          bgColor: 'indigo-400',
          hover: {
            bgColor: 'indigo-500',
          },
        },
      },
    },
  },
  light: {
    components: {
      bg: {
        styles: {
          color: 'indigo-950',
          bgColor: 'white',
        },
      },
      icon: {
        styles: {
          fill: 'indigo-950',
        },
      },
    },
  },
  dark: {
    components: {
      bg: {
        styles: {
          color: 'white',
          bgColor: 'indigo-950',
        },
      },
      icon: {
        styles: {
          fill: 'white',
        },
      },
    },
  },
});
