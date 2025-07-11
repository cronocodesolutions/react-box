import { useMemo } from 'react';
import { BoxComponentStyles, BoxStyleProps, ComponentsAndVariants } from '../../types';
import ObjectUtils from '../../utils/object/objectUtils';
import { classNames } from '../classNames';
import { BoxComponent } from './boxComponents';
import BoxExtends from './boxExtends';

export default function useComponents<TKey extends keyof ComponentsAndVariants = never>(
  props: BoxStyleProps<TKey>,
): BoxComponentStyles | undefined {
  const { clean, component, variant } = props;

  return useMemo(() => {
    if (clean) return undefined;

    const names = component?.split('.');
    if (!names) return undefined;

    const componentStyles = names.reduce<BoxComponent | undefined>((acc, item, index) => {
      if (index === 0) {
        return BoxExtends.componentsStyles[item];
      }

      return acc?.children?.[item];
    }, undefined);

    if (!componentStyles) return undefined;
    if (!variant) return componentStyles.styles;

    const variantNames = classNames(variant);
    if (variantNames.length === 0) return componentStyles.styles;

    const variantStyles = ObjectUtils.mergeDeep(...variantNames.map((v) => componentStyles.variants?.[v] as BoxComponentStyles));

    if (!componentStyles.styles) return variantStyles;

    return ObjectUtils.mergeDeep<BoxComponentStyles>(componentStyles.styles, variantStyles);
  }, [clean, component, variant]);
}
