import { BooleanPseudoClassesValue } from '../../types';

namespace BoxUtils {
  export function assignBooleanProp<TProps>(prop: Maybe<BooleanPseudoClassesValue>, name: string, props: TProps) {
    if (prop !== undefined && prop != null) {
      (props as any)[name] = Array.isArray(prop) ? prop[0] : prop;
    }
  }
}

export default BoxUtils;
