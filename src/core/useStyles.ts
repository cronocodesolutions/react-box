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
  flattenSingle(props, 'hover', 'hover');
  flattenSingle(props, 'focus', 'focus');
  flattenSingle(props, 'hasFocus', 'hasFocus');
  flattenSingle(props, 'active', 'active');
  flattenSingle(props, 'disabled', 'disabled');
  flattenSingle(props, 'hasDisabled', 'hasDisabled');
  flattenSingle(props, 'checked', 'checked');
  flattenSingle(props, 'hasChecked', 'hasChecked');
  flattenSingle(props, 'valid', 'valid');
  flattenSingle(props, 'hasValid', 'hasValid');
  flattenSingle(props, 'invalid', 'invalid');
  flattenSingle(props, 'hasInvalid', 'hasInvalid');

  flattenGroup(props, 'hoverGroup', 'hover');
  flattenGroup(props, 'focusGroup', 'focus');
  flattenGroup(props, 'activeGroup', 'active');
  flattenGroup(props, 'disabledGroup', 'disabled');
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
