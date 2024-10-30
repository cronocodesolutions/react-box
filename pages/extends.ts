import Box from '../src/box';

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
