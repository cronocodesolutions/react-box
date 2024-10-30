import { BoxStylesWithPseudoClasses } from '../../types';

namespace BoxUtils {
  export function assignBooleanProp<TProps>(prop: Maybe<boolean | [boolean, BoxStylesWithPseudoClasses]>, name: string, props: TProps) {
    if (prop !== undefined && prop != null) {
      (props as any)[name] = Array.isArray(prop) ? prop[0] : prop;
    }
  }
}

export default BoxUtils;
