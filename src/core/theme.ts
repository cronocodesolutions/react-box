import { BoxThemeStyles } from '../types';
import ObjectUtils from '../utils/object/objectUtils';
import { ThemeInternal } from './useTheme';

export interface ThemeComponentStyles {
  styles: BoxThemeStyles;
  themes?: {
    [name: string]: BoxThemeStyles;
  };
  children?: {
    [name: string]: ThemeComponentStyles;
  };
}

export interface ThemeSetup {
  components?: {
    [name: string]: ThemeComponentStyles;
  };
  button?: ThemeComponentStyles;
  textbox?: ThemeComponentStyles;
  textarea?: ThemeComponentStyles;
  checkbox?: ThemeComponentStyles;
  radioButton?: ThemeComponentStyles;
  label?: ThemeComponentStyles;
  dropdown?: ThemeComponentStyles;
}

namespace Theme {
  // IMPORTANT!!!  DO NOT USE INLINE PROP IN THESE DEFAULT VALUES
  const defaultTheme: ThemeSetup = {
    button: {
      styles: {
        display: 'inline-flex',
        color: 'white',
        bgColor: 'violet-400',
        borderColor: 'violet-500',
        p: 3,
        cursor: 'pointer',
        b: 1,
        borderRadius: 1,
        userSelect: 'none',
        hover: {
          color: 'slate-700',
          bgColor: 'violet-100',
          borderColor: 'violet-300',
        },
        disabled: {
          cursor: 'not-allowed',
          bgColor: 'violet-50',
          color: 'slate-400',
          borderColor: 'gray-300',
        },
      },
      themes: {
        reverse: {
          color: 'slate-700',
          bgColor: 'violet-100',
          borderColor: 'violet-300',
          hover: {
            color: 'white',
            bgColor: 'violet-400',
            borderColor: 'violet-500',
          },
        },
      },
    },
    checkbox: {
      styles: {
        display: 'inline-block',
      },
    },
    radioButton: {
      styles: {
        display: 'inline-block',
        b: 1,
        p: 2,
      },
    },
    textbox: {
      styles: {
        display: 'inline-block',
        b: 1,
        borderRadius: 1,
        p: 3,
      },
    },
    textarea: {
      styles: {
        display: 'inline-block',
        b: 1,
        borderRadius: 1,
      },
    },
    dropdown: {
      styles: {
        display: 'inline-flex',
        bgColor: 'white',
        color: 'violet-800',
        p: 3,
        cursor: 'pointer',
        b: 1,
        borderRadius: 1,
        userSelect: 'none',
        borderColor: 'violet-400',
        lineHeight: 20,
        hover: {
          bgColor: 'violet-50',
        },
        disabled: {
          cursor: 'not-allowed',
          bgColor: 'violet-200',
          color: 'gray-400',
          borderColor: 'gray-300',
        },
      },
      children: {
        items: {
          styles: {
            b: 1,
            borderRadius: 1,
            position: 'relative',
            top: 1,
            bgColor: 'white',
            overflow: 'auto',
            maxHeight: 45,
            borderColor: 'violet-400',
            color: 'violet-800',
          },
        },
        item: {
          styles: {
            p: 3,
            cursor: 'pointer',
            lineHeight: 20,
            hover: {
              bgColor: 'violet-50',
            },
          },
        },
      },
    },
  };

  export function setup(styles: ThemeSetup) {
    const { components, ...restStyles } = styles;
    const com = components ?? {};

    Object.entries(restStyles).forEach(([name, componentStructure]) => {
      com[name] = componentStructure;
    });

    ThemeInternal.components = ObjectUtils.mergeDeep<{ [name: string]: ThemeComponentStyles }>(defaultTheme, com);
  }
}

export default Theme;
