import { ThemeSetup } from './themeContract';

// IMPORTANT!!!  DO NOT USE INLINE PROP IN THESE DEFAULT VALUES
const defaultTheme: ThemeSetup = {
  button: {
    styles: {
      display: 'inline-flex',
      color: 'white',
      bgColor: 'violet-500',
      borderColor: 'violet-500',
      p: 3,
      cursor: 'pointer',
      b: 1,
      borderRadius: 1,
      userSelect: 'none',
      lineHeight: 20,
      hover: {
        bgColor: 'violet-600',
        borderColor: 'violet-600',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
  },
  textbox: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderColor: 'violet-200',
      bgColor: 'violet-50',
      color: 'violet-950',
      borderRadius: 1,
      p: 3,
      transition: 'none',
      lineHeight: 20,
      hover: {
        borderColor: 'violet-300',
      },
      focus: {
        outline: 1,
        borderColor: 'violet-500',
        outlineColor: 'violet-500',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
  },
  textarea: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderColor: 'violet-200',
      bgColor: 'violet-50',
      color: 'violet-950',
      borderRadius: 1,
      p: 3,
      transition: 'none',
      hover: {
        borderColor: 'violet-300',
      },
      focus: {
        outline: 1,
        borderColor: 'violet-500',
        outlineColor: 'violet-500',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
        resize: 'none',
      },
    },
  },
  checkbox: {
    styles: {
      display: 'inline-block',
      appearance: 'none',
      b: 1,
      borderColor: 'violet-300',
      borderRadius: 1,
      p: 2,
      cursor: 'pointer',
      transition: 'none',
      hover: {
        borderColor: 'violet-500',
      },
      focus: {
        outline: 2,
        outlineOffset: 2,
        outlineColor: 'violet-500',
      },
      checked: {
        bgColor: 'violet-500',
        borderColor: 'violet-500',
        bgImage: 'bg-img-checked',
      },
      indeterminate: {
        color: 'violet-500',
        bgImage: 'bg-img-indeterminate',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-100',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
  },
  radioButton: {
    styles: {
      appearance: 'none',
      b: 1,
      borderColor: 'violet-300',
      borderRadius: 3,
      p: 2,
      cursor: 'pointer',
      transition: 'none',
      hover: {
        borderColor: 'violet-500',
      },
      focus: {
        outline: 2,
        outlineOffset: 2,
        outlineColor: 'violet-500',
      },
      checked: {
        bgColor: 'violet-500',
        borderColor: 'violet-500',
        bgImage: 'bg-img-radio',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-100',
        color: 'gray-400',
        borderColor: 'violet-200',
      },
    },
  },
  dropdown: {
    styles: {
      display: 'inline-flex',
      ai: 'center',
      gap: 2,
      jc: 'space-between',
      p: 3,
      cursor: 'pointer',
      bgColor: 'violet-50',
      color: 'violet-950',
      b: 1,
      borderColor: 'violet-200',
      borderRadius: 1,
      userSelect: 'none',
      lineHeight: 20,
      minWidth: 40,
      transition: 'none',
      hover: {
        borderColor: 'violet-300',
      },
      focus: {
        outline: 1,
        borderColor: 'violet-500',
        outlineColor: 'violet-500',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
    children: {
      display: {
        styles: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        },
      },
      items: {
        styles: {
          display: 'flex',
          d: 'column',
          gap: 1,
          p: 1,
          b: 1,
          borderRadius: 1,
          position: 'relative',
          top: 1,
          bgColor: 'white',
          overflow: 'auto',
          maxHeight: 62,
          borderColor: 'violet-300',
          color: 'violet-950',
          shadow: 'medium-shadow',
        },
      },
      item: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          borderRadius: 1,
          hover: {
            bgColor: 'gray-100',
          },
          focus: {
            bgColor: 'violet-50',
          },
          selected: {
            bgColor: 'violet-50',
            cursor: 'default',
            hover: {
              bgColor: 'violet-100',
            },
          },
        },
        themes: {
          multiple: {
            selected: {
              cursor: 'pointer',
            },
          },
        },
      },
      unselectItem: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          lineHeight: 20,
          borderRadius: 1,
          color: 'violet-400',
          hover: {
            bgColor: 'violet-50',
          },
          focus: {
            bgColor: 'violet-50',
          },
          selected: {
            bgColor: 'violet-50',
            cursor: 'default',
          },
        },
      },
      emptyItem: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'default',
          lineHeight: 20,
          borderRadius: 1,
          color: 'violet-400',
        },
      },
    },
  },
};

export default defaultTheme;
