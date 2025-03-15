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

    const [userComponent, internalComponent] = names.reduce<[Maybe<BoxComponent>, Maybe<BoxComponent>]>(
      (acc, item, index) => {
        if (index === 0) {
          return [BoxExtends.userComponents[item], boxComponents[item as keyof typeof boxComponents]];
        }

        const [user, internal] = acc;

        return [user?.children?.[item], internal?.children?.[item]];
      },
      [undefined, undefined],
    );

    if (!userComponent) {
      if (!internalComponent) return undefined;

      const internalVariant = internalComponent.variants?.[variant as any];

      return internalVariant ? ObjectUtils.mergeDeep(internalComponent.styles, internalVariant) : internalComponent.styles;
    }

    const userVariant = userComponent.variants?.[variant as any];
    const userStyles = userVariant ? ObjectUtils.mergeDeep<BoxComponentStyles>(userComponent.styles, userVariant) : userComponent.styles;
    if (userComponent.clean || !internalComponent) {
      return userStyles;
    }

    const internalVariant = internalComponent.variants?.[variant as any];
    const internalStyles = internalVariant
      ? ObjectUtils.mergeDeep<BoxComponentStyles>(internalComponent.styles, internalVariant)
      : internalComponent.styles;

    return ObjectUtils.mergeDeep(internalStyles, userStyles);
  }, [clean, component, variant]);
}
