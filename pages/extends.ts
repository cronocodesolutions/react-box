import Box from '../src/box';
import Variables from '../src/core/variables';

// preload variable
Box.getVariableValue('violet-300');

export const { extendedProps, extendedPropTypes } = Box.extend(
  {
    'bg-stripes': 'linear-gradient(135deg,var(--violet-300) 10%,#0000 0,#0000 50%,var(--violet-300) 0,var(--violet-300) 60%,#0000 0,#0000)',
    'body-bg': 'linear-gradient(19deg, white 40%, rgba(183, 33, 255, 0.05) 94%)',
    'theme-bg': 'light-dark(#fff, #082f49)',
    'theme-color': 'light-dark(#fff, #082f49)',
    'bg-img-indeterminate-green': `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 20 20'><line stroke='${Variables.colors['green']}' x1='4' y1='10' x2='16' y2='10' stroke-width='1' /></svg>`)}")`,
  },
  {},
  {
    bgImage: [
      {
        values: ['body-bg', 'bg-stripes', 'bg-img-indeterminate-green'] as const,
        valueFormat: (value, getVariableValue) => getVariableValue(value),
        styleName: 'background-image',
      },
    ],
    bgColor: [
      {
        values: ['theme-bg'] as const,
        valueFormat: (value, getVariable) => getVariable(value),
        styleName: 'background-color',
      },
    ],
    color: [
      {
        values: ['theme-color'] as const,
        valueFormat: (value, getVariable) => getVariable(value),
        styleName: 'color',
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
  datagrid: {
    children: {
      header: {
        styles: {
          bgColor: 'gray-300',
        },
        children: {
          cell: {
            styles: {
              bb: 0,
              mb: 1,
              bgColor: 'white',
            },
            variants: {
              isPinned: {
                bgColor: 'gray-100',
              },
              isLastLeftPinned: { br: 4, borderColor: 'gray-300' },
              isFirstRightPinned: { bl: 4, borderColor: 'gray-300' },
            },
            children: {
              contextMenu: {
                styles: {
                  bgColor: 'white',
                  hover: {
                    bgColor: 'gray-300',
                  },
                },
                variants: {
                  isPinned: {
                    bgColor: 'gray-100',
                  },
                },
              },
            },
          },
        },
      },
      body: {
        styles: {
          rowGap: 1,
          bgColor: 'gray-300',
        },
        children: {
          cell: {
            styles: {
              bgColor: 'white',
              selected: {
                bgColor: 'violet-100',
              },
              bb: 0,
            },
            variants: {
              isLastLeftPinned: { br: 4, borderColor: 'gray-300' },
              isFirstRightPinned: { bl: 4, borderColor: 'gray-300' },
              isRowSelected: {
                bgColor: 'violet-100',
                hoverGroup: {
                  'grid-row': {
                    bgColor: 'violet-200',
                  },
                },
              },
              isRowNumber: {
                bgColor: 'gray-100',
              },
            },
          },
        },
      },
    },
  },
});
