import { useLayoutEffect, useEffect, useMemo } from 'react';
import { PseudoClassSuffix, StyleKey, boxBreakpoints } from './boxStyles';
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

    flattenWrapper(propsToUse);

    Object.entries(propsToUse).forEach(([key, value]) => {
      classNames.push(StylesContext.get(key as StyleKey, value));
    });

    boxBreakpoints.forEach((boxBreakpoint) => {
      if (boxBreakpoint in propsToUse) {
        const breakpointProps = propsToUse[boxBreakpoint]!;

        flattenWrapper(breakpointProps);

        Object.entries(breakpointProps).forEach(([key, value]) => {
          classNames.push(StylesContext.get(key as StyleKey, value, boxBreakpoint));
        });

        delete propsToUse[boxBreakpoint];
      }
    });

    return classNames;
  }, [props, themeProps]);
}

function flattenWrapper(props: BoxStyleProps) {
  flatten(props, 'disabled', 'Disabled');
  flatten(props, 'hover', 'Hover');
  flatten(props, 'focus', 'Focus');
  flatten(props, 'active', 'Active');
}

function flatten<T extends BoxStyleProps>(props: T, key: keyof T, suffix: PseudoClassSuffix) {
  if (key in props === false) return;

  if (Array.isArray(props[key])) {
    Object.entries((props[key] as [boolean, BoxStyleProps])[1]).forEach(([name, value]) => {
      props[`${name}${suffix}` as keyof BoxStyleProps] = value;
    });
    props[key] = (props[key] as [boolean, BoxStyleProps])[0] as T[keyof T];
  } else if (ObjectUtils.isObject(props[key])) {
    Object.entries(props[key] as BoxStyleProps).forEach(([name, value]) => {
      props[`${name}${suffix}` as keyof BoxStyleProps] = value;
    });
    delete props[key];
  }
}
