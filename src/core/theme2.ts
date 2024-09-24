import { useMemo } from 'react';
import { BoxThemeStyles } from './boxStyles2';

export interface ThemeComponentStyles {
  styles: BoxThemeStyles;
  themes?: {
    [name: string]: BoxThemeStyles;
  };
  // children?: {
  //   [name: string]: ThemeComponentStyles;
  // };
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
}

export interface ThemeComponentProps {
  clean?: boolean;
  component?: string;
  theme?: string;
}

export function useTheme(props: ThemeComponentProps): BoxThemeStyles | undefined {
  const { clean, theme, component } = props;

  return useMemo(() => {
    if (clean) return undefined;

    let componentStyles = ThemeInternal.components?.[component as keyof ThemeSetup['components']] as ThemeComponentStyles;
    if (!componentStyles) return undefined;

    return theme ? { ...componentStyles.styles, ...componentStyles.themes?.[theme] } : componentStyles.styles;
  }, [component, clean, theme]);
}

namespace ThemeInternal {
  export let components: { [name: string]: ThemeComponentStyles } = {};
}

namespace Theme {
  export function setup(styles: ThemeSetup) {
    const { components, ...restStyles } = styles;
    const com = components ?? {};

    Object.entries(restStyles).forEach(([name, componentStructure]) => {
      com[name] = componentStructure;
    });

    ThemeInternal.components = com;
  }
}

// REMOVE THIS
Theme.setup({
  button: {
    styles: {
      width: 100,
      b: 1,
    },
  },
});
