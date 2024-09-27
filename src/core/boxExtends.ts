import { cssStyles } from './boxStyles';
import { BoxStyle } from './coreTypes';

namespace BoxExtends {
  let _variables: string = '';

  export function setVariables(variables: Record<string, string>) {
    _variables = Object.entries(variables)
      .map(([key, val]) => `--${key}: ${val};`)
      .join('');
  }

  export function getVariables() {
    return _variables;
  }

  export function setProps(props: Record<string, BoxStyle[]>) {
    Object.entries(props).forEach(([key, val]) => {
      (cssStyles as Record<string, BoxStyle[]>)[key] = val;
    });
  }
}

export default BoxExtends;
