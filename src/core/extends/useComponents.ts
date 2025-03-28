import { useMemo } from 'react';
import { BoxStyleProps, BoxComponentStyles, ComponentsAndVariants } from '../../types';
import ObjectUtils from '../../utils/object/objectUtils';
import { BoxComponent } from './boxComponents';
import BoxExtends from './boxExtends';
import { classNames } from '../classNames';

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
    return ObjectUtils.mergeDeep<BoxComponentStyles>(componentStyles.styles, variantStyles);
  }, [clean, component, variant]);
}
