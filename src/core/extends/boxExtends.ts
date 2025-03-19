import ObjectUtils from '../../utils/object/objectUtils';
import { cssStyles } from '../boxStyles';
import { BoxStyle } from '../coreTypes';
import Variables from '../variables';
import boxComponents, { Components } from './boxComponents';

namespace BoxExtends {
  export function extend<TProps extends Record<string, BoxStyle[]>, TPropTypes extends Record<string, BoxStyle[]>>(
    variables: Record<string, string>,
    extendedProps: TProps,
    extendedPropTypes: TPropTypes,
  ) {
    Variables.setUserVariables(variables);

    Object.entries(extendedProps).forEach(([key, val]) => {
      (cssStyles as Record<string, BoxStyle[]>)[key] = val;
    });

    Object.entries(extendedPropTypes).forEach(([key, val]) => {
      const prev = cssStyles[key as keyof typeof cssStyles];
      (cssStyles as Record<string, BoxStyle[]>)[key] = prev ? [...val, ...prev] : val;
    });

    return { extendedProps, extendedPropTypes };
  }

  export let componentsStyles: Components = boxComponents;

  export function components<T extends Components>(components: T) {
    componentsStyles = ObjectUtils.mergeDeep<Components>(boxComponents, components);

    return components;
  }
}

export default BoxExtends;
