import { useMemo } from 'react';
import { BoxStyles } from './types';

namespace Theme {
  export interface ThemeComponentProps {
    clean?: boolean;
    disabled?: boolean;
    theme?: string;
  }

  interface Styles {
    styles: BoxStyles;
    disabled?: BoxStyles;
  }

  export interface ThemeStyles extends Styles {
    themes?: {
      [name: string]: Styles;
    };
  }

  export interface ThemeComponentStyles {
    textbox?: ThemeStyles;
  }

  export let Styles: ThemeComponentStyles = {};

  export function setup(styles: ThemeComponentStyles) {
    Styles = styles;
  }

  export function useTheme(component: keyof ThemeComponentStyles, props: ThemeComponentProps): BoxStyles {
    const { clean, disabled, theme } = props;

    return useMemo(() => {
      if (clean) return {};

      let componentStyles = Styles[component];
      if (!componentStyles) return {};

      let themeStyles = theme ? { ...componentStyles.styles, ...componentStyles.themes?.[theme].styles } : componentStyles.styles;

      if (!disabled) return themeStyles;

      return theme
        ? { ...themeStyles, ...componentStyles.disabled, ...componentStyles.themes?.[theme].disabled }
        : { ...themeStyles, ...componentStyles.disabled };
    }, [component, clean, disabled, theme]);
  }
}

export default Theme;
