import { useMemo } from 'react';
import { ThemeProps, BoxThemeStyles } from '../types';
import { ThemeSetup, ThemeComponentStyles } from './theme';
import ObjectUtils from '../utils/object/objectUtils';

export namespace ThemeInternal {
  export let components: { [name: string]: ThemeComponentStyles } = {};
}

export function useTheme(props: ThemeProps): BoxThemeStyles | undefined {
  const { clean, theme, component } = props;

  return useMemo(() => {
    if (clean) return undefined;

    let componentStyles = ThemeInternal.components?.[component as keyof ThemeSetup['components']] as ThemeComponentStyles;
    if (!componentStyles) return undefined;

    return theme ? ObjectUtils.mergeDeep(componentStyles.styles, componentStyles.themes?.[theme] ?? {}) : componentStyles.styles;
  }, [component, clean, theme]);
}
