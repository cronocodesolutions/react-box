import { useMemo } from 'react';
import { BoxStyles } from './types';

export interface ThemeStyles {
  styles: BoxStyles;
  disabled?: BoxStyles;
}

export interface ThemeComponentStyles {
  styles: BoxStyles;
  disabled?: BoxStyles;
  themes?: {
    [name: string]: ThemeStyles;
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
}

// IMPORTANT!!!  DO NOT USE INLINE PROP IN THESE DEFAULT VALUES
const defaultTheme: ThemeSetup = {
  button: {
    styles: {
      display: 'inline-block',
      p: 3,
      cursor: 'pointer',
      b: 1,
      borderRadius: 1,
    },
    disabled: {
      cursor: 'default',
    },
  },
  checkbox: {
    styles: {
      display: 'inline-block',
      b: 1,
      p: 2,
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
};
let Styles: ThemeSetup = defaultTheme;

namespace Theme {
  export function setup(styles: ThemeSetup) {
    Styles = styles;

    assignDefaultStyles();
  }

  function assignDefaultStyles() {
    const components = Object.keys(defaultTheme) as (keyof ThemeSetup)[];

    components.forEach((component) => {
      const componentStyles = Styles[component];
      const componentDefaultStyles = defaultTheme[component]!;

      if (componentStyles) {
        componentStyles.styles = { ...componentDefaultStyles.styles, ...componentStyles.styles };

        if (componentStyles.disabled && componentDefaultStyles.disabled) {
          componentStyles.disabled = { ...componentDefaultStyles.disabled, ...componentStyles.disabled };
        }
      } else {
        Styles[component] = defaultTheme[component] as any;
      }
    });
  }
}

export default Theme;

type ReservedComponentName = Exclude<string, keyof Omit<ThemeSetup, 'components'>>;
export interface ThemeComponentProps {
  clean?: boolean;
  disabled?: boolean;
  component?: ReservedComponentName;
  theme?: string;
}

export function useTheme(props: ThemeComponentProps): BoxStyles | undefined {
  const { clean, disabled, theme, component } = props;

  return useMemo(() => {
    if (clean) return undefined;

    let componentStyles = (Styles[component as keyof ThemeSetup] ??
      Styles.components?.[component as keyof ThemeSetup['components']]) as ThemeComponentStyles;
    if (!componentStyles) return undefined;

    let themeStyles = theme ? { ...componentStyles.styles, ...componentStyles.themes?.[theme].styles } : componentStyles.styles;

    if (!disabled) return themeStyles;

    return theme
      ? { ...themeStyles, ...componentStyles.disabled, ...componentStyles.themes?.[theme].disabled }
      : { ...themeStyles, ...componentStyles.disabled };
  }, [component, clean, disabled, theme]);
}
