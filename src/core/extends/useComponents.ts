import { useMemo } from 'react';
import { BoxStyleProps, BoxComponentStyles, ComponentsAndVariants } from '../../types';
import ObjectUtils from '../../utils/object/objectUtils';
import boxComponents, { BoxComponent } from './boxComponents';
import BoxExtends from './boxExtends';

export default function useComponents<TKey extends keyof ComponentsAndVariants = never>(
  props: BoxStyleProps<TKey>,
): Maybe<BoxComponentStyles> {
  const { clean, component, variant } = props;

  return useMemo(() => {
    if (clean) return undefined;

    const names = component?.split('.');
    if (!names) return undefined;

    const componentStyles = names.reduce<Maybe<BoxComponent>>((acc, item, index) => {
      if (index === 0) {
        return BoxExtends.componentsStyles[item];
      }

      return acc?.children?.[item];
    }, undefined);

    if (!componentStyles) return undefined;

    const variantStyles = componentStyles.variants?.[variant as any];

    if (!variantStyles) return componentStyles.styles;

    return ObjectUtils.mergeDeep<BoxComponentStyles>(componentStyles.styles, variantStyles);
  }, [clean, component, variant]);
}
