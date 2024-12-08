import { useContext, useMemo } from 'react';
import { BoxThemeStyles, ThemeProps } from '../../types';
import ThemeContext from './themeContext';
import ObjectUtils from '../../utils/object/objectUtils';
import { ThemeComponentStyles } from './themeContract';

export default function useTheme(props: ThemeProps): BoxThemeStyles | undefined {
  const { clean, theme, component } = props;

  const { themeStyles } = useContext(ThemeContext);

  return useMemo(() => {
    if (clean) return undefined;

    const names = component?.split('.');
    if (!names) return undefined;

    const componentStyles = names.reduce<Maybe<ThemeComponentStyles>>((acc, item, index) => {
      return index === 0 ? themeStyles?.[item] : acc?.children?.[item];
    }, undefined);

    if (!componentStyles) return undefined;

    return theme ? ObjectUtils.mergeDeep(componentStyles.styles, componentStyles.themes?.[theme] ?? {}) : componentStyles.styles;
  }, [component, clean, theme, themeStyles]);
}
