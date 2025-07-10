import { BoxStylesWithPseudoClasses } from '../../types';

const pseudoAliases = {
  selected: 'aria-selected',
};

namespace BoxUtils {
  export function assignBooleanProp<TProps>(
    prop: boolean | [boolean, BoxStylesWithPseudoClasses] | undefined,
    name: string,
    props: TProps,
  ) {
    if (prop !== undefined && prop != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (props as any)[(pseudoAliases as any)[name] ?? name] = Array.isArray(prop) ? prop[0] : prop;
    }
  }
}

export default BoxUtils;
