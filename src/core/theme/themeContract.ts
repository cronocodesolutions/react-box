import { BoxThemeStyles } from '../../types';

export interface ThemeComponentStyles {
  clean?: boolean;
  styles: BoxThemeStyles;
  themes?: {
    [name: string]: BoxThemeStyles;
  };
  children?: ThemeType;
}

export type ThemeType = { [componentName: string]: ThemeComponentStyles };

export interface ThemeSetup {
  components?: ThemeType;
  button?: ThemeComponentStyles;
  textbox?: ThemeComponentStyles;
  textarea?: ThemeComponentStyles;
  checkbox?: ThemeComponentStyles;
  radioButton?: ThemeComponentStyles;
  label?: ThemeComponentStyles;
  dropdown?: ThemeComponentStyles;
}

export interface Themes {
  [name: string]: ThemeSetup;
}
