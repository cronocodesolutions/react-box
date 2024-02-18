import { useLayoutEffect, useEffect, useMemo } from 'react';
import { StyleKey } from './boxStyles';
import StylesContext from './stylesContext';
import { BoxStyleProps } from './types';
import { useTheme } from './useTheme';
import ObjectUtils from '../utils/object/objectUtils';

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const useEff = isBrowser ? useLayoutEffect : useEffect;

export default function useStyles(props: BoxStyleProps, isSvg: boolean) {
  const themeProps = useTheme(props) as BoxStyleProps;
  useEff(StylesContext.flush, [props]);

  return useMemo(() => {
    const classNames: (string | undefined)[] = [isSvg ? StylesContext.svgClassName : StylesContext.boxClassName];
    const propsToUse = themeProps ? { ...themeProps, ...props } : { ...props };

    if (Array.isArray(propsToUse.disabled)) {
      Object.entries(propsToUse.disabled[1]).forEach(([name, value]) => {
        propsToUse[`${name}Disabled` as keyof BoxStyleProps] = value;
      });
      delete propsToUse.disabled;
    }

    if (Array.isArray(propsToUse.hover)) {
      Object.entries(propsToUse.hover[1]).forEach(([name, value]) => {
        propsToUse[`${name}H` as keyof BoxStyleProps] = value;
      });
      propsToUse.hover = propsToUse.hover[0];
    } else if (ObjectUtils.isObject(propsToUse.hover)) {
      Object.entries(propsToUse.hover).forEach(([name, value]) => {
        propsToUse[`${name}H` as keyof BoxStyleProps] = value;
      });
      delete propsToUse.hover;
    }

    if (Array.isArray(propsToUse.focus)) {
      Object.entries(propsToUse.focus[1]).forEach(([name, value]) => {
        propsToUse[`${name}F` as keyof BoxStyleProps] = value;
      });
      propsToUse.focus = propsToUse.focus[0];
    } else if (ObjectUtils.isObject(propsToUse.focus)) {
      Object.entries(propsToUse.focus).forEach(([name, value]) => {
        propsToUse[`${name}F` as keyof BoxStyleProps] = value;
      });
      delete propsToUse.focus;
    }

    if (propsToUse.active) {
      Object.entries(propsToUse.active).forEach(([name, value]) => {
        propsToUse[`${name}A` as keyof BoxStyleProps] = value;
      });
      delete propsToUse.active;
    }

    // TODO: add support for inline in pseudo classes
    if ('inline' in propsToUse) {
      if (propsToUse.display === 'block' || !propsToUse.display) propsToUse.display = 'inline-block';
      else if (propsToUse.display === 'flex') propsToUse.display = 'inline-flex';
      else if (propsToUse.display === 'grid') propsToUse.display = 'inline-grid';
      delete propsToUse.inline;
    }

    Object.entries(propsToUse).forEach(([key, value]) => {
      classNames.push(StylesContext.get(key as StyleKey, value));
    });

    return classNames;
  }, [props, themeProps]);
}
