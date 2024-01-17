import { useEffect, useMemo } from 'react';
import { DoxStyleProps, StyleKey } from './doxStyles';
import { StylesContext } from './stylesContext';
import { useTheme } from '../../theme';

export default function useStyles(props: DoxStyleProps) {
  const themeProps = useTheme(props) as DoxStyleProps;
  useEffect(StylesContext.flush, [props]);

  return useMemo(() => {
    const classNames: (string | undefined)[] = [StylesContext.doxClassName];
    const propsToUse = themeProps ? { ...themeProps, ...props } : props;

    Object.entries(propsToUse).forEach(([key, value]) => {
      classNames.push(StylesContext.get(key as StyleKey, value));
    });

    return classNames;
  }, [props, themeProps]);
}
