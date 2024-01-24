import { useLayoutEffect, useEffect, useMemo } from 'react';
import { AliasKey, StyleKey, aliases } from './boxStyles';
import StylesContext from './stylesContext';
import { BoxStyleProps } from './types';
import { useTheme } from './useTheme';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const useEff = isBrowser ? useLayoutEffect : useEffect;

export default function useStyles(props: BoxStyleProps, isSvg: boolean) {
  const themeProps = useTheme(props) as BoxStyleProps;
  useEff(StylesContext.flush, [props]);

  return useMemo(() => {
    const classNames: (string | undefined)[] = [isSvg ? StylesContext.svgClassName : StylesContext.boxClassName];
    const propsToUse = themeProps ? { ...replaceAliases(themeProps), ...replaceAliases(props) } : replaceAliases(props);

    if ('inline' in propsToUse) {
      if (propsToUse.display === 'block' || !propsToUse.display) propsToUse.display = 'inline-block';
      else if (propsToUse.display === 'flex') propsToUse.display = 'inline-flex';
      else if (propsToUse.display === 'grid') propsToUse.display = 'inline-grid';
      delete propsToUse.inline;
    }
    if ('inlineH' in propsToUse) {
      if (propsToUse.displayH === 'block' || !propsToUse.displayH) propsToUse.displayH = 'inline-block';
      else if (propsToUse.displayH === 'flex') propsToUse.displayH = 'inline-flex';
      else if (propsToUse.displayH === 'grid') propsToUse.displayH = 'inline-grid';
      delete propsToUse.inlineH;
    }
    if ('inlineF' in propsToUse) {
      if (propsToUse.displayF === 'block' || !propsToUse.displayF) propsToUse.displayF = 'inline-block';
      else if (propsToUse.displayF === 'flex') propsToUse.displayF = 'inline-flex';
      else if (propsToUse.displayF === 'grid') propsToUse.displayF = 'inline-grid';
      delete propsToUse.inlineF;
    }
    if ('inlineA' in propsToUse) {
      if (propsToUse.displayA === 'block' || !propsToUse.displayA) propsToUse.displayA = 'inline-block';
      else if (propsToUse.displayA === 'flex') propsToUse.displayA = 'inline-flex';
      else if (propsToUse.displayA === 'grid') propsToUse.displayA = 'inline-grid';
      delete propsToUse.inlineA;
    }

    Object.entries(propsToUse).forEach(([key, value]) => {
      classNames.push(StylesContext.get(key as StyleKey, value));
    });

    return classNames;
  }, [props, themeProps]);
}

function replaceAliases(props: BoxStyleProps) {
  const newProps: BoxStyleProps = { ...props };
  const keys = Object.keys(newProps) as (keyof BoxStyleProps)[];

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
