import { useEffect, useMemo } from 'react';
import { DoxStyleProps, StyleKey } from './doxStyles';
import { StylesContext } from './stylesContext';

export default function useStyles(props: DoxStyleProps) {
  useEffect(StylesContext.flush, [props]);

  return useMemo(() => {
    const classNames: (string | undefined)[] = [];

    Object.entries(props).forEach(([key, value]) => {
      classNames.push(StylesContext.get(key as StyleKey, value));
    });

    return classNames;
  }, [props]);
}
