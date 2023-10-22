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

let Styles: ThemeSetup = {};

namespace Theme {
  export function setup(styles: ThemeSetup) {
    Styles = styles;
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

export function useTheme(props: ThemeComponentProps): BoxStyles {
  const { clean, disabled, theme, component } = props;

  return useMemo(() => {
    if (clean) return {};

    let componentStyles = (Styles[component as keyof ThemeSetup] ??
      Styles.components?.[component as keyof ThemeSetup['components']]) as ThemeComponentStyles;
    if (!componentStyles) return {};

    let themeStyles = theme ? { ...componentStyles.styles, ...componentStyles.themes?.[theme].styles } : componentStyles.styles;

    if (!disabled) return themeStyles;

    return theme
      ? { ...themeStyles, ...componentStyles.disabled, ...componentStyles.themes?.[theme].disabled }
      : { ...themeStyles, ...componentStyles.disabled };
  }, [component, clean, disabled, theme]);
}
