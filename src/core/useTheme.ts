import { useMemo } from 'react';
import Theme, { ThemeComponentStyles, ThemeSetup } from './theme';
import { BoxStyleProps } from './types';

type ReservedComponentName = Exclude<string, keyof Omit<ThemeSetup, 'components'>>;
export interface ThemeComponentProps {
  clean?: boolean;
  disabled?: boolean;
  component?: ReservedComponentName;
  theme?: string;
}

export function useTheme(props: ThemeComponentProps): BoxStyleProps | undefined {
  const { clean, disabled, theme, component } = props;

  return useMemo(() => {
    if (clean) return undefined;

    let componentStyles = (Theme.Styles[component as keyof ThemeSetup] ??
      Theme.Styles.components?.[component as keyof ThemeSetup['components']]) as ThemeComponentStyles;
    if (!componentStyles) return undefined;

    let themeStyles = theme ? { ...componentStyles.styles, ...componentStyles.themes?.[theme].styles } : componentStyles.styles;

    if (!disabled) return themeStyles;

    return theme
      ? { ...themeStyles, ...componentStyles.disabled, ...componentStyles.themes?.[theme].disabled }
      : { ...themeStyles, ...componentStyles.disabled };
  }, [component, clean, disabled, theme]);
}
