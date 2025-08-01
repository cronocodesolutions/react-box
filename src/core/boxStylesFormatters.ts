import { DEFAULT_REM_DIVIDER } from './boxConstants';

export namespace BoxStylesFormatters {
  export namespace ClassName {
    export function fraction(key: string, value: string) {
      return `${key}${value.replace('/', '-')}`;
    }

    export function svg(selector: string) {
      return [`${selector} path`, `${selector} circle`, `${selector} rect`, `${selector} line`];
    }
  }

  export namespace Value {
    export function rem(value: number, _fn?: () => void, divider = DEFAULT_REM_DIVIDER) {
      return `${value / divider}rem`;
    }
    export function px(value: number) {
      return `${value}px`;
    }
    export function fraction(value: string) {
      const [a, b] = value.split('/');
      return `${(+a / +b) * 100}%`;
    }
    export function widthHeight(key: string, value: string) {
      switch (value) {
        case 'fit':
          return '100%';
        case 'fit-screen':
          return key.toLocaleLowerCase().includes('height') ? '100vh' : '100vw';
        default:
          return value;
      }
    }
    export function variables(prefix: string) {
      return (key: string, value: string) => `var(--${prefix}${value});`;
    }
    export function svgVariables(prefix: string) {
      return (key: string, value: string) => `var(--${prefix}${value});`;
    }
    export function gridColumns(key: string, value: number) {
      return `repeat(${value},minmax(0,1fr))`;
    }
    export function gridColumn(key: string, value: string | number) {
      if (value === 'full-row') {
        return '1/-1';
      }

      return `span ${value}/span ${value}`;
    }
    export function ms(key: string, value: number) {
      return `${value}ms`;
    }
    export function rotate(key: string, value: number) {
      return `${value}deg`;
    }
    export function flip(key: string, value: string) {
      return value === 'xAxis' ? '-1 1' : '1 -1';
    }
  }
}
