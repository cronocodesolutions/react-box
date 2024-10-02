import { cssStyles } from './boxStyles';
import { BoxStyle } from './coreTypes';

namespace BoxExtends {
  let _variables: string = '';

  export function extend<TProps extends Record<string, BoxStyle[]>>(variables: Record<string, string>, props: TProps) {
    _variables = Object.entries(variables)
      .map(([key, val]) => `--${key}: ${val};`)
      .join('');

    Object.entries(props).forEach(([key, val]) => {
      (cssStyles as Record<string, BoxStyle[]>)[key] = val;
    });

    return props;
  }

  export function getVariables() {
    return _variables;
  }
}

export default BoxExtends;
