import { useEffect, useMemo } from 'react';
import { AliasKey, DoxStyleProps, StyleKey, aliases } from './doxStyles';
import { StylesContext } from './stylesContext';
import { useTheme } from '../../theme';

export default function useStyles(props: DoxStyleProps) {
  const themeProps = useTheme(props) as DoxStyleProps;
  useEffect(StylesContext.flush, [props]);

  return useMemo(() => {
    const classNames: (string | undefined)[] = [StylesContext.doxClassName];
    const propsToUse = themeProps ? { ...replaceAliases(themeProps), ...replaceAliases(props) } : replaceAliases(props);

    Object.entries(propsToUse).forEach(([key, value]) => {
      classNames.push(StylesContext.get(key as StyleKey, value));
    });

    return classNames;
  }, [props, themeProps]);
}

function replaceAliases(props: DoxStyleProps) {
  const newProps: DoxStyleProps = { ...props };
  const keys = Object.keys(newProps) as (keyof DoxStyleProps)[];

  keys.forEach((key) => {
    const mainPropItem = aliases[key as AliasKey];
    if (mainPropItem) {
      //
      if (mainPropItem.key in newProps === false) {
        (newProps[mainPropItem.key] as any) = newProps[key];
      }

      delete newProps[key];
    }
  });

  return newProps;
}
