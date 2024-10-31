import { BoxStylesWithPseudoClasses } from '../../types';

const pseudoAliases = {
  selected: 'aria-selected',
};

namespace BoxUtils {
  export function assignBooleanProp<TProps>(prop: Maybe<boolean | [boolean, BoxStylesWithPseudoClasses]>, name: string, props: TProps) {
    if (prop !== undefined && prop != null) {
      (props as any)[(pseudoAliases as any)[name] ?? name] = Array.isArray(prop) ? prop[0] : prop;
    }
  }
}

export default BoxUtils;
