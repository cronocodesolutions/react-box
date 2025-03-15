import Box from '../src/box';

// preload variable
Box.getVariableValue('violet-300');

export const { extendedProps, extendedPropTypes } = Box.extend(
  {
    'bg-stripes': 'linear-gradient(135deg,var(--violet-300) 10%,#0000 0,#0000 50%,var(--violet-300) 0,var(--violet-300) 60%,#0000 0,#0000)',
    'body-bg': 'linear-gradient(19deg, white 40%, rgba(183, 33, 255, 0.05) 94%)',
  },
  {},
  {
    bgImage: [
      {
        values: ['body-bg', 'bg-stripes'] as const,
        valueFormat: (value, getVariableValue) => getVariableValue(`${value}`),
        styleName: 'background-image',
      },
    ],
  },
);

export const components = Box.components({
  button: {
    styles: {},
    children: {
      demo: {
        styles: {
          bgColor: 'blue-500',
          p: 3,
          b: 0,
          borderRadius: 1,
          color: 'white',
          cursor: 'pointer',
          hover: {
            bgColor: 'blue-400',
          },
        },
        variants: {
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
  },
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
});
