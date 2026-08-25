import { BoxComponentStyles, BoxStyleProps, ComponentsAndVariants } from '../../types';
import ObjectUtils from '../../utils/object/objectUtils';
import { classNames } from '../classNames';
import { BoxComponent } from './boxComponents';
import BoxExtends from './boxExtends';

/**
 * Pure component-style resolution (no hooks). Resolves the base component styles by
 * dot-notation and applies variants. Kept hook-free so `useStyles` can call it lazily
 * on a style-cache miss instead of paying a per-instance `useMemo` on every Box.
 */
export function resolveComponentStyles<TKey extends keyof ComponentsAndVariants = never>(
  props: BoxStyleProps<TKey>,
): BoxComponentStyles | undefined {
  const { clean, component, variant } = props;

  if (clean) return undefined;

  const names = component?.split('.');
  if (!names) return undefined;

  // Resolve the base component styles via dot-notation
  const componentStyles = names.reduce<BoxComponent | undefined>((acc, item, index) => {
    if (index === 0) {
      return BoxExtends.getComponentsStyles()[item];
    }

    return acc?.children?.[item];
  }, undefined);

  if (!componentStyles) return undefined;

  // Apply variants
  if (!variant) return componentStyles.styles;

  const variantNames = classNames(variant);
  if (variantNames.length === 0) return componentStyles.styles;

  const variantStyles = ObjectUtils.mergeDeep(...variantNames.map((v) => componentStyles.variants?.[v] as BoxComponentStyles));

  if (!componentStyles.styles) return variantStyles;

  return ObjectUtils.mergeDeep<BoxComponentStyles>(componentStyles.styles, variantStyles);
}
