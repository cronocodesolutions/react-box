import Box from '../src/box';
import './extends';

Box.themeSetup({
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
