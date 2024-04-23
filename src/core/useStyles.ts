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
  flattenSingle(props, 'hover', 'Hover');
  flattenSingle(props, 'focus', 'Focus');
  flattenSingle(props, 'active', 'Active');
  flattenSingle(props, 'disabled', 'Disabled');

  flattenGroup(props, 'hoverGroup', 'Hover');
  flattenGroup(props, 'focusGroup', 'Focus');
  flattenGroup(props, 'activeGroup', 'Active');
  flattenGroup(props, 'disabledGroup', 'Disabled');
}

function flattenSingle<T extends BoxStyleProps>(props: T, key: keyof T, suffix: PseudoClassSuffix) {
  if (key in props === false) return;

  flatten(props, key, suffix, props[key] as [boolean, BoxStyleProps] | BoxStyleProps);
}

function flattenGroup<T extends BoxStyleProps>(props: T, key: keyof T, suffix: PseudoClassSuffix) {
  if (key in props === false) return;
  if (!ObjectUtils.isObject(props[key])) return;

  Object.entries(props[key] as Record<string, BoxStyleProps>).forEach(([customName, value]) => {
    StylesContext.addCustomPseudoClass(suffix, customName, key as string);

    flatten(props, key, (suffix + customName) as PseudoClassSuffix, value);
  });
}

function flatten<T extends BoxStyleProps>(
  props: T,
  key: keyof T,
  suffix: PseudoClassSuffix,
  innerProps: [boolean, BoxStyleProps] | BoxStyleProps,
) {
  if (Array.isArray(innerProps)) {
    Object.entries(innerProps[1]).forEach(([name, value]) => {
      props[`${name}${suffix}` as keyof BoxStyleProps] = value;
    });
    props[key] = innerProps[0] as T[keyof T];
  } else if (ObjectUtils.isObject(innerProps)) {
    Object.entries(innerProps).forEach(([name, value]) => {
      props[`${name}${suffix}` as keyof BoxStyleProps] = value;
    });
    delete props[key];
  }
}
