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
        display: 'inline-block',
        p: 3,
        cursor: 'pointer',
        b: 1,
        borderRadius: 1,
        userSelect: 'none',
        disabled: {
          cursor: 'default',
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
    // dropdown: {
    //   styles: {
    //     width: 'min-content',
    //     b: 1,
    //     borderRadius: 1,
    //     p: 3,
    //     cursor: 'pointer',
    //   },
    //   children: {
    //     items: {
    //       styles: {
    //         b: 1,
    //       },
    //     },
    //   },
    // },
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
